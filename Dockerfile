FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .


ENV DATABASE_URL="postgresql://postgres.prlqfisnbpmzvapodpwu:Irashoboyeme@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]