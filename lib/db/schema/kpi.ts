import { pgTable, uuid, text, timestamp, integer, numeric, date } from 'drizzle-orm/pg-core'
import { branches } from './branches'
import { terms } from './academic'

// Lightweight student records — for KPI counts and fee linkage
export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').notNull().references(() => branches.id),
  name: text('name').notNull(),
  status: text('status').notNull().default('Active'), // 'Active' | 'Inactive'
  enrolledAt: date('enrolled_at').notNull(),
})

// Fee records — for the fee collection donut chart and KPI
export const feeRecords = pgTable('fee_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id),
  branchId: uuid('branch_id').notNull().references(() => branches.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'), // 'paid' | 'pending' | 'overdue'
  dueDate: date('due_date').notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
})

// Weekly attendance records — for the attendance trend line chart
export const attendanceRecords = pgTable('attendance_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').notNull().references(() => branches.id),
  className: text('class_name').notNull(),
  date: date('date').notNull(),
  presentCount: integer('present_count').notNull(),
  totalCount: integer('total_count').notNull(),
})

// Class-level assessment scores — for the class performance bar chart
export const assessments = pgTable('assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').notNull().references(() => branches.id),
  termId: uuid('term_id').references(() => terms.id),
  className: text('class_name').notNull(),
  subject: text('subject').notNull(),
  avgScore: numeric('avg_score', { precision: 5, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'approved' | 'revision'
  teacherName: text('teacher_name'),
  recordedAt: date('recorded_at').notNull(),
})

export type Student = typeof students.$inferSelect
export type NewStudent = typeof students.$inferInsert
export type FeeRecord = typeof feeRecords.$inferSelect
export type NewFeeRecord = typeof feeRecords.$inferInsert
export type AttendanceRecord = typeof attendanceRecords.$inferSelect
export type NewAttendanceRecord = typeof attendanceRecords.$inferInsert
export type Assessment = typeof assessments.$inferSelect
export type NewAssessment = typeof assessments.$inferInsert
