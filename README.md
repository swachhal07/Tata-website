# Tata Hitachi · Dugar Earthmovers

The site is split into two independent projects so they can be hosted separately:

```
.
├── frontend/   ← React + Vite + Vercel serverless function for mail
└── backend/    ← Express server for the admin console (login, add/edit/delete products, uploads)
```

## Quick start (local dev)

In two terminals:

```powershell
# Terminal 1 — Express backend (admin endpoints, port 3001)
cd backend
npm install
npm run dev

# Terminal 2 — Vite frontend (UI + contact mail, port 5173)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Admin lives at `/login` then `/admin`. The contact form sends real mail in dev because Vite's middleware runs the same `api/send-mail.js` that Vercel deploys in production.

## Environment variables

Each folder has its own `.env.local`. Templates live in `.env.example` of each.

**`frontend/.env.local`** — Gmail SMTP for the mail function:

```
SMTP_USER=sales.tatahitachinp@gmail.com
SMTP_PASS=16-char-gmail-app-password
MAIL_TO=sales.tatahitachinp@gmail.com
MAIL_FROM_NAME=Tata Hitachi · Dugar Earthmovers
```

**`backend/.env.local`** — admin console credentials:

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=set-a-real-password
ADMIN_SESSION_SECRET=long-random-hex
```

Generate a session secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment

- **Frontend** → Vercel. In the Vercel project's **Settings → General**, set **Root Directory** to `frontend`. Add the four SMTP env vars under **Settings → Environment Variables**.
- **Backend** → any Node host (Railway, Render, Fly.io). Run from `backend/` with `npm start`. Set the three admin env vars on that platform. Point the frontend's `VITE_API_TARGET` env var at the backend URL if it's not on the same host.

## Folder reference

```
frontend/
  src/              React app (pages, components, data, assets)
  api/              Vercel serverless functions (api/send-mail.js)
  public/           Static assets
  index.html        Vite entry
  vite.config.js    Dev server + proxy + mail-handler middleware
  vercel.json       SPA rewrites
  package.json
  .env.example

backend/
  index.js          Express app (auth + products + uploads)
  data/             products.json (gitignored)
  uploads/          uploaded images + PDFs (gitignored)
  package.json
  .env.example
```
