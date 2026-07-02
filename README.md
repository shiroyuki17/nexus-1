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
RABBITMQ_URL="amqp://localhost:5672"
RABBITMQ_EXCHANGE="nexus.events"
RABBITMQ_AUDIT_QUEUE="nexus.audit.events"
RABBITMQ_ENABLED="true"
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
RABBITMQ_URL=amqp://USER:PASSWORD@HOST:5672
RABBITMQ_EXCHANGE=nexus.events
RABBITMQ_AUDIT_QUEUE=nexus.audit.events
RABBITMQ_ENABLED=true
```

`start:render` runs `prisma db push` before starting the server, so MySQL tables are created from `prisma/schema.prisma`.

RabbitMQ events are published to the `nexus.events` topic exchange. Entity create/update/delete API calls emit events such as `GamesCreated`, `ProductsUpdated`, and `ReservationsDeleted`. The built-in audit consumer stores processed events in the `EventLog` table.

## Docker

Build and run the app only:

```bash
docker build --build-arg VITE_API_URL=/api --build-arg VITE_API_TOKEN=local-dev-token -t nexus-gaming-center .
docker run --env-file .env -p 3000:3000 nexus-gaming-center
```

Run app + local MySQL:

```bash
docker compose up --build
```

Open:

```txt
http://localhost:3000
```

The compose file creates a local MySQL database named `nexus_1` and runs `prisma db push` before the server starts.
RabbitMQ management UI is available at:

```txt
http://localhost:15672
guest / guest
```

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
