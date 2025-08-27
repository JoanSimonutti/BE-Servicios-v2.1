/**
 * codigoVerificacion.modelo.ts
 *
 * Modelo temporal que almacena los códigos SMS enviados para verificar el teléfono.
 * Se autodestruye pasado cierto tiempo gracias a un índice TTL.
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface TypeScript para el modelo de código de verificación.
 */
export interface ICodigoVerificacion extends Document {
  telefono: string;
  codigo: string;
  creadoEn: Date;
}

/**
 * Esquema Mongoose para códigos de verificación.
 */
const codigoVerificacionSchema: Schema<ICodigoVerificacion> = new Schema(
  {
    /**
     * Número de teléfono al que se le envió el código.
     *
     * Reglas:
     * - Requerido
     * - Trim y lowercase para evitar errores de duplicación
     * - No es único: puede haber varios intentos por teléfono (por seguridad, se sobreescribirá en lógica)
     */
    telefono: {
      type: String,
      required: [true, 'El número de teléfono es obligatorio'],
      trim: true,
      lowercase: true,
    },

    /**
     * Código numérico generado y enviado al teléfono.
     *
     * Reglas:
     * - Requerido
     * - Puede tener 4 a 6 dígitos (según config futura)
     */
    codigo: {
      type: String,
      required: [true, 'El código de verificación es obligatorio'],
      trim: true,
    },

    /**
     * Fecha de creación.
     * Se usará como base para el TTL.
     */
    creadoEn: {
      type: Date,
      default: Date.now,
      index: {
        expires: 300, // 300 segundos = 5 minutos
        // El documento se eliminará automáticamente 5 minutos después de creado
      },
    },
  },
  {
    // No necesitamos updatedAt
    timestamps: false,
  }
);

/**
 * Compilación del modelo y exportación.
 */
export const CodigoVerificacion = mongoose.model<ICodigoVerificacion>(
  'CodigoVerificacion',
  codigoVerificacionSchema
);


// Justificación de cada decisión técnica:
//
// Elemento	                  =======> Justificación
//
// TTL (expires: 300)         =======>	Elimina automáticamente los códigos vencidos después de 5 minutos
// telefono: trim + lowercase =======>	Evita falsos duplicados por espacios o mayúsculas
// codigo: string             =======>	Permite almacenar números como string sin perder ceros a la izquierda
// timestamps: false          =======>	No es necesario updatedAt para datos efímeros
// no unique                  =======>	Se permite múltiples códigos por número; la lógica se encargará de reemplazar el anterior
