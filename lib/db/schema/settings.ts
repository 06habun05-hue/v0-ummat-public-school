import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const systemSettings = pgTable('system_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  // keys: 'two_fa_required' | 'audit_retention_days' | 'dark_mode_default' | 'last_backup_at'
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid('updated_by').references(() => users.id),
})

export type SystemSetting = typeof systemSettings.$inferSelect
export type NewSystemSetting = typeof systemSettings.$inferInsert
