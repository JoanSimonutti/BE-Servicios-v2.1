/**
 * admin.ruta.ts
 *
 * Define rutas accesibles solo por usuarios con rol "admin".
 * Todas están protegidas por el middleware de autenticación (JWT)
 * y el middleware de autorización (esAdmin).
 */

import { Router, Request, Response } from 'express';
import { autenticarJWT } from '../middlewares/auth.middleware';
import { esAdmin } from '../middlewares/esAdmin.middleware';

const router = Router();

/**
 * GET /api/admin/test
 *
 * Ruta de prueba protegida:
 * - Requiere token válido (middleware autenticarJWT).
 * - Requiere rol "admin" (middleware esAdmin).
 *
 * Si pasa ambos filtros, responde con éxito y un mensaje personalizado.
 */
router.get('/test', autenticarJWT, esAdmin, (req: Request, res: Response) => {
  return res.status(200).json({
    exito: true,
    mensaje: 'Acceso autorizado. ¡Sos un administrador!',
    datos: null,
  });
});

export default router;
