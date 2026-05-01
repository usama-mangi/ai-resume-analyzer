import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const serverUrl = process.env.BETTER_AUTH_SERVER_URL || 'http://localhost:3000/api/auth';
const clientOrigin = process.env.BETTER_AUTH_CLIENT_URL || 'http://localhost:5173';
const trustedOrigins = [clientOrigin, serverUrl.replace(/\/api\/auth$/, '')];

export const auth = betterAuth({
  baseURL: serverUrl,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins,
  crossSubDomainCookies: {
    enabled: !clientOrigin.includes('localhost'),
  },
});