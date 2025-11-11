import { PrismaClient } from '@prisma/client';

// Add Prisma types for better error handling
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Add error handling for Prisma client initialization
let prismaInstance: PrismaClient;

// Enable logging only in development
const prismaOptions: any = {};

if (process.env.NODE_ENV === 'development') {
  prismaOptions.log = [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ];
}

try {
  prismaInstance = global.prisma || new PrismaClient(prismaOptions);

  // Only add event listeners in development
  if (process.env.NODE_ENV === 'development') {
    prismaInstance.$on('query', (e: any) => {
      console.log('Query:', e.query);
      console.log('Params:', e.params);
      console.log('Duration:', e.duration, 'ms');
    });
  }

  // Store in globalThis in development to prevent hot reloading issues
  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prismaInstance;
  }

  // Test the connection
  prismaInstance.$connect()
    .then(() => {
      console.log('✅ Successfully connected to the database');
    })
    .catch((error: unknown) => {
      console.error('❌ Failed to connect to the database:', error);
      process.exit(1);
    });
} catch (error: unknown) {
  console.error('❌ Failed to initialize Prisma Client:', error);
  process.exit(1);
}

export const prisma = prismaInstance!;
