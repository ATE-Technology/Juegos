# Tareas de Implementación — Plataforma Educativa con Juegos Demo

Cada tarea está numerada, tiene sus requisitos relacionados y criterios de verificación claros.
Se recomienda trabajar en el orden indicado ya que hay dependencias entre fases.

---

## FASE 0 — Configuración del proyecto

- [ ] **TASK-001**: Inicializar repositorio Git con estructura monorepo o repos separados (frontend/backend).
  - Crear `frontend/` con Vite + React 18 + TypeScript + TailwindCSS.
  - Crear `backend/` con NestJS + TypeScript (o framework elegido).
  - Configurar ESLint, Prettier y Husky (pre-commit hooks).
  - Requisitos: REQ-NF-01, restricciones técnicas.

- [ ] **TASK-002**: Configurar la base de datos PostgreSQL.
  - Crear proyecto en Supabase o Railway.
  - Ejecutar script DDL con todas las tablas del diseño (users, subscriptions, games, videos, articles, contact_messages, data_consent, game_progress).
  - Configurar usuario de solo lectura para métricas.
  - Requisitos: REQ-NF-04, restricciones técnicas.

- [ ] **TASK-003**: Configurar variables de entorno y secretos.
  - Archivo `.env.example` con todas las variables necesarias.
  - Integrar manejo seguro de secrets (Railway Secrets / Vercel Env Vars).
  - Nunca commitear archivos `.env` reales.

---

## FASE 1 — Backend: Autenticación y usuarios

- [ ] **TASK-010**: Implementar módulo de autenticación.
  - Endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `DELETE /auth/logout`.
  - Hashing de contraseña con Argon2id.
  - Emisión de JWT (access token 15 min) y refresh token (7 días, HttpOnly cookie).
  - Requisitos: REQ-AUTH-01 al REQ-AUTH-04.

- [ ] **TASK-011**: Implementar recuperación de contraseña.
  - Endpoint `POST /auth/forgot-password` → genera token de reset y envía correo.
  - Endpoint `POST /auth/reset-password` → valida token y actualiza contraseña.
  - Token expira en 1 hora.
  - Requisitos: REQ-AUTH-05.

- [ ] **TASK-012**: Implementar guards de roles (free, premium, admin).
  - Guard `JwtAuthGuard` para rutas autenticadas.
  - Guard `RolesGuard` con decorador `@Roles('admin')`, `@Roles('premium')`.
  - Requisitos: REQ-AUTH-07, REQ-FREE-03.

- [ ] **TASK-013**: Implementar rate limiting en login.
  - Máximo 5 intentos fallidos por IP en 15 minutos.
  - Responder con 429 y tiempo de espera.
  - Requisitos: seguridad OWASP.

- [ ] **TASK-014**: Implementar consentimiento de datos.
  - Endpoint `POST /consent` que registra IP, versión de política y timestamp al registrarse.
  - Requisitos: REQ-PRIV-02, REQ-PRIV-04.

---

## FASE 2 — Backend: Contenido

- [ ] **TASK-020**: Módulo de juegos (CRUD + progreso).
  - CRUD admin para juegos (REQ-GAME-05).
  - Endpoint público de listado que nunca expone `embed_url_full` a usuarios free.
  - Endpoint de progreso por usuario (REQ-GAME-04).

- [ ] **TASK-021**: Módulo de videos (CRUD).
  - CRUD admin para videos (REQ-VIDEO-03).
  - Lógica de acceso: si `is_premium=true`, retornar embed_url solo a usuarios premium.
  - Soporte para upload a Cloudinary/S3 (REQ-VIDEO-01).

- [ ] **TASK-022**: Módulo de artículos (CRUD + publicación).
  - CRUD admin con campo `is_published` y `published_at`.
  - Endpoint público retorna solo artículos publicados.
  - Requisitos: REQ-CONT-03 al REQ-CONT-05.

- [ ] **TASK-023**: Módulo de contacto.
  - Endpoint `POST /contact` con validación de campos.
  - Envío de email a administración (Nodemailer + SMTP o SendGrid).
  - Requisitos: REQ-CONT-06, REQ-CONT-07.

---

## FASE 3 — Backend: Pagos y suscripciones (MVP manual)

- [ ] **TASK-030**: Implementar módulo de solicitud de plan premium (MVP sin pasarela).
  - Endpoint `POST /subscriptions/request` → crea registro con `status='pending'`, plan y método de pago preferido.
  - Envía notificación por email al administrador con los datos de la solicitud.
  - Requisitos: REQ-PAY-01 (MVP), REQ-PAY-02.

- [ ] **TASK-031**: Implementar activación manual de suscripción por admin.
  - Endpoint `PUT /admin/subscriptions/:id/activate` [admin] → actualiza `status='active'` y calcula `expires_at` según el plan.
  - Envía correo de confirmación y bienvenida al usuario.
  - Requisitos: REQ-PAY-03.

- [ ] **TASK-032**: Gestión de suscripciones activas.
  - Job/cron diario para marcar suscripciones expiradas (`status='expired'`).
  - Endpoint `GET /subscriptions/status` [auth] → retorna estado y fecha de expiración del usuario actual.
  - Requisitos: REQ-FREE-04.

- [ ] **TASK-033** (Futuro): Integración con pasarela automática (Wompi/Stripe).
  - Desacoplar la lógica de negocio del método de pago desde TASK-030.
  - Implementar `POST /payments/create` y `POST /payments/webhook` cuando se contrate la pasarela.
  - Requisitos: REQ-PAY-04 (futuro), REQ-PAY-05 (futuro).
  - **Esta tarea se ejecuta en una fase posterior, no en el MVP.**

---

## FASE 4 — Frontend: Base y navegación

- [ ] **TASK-040**: Configurar enrutador y estructura de páginas.
  - React Router v6 con rutas lazy-loaded.
  - `ProtectedRoute` para rutas que requieren auth o premium.
  - Estructura de carpetas según el diseño (Sección 3 del design.md).

- [ ] **TASK-041**: Implementar Navbar y menú hamburguesa.
  - Barra fija en desktop con links principales.
  - Menú slide-in lateral en mobile (< 768px) con animación CSS/Framer Motion.
  - Indicador de sesión: avatar/nombre si está logueado, botón "Iniciar sesión" si no.
  - Requisitos: REQ-NAV-01, REQ-NAV-02, REQ-NAV-03.

- [ ] **TASK-042**: Implementar Footer.
  - Links a: Política de Datos, Términos, Contacto, Redes Sociales.
  - Copyright con año dinámico.
  - Requisitos: REQ-PRIV-01.

- [ ] **TASK-043**: Implementar banner de cookies (GDPR/Ley 1581).
  - Aparece en primera visita.
  - Opciones: Aceptar todas / Solo esenciales / Configurar.
  - Guarda preferencia en cookie de 1 año.
  - Requisitos: REQ-PRIV-04.

---

## FASE 5 — Frontend: Autenticación

- [ ] **TASK-050**: Implementar `AuthContext` y servicio de autenticación.
  - Manejo de tokens JWT (almacenados en memoria + refresh token en cookie HttpOnly).
  - Interceptor Axios para renovar token automáticamente antes de que expire.
  - Requisitos: REQ-AUTH-04, REQ-AUTH-06.

- [ ] **TASK-051**: Página de Registro (Sign Up).
  - Formulario: nombre, email, contraseña, confirmación, tipo de perfil.
  - Guardar borrador en cookie `reg_draft` con `js-cookie` en cada onChange.
  - Al recargar, restaurar valores desde cookie.
  - Limpiar cookie al completar registro exitoso.
  - Checkbox de aceptación de política de datos (obligatorio).
  - Requisitos: REQ-AUTH-01, REQ-AUTH-06, REQ-PRIV-02.

- [ ] **TASK-052**: Página de Login.
  - Formulario: email, contraseña.
  - Enlace "¿Olvidaste tu contraseña?".
  - Mensaje de error amigable sin revelar si el email existe.
  - Requisitos: REQ-AUTH-02.

- [ ] **TASK-053**: Flujo de recuperación de contraseña.
  - Página "Ingresa tu email".
  - Página de confirmación "Revisa tu correo".
  - Página de nueva contraseña (consume token de URL).
  - Requisitos: REQ-AUTH-05.

- [ ] **TASK-054**: Página Mi Cuenta.
  - Ver y editar nombre, avatar.
  - Ver estado de suscripción y fecha de expiración.
  - Botón "Solicitar eliminación de datos" (genera ticket de soporte).
  - Requisitos: REQ-PRIV-03.

---

## FASE 6 — Frontend: Páginas de contenido

- [ ] **TASK-060**: Página Home.
  - Hero banner animado con CTA "Explorar juegos".
  - Sección "¿Qué es esta plataforma?" (misión/objetivo).
  - Grid de juegos destacados (máx 6).
  - Sección de artículos recientes (máx 3).
  - Bloque de conversión a premium.
  - Requisitos: REQ-CONT-01.

- [ ] **TASK-061**: Página Juegos.
  - Grid responsivo de GameCards con filtros por categoría y nivel educativo.
  - Badges visuales FREE / PREMIUM.
  - Paginación o carga infinita.
  - Requisitos: REQ-GAME-02, REQ-GAME-03.

- [ ] **TASK-062**: Página Detalle de Juego.
  - Embed del juego (iframe) — demo para todos, versión completa solo premium.
  - Si el usuario free intenta la versión completa → modal de upgrade.
  - Registro de progreso automático.
  - Requisitos: REQ-GAME-01, REQ-FREE-02, REQ-FREE-03, REQ-FREE-04, REQ-GAME-04.

- [ ] **TASK-063**: Página Videos.
  - Grid de VideoCards con badge FREE / PREMIUM.
  - Filtros por categoría.
  - Requisitos: REQ-VIDEO-01, REQ-VIDEO-02.

- [ ] **TASK-064**: Página Artículos y Detalle.
  - Lista de artículos con imagen, extracto y categoría.
  - Página de detalle con contenido HTML renderizado de forma segura (DOMPurify).
  - Requisitos: REQ-CONT-03, REQ-CONT-04.

- [ ] **TASK-065**: Página Perfil de la Docente.
  - Foto, nombre, biografía, especialidades y experiencia.
  - Contenido gestionable desde el panel admin.
  - Requisitos: REQ-CONT-02.

- [ ] **TASK-066**: Página Contacto.
  - Formulario con validación (react-hook-form + zod).
  - Guardar borrador en cookie mientras el usuario escribe.
  - Links a redes sociales e información de contacto adicional.
  - Requisitos: REQ-CONT-06, REQ-CONT-07, REQ-CONT-08.

---

## FASE 7 — Frontend: Pagos y precios

- [ ] **TASK-070**: Página de Precios (Pricing).
  - Dos columnas: FREE vs PREMIUM.
  - Tabla comparativa de características.
  - Planes mensual y anual con precios en COP.
  - Botón "Solicitar acceso premium" que abre formulario de solicitud (nombre, método de pago: efectivo / Nequi / transferencia bancaria).
  - Instrucciones claras de cómo realizar el pago y tiempo estimado de activación.
  - Requisitos: REQ-PAY-01 (MVP), REQ-PAY-02.

- [ ] **TASK-071**: Flujo de solicitud de premium (MVP).
  - Formulario de solicitud → POST a `/subscriptions/request`.
  - Pantalla de confirmación: "Solicitud recibida. El admin activará tu acceso en menos de 24 horas."
  - Email automático al usuario con instrucciones de pago.
  - Requisitos: REQ-PAY-01 (MVP), REQ-PAY-03.

- [ ] **TASK-072** (Futuro): Flujo de Checkout con pasarela automática.
  - Reemplaza TASK-071 cuando se integre Wompi/Stripe.
  - Modal/página de checkout que abre el widget de la pasarela.
  - Confirmación de pago exitoso con animación.
  - **No implementar en el MVP.**

---

## FASE 8 — Frontend: Privacidad y legal

- [ ] **TASK-080**: Página Política de Tratamiento de Datos Personales.
  - Contenido completo conforme a Ley 1581/2012 y Decreto 1377/2013.
  - Secciones: responsable, finalidad, derechos del titular, mecanismos de ejercicio de derechos, vigencia.
  - Versión con fecha de última actualización.
  - Requisitos: REQ-PRIV-01.

- [ ] **TASK-081**: Página Términos y Condiciones.
  - Términos de uso del servicio, propiedad intelectual, limitación de responsabilidad.

---

## FASE 9 — Frontend: Panel de Administración

- [ ] **TASK-090**: Dashboard de administración.
  - Métricas: usuarios totales, suscripciones activas, juegos más jugados.
  - Acceso solo para rol `admin`.
  - Requisitos: REQ-ADMIN-01, REQ-ADMIN-03.

- [ ] **TASK-091**: CRUD de Juegos en panel admin.
  - Formulario de creación/edición con subida de imagen de portada.
  - Toggle activo/inactivo.
  - Requisitos: REQ-GAME-05.

- [ ] **TASK-092**: CRUD de Videos en panel admin.
  - Subida de video o ingreso de URL embebida.
  - Toggle free/premium.
  - Requisitos: REQ-VIDEO-03.

- [ ] **TASK-093**: CRUD de Artículos en panel admin.
  - Editor de texto enriquecido (TipTap o Quill).
  - Publicar / despublicar.
  - Requisitos: REQ-CONT-05.

- [ ] **TASK-094**: Gestión de usuarios en panel admin.
  - Tabla de usuarios con búsqueda y filtros.
  - Cambiar rol, suspender usuario.
  - Requisitos: REQ-ADMIN-02.

---

## FASE 10 — Calidad y despliegue

- [ ] **TASK-100**: Pruebas unitarias de servicios críticos del backend.
  - Auth (hashing, JWT, rate limit).
  - Lógica de suscripción (activar, expirar).
  - Validación del webhook de pagos (firma HMAC).

- [ ] **TASK-101**: Pruebas de integración de flujos principales.
  - Flujo registro → login → acceso premium.
  - Flujo pago → webhook → acceso desbloqueado.

- [ ] **TASK-102**: Auditoría de seguridad básica (OWASP).
  - Revisar headers HTTP (CSP, HSTS, X-Frame-Options).
  - Verificar que ningún endpoint expone datos de otros usuarios.
  - Confirmar que las contraseñas nunca aparecen en logs.
  - Requisitos: REQ-NF-02.

- [ ] **TASK-103**: Optimización de rendimiento frontend.
  - Code splitting por rutas (lazy load).
  - Optimización de imágenes (WebP, lazy loading nativo).
  - Medir con Lighthouse y alcanzar score ≥ 80 Performance / ≥ 90 Accessibility.
  - Requisitos: REQ-NF-01, REQ-NF-05.

- [ ] **TASK-104**: Configurar despliegue en Vercel/Netlify.
  - Archivo `vercel.json` o `netlify.toml` con redirects para SPA.
  - Variables de entorno configuradas en el panel del proveedor.
  - Pipeline CI/CD desde rama `main`.
  - Requisitos: REQ-NF-03.

- [ ] **TASK-105**: Configurar despliegue del backend.
  - Dockerfile o configuración Railway/Render.
  - Migraciones automáticas en deploy.
  - Health check endpoint `GET /health`.
  - Requisitos: REQ-NF-03.

- [ ] **TASK-106**: Documentación de API (Swagger/OpenAPI).
  - Documentación automática generada con `@nestjs/swagger`.
  - Accesible en `/api/docs` (solo en entorno no-producción).

---

## Prioridad de implementación sugerida (MVP)

| Prioridad | Tareas |
|---|---|
| P0 — Crítico | TASK-001, 002, 010, 011, 012, 020, 040, 041, 042, 050, 051, 052, 060, 061, 062 |
| P1 — Alto | TASK-030, 031, 070, 071, 080, 090, 091, 092, 093 |
| P2 — Medio | TASK-013, 021, 022, 023, 043, 053, 054, 063, 064, 065, 066, 094 |
| P3 — Bajo | TASK-100 al 106, TASK-081, TASK-014 |
