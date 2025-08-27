/**
 * accesoMaestro.controlador.ts
 *
 * Permite el acceso directo del administrador mediante un código maestro.
 * No requiere SMS ni verificación previa.
 * Si el código es válido, crea (si no existe) un usuario con rol admin
 * y devuelve los tokens de autenticación como en loginUsuario.
 */

import { Request, Response } from 'express';
import { generarJWT, generarRefreshToken } from '../utilidades/generarToken';
import { enviarRespuestaExitosa, enviarRespuestaError } from '../utilidades/respuestaEstandarizada';
import { Usuario } from '../modelos/usuario.modelo';
import { RefreshToken } from '../modelos/refreshToken.modelo';
import { logger } from '../config/logger';
import { env } from '../config/variables'; // Importamos las variables de entorno validadas

// Código secreto maestro y teléfono del admin, ahora desde .env y validados por Zod
const CODIGO_MAESTRO = env.CODIGO_MAESTRO;
const TELEFONO_ADMIN = env.TELEFONO_ADMIN;

export const accesoMaestro = async (req: Request, res: Response) => {
  try {
    const { codigo } = req.body;

    if (codigo !== CODIGO_MAESTRO) {
      return enviarRespuestaError(res, 'Código incorrecto', 'CODIGO_MAESTRO_INVALIDO', undefined, 401);
    }

    // Buscamos el usuario admin oculto, o lo creamos si no existe
    let usuario = await Usuario.findOne({ telefono: TELEFONO_ADMIN });

    if (!usuario) {
      usuario = new Usuario({
        telefono: TELEFONO_ADMIN,
        rol: 'admin',
      });
      await usuario.save();
      logger.info('Usuario admin maestro creado automáticamente.');
    }

    // Generamos el token de acceso
    const token = generarJWT({
      usuarioId: usuario._id.toString(),
      telefono: usuario.telefono,
    });

    // Generamos y guardamos el refresh token
    const refreshToken = generarRefreshToken();

    await RefreshToken.create({
      token: refreshToken,
      usuarioId: usuario._id,
    });

    // Respondemos con éxito como si fuera un login
    return enviarRespuestaExitosa(res, 'Acceso maestro exitoso', {
      token,
      refreshToken,
      usuario: {
        id: usuario._id,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    });
  } catch (error: any) {
    logger.error('Error en acceso maestro:', error);
    return enviarRespuestaError(res, 'Error interno del servidor', 'ERROR_ACCESO_MAESTRO');
  }
};
