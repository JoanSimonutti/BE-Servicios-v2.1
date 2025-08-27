/**
 * autenticacion.validacion.ts
 *
 * Define los esquemas de validación para las rutas de autenticación.
 * Usa Zod en su versión más compatible (sin required_error).
 */

import { z } from 'zod';

/**
 * Expresión regular para validar números de teléfono en formato internacional E.164.
 * Ejemplo válido: +34600111222 (España)
 *
 * Este patrón exige:
 * - El signo + inicial.
 * - Un dígito del 1 al 9 como primer número (no permite +0...).
 * - Entre 9 y 14 dígitos más.
 * La longitud total del número será entre 10 y 15 caracteres.
 */
const telefonoRegex = /^\+[1-9]\d{9,14}$/;

/**
 * registroSchema
 *
 * Valida el body de la petición POST /api/autenticacion/registro.
 * Solo se requiere el número de teléfono.
 */
export const registroSchema = z.object({
  telefono: z
    .string()
    .trim()
    .regex(telefonoRegex, {
      message: 'El teléfono debe tener formato internacional, ej: +34600111222',
    }),
});

/**
 * verificacionSchema
 *
 * Valida el body del POST /api/autenticacion/verificar.
 * Requiere dos campos:
 * - teléfono (en formato internacional, validado con la misma expresión regular)
 * - código (de exactamente 6 caracteres)
 */
export const verificacionSchema = z.object({
  telefono: z
    .string()
    .trim()
    .regex(telefonoRegex, {
      message: 'El teléfono debe tener formato internacional, ej: +34600111222',
    }),
  codigo: z
    .string()
    .trim()
    .length(6, { message: 'El código debe tener exactamente 6 dígitos' }),
});

/**
 * loginSchema
 *
 * Valida el body del POST /api/autenticacion/login.
 * Requiere los mismos dos campos que verificación.
 */
export const loginSchema = z.object({
  telefono: z
    .string()
    .trim()
    .regex(telefonoRegex, {
      message: 'El teléfono debe tener formato internacional, ej: +34600111222',
    }),
  codigo: z
    .string()
    .trim()
    .length(6, { message: 'El código debe tener exactamente 6 dígitos' }),
});

/**
 * refreshSchema
 *
 * Valida el body del POST /api/autenticacion/refresh.
 * Requiere únicamente el campo refreshToken, con al menos 10 caracteres.
 */
export const refreshSchema = z.object({
  refreshToken: z
    .string()
    .trim()
    .min(10, { message: 'El refresh token debe tener al menos 10 caracteres' }),
});

/**
 * accesoMaestroSchema
 *
 * Valida el body del POST /api/autenticacion/acceso-maestro.
 * Requiere un solo campo: código, que debe ser una string no vacía.
 */
export const accesoMaestroSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(1, { message: 'El código maestro no puede estar vacío' }),
});
