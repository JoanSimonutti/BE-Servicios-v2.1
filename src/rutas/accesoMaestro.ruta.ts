/**
 * accesoMaestro.ruta.ts
 *
 * Define la ruta POST /api/acceso-maestro
 * para permitir ingreso directo del administrador por código secreto.
 */

import express from 'express';
import { accesoMaestro } from '../controladores/accesoMaestro.controlador';

const router = express.Router();

router.post('/', accesoMaestro);

export default router;
