import { createAuthClient } from '@neondatabase/neon-js/auth';

export const neonAuthClient = createAuthClient(
  process.env.NEXT_PUBLIC_NEON_AUTH_URL || ''
);
