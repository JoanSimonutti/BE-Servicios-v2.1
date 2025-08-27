/**
 * usuario.modelo.ts
 *
 * Define el esquema de usuario en MongoDB usando Mongoose.
 * Incluye campos básicos para autenticación vía teléfono y control administrativo.
 */

import mongoose, { Document, Types, Schema } from 'mongoose';

/**
 * Interface de TypeScript para tipar un usuario.
 * Extiende de Document para heredar métodos de Mongoose.
 */
export interface IUsuario extends Document {
  _id: Types.ObjectId;
  telefono: string;
  estaVerificado: boolean;
  rol: 'usuario' | 'admin'; // extensible si se agregan más roles
  creadoEn: Date;
  actualizadoEn: Date;
}

/**
 * Esquema de Mongoose para la colección de usuarios.
 */
const usuarioSchema: Schema<IUsuario> = new Schema(
  {
    /**
     * Número de teléfono del usuario (clave principal para autenticación).
     *
     * Reglas:
     * - Requerido
     * - Único (no pueden registrarse 2 veces con el mismo número)
     * - Se guarda en minúsculas por consistencia
     * - Se elimina espacios en blanco accidentales (trim)
     *
     * Formato recomendado: E.164 (ej: +34600111222)
     */
    telefono: {
      type: String,
      required: [true, 'El número de teléfono es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
    },

    /**
     * Bandera para saber si el usuario ya verificó su número con un código SMS.
     */
    estaVerificado: {
      type: Boolean,
      default: false,
    },

    /**
     * Rol del usuario en la aplicación.
     * Por defecto es 'usuario', pero se puede asignar 'admin' desde el backend.
     */
    rol: {
      type: String,
      enum: ['usuario', 'admin'],
      default: 'usuario',
    },
  },
  {
    /**
     * timestamps: true agrega automáticamente:
     * - createdAt
     * - updatedAt
     *
     * Ideal para auditoría o trazabilidad.
     */
    timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' },
  }
);

/**
 * Exportamos el modelo compilado.
 * Se puede importar como Usuario en controladores, middlewares, etc.
 */
export const Usuario = mongoose.model<IUsuario>('Usuario', usuarioSchema);


// Justificación de cada decisión técnica:
//
// Elemento	                           =======> Justificación
//
// telefono: unique + lowercase + trim =======>	Evita duplicados como +34600111222 vs +34600111222
// estaVerificado                      =======>	Controla si puede loguearse correctamente
// rol con enum                        =======>	Abre la puerta a más roles futuros con seguridad
// timestamps renombrados              =======>	Profesionalismo: creadoEn y actualizadoEn en español
// Interface IUsuario                  =======>	Evita any, permite tipado estricto en controladores