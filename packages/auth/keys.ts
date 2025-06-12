import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      AUTH0_SECRET: z.string(),
      AUTH0_BASE_URL: z.string().url(),
      AUTH0_ISSUER_BASE_URL: z.string().url(),
      AUTH0_CLIENT_ID: z.string(),
      AUTH0_CLIENT_SECRET: z.string(),
    },
    client: {},
    runtimeEnv: {
      AUTH0_SECRET: process.env.AUTH0_SECRET,
      AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
      AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    },
  });
