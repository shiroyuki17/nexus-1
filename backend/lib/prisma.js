import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Handle connection errors
prisma.$connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
