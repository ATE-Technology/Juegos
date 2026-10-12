# Requisitos — Plataforma Educativa con Juegos Demo

## Visión general

Plataforma web educativa dirigida a niños y sus padres/docentes, que ofrece juegos interactivos y videos en modalidad **freemium**: acceso gratuito a demos y acceso completo mediante pago. La plataforma debe ser visualmente atractiva para niños, segura para datos personales y cumplir con la legislación colombiana de protección de datos (Ley 1581 de 2012).

---

## 1. Requisitos funcionales

### 1.1 Autenticación y gestión de usuarios

- **REQ-AUTH-01**: El sistema DEBE permitir el registro de nuevos usuarios (sign up) con nombre completo, correo electrónico, contraseña y perfil (padre/estudiante/docente).
- **REQ-AUTH-02**: El sistema DEBE permitir inicio de sesión (login) con correo y contraseña.
- **REQ-AUTH-03**: Las contraseñas DEBEN almacenarse con hashing seguro (bcrypt o Argon2). Nunca en texto plano.
- **REQ-AUTH-04**: El sistema DEBE implementar autenticación basada en JWT con refresh tokens.
- **REQ-AUTH-05**: El sistema DEBE ofrecer recuperación de contraseña vía correo electrónico.
- **REQ-AUTH-06**: El sistema DEBE guardar cookies seguras (HttpOnly, SameSite=Strict) para mantener la sesión activa y los formularios parcialmente diligenciados.
- **REQ-AUTH-07**: El sistema DEBE diferenciar dos tipos de usuario: **FREE** (gratuito) y **PREMIUM** (de pago).

### 1.2 Niveles de acceso — Freemium

- **REQ-FREE-01**: Los usuarios no registrados PUEDEN acceder a los juegos demo y artículos públicos sin necesidad de cuenta.
- **REQ-FREE-02**: Los usuarios con cuenta FREE PUEDEN jugar todos los juegos en su versión demo.
- **REQ-FREE-03**: Los usuarios PREMIUM PUEDEN acceder a la versión completa de todos los juegos y videos.
- **REQ-FREE-04**: Al intentar acceder a contenido premium sin suscripción, el sistema DEBE mostrar una pantalla de conversión con opciones de pago.

### 1.3 Juegos educativos

- **REQ-GAME-01**: El sistema DEBE permitir embeber juegos desarrollados externamente (iframe o integración directa) y juegos desarrollados internamente.
- **REQ-GAME-02**: Cada juego DEBE tener: título, descripción corta, materia/categoría, nivel educativo, imagen de portada, versión demo y (opcional) versión completa.
- **REQ-GAME-03**: El sistema DEBE mostrar indicadores visuales que distingan juegos gratuitos de juegos premium.
- **REQ-GAME-04**: El sistema DEBE registrar el progreso del usuario en los juegos (nivel alcanzado, puntuación, tiempo jugado).
- **REQ-GAME-05**: El panel de administración DEBE permitir agregar, editar y desactivar juegos.

### 1.4 Videos educativos

- **REQ-VIDEO-01**: El sistema DEBE soportar videos embebidos (YouTube/Vimeo) y videos subidos directamente.
- **REQ-VIDEO-02**: Los videos DEBEN seguir el mismo modelo freemium que los juegos (demo gratuita, versión completa de pago).
- **REQ-VIDEO-03**: El panel de administración DEBE permitir subir, categorizar y gestionar videos.

### 1.5 Contenido editorial

- **REQ-CONT-01**: La página principal DEBE incluir una sección "Quiénes somos" con el objetivo de la plataforma.
- **REQ-CONT-02**: El sistema DEBE tener una sección de perfil de la docente con foto, biografía y especialidades.
- **REQ-CONT-03**: El sistema DEBE incluir un blog/sección de artículos de orientación para padres y estudiantes.
- **REQ-CONT-04**: Los artículos DEBEN tener: título, contenido enriquecido (rich text), imagen, categoría, fecha de publicación y autor.
- **REQ-CONT-05**: El panel de administración DEBE permitir crear, editar y publicar/despublicar artículos.

### 1.6 Pasarela de pagos

- **REQ-PAY-01 (MVP)**: El sistema DEBE ofrecer un flujo de pago manual: el usuario solicita acceso premium, el admin confirma el pago recibido (efectivo / transferencia / Nequi) y activa la cuenta desde el panel de administración.
- **REQ-PAY-02**: El sistema DEBE ofrecer al menos un plan de suscripción mensual y uno anual, con precios definidos por el admin.
- **REQ-PAY-03**: El sistema DEBE generar y enviar por correo una confirmación de activación al usuario cuando el admin activa su cuenta premium.
- **REQ-PAY-04 (futuro)**: La arquitectura DEBE estar preparada para integrar una pasarela automática (Wompi o Stripe) sin reescribir el módulo de suscripciones. La lógica de negocio de suscripciones estará desacoplada del método de pago.
- **REQ-PAY-05 (futuro)**: Cuando se integre pasarela, los datos de tarjeta NUNCA se almacenarán en la base de datos propia; se delegará a la pasarela certificada PCI-DSS.

### 1.7 Navegación

- **REQ-NAV-01**: El sistema DEBE incluir un menú hamburguesa desplegable en dispositivos móviles y tablet.
- **REQ-NAV-02**: El menú DEBE contener: Inicio, Juegos, Videos, Artículos, Perfil de la Docente, Contacto, Iniciar Sesión / Mi Cuenta.
- **REQ-NAV-03**: El diseño DEBE ser responsivo (mobile-first) y adaptarse a pantallas desde 320 px.

### 1.8 Contacto

- **REQ-CONT-06**: El sistema DEBE incluir un formulario de contacto con: nombre, correo, asunto y mensaje.
- **REQ-CONT-07**: El formulario DEBE validar los campos y enviar notificación al correo de administración.
- **REQ-CONT-08**: El sistema DEBE mostrar información adicional de contacto (redes sociales, correo institucional).

### 1.9 Privacidad y protección de datos (Ley 1581/2012)

- **REQ-PRIV-01**: El sistema DEBE incluir una página de Política de Tratamiento de Datos Personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.
- **REQ-PRIV-02**: El sistema DEBE solicitar consentimiento explícito al registrarse y al recolectar datos opcionales.
- **REQ-PRIV-03**: Los usuarios DEBEN poder solicitar la eliminación o rectificación de sus datos personales desde su perfil o desde la sección de privacidad.
- **REQ-PRIV-04**: El sistema DEBE incluir un aviso de cookies con opción de aceptar/rechazar cookies no esenciales.
- **REQ-PRIV-05**: Los datos sensibles DEBEN transmitirse únicamente bajo HTTPS/TLS.

### 1.10 Panel de administración

- **REQ-ADMIN-01**: Debe existir un rol `admin` que tenga acceso completo al panel de administración.
- **REQ-ADMIN-02**: El panel DEBE permitir gestionar usuarios (ver, suspender, cambiar plan).
- **REQ-ADMIN-03**: El panel DEBE mostrar métricas básicas: usuarios registrados, suscripciones activas, juegos más jugados.

---

## 2. Requisitos no funcionales

- **REQ-NF-01 — Rendimiento**: El tiempo de carga inicial DEBE ser menor a 3 segundos en una conexión de 10 Mbps (medido con Lighthouse).
- **REQ-NF-02 — Seguridad**: La aplicación DEBE pasar una auditoría OWASP Top 10 básica antes del despliegue.
- **REQ-NF-03 — Disponibilidad**: El frontend DEBE desplegarse en Vercel o Netlify; el backend en un servicio con SLA ≥ 99.5%.
- **REQ-NF-04 — Escalabilidad**: La arquitectura DEBE soportar al menos 500 usuarios concurrentes sin degradación.
- **REQ-NF-05 — Accesibilidad**: La UI DEBE cumplir WCAG 2.1 nivel AA.
- **REQ-NF-06 — Compatibilidad**: DEBE funcionar en Chrome, Firefox, Safari y Edge (últimas 2 versiones).
- **REQ-NF-07 — Cookies**: Se DEBEN usar cookies HttpOnly + SameSite para tokens de sesión; cookies de formulario para datos no completados.

---

## 3. Restricciones técnicas

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + TailwindCSS |
| Backend | Node.js + NestJS + TypeScript |
| Base de datos | PostgreSQL alojado en Supabase (plan gratuito, TLS + RLS incluidos) |
| Autenticación | JWT (access token en memoria + refresh token en cookie HttpOnly) + Argon2id |
| Pagos (MVP) | Flujo manual: el admin activa el acceso premium tras confirmar pago en efectivo/transferencia |
| Pagos (futuro) | Integración con Wompi (Colombia) o Stripe — arquitectura ya preparada |
| Despliegue frontend | Vercel o Netlify |
| Despliegue backend | Railway o Render |
| Almacenamiento archivos | Cloudinary (plan gratuito para imágenes y videos cortos) |

---

## 4. Criterios de aceptación globales

1. Un usuario no registrado puede ver y jugar una demo de cualquier juego.
2. Un usuario puede registrarse, iniciar sesión y su sesión persiste entre recargas.
3. Al intentar acceder a contenido premium sin suscripción, se muestra el flujo de pago.
4. Tras completar el pago, el acceso premium se activa en menos de 30 segundos.
5. El formulario de registro guarda el progreso en cookies y lo restaura si el usuario regresa antes de completarlo.
6. La política de datos personales es accesible desde el footer en todas las páginas.
7. El sitio obtiene un score de Lighthouse ≥ 80 en Performance y ≥ 90 en Accessibility.
8. Toda comunicación entre cliente y servidor ocurre sobre HTTPS.
