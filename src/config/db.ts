/**
 * src/config/db.ts
 *
 * Configura la conexión a MongoDB usando Mongoose.
 * Esto es la base para toda la persistencia de datos en ServiPro.
 */

import mongoose from "mongoose";
import { env } from "./variables";
import { logger } from "./logger";

/**
 * Opciones de configuración para Mongoose.
 * Algunas de estas opciones no son estrictamente necesarias en las versiones modernas,
 * pero se incluyen para:
 *  - estandarizar timeouts
 *  - evitar warnings
 *  - mejorar estabilidad en producción
 */
const mongooseOptions: mongoose.ConnectOptions = {
  // Timeout para el primer intento de conexión (en milisegundos)
  connectTimeoutMS: 10000,
  // Timeout para operaciones individuales como find, insert, etc.
  socketTimeoutMS: 45000,
};

/**
 * connectDB
 *
 * Función que realiza la conexión a MongoDB.
 * La exportamos para poder llamarla desde src/index.ts,
 * de modo que el servidor no arranque si la base de datos falla.
 */
export const connectDB = async (): Promise<void> => {
  try {
    // Inicia conexión a MongoDB usando la URI definida en el archivo .env
    await mongoose.connect(env.MONGODB_URI, mongooseOptions);

    // Si la conexión es exitosa, lo informamos en el logger
    logger.info("Conexión a MongoDB establecida correctamente.");
  } catch (error) {
    // Capturamos cualquier error y lo mostramos en logs
    logger.error("Error al conectar a MongoDB:");
    logger.error(error);

    // Salimos del proceso: no tiene sentido mantener el servidor corriendo sin base de datos
    process.exit(1);
  }
};

/**
 * Manejamos eventos de Mongoose para monitorear el estado de la conexión.
 * Es buena práctica en apps críticas:
 *  - permite detectar problemas de red
 *  - facilita monitoreo y alertas
 */

// Evento si se pierde la conexión una vez establecida
mongoose.connection.on("disconnected", () => {
  logger.warn("Conexión a MongoDB perdida.");
});

// Evento de reconexión (Mongoose intenta reconectar solo)
mongoose.connection.on("reconnected", () => {
  logger.info("Conexión a MongoDB reestablecida.");
});

// Evento de error persistente
mongoose.connection.on("error", (err) => {
  logger.error("Error en la conexión de MongoDB:", err);
});
