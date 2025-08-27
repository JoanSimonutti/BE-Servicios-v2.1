/**
 * auth.middleware.ts
 *
 * Middleware de autenticación por JWT.
 * Valida el token de acceso y extrae el usuario autenticado.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { enviarRespuestaError } from '../utilidades/respuestaEstandarizada';
import { Usuario } from '../modelos/usuario.modelo';
import { env } from '../config/variables';
/**
 * Extendemos el tipo Request para que Express sepa que
 * vamos a inyectar una propiedad "usuario" en el objeto request.
 */
interface RequestConUsuario extends Request {
  usuario?: any; // opcional al inicio, se agrega si el token es válido
}

/**
 * Middleware principal.
 *
 * - Extrae el token del header Authorization.
 * - Lo verifica con la clave secreta.
 * - Si es válido, busca al usuario en la base de datos.
 * - Inyecta el usuario en req.usuario.
 * - Si falla algo, responde con 401 (no autorizado).
 */
export const autenticarJWT = async (
  req: RequestConUsuario,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtenemos el header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return enviarRespuestaError(res, 'Token no proporcionado', 'TOKEN_FALTANTE', undefined, 401);
    }

    // Extraemos solo el token (sacamos "Bearer ")
    const token = authHeader.split(' ')[1];

    // Verificamos el token con la clave secreta
    const payload = jwt.verify(token, env.JWT_SECRET) as { usuarioId: string };

    // Buscamos al usuario autenticado en la base de datos
    const usuario = await Usuario.findById(payload.usuarioId);

    if (!usuario) {
      return enviarRespuestaError(res, 'Usuario no encontrado', 'USUARIO_INVALIDO', undefined, 401);
    }

    // Inyectamos el usuario en la request
    req.usuario = usuario;

    // Continuamos hacia la ruta protegida
    next();
  } catch (error: any) {
    console.error('Error en middleware de autenticación:', error);
    return enviarRespuestaError(res, 'Token inválido o expirado', 'TOKEN_INVALIDO', undefined, 401);
  }
};
