/**
 * src/utilidades/generarToken.ts
 *
 * Encapsula toda la lógica para generar y verificar:
 * - tokens JWT de acceso
 * - refresh tokens
 *
 * Esto:
 * - centraliza la configuración de claves y expiraciones
 * - evita duplicar lógica en controladores
 * - facilita mantener y testear la seguridad
 */

import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/variables";
import crypto from "crypto";

/**
 * PayloadJWT
 *
 * Interface que define el contenido mínimo
 * que tendrá nuestro token JWT de acceso.
 *
 * Podemos extenderla en el futuro con más campos,
 * por ejemplo roles o permisos.
 */
export interface PayloadJWT {
  usuarioId: string;
  telefono: string;
}

/**
 * generarJWT
 *
 * Genera un token JWT firmado:
 * - Incluye datos mínimos de identificación en el payload.
 * - Firma el token con el secreto definido en variables de entorno.
 * - Define tiempo de expiración para el token.
 *
 * @param payload - Objeto con datos mínimos de usuario.
 * @returns token JWT firmado (string)
 *
 * Beneficios:
 * - Permite validación de identidad sin necesidad de consultas a BD en cada request.
 * - El token expira automáticamente tras el tiempo definido en .env.
 */
export function generarJWT(payload: PayloadJWT): string {
  /**
   * ¡ATENCIÓN!
   * ---------------------------------------------
   * En jsonwebtoken, expiresIn puede ser:
   *    - un número (segundos)
   *    - un string con formato ("15m", "2h", etc.)
   *
   * TypeScript define eso como:
   *    expiresIn?: number | StringValue
   *
   * El problema:
   * - StringValue no está exportado en los types.
   * - TypeScript no reconoce que un string normal (ej.: "15m")
   *   es válido para expiresIn.
   *
   * Solución:
   * → Casteamos a any. Es la única forma 100% segura
   *   de evitar el error de tipos sin pelear con los types.
   *
   * Impacto:
   * - Ninguno a nivel runtime.
   * - Pequeña pérdida de type safety, pero es asumible
   *   porque sabemos que JWT admite perfectamente strings como "15m".
   */

  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRATION as any,
  };

  return jwt.sign(payload, env.JWT_SECRET, signOptions);
}

/**
 * verificarJWT
 *
 * Verifica:
 * - Que el token sea válido (no haya sido modificado).
 * - Que no haya expirado.
 *
 * Devuelve el payload original si es correcto.
 * Lanza un error si:
 * - El token está mal formado.
 * - Está firmado con otra clave.
 * - Ha expirado.
 *
 * @param token - JWT recibido en la request.
 * @returns Payload decodificado (PayloadJWT).
 *
 * Seguridad:
 * - Nunca uses el contenido del token sin validarlo.
 * - Si la firma falla, se lanza automáticamente un error.
 */
export function verificarJWT(token: string): PayloadJWT {
  const decoded = jwt.verify(token, env.JWT_SECRET) as PayloadJWT;
  return decoded;
}

/**
 * generarRefreshToken
 *
 * Genera un token aleatorio para usar como refresh token.
 *
 * Importante:
 * - No usamos JWT para refresh tokens por seguridad:
 *   → Los refresh tokens se almacenan en la base de datos.
 *   → Así podemos invalidarlos individualmente cuando un usuario cierra sesión.
 *
 * Usamos crypto.randomBytes para garantizar entropía fuerte:
 * - Evita tokens predecibles.
 * - Resiste ataques de fuerza bruta.
 *
 * @returns refresh token seguro (string)
 */
export function generarRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

/**
 * generarCodigo
 *
 * Genera un código numérico aleatorio de 6 dígitos (como string).
 * Este código se usa para la verificación por SMS durante el registro.
 *
 * Ejemplo: "387421"
 *
 * Seguridad:
 * - La entropía es suficiente para propósitos temporales.
 * - Puede usarse junto a un TTL en base de datos para limitar su vigencia.
 *
 * @returns Código numérico de 6 dígitos (string)
 */
export function generarCodigo(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
