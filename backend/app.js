import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { entityRouter } from './routes/entityRoutes.js';
import { eventRouter } from './routes/eventRoutes.js';
import { tenantRouter } from './routes/tenantRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { tokenAuth } from './middleware/tokenAuth.js';
import { tenantMiddleware } from './middleware/tenantMiddleware.js';
import { prisma } from './lib/prisma.js';

export const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

// CORS configuration for Vercel frontend and local development
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    if (allowedOrigins.includes(origin) || 
        /\.vercel\.app$/.test(origin) || 
        origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Slug']
}));

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, service: 'nexus-api', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ 
      ok: false, 
      service: 'nexus-api', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Public tenant registration (no auth required)
app.post('/api/tenants/register', tenantRouter);

// Apply tenant middleware to all other API routes
app.use('/api', tenantMiddleware);
app.use('/api', tokenAuth);

// Tenant management routes
app.use('/api/tenants', tenantRouter);

// Admin routes (require admin role)
app.use('/api/admin', adminRouter);

// Existing routes
app.use('/api', eventRouter);
app.use('/api', entityRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    return res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);
