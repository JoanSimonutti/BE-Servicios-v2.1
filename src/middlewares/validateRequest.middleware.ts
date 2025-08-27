/**
 * validateRequest.middleware.ts
 *
 * Middleware que valida el cuerpo (body), los parámetros de URL (params),
 * y la query string (query) de una solicitud HTTP usando Zod.
 *
 * Esta función recibe un esquema Zod y devuelve un middleware Express.
 * Si la validación falla, se detiene la ejecución y se responde con error estandarizado.
 * Si todo es válido, se continúa al siguiente middleware/controlador.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodRawShape, ZodError } from 'zod';
import { enviarRespuestaError } from '../utilidades/respuestaEstandarizada';

/**
 * Recibe un esquema Zod y devuelve un middleware que valida req.body contra él.
 * También podría extenderse para validar query o params si lo necesitás a futuro.
 *
 * @param schema - Esquema Zod que define la forma esperada del body.
 */
export const validarRequest = (
  schema: ZodObject<ZodRawShape>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parseamos y validamos el cuerpo (body) de la solicitud
      schema.parse(req.body);

      // Si no lanza error, continúa al siguiente middleware o controlador
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Si hay errores de validación, respondemos con formato estandarizado
        const detalles = error.issues.map((err) => ({
          campo: err.path.join('.'),
          mensaje: err.message,
        }));

        return enviarRespuestaError(
          res,
          'Error de validación en los datos enviados',
          'VALIDACION_DATOS_INVALIDOS',
          detalles,
          400
        );
      }

      // Si el error no es de Zod, lo pasamos al manejador global
      next(error);
    }
  };
};
