import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'

// Load .env.local so drizzle-kit picks up DATABASE_URL at CLI time
config({ path: '.env.local' })

export default {
  schema: './lib/db/schema/index.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
