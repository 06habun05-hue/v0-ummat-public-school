import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { branches } from './branches'

export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  userName: text('user_name').notNull(), // denormalized for read speed
  action: text('action').notNull(),      // e.g. 'Created user'
  detail: text('detail'),                // e.g. 'Ms. Sana · Teacher · Main Campus'
  entityType: text('entity_type'),       // 'user' | 'branch' | 'setting' | 'academic'
  entityId: uuid('entity_id'),
  branchId: uuid('branch_id').references(() => branches.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type ActivityLog = typeof activityLog.$inferSelect
export type NewActivityLog = typeof activityLog.$inferInsert
