/**
 * refreshToken.modelo.ts
 *
 * Define el esquema de los tokens de refresco (refresh tokens) utilizados para renovar JWTs.
 * Estos tokens son persistentes y tienen una validez limitada (por ejemplo, 30 días).
 *
 * Objetivos:
 * - Asociar cada token a un usuario específico (por ID).
 * - Implementar TTL automático: el token expira y se elimina sin intervención manual.
 * - Posibilitar revocación de sesión desde backend eliminando tokens.
 */

import { Schema, model, Document } from 'mongoose';

/**
 * Interface TypeScript que representa un documento de RefreshToken.
 * Extendemos de Document (de Mongoose) para que sea tipado correctamente.
 */
export interface IRefreshToken extends Document {
  token: string;
  usuarioId: Schema.Types.ObjectId;
  creadoEn: Date;
}

/**
 * refreshTokenSchema:
 * Define los campos y comportamiento del documento RefreshToken.
 */
const refreshTokenSchema = new Schema<IRefreshToken>({
  /**
   * token:
   * - Es el string único que se entrega al frontend.
   * - Puede ser generado como UUID v4 o string aleatorio de alta entropía.
   * - No se cifra en esta versión, pero podría hacerse para mayor seguridad.
   */
  token: {
    type: String,
    required: true,
    unique: true,
  },

  /**
   * usuarioId:
   * - Referencia al documento de Usuario al que pertenece este refresh token.
   * - Se puede usar para validar que el token corresponde al usuario correcto.
   */
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },

  /**
   * creadoEn:
   * - Fecha de creación del token.
   * - Se utiliza para TTL (Time To Live).
   */
  creadoEn: {
    type: Date,
    default: Date.now,
    expires: '30d', // TTL automático: el documento se elimina 30 días después de creado
  },
});

/**
 * Index TTL explícito (alternativo a usar expires en el campo directamente):
 * Este enfoque NO es necesario si ya se usa "expires" en el campo creadoEn como arriba.
 */
// refreshTokenSchema.index({ creadoEn: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

/**
 * Exportamos el modelo bajo el nombre "RefreshToken".
 */
export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);
