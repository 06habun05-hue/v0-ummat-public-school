import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL
const sql = neon(databaseUrl || 'postgres://placeholder_url_for_build_only')

export const db = drizzle(sql, { schema })

