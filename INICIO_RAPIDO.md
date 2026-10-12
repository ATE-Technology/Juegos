# Guía de Inicio Rápido — Juegos Educativos

## URLs para probar el proyecto

| Servicio | URL | Descripción |
|---|---|---|
| **Frontend (web)** | http://localhost:5173 | La página principal |
| **Backend API** | http://localhost:3000/api | API REST |
| **Documentación API** | http://localhost:3000/api/docs | Swagger / OpenAPI |
| **Health check** | http://localhost:3000/api/health | Verificar que el backend funciona |

---

## Paso 1 — Instalar Node.js (si no lo has hecho)

1. Ve a https://nodejs.org/en/download
2. Descarga **"Windows Installer (.msi) — LTS"** (versión recomendada)
3. Ejecuta el instalador y sigue los pasos (acepta todas las opciones por defecto)
4. **Reinicia el terminal** después de instalar
5. Verifica: abre PowerShell y escribe `node --version` → debe mostrar `v22.x.x`

---

## Paso 2 — Configurar la base de datos en Supabase (gratuito)

1. Ve a https://supabase.com y crea una cuenta gratuita
2. Crea un nuevo proyecto (elige región: **South America (São Paulo)**)
3. Espera ~2 minutos a que se inicialice
4. En el panel de Supabase, ve a **SQL Editor** (ícono de base de datos)
5. Copia y pega todo el contenido del archivo `database/schema.sql`
6. Haz clic en **"Run"**
7. Copia la **Connection String** desde: Settings → Database → Connection string → URI
   - Debe verse así: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

---

## Paso 3 — Configurar el Backend

Abre PowerShell en la carpeta `backend/`:

```powershell
# 1. Copiar el archivo de variables de entorno
Copy-Item .env.example .env

# 2. Editar .env con tus datos reales (abre con Notepad o VS Code)
notepad .env
```

Datos que debes cambiar en `.env`:
- `DATABASE_URL` → la URL de Supabase del paso 2
- `JWT_SECRET` → escribe cualquier texto largo (ej: `mi_secreto_muy_largo_2026_abc123`)
- `JWT_REFRESH_SECRET` → otro texto diferente largo
- `SMTP_USER` / `SMTP_PASS` → tu correo Gmail y App Password (opcional por ahora)
- `ADMIN_EMAIL` → el correo donde recibirás notificaciones

```powershell
# 3. Instalar dependencias
npm install

# 4. Iniciar el backend en modo desarrollo
npm run start:dev
```

Verás en la consola: `🚀 Backend corriendo en http://localhost:3000/api`

---

## Paso 4 — Configurar el Frontend

Abre **otra ventana** de PowerShell en la carpeta `frontend/`:

```powershell
# 1. Copiar el archivo de variables de entorno
Copy-Item .env.example .env.local

# 2. Instalar dependencias
npm install

# 3. Iniciar el frontend en modo desarrollo
npm run dev
```

Verás en la consola: `Local: http://localhost:5173/`

---

## Paso 5 — Crear el primer usuario Admin

Una vez que el backend esté corriendo, tienes dos opciones:

### Opción A — Registrarse desde la web y luego promover a admin
1. Abre http://localhost:5173/registro
2. Crea una cuenta normal
3. En Supabase SQL Editor, ejecuta:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'tu@correo.com';
   ```
4. Cierra sesión y vuelve a ingresar → ya tendrás acceso al panel admin

### Opción B — Directo en SQL
1. Genera el hash de tu contraseña. En PowerShell (una vez instalado Node):
   ```powershell
   node -e "const argon2 = require('argon2'); argon2.hash('TuContraseña123').then(h => console.log(h))"
   ```
   (Ejecutar dentro de la carpeta `backend/` donde está `node_modules`)
2. Usa ese hash en el INSERT del archivo `database/schema.sql` (el que está comentado)

---

## Estructura de URLs del Frontend

| Página | URL |
|---|---|
| Inicio | http://localhost:5173/ |
| Juegos | http://localhost:5173/juegos |
| Videos | http://localhost:5173/videos |
| Artículos | http://localhost:5173/articulos |
| Perfil Docente | http://localhost:5173/docente |
| Precios | http://localhost:5173/precios |
| Contacto | http://localhost:5173/contacto |
| Registrarse | http://localhost:5173/registro |
| Iniciar sesión | http://localhost:5173/login |
| Mi cuenta | http://localhost:5173/mi-cuenta |
| **Panel Admin** | http://localhost:5173/admin |
| Política de datos | http://localhost:5173/privacidad |
| Términos | http://localhost:5173/terminos |

---

## Endpoints principales del Backend (para probar)

Abre http://localhost:3000/api/docs para ver todos con Swagger.

Ejemplos rápidos con el navegador (GET sin autenticación):
- http://localhost:3000/api/health → `{"status":"ok"}`
- http://localhost:3000/api/games → lista de juegos
- http://localhost:3000/api/articles → lista de artículos publicados

---

## Despliegue en Vercel (Frontend)

1. Crea cuenta en https://vercel.com
2. Conecta tu repositorio de GitHub (primero sube el código con `git init && git add . && git commit -m "inicial"`)
3. Importa el proyecto → selecciona la carpeta `frontend/`
4. En "Environment Variables" agrega:
   - `VITE_API_URL` = URL de tu backend en Railway (ej: `https://tu-app.railway.app/api`)
5. Haz clic en Deploy
6. Tu frontend quedará en: `https://tu-proyecto.vercel.app`

## Despliegue del Backend en Railway

1. Crea cuenta en https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona la carpeta `backend/`
4. En "Variables", agrega todas las del archivo `.env` (con datos de producción)
5. Railway genera automáticamente una URL como `https://tu-app.railway.app`

---

## Solución de problemas comunes

| Error | Solución |
|---|---|
| `node: command not found` | Instala Node.js desde nodejs.org y reinicia el terminal |
| `Cannot connect to database` | Verifica que `DATABASE_URL` en `.env` sea correcto y tenga `?sslmode=require` al final |
| `CORS error` en el navegador | Verifica que `CORS_ORIGIN` en el backend apunte a `http://localhost:5173` |
| Puerto 5173 ocupado | El frontend usará 5174. Actualiza `CORS_ORIGIN` en el backend |
| Puerto 3000 ocupado | Cambia `PORT=3001` en `.env` del backend y actualiza `VITE_API_URL` en el frontend |
| Juegos sin contenido | Normal para el MVP. Agrega juegos desde http://localhost:5173/admin/juegos |
