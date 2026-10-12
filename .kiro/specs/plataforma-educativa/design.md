# Diseño — Plataforma Educativa con Juegos Demo

## 1. Arquitectura general

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE (Browser)                  │
│   React 18 + TypeScript + TailwindCSS               │
│   Desplegado en Vercel / Netlify                    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / REST
┌──────────────────────▼──────────────────────────────┐
│                   BACKEND API                        │
│   Node.js + NestJS + TypeScript                     │
│   Desplegado en Railway / Render                    │
└──────┬──────────────┬─────────────────┬─────────────┘
       │              │                 │
┌──────▼──────┐ ┌─────▼──────┐ ┌───────▼─────────────┐
│ PostgreSQL  │ │ Cloudinary │ │ Pago MVP: manual     │
│ Supabase   │ │ (imágenes  │ │ (admin activa cuenta)│
│ TLS + RLS  │ │  y videos) │ │ Futuro: Wompi/Stripe │
└─────────────┘ └────────────┘ └─────────────────────┘
```

---

## 2. Estructura de la base de datos

### Tabla `users`
```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
full_name     VARCHAR(120) NOT NULL
email         VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL          -- bcrypt/Argon2
role          ENUM('admin','free','premium') DEFAULT 'free'
profile_type  ENUM('parent','student','teacher')
avatar_url    TEXT
created_at    TIMESTAMPTZ DEFAULT now()
updated_at    TIMESTAMPTZ DEFAULT now()
```

### Tabla `subscriptions`
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
plan            ENUM('monthly','annual')
status          ENUM('active','cancelled','expired','pending')
started_at      TIMESTAMPTZ
expires_at      TIMESTAMPTZ
payment_ref     VARCHAR(100)    -- referencia de la pasarela
gateway         VARCHAR(50)     -- 'wompi' | 'stripe'
created_at      TIMESTAMPTZ DEFAULT now()
```

### Tabla `games`
```sql
id              UUID PRIMARY KEY
title           VARCHAR(150) NOT NULL
slug            VARCHAR(150) UNIQUE NOT NULL
description     TEXT
category        VARCHAR(80)
level           VARCHAR(50)     -- 'preescolar','primaria','secundaria'
cover_url       TEXT
embed_url_demo  TEXT            -- iframe src versión demo
embed_url_full  TEXT            -- iframe src versión completa
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT now()
```

### Tabla `game_progress`
```sql
id          UUID PRIMARY KEY
user_id     UUID REFERENCES users(id)
game_id     UUID REFERENCES games(id)
score       INT DEFAULT 0
level_reached INT DEFAULT 0
play_time_s INT DEFAULT 0
updated_at  TIMESTAMPTZ DEFAULT now()
UNIQUE(user_id, game_id)
```

### Tabla `videos`
```sql
id          UUID PRIMARY KEY
title       VARCHAR(150) NOT NULL
slug        VARCHAR(150) UNIQUE NOT NULL
description TEXT
embed_url   TEXT
is_premium  BOOLEAN DEFAULT false
category    VARCHAR(80)
thumbnail   TEXT
created_at  TIMESTAMPTZ DEFAULT now()
```

### Tabla `articles`
```sql
id            UUID PRIMARY KEY
title         VARCHAR(200) NOT NULL
slug          VARCHAR(200) UNIQUE NOT NULL
content       TEXT            -- HTML enriquecido
excerpt       TEXT
cover_url     TEXT
category      VARCHAR(80)
author_id     UUID REFERENCES users(id)
is_published  BOOLEAN DEFAULT false
published_at  TIMESTAMPTZ
created_at    TIMESTAMPTZ DEFAULT now()
```

### Tabla `contact_messages`
```sql
id          UUID PRIMARY KEY
name        VARCHAR(120) NOT NULL
email       VARCHAR(255) NOT NULL
subject     VARCHAR(200)
message     TEXT NOT NULL
read        BOOLEAN DEFAULT false
created_at  TIMESTAMPTZ DEFAULT now()
```

### Tabla `data_consent`
```sql
id          UUID PRIMARY KEY
user_id     UUID REFERENCES users(id)
ip_address  INET
consented   BOOLEAN NOT NULL
version     VARCHAR(20)    -- versión de la política
created_at  TIMESTAMPTZ DEFAULT now()
```

---

## 3. Arquitectura del frontend

### Estructura de carpetas (React + TypeScript)

```
src/
├── assets/              # Imágenes, fuentes, íconos
├── components/
│   ├── common/          # Button, Modal, Badge, Spinner, etc.
│   ├── layout/          # Navbar, Footer, HamburgerMenu, Sidebar
│   ├── games/           # GameCard, GameEmbed, GameGrid
│   ├── videos/          # VideoCard, VideoPlayer
│   ├── articles/        # ArticleCard, ArticleBody
│   └── payment/         # PricingCard, CheckoutModal
├── pages/
│   ├── Home/
│   ├── Games/
│   ├── GameDetail/
│   ├── Videos/
│   ├── Articles/
│   ├── ArticleDetail/
│   ├── TeacherProfile/
│   ├── Contact/
│   ├── Auth/
│   │   ├── Login/
│   │   └── Register/
│   ├── Account/
│   ├── Pricing/
│   ├── Privacy/
│   └── Admin/
│       ├── Dashboard/
│       ├── ManageGames/
│       ├── ManageVideos/
│       ├── ManageArticles/
│       └── ManageUsers/
├── context/
│   ├── AuthContext.tsx
│   └── SubscriptionContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCookieForm.ts    # Guardar progreso de formularios en cookies
│   └── useSubscription.ts
├── services/
│   ├── api.ts              # Axios instancia base con interceptores JWT
│   ├── authService.ts
│   ├── gameService.ts
│   ├── videoService.ts
│   ├── articleService.ts
│   └── paymentService.ts
├── utils/
│   ├── cookieUtils.ts
│   └── validators.ts
├── router/
│   ├── AppRouter.tsx
│   └── ProtectedRoute.tsx  # Ruta protegida por rol
└── main.tsx
```

### Gestión de estado
- **React Context + useReducer** para auth y suscripción.
- **React Query (TanStack Query)** para fetching, caché y sincronización de datos del servidor.
- **Cookies (js-cookie)** para persistencia de sesión y formularios parciales.

---

## 4. Diseño visual

### Paleta de colores (orientada a niños, moderna)
| Token | Valor | Uso |
|---|---|---|
| `primary` | `#6C63FF` | Morado vibrante — acción principal |
| `secondary` | `#FF6584` | Rosa coral — acentos |
| `accent` | `#43E97B` | Verde menta — éxito / premium |
| `warning` | `#FFD600` | Amarillo — destacar demos |
| `dark` | `#1A1A2E` | Fondos oscuros |
| `light` | `#F8F9FF` | Fondos claros |

### Tipografía
- **Títulos**: `Nunito` (redondeada, amigable para niños)
- **Cuerpo**: `Inter` (legible, moderna)

### Componentes UI clave
- **Menú hamburguesa**: Animación suave slide-in lateral. Visible en `< 768px`. En desktop: barra de navegación horizontal fija.
- **GameCard**: Tarjeta con imagen de portada, badge de categoría, badge FREE/PREMIUM, botón "Jugar".
- **HeroBanner**: Animación de personajes o íconos de juegos flotantes. CTA llamativo.
- **PricingCard**: Comparación visual FREE vs PREMIUM con checklist de características.

---

## 5. Flujos principales

### 5.1 Flujo de registro con cookies
```
Usuario llena formulario → 
  Cada campo onChange guarda en cookie "reg_draft" →
    Usuario cierra pestaña →
      Al volver, el formulario se rellena automáticamente desde cookie →
        Usuario completa y envía →
          Cookie "reg_draft" se elimina
```

### 5.2 Flujo de acceso a contenido premium
```
Click en juego/video PREMIUM →
  ¿Sesión activa? 
    No → Modal "Inicia sesión para continuar"
    Sí → ¿Tiene suscripción activa?
      Sí → Abre contenido completo
      No → Página de Precios con plan recomendado destacado →
            Elige plan → Checkout → Webhook pasarela →
              Backend actualiza subscriptions →
                Usuario redirigido al contenido (acceso desbloqueado)
```

### Pasarela de pagos
```
MVP — Pago manual:
  Usuario solicita plan premium →
    Formulario: nombre, método de pago preferido (efectivo/Nequi/transferencia) →
      Backend crea registro subscription con status='pending' →
        Admin recibe notificación por email →
          Admin confirma pago recibido en panel →
            Backend actualiza status='active', expires_at = now() + período →
              Usuario recibe correo de confirmación y acceso desbloqueado

Futuro — Pasarela automática (Wompi/Stripe):
  Frontend crea "payment intent" (POST /payments/create) →
    Backend retorna token/widget URL →
      Frontend abre widget de pasarela →
        Usuario ingresa datos de tarjeta (en iframe de pasarela, nunca en nuestro dominio) →
          Pasarela procesa → Envía webhook a /payments/webhook →
            Backend valida firma HMAC del webhook →
              Actualiza subscriptions → Envía correo de confirmación
```

---

## 6. Seguridad

| Amenaza | Mitigación |
|---|---|
| Inyección SQL | ORM (TypeORM/Prisma) con queries parametrizadas |
| XSS | Sanitización de HTML en artículos (DOMPurify), CSP headers |
| CSRF | Tokens CSRF + SameSite cookies |
| Fuerza bruta en login | Rate limiting (5 intentos / 15 min por IP) |
| Exposición de datos | Roles en JWT verificados en cada endpoint |
| Datos de pago | Nunca almacenados; delegados a pasarela PCI-DSS |
| Contraseñas | Argon2id con salt único por usuario |
| Transmisión | HTTPS obligatorio; HSTS header activado |

---

## 7. API REST — Endpoints principales

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
DELETE /api/auth/logout
```

### Juegos
```
GET    /api/games                 # Lista pública (demo info)
GET    /api/games/:slug           # Detalle (URL full solo para premium)
POST   /api/games          [admin]
PUT    /api/games/:id      [admin]
DELETE /api/games/:id      [admin]
GET    /api/games/:id/progress  [auth]
PUT    /api/games/:id/progress  [auth]
```

### Videos
```
GET  /api/videos
GET  /api/videos/:slug
POST /api/videos      [admin]
PUT  /api/videos/:id  [admin]
```

### Artículos
```
GET  /api/articles
GET  /api/articles/:slug
POST /api/articles        [admin]
PUT  /api/articles/:id    [admin]
```

### Pagos
```
POST /api/payments/create      [auth]
POST /api/payments/webhook     [pasarela]
GET  /api/payments/status      [auth]
```

### Contacto
```
POST /api/contact
```

### Usuarios (admin)
```
GET    /api/admin/users
PUT    /api/admin/users/:id/role
DELETE /api/admin/users/:id
GET    /api/admin/stats
```

---

## 8. Despliegue

### Frontend (Vercel / Netlify)
- Build: `npm run build` → carpeta `dist/`
- Variables de entorno: `VITE_API_URL`, `VITE_CLOUDINARY_CLOUD_NAME`
- Redirects: `/* → /index.html` (SPA routing)

### Backend (Railway / Render)
- Node.js + NestJS, build automático desde repo
- Variables de entorno: `DATABASE_URL` (Supabase), `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SMTP_*`, `CLOUDINARY_*`
- Migraciones automáticas con TypeORM en startup

### Base de datos (Supabase — plan gratuito)
- PostgreSQL 15 con TLS obligatorio en todas las conexiones
- Row Level Security (RLS) activado como capa adicional
- Backups automáticos diarios (últimos 7 días)
- Dashboard con logs de acceso y métricas
- **Límites del plan gratuito**: 500 MB de almacenamiento, 2 GB de transferencia/mes — suficiente para el MVP

---

## 9. Internacionalización y legislación

- Idioma principal: **Español (Colombia)**
- Zona horaria: `America/Bogota`
- Moneda: **COP (Peso colombiano)**
- Política de datos: cumplimiento Ley 1581/2012, registro ante la SIC si aplica
- Aviso de cookies: banner en primera visita con opciones granulares

---

## 10. Consideraciones de accesibilidad

- Contraste de colores ≥ 4.5:1 (WCAG AA)
- Todos los elementos interactivos accesibles por teclado
- Textos alternativos en todas las imágenes
- Tamaño mínimo de fuente: 16px en cuerpo
- Botones y áreas de toque ≥ 44×44px (especialmente en móvil)
- ARIA labels en menú hamburguesa, modales y formularios
