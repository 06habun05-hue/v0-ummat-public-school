import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react/adapters';

export const neonAuthClient = BetterAuthReactAdapter()(
  process.env.NEXT_PUBLIC_NEON_AUTH_URL || ''
);
