# Hospital Compliant Management

Full-stack hospital complaint management system: **React (Vite)** web client and **Node.js (Express)** API with **PostgreSQL**, optional **Redis**, in-process **AI routing** for complaints (category, priority, department), file attachments, and email notifications.

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js** | **v20+** (required by the API) |
| **PostgreSQL** | **14+** recommended; empty database you can connect to |
| **npm** | Comes with Node (or use **pnpm** / **yarn** analogues to the commands below) |
| **Redis** | Optional — improves department list caching when `REDIS_URL` is set |

---

## 1. Clone the repository

```bash
git clone <repository-url>
cd hospital-compliant-management
```

---

## 2. Create the PostgreSQL database

Create a database (name can match your connection string), for example:

```sql
CREATE DATABASE hospital_cm;
```

---

## 3. Configure and run the API (`server/`)

### 3.1 Install dependencies

```bash
cd server
npm install
```

### 3.2 Environment variables

Copy the example file and edit values:

```bash
cp .env.example .env
```

**Required:**

- **`DATABASE_URL`** — PostgreSQL connection string, e.g.  
  `postgresql://USER:PASSWORD@localhost:5432/hospital_cm?schema=public`
- **`JWT_SECRET`** — At least **32 characters** (used to sign auth tokens).

**Strongly recommended for local UI:**

- **`CORS_ORIGIN`** — Comma-separated origins allowed by the browser, e.g.  
  `http://localhost:5173,http://127.0.0.1:5173`  
  Use `*` only for quick tests (not recommended for production).

See `server/.env.example` for optional **Redis**, **SMTP**, **upload** paths, and **categorization** (`CATEGORIZATION_*`) settings.

### 3.3 Prisma: generate client, migrate, seed

From `server/`:

```bash
npx prisma generate
npx prisma migrate deploy
```

For interactive development (creates/applies migrations locally):

```bash
npm run prisma:migrate
```

Load demo users and departments:

```bash
npm run prisma:seed
```

After seeding, demo accounts share password **`ChangeMe123!`**:

| Role   | Email               |
|--------|---------------------|
| Admin  | `admin@hospital.com` |
| Staff  | `staff@hospital.com` |
| Patient| `patient@hospital.com` |

### 3.4 Start the API (development)

```bash
npm run dev
```

Default: **http://localhost:4000** — health check: **http://localhost:4000/health** — API base: **http://localhost:4000/api/v1**

### 3.5 Production-style API build

```bash
npm run build
npm start
```

Ensure `DATABASE_URL` and migrations are applied on the target machine (`npx prisma migrate deploy`).

---

## 4. Configure and run the web client (`client/`)

### 4.1 Install dependencies

```bash
cd ../client
npm install
```

### 4.2 Environment (optional)

If the API is not at `http://localhost:4000/api/v1`, copy and edit:

```bash
cp .env.example .env
```

Set **`VITE_API_URL`** to your API base URL **including** `/api/v1`, e.g.  
`http://localhost:4000/api/v1`.

### 4.3 Start the client (development)

```bash
npm run dev
```

Default Vite URL: **http://localhost:5173**

### 4.4 Production build

```bash
npm run build
npm run preview
```

Serve the `client/dist` folder with any static host; point **`VITE_API_URL`** (build-time) at your deployed API and configure **`CORS_ORIGIN`** on the server accordingly.

---

## 5. Run everything locally (quick checklist)

1. Start **PostgreSQL**.
2. **`server/`**: `.env` with valid `DATABASE_URL` + `JWT_SECRET` → `npm install` → `npx prisma generate` → `npx prisma migrate deploy` → `npm run prisma:seed` → `npm run dev`.
3. **`client/`**: `npm install` → `npm run dev` (set `VITE_API_URL` if needed).
4. Open **http://localhost:5173** — sign in with a seeded account or submit a complaint **without** signing in (public submit/track routes).

---

## 6. Optional features

| Feature | Configuration |
|---------|----------------|
| **Redis** | Set `REDIS_URL` in `server/.env` (e.g. `redis://localhost:6379`). |
| **SMTP** | Set `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`, etc. If `MAIL_HOST` is empty, outbound mail is logged only. |
| **Complaint uploads** | Stored under `server/UPLOAD_DIR` (default `uploads`). Created automatically on startup. |
| **AI categorization** | In-process (no separate service). Toggle **`CATEGORIZATION_HF_ENABLED=false`** to skip downloading Transformers.js models and use local NLP only. |
| **Two-factor (TOTP)** | Optional RFC 6238 second step after password. Enable under **Dashboard → Settings → Security**. Uses **`JWT_2FA_EXPIRES_IN`** (default `5m`) and **`TOTP_ISSUER`** (default `SmartCare`) in `server/.env`. |

---

## 7. Troubleshooting

| Issue | What to try |
|-------|-------------|
| **`Invalid prisma...` / EPERM on Windows** during `prisma generate` | Stop the API dev process (`npm run dev`), then run `npx prisma generate` again. |
| **Database auth failed** | Verify `DATABASE_URL` user, password, host, port, and that the database exists. |
| **Empty department dropdown** | Run **`npm run prisma:seed`**. If Redis was caching an empty list, flush Redis or wait for TTL / restart without `REDIS_URL`. |
| **CORS errors from the browser** | Add your exact frontend origin to **`CORS_ORIGIN`** on the server (comma-separated). |
| **JWT errors** | Ensure **`JWT_SECRET`** is at least 32 characters. |

---

## 8. Project layout

```
hospital-compliant-management/
├── client/          # React + Vite frontend
├── server/          # Express API, Prisma, categorization, uploads
│   ├── prisma/      # schema, migrations, seed.ts
│   └── src/
├── README.md
└── NAVIGATION.md    # How to navigate the app by role (user-facing guide)
```

**Using the application:** see **[NAVIGATION.md](./NAVIGATION.md)** for routes, sidebar items, and patient / staff / admin flows.

---

## License

See repository owner for license terms.
