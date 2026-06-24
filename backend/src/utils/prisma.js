import { PrismaClient } from '@prisma/client';

// Singleton — reuse the same connection pool across all controllers
const prisma = new PrismaClient({
  log: ['error'],
});

export default prisma;
