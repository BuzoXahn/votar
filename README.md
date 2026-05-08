# VotAR 🗳️

**Plataforma de participación ciudadana digital basada en avatares anónimos.**

VotAR permite a ciudadanos votar simbólicamente sobre leyes, iniciativas y decisiones públicas usando un avatar anónimo, y ver resultados segmentados por profesión. El sistema garantiza que ningún administrador pueda vincular un voto con una identidad real.

---

## Requisitos previos

| Herramienta | Versión mínima | Cómo verificar |
|---|---|---|
| Node.js | 20.x | `node --version` |
| pnpm | 9.x | `pnpm --version` |
| Docker Desktop | Cualquiera reciente | Que esté abierto y corriendo |
| Expo Go (teléfono) | Última versión | App Store / Google Play |

Si no tienes pnpm:
```bash
npm install -g pnpm
```

---

## Estructura del proyecto

```
votar/
├── apps/
│   ├── api/                    # Backend NestJS + PostgreSQL
│   └── mobile/                 # App React Native con Expo
├── packages/
│   ├── types/                  # Tipos compartidos
│   ├── utils/                  # Helpers compartidos
│   └── config/                 # Configuración compartida
├── docker-compose.yml
├── .env.example
└── pnpm-workspace.yaml
```

---

## Instalación completa

### 1. Instala las dependencias

```bash
# Desde la raíz votar/
pnpm install
pnpm approve-builds
pnpm install
```

### 2. Configura las variables de entorno

```bash
# Linux / Mac
cp .env.example .env

# Windows PowerShell
copy .env.example .env
```

Copia el `.env` también a `apps/api/`:

```powershell
# Windows
copy .env apps\api\.env
```

Abre `apps/api/.env` y verifica que `DATABASE_URL` sea una sola línea:

```
DATABASE_URL=postgresql://votar:votar_dev_password@127.0.0.1:5433/votar_db
```

> **Nota Windows:** Si tienes PostgreSQL instalado localmente, el proyecto usa el puerto `5433` para evitar conflictos. Asegúrate de que `DATABASE_URL` use `127.0.0.1:5433` y que `docker-compose.yml` tenga `'5433:5432'` en los puertos.

### 3. Levanta la base de datos

Asegúrate de que Docker Desktop está abierto, luego:

```bash
docker compose up postgres -d
```

Verifica que está corriendo:
```bash
docker compose ps
# Debe mostrar votar_postgres con estado healthy
```

### 4. Migra y carga datos de prueba

```bash
pnpm db:migrate
# Cuando pida nombre escribe: init

pnpm db:seed
# Crea 10 profesiones, 2 funcionarios y 2 votaciones demo
```

### 5. Arranca la API

```bash
pnpm dev:api
```

Cuando veas esto, el backend está listo:
```
VotAR API corriendo en http://localhost:3000
Swagger docs: http://localhost:3000/docs
```

---

## Correr la app mobile

### 1. Instala dependencias del mobile

```bash
cd apps/mobile
npm install
```

### 2. Configura la URL de la API

Abre `apps/mobile/src/services/api.ts`:

```typescript
// Simulador iOS → usa localhost
export const API_URL = 'http://localhost:3000/v1';

// Android o dispositivo físico → usa tu IP local
export const API_URL = 'http://192.168.1.X:3000/v1';
```

Para saber tu IP local:
```powershell
# Windows
ipconfig | Select-String "IPv4"

# Mac / Linux
ifconfig | grep "inet "
```

### 3. Corre la app

```bash
npx expo start
```

Escanea el QR con la app **Expo Go** en tu teléfono (iOS o Android).

---

## Probar el flujo completo

### Desde Swagger (API)

Abre **http://localhost:3000/docs**

1. `POST /v1/auth/request-otp` → ingresa tu email
2. Busca el OTP en la **terminal de la API** (en desarrollo se imprime ahí)
3. `POST /v1/auth/verify-otp` → pega el código
4. Copia el `accessToken` → clic en **Authorize** (arriba a la derecha)
5. `GET /v1/professions` → copia un `id` de profesión
6. `PUT /v1/users/me/profession` → pega el id
7. `PUT /v1/avatars/me` → crea tu avatar
8. `GET /v1/polls` → copia un `id` de votación
9. `GET /v1/polls/{id}/eligibility` → obtén tu token de voto
10. `POST /v1/polls/{id}/vote` → emite tu voto con el token
11. `GET /v1/polls/{id}/results` → ve los resultados

### Desde la app mobile

1. Abre la app → toca **Comenzar**
2. Ingresa tu email → revisa el OTP en la terminal de la API
3. Ingresa el código de 6 dígitos
4. Selecciona tu profesión
5. Elige un animal, color y apodo para tu avatar
6. Ya estás en el Home con las votaciones activas
7. Toca una votación → **Votar** → elige una opción → confirmar
8. Guarda el hash del comprobante
9. Toca **Ver resultados** para ver general y por profesión

---

## Endpoints de la API

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/v1/auth/request-otp` | Solicitar código OTP | No |
| POST | `/v1/auth/verify-otp` | Verificar OTP y obtener tokens | No |
| POST | `/v1/auth/refresh` | Renovar access token | No |
| POST | `/v1/auth/logout` | Cerrar sesión | JWT |
| GET | `/v1/users/me` | Ver perfil propio | JWT |
| PUT | `/v1/users/me/profession` | Actualizar profesión | JWT |
| GET | `/v1/avatars/me` | Ver mi avatar | JWT |
| PUT | `/v1/avatars/me` | Crear o actualizar avatar | JWT |
| GET | `/v1/professions` | Listar profesiones | No |
| GET | `/v1/polls` | Listar votaciones | No |
| GET | `/v1/polls/:id` | Detalle de votación | No |
| GET | `/v1/polls/:id/results` | Resultados por profesión | No |
| GET | `/v1/polls/:id/eligibility` | Verificar elegibilidad | JWT |
| POST | `/v1/polls/:id/vote` | Emitir voto anónimo | Token |
| GET | `/v1/officials` | Listar funcionarios | No |
| GET | `/v1/officials/:id` | Perfil de funcionario | No |

---

## Pantallas de la app mobile

| Pantalla | Descripción |
|---|---|
| Splash | Bienvenida con logo |
| Login | Ingreso de email |
| OTP | Verificación con 6 cajas individuales |
| Profesión | Selección de profesión con iconos |
| Avatar | Animal + color + apodo con preview en vivo |
| Home | Feed de votaciones activas con saludo |
| Detalle | Info completa + funcionarios relacionados |
| Votación | Opciones + badge de anonimato + comprobante con hash |
| Resultados | Tabs general / por profesión, actualización cada 15 seg |
| Funcionarios | Lista y perfil detallado |
| Perfil | Avatar, estado, sección de privacidad, cerrar sesión |

---

## Comandos de referencia

```bash
# API
pnpm dev:api           # Arrancar backend en modo desarrollo
pnpm db:migrate        # Crear/actualizar tablas
pnpm db:seed           # Cargar datos de prueba
pnpm db:generate       # Regenerar cliente Prisma
pnpm db:studio         # Abrir UI visual de la base de datos
pnpm test:api          # Correr tests del backend

# Mobile
cd apps/mobile
npx expo start         # Arrancar app
npx expo start --android   # Solo Android
npx expo start --ios       # Solo iOS

# Docker
docker compose up postgres -d    # Levantar base de datos
docker compose ps                # Ver estado
docker compose down              # Detener
docker compose down -v           # Detener y borrar datos
```

---

## Cómo funciona el anonimato del voto

El sistema usa **eligibility tokens de un solo uso**:

1. El usuario autenticado (JWT) solicita un token de elegibilidad.
2. El servidor verifica que puede votar y genera un token aleatorio de 32 bytes.
3. Solo guarda el **hash SHA-256** del token — nunca el token en sí.
4. El usuario envía su voto usando ese token **sin incluir su JWT**.
5. El servidor verifica el hash, marca el token como usado y registra el voto **sin ningún userId**.

Cada voto incluye el hash del voto anterior, formando una **cadena verificable** que garantiza integridad sin exponer identidades.

> **Límite del MVP:** Un administrador con acceso a ambas tablas podría correlacionar votos por el hash del token. El anonimato criptográfico completo con blind signatures está planificado para la Fase 2.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | NestJS + TypeScript |
| Base de datos | PostgreSQL + Prisma ORM |
| Autenticación | JWT + OTP + Refresh tokens |
| Seguridad | Helmet, rate limiting, class-validator |
| Documentación | Swagger / OpenAPI en `/docs` |
| Infraestructura | Docker + pnpm workspaces |
| Mobile | React Native + Expo |
| Estado global | Zustand |
| Datos remotos | TanStack Query |
| Fuentes | DM Serif Display + DM Sans |

---

## Solución de problemas comunes

**`DATABASE_URL` no encontrado al migrar**
Copia el `.env` a `apps/api/`: `copy .env apps\api\.env`

**`Authentication failed` al migrar**
Corre `docker compose down -v && docker compose up postgres -d` y vuelve a intentar.

**Puerto 5432 ocupado**
Tienes PostgreSQL local. Cambia el puerto en `docker-compose.yml` a `'5433:5432'` y actualiza `DATABASE_URL` con `127.0.0.1:5433`.

**`Cannot find module` al arrancar la API**
Borra el caché: `Remove-Item -Recurse -Force apps\api\dist` y corre `pnpm dev:api`.

**La app mobile no conecta a la API**
Si usas dispositivo físico, cambia `localhost` por tu IP local en `apps/mobile/src/services/api.ts`.

**OTP no llega al correo**
En desarrollo el OTP se imprime directo en la terminal de la API. Busca una línea como `[DEV] OTP para usuario xxx: 123456`.

---

## Licencia

Proyecto educativo y de demostración. Para uso en producción revisar `SECURITY.md`.
