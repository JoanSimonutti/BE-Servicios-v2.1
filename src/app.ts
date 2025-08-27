/**
 * app.ts
 *
 * Crea y configura la instancia de Express.
 * Aplica middlewares de seguridad, parsers, logs y CORS.
 * No levanta el servidor HTTP aquí.
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import accesoMaestroRuta from './rutas/accesoMaestro.ruta';


/**
 * Creamos la instancia de Express.
 *
 * Tipamos como Application para obtener tipado estricto de Express en TypeScript.
 */
const app: Application = express();

/**
 * Helmet:
 * Aplica cabeceras HTTP seguras:
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Strict-Transport-Security
 * - Content-Security-Policy (si configuramos)
 *
 * Mejora seguridad ante ataques como:
 * - clickjacking
 * - sniffing de tipos de contenido
 * - ataques de downgrade
 */
app.use(helmet());

/**
 * Compression:
 * Comprime las respuestas HTTP usando gzip.
 * Reduce ancho de banda y acelera tiempos de carga.
 *
 * Cuidado:
 * - Aumenta ligeramente uso de CPU.
 * - Evitar sobre-comprimir archivos ya comprimidos (ej. imágenes, etc.)
 */
app.use(compression());

/**
 * CORS:
 * Permite controlar qué orígenes pueden acceder al backend.
 *
 * Configuración provisional:
 * - Permitimos cualquier origen en dev.
 * - En prod debe limitarse a dominios específicos.
 *
 * Alternativa avanzada:
 * - Configurar lista blanca (whitelist) en variables de entorno.
 */
app.use(cors({
  origin: '*', // TODO: restringir en producción
}));

/**
 * express.json():
 * Permite parsear JSON en el body de las requests.
 * Por default permite payloads hasta ~100KB.
 */
app.use(express.json());

/**
 * express.urlencoded():
 * Permite parsear datos URL-encoded (ej. formularios).
 * extended: true permite objetos anidados.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Morgan:
 * Middleware de logging HTTP.
 *
 * - 'dev' es colorido y útil en desarrollo.
 * - En producción podemos integrarlo con Winston.
 */
app.use(morgan('dev'));


/**
 * Acceso Maestro:
 *
 * Permite el acceso directo del administrador mediante un código maestro.
 * No requiere SMS ni verificación previa.
 */
app.use('/api/acceso-maestro', accesoMaestroRuta);

/**
 * Rutas de autenticación:
 * - Registro (/registro)
 * - Verificación (/verificar)
 * - Login (/login)
 * - Refresh (/refresh)
 *
 * Todas con el prefijo /api/autenticacion
 */
import autenticacionRutas from './rutas/autenticacion.ruta';
app.use('/api/autenticacion', autenticacionRutas);

/**
 * Rutas del administrador:
 * - Solo accesibles para usuarios con rol "admin".
 * - Requieren autenticación por JWT y verificación de rol.
 *
 * Esta es una ruta de prueba por ahora:
 *   GET /api/admin/test
 * Devuelve un mensaje de éxito si el usuario autenticado es administrador.
 *
 * En el futuro:
 * - Podés ampliar esta ruta con funciones reales del panel de administración.
 * - Todas las rutas bajo /api/admin deben mantenerse protegidas.
 */
import adminRuta from './rutas/admin.ruta';
app.use('/api/admin', adminRuta);


/**
 * Placeholder de rutas:
 * Aquí importaremos rutas reales cuando las creemos.
 *
 * Ejemplo:
 * import autenticacionRutas from './rutas/autenticacion.ruta';
 * app.use('/api/auth', autenticacionRutas);
 */

/**
 * Middleware para rutas no encontradas (404).
 * Buena práctica profesional.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada',
    datos: null,
  });
});

/**
 * Middleware global de errores.
 * Intercepta cualquier error lanzado en rutas.
 *
 * Recomendación:
 * - Crear un error middleware dedicado en middlewares/error.middleware.ts
 * y usarlo aquí con app.use(errorMiddleware);
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(err.status || 500).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor',
    datos: null,
  });
});

export default app;
