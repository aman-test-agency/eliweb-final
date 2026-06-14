# EliWeb.in

Monorepo for the EliWeb.in marketing site and admin panel.

- **Frontend** (`/frontend`) — Next.js 14 public site + admin UI (Vercel)
- **Backend** (`/backend`) — Next.js API server with Express entrypoint (Render)

## Project structure

```
/backend         → REST API only (no admin UI)
/frontend
  /src
    /app
      /admin     → admin pages (login, dashboard, CMS sections)
      /(public)  → public-facing pages
    /components
      /admin
      /public
    /lib
```

## Local development

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon or local)

### 1. Backend (port 5000)

```bash
cd backend
cp .env.example .env
npm install
```

Set in `backend/.env`:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

```bash
npm run db:push
npm run db:seed
npm run dev
```

API runs at `http://localhost:5000`.

### 2. Frontend (port 3000)

```bash
cd frontend
cp .env.example .env.local
npm install
```

Set in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`
- Admin dashboard: `http://localhost:3000/admin/dashboard`

### Default admin credentials (after seed)


## Environment variables

| Location | Variable | Description |
|----------|----------|-------------|
| `backend/.env` | `PORT` | API port (default `5000`) |
| `backend/.env` | `DATABASE_URL` | PostgreSQL connection string (Prisma) |
| `backend/.env` | `JWT_SECRET` | Secret for admin JWT tokens |
| `backend/.env` | `CLIENT_URL` | Frontend origin for CORS |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | Backend API base URL (local) |
| `frontend/.env.production` | `NEXT_PUBLIC_API_URL` | Backend API base URL (production) |

All `.env` files are gitignored. Use `.env.example` files as templates.

## Deploy backend to Render

1. Create a new **Web Service** on [Render](https://render.com) from this repo.
2. Set **Root Directory** to `backend`.
3. Render reads `backend/render.yaml` or configure manually:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `node server.js`
4. Add environment variables in the Render dashboard:
   - `PORT` = `5000`
   - `DATABASE_URL` = your PostgreSQL URI
   - `JWT_SECRET` = a strong random secret
   - `CLIENT_URL` = `https://www.eliweb.com`
5. Deploy and note your service URL (e.g. `https://eliweb-backend.onrender.com`).

## Deploy frontend to Vercel

1. Import the repo on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
4. Deploy and point your domain `www.eliweb.com` to the Vercel project.

Next.js App Router handles all routes (`/`, `/admin/login`, etc.) natively on Vercel — no client-side rewrite rules are required.

## Production URLs

| App | URL |
|-----|-----|
| Public site | https://www.eliweb.com |
| Admin login | https://www.eliweb.com/admin/login |
| Admin dashboard | https://www.eliweb.com/admin/dashboard |
| API | `https://your-render-backend.onrender.com` |

## Auth flow

- Admin login calls `POST {API}/api/auth/login` and stores the JWT in `sessionStorage` plus a frontend cookie.
- Protected `/admin/*` routes redirect to `/admin/login` when no token is present.
- API requests send `Authorization: Bearer <token>` to the backend.
