Este repositorio contiene el backend de una plataforma web que conecta prestadores de servicios con usuarios finales.  
El enfoque del desarrollo es **profesional, escalable y seguro**, con una arquitectura modular en **Node.js + TypeScript** y base de datos en **MongoDB**.

### Tecnologías principales

- **Node.js + Express** → servidor HTTP y API REST.
- **TypeScript** → tipado estático y mayor robustez.
- **MongoDB + Mongoose** → modelado de datos con validaciones e índices.
- **JWT + Refresh Tokens** → autenticación segura y persistente.
- **Twilio** → envío de SMS para verificación.
- **Zod** → validaciones de datos estrictas.
- **Winston + Morgan** → logging profesional.
- **Node-Cache** → caché en memoria (fácil de migrar a Redis).
- **Jest + Supertest** → testing unitario e integración.

### Qué hay ahora mismo

- **Infraestructura lista:** conexión a base de datos, logging, cache, variables de entorno y Twilio configurados.
- **Utilidades clave:** generación y verificación de tokens, envío de SMS, respuestas estandarizadas.
- **Modelos principales:** usuarios, servicios, clics, códigos de verificación y refresh tokens.
- **Autenticación completa:** registro con SMS, verificación, login, refresh de tokens y acceso maestro de admin.
- **Middlewares de seguridad:** JWT, control de roles (admin), rate limiting, manejo de errores y validaciones centralizadas.
- **Estructura modular:** rutas, controladores, modelos, validaciones y tests separados y documentados.

### Próximos pasos

- Rutas de usuarios (perfil, administración).
- CRUD y búsquedas avanzadas de servicios.
- Registro y métricas de clics (WhatsApp / teléfono).
- Documentación de la API con **Swagger**.
- Monitoreo, despliegue CI/CD y métricas en producción.

### Filosofía del proyecto

- **Lenguaje en español neutro** en todo el backend para claridad.
- **Código pensado para crecer:** modular, documentado y fácil de mantener.
- **Diseñado con seguridad, validaciones rigurosas y testing continuo**.

---

<div align="end">

Creado por [Joan Simonutti](https://www.linkedin.com/in/joansimonutti/) | 2025

</div>
