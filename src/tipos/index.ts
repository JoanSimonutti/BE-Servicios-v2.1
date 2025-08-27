/**
 * src/tipos/index.ts
 *
 * Este archivo centraliza la exportación de tipos TypeScript reutilizables
 * en todo el backend. Nos permite importar tipos desde una única ruta,
 * sin acoplar el código a rutas internas o cambios de estructura.
 *
 * Ejemplo:
 * import { IUsuario } from '../tipos';
 *
 * En lugar de:
 * import { IUsuario } from '../modelos/usuario.modelo';
 *
 * Esta técnica mejora:
 * - Mantenibilidad
 * - Escalabilidad
 * - Claridad en los imports
 */

export type { IUsuario } from '../modelos/usuario.modelo';
// En el futuro podemos agregar acá más tipos:
// export type { OtroTipo } from '../modelos/otro.modelo';
// export type { OtroInterface } from '../validaciones/archivo.validacion';
