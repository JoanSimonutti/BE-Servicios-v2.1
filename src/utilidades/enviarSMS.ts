/**
 * src/utilidades/enviarSMS.ts
 *
 * Encapsula la lógica para enviar mensajes SMS usando Twilio.
 *
 * Beneficios de aislarlo en una utilidad:
 * - Centraliza el manejo de errores de Twilio
 * - Permite cambiar de proveedor en el futuro sin modificar controladores
 * - Facilita testing (puedes mockear fácilmente esta función)
 */

import { getTwilioClient } from "../config/twilio";
import { env } from "../config/variables";
import { logger } from "../config/logger";

/**
 * enviarSMS
 *
 * Envía un SMS a través de Twilio.
 *
 * @param destinatario - Número telefónico E.164 (ej.: +5491112345678)
 * @param mensaje - Texto del SMS a enviar
 * @returns Promise<void>
 *
 * Seguridad:
 * - Nunca colocar datos sensibles en mensajes SMS (p. ej. tokens JWT completos).
 *
 * Ejemplo de uso:
 * await enviarSMS("+5491112345678", "Tu código de verificación es 123456");
 */
export async function enviarSMS(
  destinatario: string,
  mensaje: string
): Promise<void> {
  try {
    // Obtenemos la instancia de Twilio previamente inicializada
    const client = getTwilioClient();

    // Usamos la API de Twilio para crear y enviar el SMS
    await client.messages.create({
      body: mensaje,                  // Texto del SMS
      from: env.TWILIO_PHONE_NUMBER,  // Número configurado en Twilio
      to: destinatario,               // Destinatario en formato E.164
    });

    // Logueamos en caso de éxito
    logger.info(`SMS enviado correctamente a ${destinatario}`);
  } catch (error) {
    logger.error(`Error al enviar SMS a ${destinatario}:`);
    logger.error(error);
    // Lanza el error para que lo capture el controlador y responda apropiadamente
    throw new Error("No se pudo enviar el SMS. Intenta nuevamente.");
  }
}
