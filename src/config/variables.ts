/**
 * src/config/variables.ts
 *
 * Centraliza la carga y validación de variables de entorno para ServiPro.
 * Usamos dotenv para leerlas del archivo .env.
 * Usamos Zod para validarlas y asegurarnos de que:
 *  - existan
 *  - sean del tipo correcto
 * Esto es clave para evitar que falte una variable crítica en producción
 * y para tener seguridad de tipos en TypeScript.
 */

import dotenv from "dotenv";
import { z } from "zod";

// Cargamos variables de entorno desde el archivo .env
dotenv.config();

/**
 * Definimos un esquema Zod con TODAS las variables que nuestro proyecto necesita.
 * Esto:
 *  - valida su presencia
 *  - valida tipos (string, number, boolean, etc.)
 *  - permite definir defaults si faltan variables no críticas
 */
const envSchema = z.object({
  // Entorno (development, production, test)
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Puerto del servidor Express
  PORT: z
    .string()
    .transform(Number) // Convertimos de string a number automáticamente
    .refine((val) => !Number.isNaN(val) && val > 0, {
      message: "PORT debe ser un número mayor a cero.",
    }),

  // MongoDB connection string
  MONGODB_URI: z.string().min(1, "MONGODB_URI es obligatorio."),

  // JWT secrets
  JWT_SECRET: z.string().min(10, "JWT_SECRET es obligatorio y debe tener al menos 10 caracteres."),
  JWT_EXPIRATION: z.string().min(1, "JWT_EXPIRATION es obligatorio."),

  // Twilio credentials
  TWILIO_ACCOUNT_SID: z.string().min(1, "TWILIO_ACCOUNT_SID es obligatorio."),
  TWILIO_AUTH_TOKEN: z.string().min(1, "TWILIO_AUTH_TOKEN es obligatorio."),
  TWILIO_PHONE_NUMBER: z.string().min(1, "TWILIO_PHONE_NUMBER es obligatorio."),

  // Acceso maestro (admin oculto)
  CODIGO_MAESTRO: z.string().min(1, "CODIGO_MAESTRO es obligatorio."),
  TELEFONO_ADMIN: z.string().min(1, "TELEFONO_ADMIN es obligatorio."),
});

/**
 * Validamos process.env contra el esquema definido.
 * Si alguna variable falta o tiene un valor inválido:
 *  - Zod lanza un error y aborta el proceso
 *  - Esto es deseable: no queremos que el backend corra con configuraciones incompletas
 */
const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error("Error en variables de entorno:");
  console.error(envParsed.error.format());
  process.exit(1);
}

/**
 * Exportamos un objeto con las variables ya tipadas y seguras.
 * Desde ahora, en cualquier archivo podemos hacer:
 *     import { env } from "../config/variables";
 * Y estar seguros de que esas variables existen y tienen el tipo correcto.
 */
export const env = envParsed.data;
