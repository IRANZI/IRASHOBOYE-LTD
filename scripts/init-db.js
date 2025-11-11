const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const path = require('path');

async function main() {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Migrate the database
  console.log('Running database migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  
  console.log('Database initialized successfully!');
}

main()
  .catch((e) => {
    console.error('Error initializing database:', e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
