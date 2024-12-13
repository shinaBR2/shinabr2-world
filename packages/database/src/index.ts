import { PrismaClient } from '@prisma/client';

// Define our global augmentation cleanly at the top
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Add logging in development to help with debugging

    log:
      // @ts-ignore
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

// Use the standard global property name for better consistency
const prisma = globalThis.prisma ?? prismaClientSingleton();

// @ts-ignore
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Also provide a named export for more flexible importing
export { prisma };
