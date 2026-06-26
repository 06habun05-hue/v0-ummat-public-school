/**
 * Applies the classes table migration directly via the Neon serverless driver.
 * Safe to run multiple times (uses IF NOT EXISTS).
 */
import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Manually load .env.local
const envPath = join(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const [key, ...rest] = trimmed.split('=')
  process.env[key.trim()] = rest.join('=').trim()
}

const sql = neon(process.env.DATABASE_URL)

async function main() {
  console.log('🔧 Applying classes table migration...')

  await sql`
    CREATE TABLE IF NOT EXISTS "classes" (
      "id" text PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "grade" text NOT NULL,
      "subjects" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `
  console.log('✅ classes table is ready.')
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
