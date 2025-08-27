/**
 * src/config/cache.ts
 *
 * Configura y exporta la instancia de Node-Cache,
 * que se usa para almacenar datos en memoria
 * de forma temporal (ej.: tokens de verificación,
 * resultados de consultas, etc.)
 *
 * Esto permite reducir la cantidad de accesos a base de datos
 * o llamadas externas (por ejemplo, a Twilio),
 * mejorando la performance general de la API.
 */

import NodeCache from "node-cache";

/**
 * cache
 *
 * Creamos una instancia de NodeCache.
 *
 * Por defecto:
 *   - stdTTL: 600 segundos (10 minutos)
 *     → el tiempo que un ítem se mantiene en cache
 *       antes de expirar automáticamente.
 *
 *   - checkperiod: 120 segundos
 *     → cada cuánto tiempo el cache verifica y limpia
 *       entradas expiradas.
 *
 * Estas configuraciones son seguras para la mayoría
 * de escenarios web y se pueden ajustar más adelante
 * según métricas de uso real.
 */
export const cache = new NodeCache({
  stdTTL: 600,
  checkperiod: 120,
});

/**
 * Ejemplo de uso:
 *
 * import { cache } from "../config/cache";
 *
 * // Guardar un valor
 * cache.set("codigo_sms_5491123456789", "123456");
 *
 * // Obtener un valor
 * const codigo = cache.get("codigo_sms_5491123456789");
 *
 * // Eliminar un valor
 * cache.del("codigo_sms_5491123456789");
 *
 * // Limpiar todo el cache
 * cache.flushAll();
 *
 * Esto es ideal para almacenar:
 *   - Códigos de verificación SMS
 *   - Respuestas de búsquedas frecuentes
 *   - Tokens temporales
 *   - Resultados de consultas externas
 *
 * **Importante:**
 * Node-Cache almacena todo en la RAM del servidor.
 * Si deployamos ServiPro en instancias distribuidas
 * o escaladas horizontalmente, tendremos que migrar
 * esta capa de cache a un sistema centralizado
 * como Redis para mantener consistencia entre nodos.
 */
