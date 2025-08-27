/**
 * esAdmin.middleware.ts
 *
 * Middleware de autorización que verifica si el usuario autenticado es administrador.
 * Este middleware debe usarse DESPUÉS de autenticarJWT.
 */

import { Request, Response, NextFunction } from 'express';
import { enviarRespuestaError } from '../utilidades/respuestaEstandarizada';

/**
 * Extendemos el tipo de Request para incluir al usuario ya autenticado.
 */
interface RequestConUsuario extends Request {
  usuario?: {
    rol?: string;
  };
}

/**
 * Middleware que verifica si el usuario tiene el rol 'admin'.
 * Si no lo tiene, se responde con 403 (prohibido).
 */
export const esAdmin = (req: RequestConUsuario, res: Response, next: NextFunction) => {
  try {
    // Si no hay usuario en la request, algo salió mal con el middleware anterior
    if (!req.usuario) {
      return enviarRespuestaError(res, 'Usuario no autenticado', 'USUARIO_NO_AUTENTICADO', undefined, 401);
    }

    // Verificamos si el rol es 'admin'
    if (req.usuario.rol !== 'admin') {
      return enviarRespuestaError(res, 'Acceso restringido a administradores', 'ACCESO_NO_AUTORIZADO', undefined, 403);
    }

    // Si todo está bien, se continúa hacia la ruta protegida
    next();
  } catch (error: any) {
    console.error('Error en middleware esAdmin:', error);
    return enviarRespuestaError(res, 'Error al validar rol de administrador', 'ERROR_AUTORIZACION', undefined, 500);
  }
};


// Para usar este middleware en cualquier ruta protegida, simplemente lo encadenás después de autenticarJWT. 
// Ejemplo:
//
// import { Router } from 'express';
// import { autenticarJWT } from '../middlewares/auth.middleware';
// import { esAdmin } from '../middlewares/esAdmin.middleware';
// import { listarUsuarios } from '../controladores/admin.controlador';
// const router = Router();
//
// router.get('/usuarios', autenticarJWT, esAdmin, listarUsuarios); // solo admins <<<========|||
//
// export default router;


