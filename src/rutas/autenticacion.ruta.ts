/**
 * src/rutas/autenticacion.ruta.ts
 *
 * Define todas las rutas relacionadas a autenticación:
 * - Registro
 * - Verificación
 * - Login
 * - Refresh
 * - Acceso maestro
 */

import { Router } from 'express';

import {
  registrarUsuario,
  verificarUsuario,
  loginUsuario,
  refrescarToken, // corregido: este es el nombre real exportado
} from '../controladores/autenticacion.controlador';

import { accesoMaestro } from '../controladores/accesoMaestro.controlador';

import { validarRequest } from '../middlewares/validateRequest.middleware';

import {
  registroSchema,
  verificacionSchema,
  loginSchema,
  refreshSchema,
  accesoMaestroSchema,
} from '../validaciones/autenticacion.validacion';

const router = Router();

/**
 * Paso 1: POST /api/autenticacion/registro
 *
 * El usuario envía su número de teléfono para iniciar el proceso de registro.
 * Se genera un código aleatorio que se envía vía SMS usando Twilio.
 */
router.post('/registro', validarRequest(registroSchema), registrarUsuario);

/**
 * Paso 2: POST /api/autenticacion/verificar
 *
 * El usuario ingresa el código recibido por SMS.
 * Si el código es válido y no ha expirado, se registra el usuario en la base de datos.
 */
router.post('/verificar', validarRequest(verificacionSchema), verificarUsuario);

/**
 * Paso 3: POST /api/autenticacion/login
 *
 * El usuario ya registrado envía su número de teléfono.
 * Si el teléfono existe, se genera un nuevo código de acceso y se envía por SMS.
 */
router.post('/login', validarRequest(loginSchema), loginUsuario);

/**
 * Paso 4: POST /api/autenticacion/refresh
 *
 * El cliente envía su refresh token para obtener un nuevo token de acceso.
 * Validamos el token, su existencia en la base de datos y su expiración.
 * Si todo es válido, generamos un nuevo token de acceso.
 */
router.post('/refresh', validarRequest(refreshSchema), refrescarToken);

/**
 * Paso oculto: POST /api/autenticacion/acceso-maestro
 *
 * Endpoint exclusivo del administrador.
 * No requiere SMS ni verificación.
 * Si el código secreto es válido, se genera un usuario admin (si no existe)
 * y se devuelven los tokens de acceso.
 */
router.post('/acceso-maestro', validarRequest(accesoMaestroSchema), accesoMaestro);

export default router;
