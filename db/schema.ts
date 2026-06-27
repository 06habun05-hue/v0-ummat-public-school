import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  integer,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core'


// ─── Students ────────────────────────────────────────────────────────────────
// Powers: Total Students KPI, Class Performance chart
export const students = pgTable('students', {
  id:        uuid('id').defaultRandom().primaryKey(),
  name:      text('name').notNull(),
  branch:    text('branch').notNull(),   // 'Main Campus' | 'North Campus' | 'South Campus'
  class:     text('class').notNull(),    // e.g. '10-A'
  status:    text('status').notNull().default('Active'), // 'Active' | 'Inactive'
  guardianName: text('guardian_name'),
  guardianPhone: text('guardian_phone'),
  registrationNumber: text('registration_number'),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Users ───────────────────────────────────────────────────────────────────
// Powers: Total Teachers KPI, Approvals queue, Activity feed
export const users = pgTable('users', {
  id:        uuid('id').defaultRandom().primaryKey(),
  name:      text('name').notNull(),
  email:     text('email').notNull().unique(),
  role:      text('role').notNull(), // 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'TEACHER' | 'ACCOUNTANT'
  branch:    text('branch').notNull(),
  status:    text('status').notNull().default('Active'), // 'Active' | 'Inactive'
  password:  text('password'),
  specialization: text('specialization'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Attendance ───────────────────────────────────────────────────────────────
// Powers: Attendance Rate KPI, Attendance Trend chart
export const attendance = pgTable('attendance', {
  id:        uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  branch:    text('branch').notNull(),
  class:     text('class').notNull(),
  subject:   text('subject').notNull(),
  date:      date('date').notNull(),
  status:    text('status').notNull(), // 'present' | 'absent' | 'late'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Approvals ────────────────────────────────────────────────────────────────
// Powers: Pending Approvals KPI, Approvals queue widget
export const approvals = pgTable('approvals', {
  id:           uuid('id').defaultRandom().primaryKey(),
  teacherId:    uuid('teacher_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  teacherName:  text('teacher_name').notNull(),
  class:        text('class').notNull(),
  subject:      text('subject').notNull(),
  chapter:      text('chapter').notNull(),
  slo:          text('slo').notNull(),
  dateSubmitted: timestamp('date_submitted').defaultNow().notNull(),
  studentCount: integer('student_count').notNull().default(0),
  status:       text('status').notNull().default('pending'), // 'pending' | 'approved' | 'revision'
  comment:      text('comment'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
})

// ─── Fees ─────────────────────────────────────────────────────────────────────
// Powers: Fee Collection KPI, Fee Collection donut chart
export const fees = pgTable('fees', {
  id:        uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  branch:    text('branch').notNull(),
  amount:    numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status:    text('status').notNull().default('pending'), // 'collected' | 'pending' | 'overdue'
  dueDate:   date('due_date').notNull(),
  paidDate:  date('paid_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Grades ───────────────────────────────────────────────────────────────────
// Powers: Class Performance bar chart
export const grades = pgTable('grades', {
  id:        uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  branch:    text('branch').notNull(),
  class:     text('class').notNull(),
  subject:   text('subject').notNull(),
  chapter:   text('chapter').notNull(),
  sloId:     text('slo_id').notNull(),
  score:     integer('score'), // 1–4 scale (NCP), nullable = not yet graded
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── Audit Logs ───────────────────────────────────────────────────────────────
// Powers: Recent Activity feed
export const auditLogs = pgTable('audit_logs', {
  id:        uuid('id').defaultRandom().primaryKey(),
  userId:    uuid('user_id'),
  userName:  text('user_name').notNull(),
  action:    text('action').notNull(),  // e.g. 'Submitted Assessment', 'Approved SLO', 'Fee Paid'
  entity:    text('entity').notNull(),  // 'assessment' | 'approval' | 'fee' | 'attendance'
  branch:    text('branch').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── SLOs ────────────────────────────────────────────────────────────────────
// Powers: Curriculum Intelligence, Curriculum Map
export const slos = pgTable('slos', {
  id:          text('id').primaryKey(), // e.g. 'SLO-101'
  description: text('description').notNull(),
  class:       text('class').notNull(),
  subject:     text('subject').notNull(),
  chapter:     text('chapter').notNull(),
  ncp:         text('ncp').notNull().default('NCP-GENERIC'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
})

// ─── Assessment Events ────────────────────────────────────────────────────────
// Powers: SLO Assessment Tracking logs
export const assessmentEvents = pgTable('assessment_events', {
  id:             uuid('id').defaultRandom().primaryKey(),
  sloId:          text('slo_id').notNull().references(() => slos.id, { onDelete: 'cascade' }),
  class:          text('class').notNull(),
  testDate:       date('test_date').notNull(),
  testMethod:     text('test_method').notNull(), // 'MCQs' | 'Writing' | 'Oral' | 'Practical' | 'Project'
  teachingMethod: text('teaching_method').notNull(), // 'Lecture' | 'Group Activity' | 'Direct Instruction' | 'Research'
  status:         text('status').notNull().default('Pending'), // 'Completed' | 'Pending' | 'Re-test Scheduled'
  createdAt:      timestamp('created_at').defaultNow().notNull(),
})

// ─── Classes ──────────────────────────────────────────────────────────────────
// Powers: Classes & Sections management
export const classes = pgTable('classes', {
  id:        text('id').primaryKey(), // using text since existing mock IDs are strings (e.g., cls-1)
  name:      text('name').notNull(),
  grade:     text('grade').notNull(),
  subjects:  jsonb('subjects').$type<string[]>().notNull().default([]),
  sections:  jsonb('sections').$type<any[]>().notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})


