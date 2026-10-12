-- ============================================================
-- SCHEMA — Plataforma Educativa con Juegos
-- Ejecutar en Supabase > SQL Editor
-- ============================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USUARIOS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        VARCHAR(120) NOT NULL,
  email            VARCHAR(255) UNIQUE NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  role             VARCHAR(20) NOT NULL DEFAULT 'free'
                   CHECK (role IN ('free','premium','admin')),
  profile_type     VARCHAR(20)
                   CHECK (profile_type IN ('parent','student','teacher')),
  avatar_url       TEXT,
  reset_password_token  VARCHAR(255),
  reset_password_expiry TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- ── CONSENTIMIENTO DE DATOS (Ley 1581/2012) ──────────────────
CREATE TABLE IF NOT EXISTS data_consent (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  ip_address     INET,
  consented      BOOLEAN NOT NULL,
  policy_version VARCHAR(20) DEFAULT '1.0',
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ── JUEGOS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS games (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           VARCHAR(150) NOT NULL,
  slug            VARCHAR(150) UNIQUE NOT NULL,
  description     TEXT,
  category        VARCHAR(80),
  level           VARCHAR(50),
  cover_url       TEXT,
  embed_url_demo  TEXT,
  embed_url_full  TEXT,
  is_premium      BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── PROGRESO EN JUEGOS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS game_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id       UUID REFERENCES games(id) ON DELETE CASCADE,
  score         INT DEFAULT 0,
  level_reached INT DEFAULT 0,
  play_time_s   INT DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, game_id)
);

-- ── VIDEOS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS videos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(150) NOT NULL,
  slug          VARCHAR(150) UNIQUE NOT NULL,
  description   TEXT,
  embed_url     TEXT,
  is_premium    BOOLEAN DEFAULT false,
  category      VARCHAR(80),
  thumbnail_url TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ── ARTÍCULOS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(200) NOT NULL,
  slug          VARCHAR(200) UNIQUE NOT NULL,
  content       TEXT,
  excerpt       TEXT,
  cover_url     TEXT,
  category      VARCHAR(80),
  author_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  is_published  BOOLEAN DEFAULT false,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ── SUSCRIPCIONES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  plan           VARCHAR(20) NOT NULL CHECK (plan IN ('monthly','annual')),
  status         VARCHAR(20) NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('active','cancelled','expired','pending')),
  payment_method VARCHAR(50),
  payment_ref    VARCHAR(100),
  notes          TEXT,
  started_at     TIMESTAMPTZ,
  expires_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ── MENSAJES DE CONTACTO ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  subject    VARCHAR(200),
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── ÍNDICES ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_games_slug       ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_active     ON games(is_active);
CREATE INDEX IF NOT EXISTS idx_videos_slug      ON videos(slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug    ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_pub     ON articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_subs_user_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);

-- ── DATOS INICIALES (ADMIN) ───────────────────────────────────
-- IMPORTANTE: cambia el password_hash por el hash real generado con Argon2
-- Para generar en Node.js: const argon2 = require('argon2'); console.log(await argon2.hash('TuContraseña'))
-- Luego ejecuta solo este INSERT si quieres crear el primer admin manualmente:
/*
INSERT INTO users (full_name, email, password_hash, role, profile_type)
VALUES (
  'Administrador',
  'admin@juegoseducativos.com',
  '$argon2id$REEMPLAZA_CON_HASH_REAL',
  'admin',
  'teacher'
) ON CONFLICT (email) DO NOTHING;
*/

-- ── JUEGOS DE EJEMPLO ─────────────────────────────────────────
INSERT INTO games (title, slug, description, category, level, is_premium, is_active, embed_url_demo)
VALUES
  ('Sumas Divertidas', 'sumas-divertidas', 'Aprende a sumar con personajes animados', 'Matemáticas', 'preescolar', false, true, ''),
  ('Letras Mágicas', 'letras-magicas', 'Reconoce letras y forma palabras', 'Lenguaje', 'preescolar', false, true, ''),
  ('Ciencias Exploradora', 'ciencias-exploradora', 'Descubre el mundo natural jugando', 'Ciencias', 'primaria', true, true, ''),
  ('Historia de Colombia', 'historia-colombia', 'Conoce la historia de nuestro país', 'Sociales', 'primaria', true, true, ''),
  ('Arte Creativo', 'arte-creativo', 'Expresa tu creatividad con formas y colores', 'Arte', 'preescolar', false, true, ''),
  ('Coding Kids', 'coding-kids', 'Introducción a la programación para niños', 'Tecnología', 'primaria', true, true, '')
ON CONFLICT (slug) DO NOTHING;

-- ── ARTÍCULOS DE EJEMPLO ──────────────────────────────────────
-- (se agregarán desde el panel de administración)

SELECT 'Schema creado exitosamente' AS resultado;
