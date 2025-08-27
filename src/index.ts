/**
 * index.ts
 *
 * Punto de entrada de la aplicación.
 * - Importa la app de Express.
 * - Conecta a la base de datos.
 * - Levanta el servidor HTTP.
 * - Maneja errores globales.
 *
 * Mantiene la mínima responsabilidad posible:
 * orquestar el startup del backend.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';
import { logger } from './config/logger'; // Futuro archivo con Winston configurado

/**
 * Carga las variables de entorno desde .env.
 * Debe ser lo primero que se ejecute para que process.env contenga todas las variables.
 */
dotenv.config();

/**
 * Lee el puerto desde las variables de entorno,
 * o utiliza 3000 por defecto.
 */
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

/**
 * Conexión a MongoDB.
 *
 * Importante:
 * - Mantenemos la conexión antes de arrancar el servidor.
 * - En caso de error, salimos con código distinto de cero (process.exit).
 */
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    logger.info('Conexión a MongoDB exitosa.');

    // Una vez conectados, arrancamos el servidor HTTP.
    app.listen(PORT, () => {
      logger.info(`SERVIPRO backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Error conectando a MongoDB:', error);
    process.exit(1); // Salimos con error si falla la base de datos
  });

/**
 * Captura errores no manejados en promesas.
 * Esto evita que el proceso quede en estado inconsistente.
 */
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection detectado:', reason);
  process.exit(1);
});

/**
 * Captura excepciones no atrapadas (e.g. errores de programación).
 * Buena práctica en apps críticas.
 */
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception detectada:', error);
  process.exit(1);
});
