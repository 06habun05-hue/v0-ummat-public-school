import { pgTable, uuid, text, timestamp, boolean, date, numeric } from 'drizzle-orm/pg-core'

export const academicYears = pgTable('academic_years', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull(), // e.g. '2025–2026'
  isActive: boolean('is_active').notNull().default(false),
  isLocked: boolean('is_locked').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const terms = pgTable('terms', {
  id: uuid('id').primaryKey().defaultRandom(),
  academicYearId: uuid('academic_year_id').notNull().references(() => academicYears.id),
  name: text('name').notNull(), // 'Term 1' | 'Term 2'
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
})

export const gradeScales = pgTable('grade_scales', {
  id: uuid('id').primaryKey().defaultRandom(),
  academicYearId: uuid('academic_year_id').notNull().references(() => academicYears.id),
  maxGpa: numeric('max_gpa', { precision: 3, scale: 1 }).notNull().default('4.0'),
  description: text('description').default('NCP Compliant'),
})

export type AcademicYear = typeof academicYears.$inferSelect
export type NewAcademicYear = typeof academicYears.$inferInsert
export type Term = typeof terms.$inferSelect
export type NewTerm = typeof terms.$inferInsert
export type GradeScale = typeof gradeScales.$inferSelect
export type NewGradeScale = typeof gradeScales.$inferInsert
