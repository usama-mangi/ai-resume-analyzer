import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    // process.env used directly so prisma generate works even without DATABASE_URL set
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/resume_analyzer',
  },
});
