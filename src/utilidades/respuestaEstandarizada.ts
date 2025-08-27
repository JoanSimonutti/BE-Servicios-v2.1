/**
 * src/utilidades/respuestaEstandarizada.ts
 *
 * Contiene funciones para construir respuestas JSON
 * bajo un formato estandarizado en ServiPro.
 *
 * Esto permite:
 * - mantener consistencia en todas las respuestas de la API
 * - simplificar el manejo de errores en el frontend
 * - facilitar logging y trazabilidad
 */

import { Response } from "express";

/**
 * Tipo TypeScript que define la forma de una respuesta exitosa.
 * Siempre debe tener:
 * - exito: true
 * - mensaje: texto descriptivo en español
 * - datos: objeto, array o null
 */
interface RespuestaExitosa<T> {
  exito: true;
  mensaje: string;
  datos: T | null;
}

/**
 * Tipo TypeScript que define la forma de una respuesta de error.
 * Siempre debe tener:
 * - exito: false
 * - mensaje: texto descriptivo en español
 * - errores: array de errores de validación (opcional)
 * - codigo: string estandarizado para identificar el tipo de error
 */
interface ErrorDetalle {
  campo: string;
  mensaje: string;
}

interface RespuestaError {
  exito: false;
  mensaje: string;
  errores?: ErrorDetalle[];
  codigo: string;
}

/**
 * enviarRespuestaExitosa
 *
 * Devuelve una respuesta HTTP con status 200 u otro definido,
 * utilizando el formato estándar de respuesta exitosa.
 *
 * @param res - Objeto Response de Express
 * @param mensaje - Mensaje en español describiendo la operación
 * @param datos - Objeto, array o null con la información de respuesta
 * @param statusCode - Código HTTP, por defecto 200
 */
export function enviarRespuestaExitosa<T>(
  res: Response,
  mensaje: string,
  datos: T | null = null,
  statusCode = 200
): void {
  const respuesta: RespuestaExitosa<T> = {
    exito: true,
    mensaje,
    datos,
  };

  res.status(statusCode).json(respuesta);
}

/**
 * enviarRespuestaError
 *
 * Devuelve una respuesta HTTP con el formato estándar de error.
 *
 * @param res - Objeto Response de Express
 * @param mensaje - Mensaje en español describiendo el error
 * @param codigo - String estandarizado del error (p.ej. "USUARIO_NO_ENCONTRADO")
 * @param errores - Array opcional de errores de validación, si corresponde
 * @param statusCode - Código HTTP, por defecto 400
 */
export function enviarRespuestaError(
  res: Response,
  mensaje: string,
  codigo: string,
  errores?: ErrorDetalle[],
  statusCode = 400
): void {
  const respuesta: RespuestaError = {
    exito: false,
    mensaje,
    codigo,
  };

  if (errores) {
    respuesta.errores = errores;
  }

  res.status(statusCode).json(respuesta);
}
