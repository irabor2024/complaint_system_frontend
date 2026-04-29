# Hospital Compliant Management — API

Production-oriented **Node.js + Express + TypeScript** backend with **PostgreSQL**, **Prisma**, **JWT** auth, optional **Redis** caching, **Nodemailer**, **Zod** validation, and **Pino** logging.

## Architecture (layered)

| Layer | Responsibility |
|--------|----------------|
| **Routes** | HTTP path/method wiring, rate limits, middleware order |
| **Controllers** | Parse request, call services, shape HTTP responses |
| **Services** | Business rules, orchestration, cross-cutting calls (email, cache) |
| **Repositories** | Prisma-only data access (no business rules) |
| **Infrastructure** | DB client, external adapters |
| **Config** | Environment, logger, Redis, mailer |
| **Validation** | Zod schemas |
| **Mappers** | DB enums ↔ API-friendly strings (aligned with the SPA) |

Dependencies point **inward**: routes → controllers → services → repositories → Prisma.

## Quick start

1. Copy environment file and set secrets:

   ```bash
   cp .env.example .env
   ```

   `JWT_SECRET` must be **at least 32 characters**. For local DB:

   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hospital_cm?schema=public
   ```

2. Start PostgreSQL (Docker example from this folder):

   ```bash
   docker compose up -d postgres
   ```

3. Install dependencies, migrate, seed:

   ```bash
   npm install
   npx prisma migrate deploy
   npm run prisma:seed
   ```

4. Run the API:

   ```bash
   npm run dev
   ```

   - Health: `GET http://localhost:4000/health`
   - API base: `http://localhost:4000/api/v1`

### Optional Redis

```bash
docker compose --profile cache up -d redis
```

Set `REDIS_URL=redis://localhost:6379` in `.env`. Department list responses are cached when Redis is available.

### Optional SMTP

Set `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, and `MAIL_FROM`. If SMTP is not configured, outbound emails are **logged** only (safe for local dev).

## Demo accounts (after seed)

| Email | Password | Role |
|--------|----------|------|
| admin@hospital.com | ChangeMe123! | ADMIN |
| staff@hospital.com | ChangeMe123! | STAFF |
| patient@hospital.com | ChangeMe123! | PATIENT |

## Main endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | — | Register patient |
| POST | `/api/v1/auth/login` | — | Login |
| GET | `/api/v1/auth/me` | JWT | Current user |
| GET | `/api/v1/departments` | — | List departments |
| GET | `/api/v1/departments/:id` | — | Department detail |
| POST/PATCH/DELETE | `/api/v1/departments...` | JWT ADMIN | Manage departments |
| GET | `/api/v1/staff` | JWT ADMIN | List staff |
| POST | `/api/v1/staff` | JWT ADMIN | Create staff user |
| POST | `/api/v1/complaints` | — | Submit complaint (rate limited) |
| GET | `/api/v1/complaints/track/:ticketId` | — | Track by ticket |
| GET | `/api/v1/complaints` | JWT | List (role-scoped) |
| GET | `/api/v1/complaints/:id` | JWT | Detail (role-scoped) |
| PATCH | `/api/v1/complaints/:id/status` | JWT STAFF/ADMIN | Update status |
| POST | `/api/v1/complaints/:id/responses` | JWT STAFF/ADMIN | Add response |
| PATCH | `/api/v1/complaints/:id/assign` | JWT ADMIN | Assign staff |
| PATCH | `/api/v1/complaints/:id/priority` | JWT ADMIN | Set priority |
| GET | `/api/v1/notifications` | JWT | List notifications |
| GET | `/api/v1/notifications/unread-count` | JWT | Unread count |
| PATCH | `/api/v1/notifications/:id/read` | JWT | Mark read |
| POST | `/api/v1/notifications/read-all` | JWT | Mark all read |

Send `Authorization: Bearer <token>` for protected routes.

## Error responses (for the frontend)

Failed requests return **HTTP status** plus a JSON body in this shape:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "status": 400,
    "requestId": "uuid",
    "fields": { "email": ["Invalid email"] },
    "details": { "issues": [] }
  }
}
```

- **`error.code`** — Stable machine-readable identifier (e.g. `INVALID_TOKEN`, `DUPLICATE_ENTRY`, `ROUTE_NOT_FOUND`).
- **`error.message`** — User-safe summary text.
- **`error.status`** — Same as the HTTP status code.
- **`error.requestId`** — Matches the **`X-Request-Id`** response header for log correlation.
- **`error.fields`** — Present for validation / unique conflicts when applicable (map directly to form fields).
- **`error.details`** — Optional structured context (in development, 500 errors may include a stack trace).

Handled categories: **`AppError`** (domain), **Zod** validation, **Prisma** known & validation errors, **invalid JSON** body, and a generic **500** with a safe message in production.

## Production notes

- Use `npm run build` then `npm start` behind a reverse proxy (TLS termination, timeouts).
- Set `NODE_ENV=production`, strong `JWT_SECRET`, and real `DATABASE_URL`.
- Run `npx prisma migrate deploy` in CI/CD before starting the process.
- Configure SMTP for patient-facing emails (complaint received, status updates).
