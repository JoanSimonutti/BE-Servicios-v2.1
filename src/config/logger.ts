/**
 * src/config/logger.ts
 *
 * Configura Winston, la librería más utilizada en Node.js para logging profesional.
 * Nos permite:
 *  - guardar logs en archivos
 *  - enviar logs a servicios externos (e.g. Graylog, Logstash, Datadog)
 *  - formatear y categorizar mensajes (info, error, debug, etc.)
 *
 * Aquí creamos un logger centralizado para todo ServiPro.
 * Todos los módulos deben importar este logger y no usar console.log directamente,
 * salvo para casos rápidos de debugging local.
 */

import { createLogger, format, transports } from "winston";
import dotenv from "dotenv";

// Cargamos variables de entorno para saber si estamos en production o development
dotenv.config();

const { combine, timestamp, printf, colorize, errors } = format;

/**
 * Creamos un formato customizado para nuestros logs:
 * - Incluye fecha y hora
 * - Incluye nivel (info, error, etc.)
 * - Muestra el mensaje
 * - Incluye stack trace en caso de errores
 */
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

/**
 * Definimos el logger global de ServiPro
 */
export const logger = createLogger({
  // Nivel mínimo de log:
  // - 'info' en producción (menos verboso)
  // - 'debug' en desarrollo (máxima información)
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  // Formato combinado:
  // - timestamp → agrega la fecha y hora a cada log
  // - errors({ stack: true }) → incluye stack trace automáticamente si el log es un error
  // - logFormat → nuestro formato personalizado definido arriba
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),

  // Definimos los “transports” → a dónde se envían los logs
  transports: [
    // Transport para logs en consola
    new transports.Console({
      format: combine(
        colorize(),            // Colores según nivel (info en verde, error en rojo, etc.)
        logFormat
      ),
    }),

    // Transport para archivo de errores
    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Transport para archivo de todos los logs
    new transports.File({
      filename: "logs/combined.log",
    }),
  ],
});
