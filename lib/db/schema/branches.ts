import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const branches = pgTable('branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  principalName: text('principal_name'),
  status: text('status').notNull().default('Active'), // 'Active' | 'Inactive'
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Branch = typeof branches.$inferSelect
export type NewBranch = typeof branches.$inferInsert
