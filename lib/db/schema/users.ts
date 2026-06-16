import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { branches } from './branches'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('TEACHER'),
  // 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'PRINCIPAL' | 'TEACHER' | 'ACCOUNTANT' | 'COORDINATOR'
  branchId: uuid('branch_id').references(() => branches.id),
  status: text('status').notNull().default('Active'), // 'Active' | 'Inactive'
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
