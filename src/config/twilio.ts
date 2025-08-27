/**
 * src/config/twilio.ts
 *
 * Configura y exporta la instancia del cliente de Twilio,
 * para enviar SMS de verificación u otros mensajes desde ServiPro.
 */

import twilio, { Twilio } from "twilio";
import { env } from "./variables";
import { logger } from "./logger";

/**
 * client
 *
 * Creamos una instancia del SDK de Twilio usando las credenciales
 * obtenidas de variables de entorno.
 *
 * - SID de la cuenta de Twilio → env.TWILIO_ACCOUNT_SID
 * - Auth Token de la cuenta → env.TWILIO_AUTH_TOKEN
 *
 * El objeto `client` permite llamar métodos como:
 *  - client.messages.create(...) → para enviar SMS
 *  - client.verify.services(...) → si más adelante implementamos Twilio Verify
 */
let client: Twilio | null = null;

try {
  client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  logger.info("Cliente Twilio inicializado correctamente.");
} catch (error) {
  logger.error("Error al inicializar el cliente de Twilio:");
  logger.error(error);
  client = null;
}

/**
 * getTwilioClient
 *
 * Función helper que devuelve la instancia del cliente Twilio
 * o lanza un error si no está inicializada.
 *
 * Esto previene errores silenciosos si las variables de entorno
 * no están configuradas correctamente.
 */
export const getTwilioClient = (): Twilio => {
  if (!client) {
    throw new Error(
      "El cliente de Twilio no está inicializado. Revisa las credenciales de entorno."
    );
  }
  return client;
};
