# Nexus Gaming Center

Gaming center management app for PC sessions, reservations, food orders, tournaments, users, payments, and reports.

## Local Run

```bash
npm install
npm run build
npm start
```

Open:

```txt
http://localhost:3000
```

Demo users:

```txt
admin / admin123
player / player123
```

## Environment

Create `.env` from `.env.example`.

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
API_TOKEN="your-secret-api-token"
PORT=3000
VITE_API_URL="/api"
VITE_API_TOKEN="your-secret-api-token"
```

`API_TOKEN` protects backend `/api/*` routes. `/api/health` stays public for uptime checks.

## Render Deployment

Use the included `render.yaml`, or create a Web Service manually:

```txt
Build Command: npm run render-build
Start Command: npm run start:render
```

Set these Render environment variables:

```txt
NODE_ENV=production
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE
API_TOKEN=your-secret-api-token
VITE_API_URL=/api
VITE_API_TOKEN=your-secret-api-token
```

`start:render` runs `prisma db push` before starting the server, so MySQL tables are created from `prisma/schema.prisma`.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
