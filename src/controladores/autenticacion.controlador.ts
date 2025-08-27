/**
 * autenticacion.controlador.ts
 *
 * Controlador para rutas de autenticación de usuarios:
 * - Registro
 * - Verificación
 * - Login
 * - Refresh token
 */

import { Request, Response } from 'express';
import { logger } from '../config/logger';
import { enviarSMS } from '../utilidades/enviarSMS';
import {
  generarCodigo,
  generarJWT,
  generarRefreshToken
} from '../utilidades/generarToken';
import {
  enviarRespuestaExitosa,
  enviarRespuestaError
} from '../utilidades/respuestaEstandarizada';
import { CodigoVerificacion } from '../modelos/codigoVerificacion.modelo';
import { Usuario } from '../modelos/usuario.modelo';
import { RefreshToken } from '../modelos/refreshToken.modelo';

/**
 * POST /api/autenticacion/registro
 *
 * Paso 1 del proceso de autenticación.
 * - Recibe un teléfono.
 * - Genera código de verificación aleatorio.
 * - Lo guarda con TTL en la colección temporal.
 * - Envía el código vía SMS.
 */
export const registrarUsuario = async (req: Request, res: Response) => {
  try {
    const { telefono } = req.body;

    const codigo = generarCodigo();

    await CodigoVerificacion.findOneAndUpdate(
      { telefono },
      { telefono, codigo, creadoEn: new Date() },
      { upsert: true, new: true }
    );

    await enviarSMS(telefono, `Tu código de verificación es: ${codigo}`);

    logger.info(`Código de verificación enviado a ${telefono}`);

    return enviarRespuestaExitosa(res, 'Código enviado correctamente', null);
  } catch (error: any) {
    logger.error('Error al registrar usuario:', error);
    return enviarRespuestaError(res, 'Error interno del servidor', 'ERROR_REGISTRO_USUARIO');
  }
};

/**
 * POST /api/autenticacion/verificar
 *
 * Paso 2 del proceso de autenticación.
 * - Verifica que el código enviado por SMS sea válido.
 */
export const verificarUsuario = async (req: Request, res: Response) => {
  try {
    const { telefono, codigo } = req.body;

    const codigoEncontrado = await CodigoVerificacion.findOne({ telefono, codigo });

    if (!codigoEncontrado) {
      return enviarRespuestaError(
        res,
        'Código incorrecto o expirado',
        'CODIGO_INVALIDO_O_EXPIRADO'
      );
    }

    await CodigoVerificacion.deleteOne({ _id: codigoEncontrado._id });

    return enviarRespuestaExitosa(res, 'Código verificado correctamente', null);
  } catch (error: any) {
    logger.error('Error al verificar código de usuario:', error);
    return enviarRespuestaError(res, 'Error interno al verificar el código', 'ERROR_VERIFICACION');
  }
};

/**
 * POST /api/autenticacion/login
 *
 * - Verifica código.
 * - Crea usuario si no existe.
 * - Genera y guarda refreshToken.
 * - Devuelve JWT + refreshToken al cliente.
 */
export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { telefono, codigo } = req.body;

    const codigoDoc = await CodigoVerificacion.findOne({ telefono });

    if (!codigoDoc || codigoDoc.codigo !== codigo) {
      return enviarRespuestaError(res, 'Código inválido o expirado', 'CODIGO_INVALIDO');
    }

    let usuario = await Usuario.findOne({ telefono });

    if (!usuario) {
      usuario = new Usuario({ telefono });
      await usuario.save();
    }

    const token = generarJWT({
      usuarioId: usuario._id.toString(),
      telefono: usuario.telefono,
    });

    const refreshTokenString = generarRefreshToken();

    await RefreshToken.create({
      token: refreshTokenString,
      usuarioId: usuario._id,
    });

    await CodigoVerificacion.deleteOne({ telefono });

    return enviarRespuestaExitosa(res, 'Login exitoso', {
      token,
      refreshToken: refreshTokenString,
      usuario: {
        id: usuario._id,
        telefono: usuario.telefono,
      },
    });
  } catch (error: any) {
    logger.error('Error en loginUsuario:', error);
    return enviarRespuestaError(res, 'Error interno del servidor', 'ERROR_LOGIN');
  }
};

/**
 * POST /api/autenticacion/refresh-token
 *
 * - Verifica que el refresh token exista y no esté vencido.
 * - Si es válido, lo elimina (rotación) y genera uno nuevo.
 * - Devuelve nuevo JWT y nuevo refresh token.
 */
export const refrescarToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Buscamos si el token está registrado y sigue siendo válido
    const tokenEnBD = await RefreshToken.findOne({ token: refreshToken });

    if (!tokenEnBD) {
      return enviarRespuestaError(
        res,
        'Refresh token inválido o caducado',
        'REFRESH_TOKEN_INVALIDO'
      );
    }

    // Validamos que el usuario exista
    const usuario = await Usuario.findById(tokenEnBD.usuarioId);
    if (!usuario) {
      return enviarRespuestaError(res, 'Usuario no encontrado', 'USUARIO_NO_EXISTE');
    }

    // Eliminamos el token usado: ROTACIÓN de token
    await RefreshToken.deleteOne({ _id: tokenEnBD._id });

    // Generamos nuevo JWT y nuevo refresh token
    const nuevoJWT = generarJWT({
      usuarioId: usuario._id.toString(),
      telefono: usuario.telefono,
    });

    const nuevoRefreshToken = generarRefreshToken();

    // Guardamos el nuevo token en la base de datos
    await RefreshToken.create({
      token: nuevoRefreshToken,
      usuarioId: usuario._id,
    });

    return enviarRespuestaExitosa(res, 'Token renovado correctamente', {
      token: nuevoJWT,
      refreshToken: nuevoRefreshToken,
    });
  } catch (error: any) {
    logger.error('Error al refrescar token:', error);
    return enviarRespuestaError(res, 'Error al procesar el refresh token', 'ERROR_REFRESH_TOKEN');
  }
};
