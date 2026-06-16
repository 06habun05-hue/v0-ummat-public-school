/**
 * Seed script — populates all Neon tables with realistic data.
 * Run once: npx tsx scripts/seed.ts
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'
import { subDays, subWeeks, format, addWeeks } from 'date-fns'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

async function main() {
  console.log('🌱 Seeding Neon database...')

  // ── Branches ────────────────────────────────────────────────────────────────
  console.log('  → Branches')
  const [mainCampus, northCampus, southCampus] = await db
    .insert(schema.branches)
    .values([
      { name: 'Main Campus',  location: 'Islamabad',  principalName: 'Principal Arif',  status: 'Active' },
      { name: 'North Campus', location: 'Rawalpindi', principalName: 'Principal Nadia', status: 'Active' },
      { name: 'South Campus', location: 'Lahore',     principalName: 'Principal Imran', status: 'Active' },
    ])
    .returning()

  // ── Users ────────────────────────────────────────────────────────────────────
  console.log('  → Users')
  const [superAdmin, branchAdminMain, branchAdminNorth, sana, tariq, ayesha, hassan, sara] =
    await db
      .insert(schema.users)
      .values([
        { fullName: 'John Doe',        email: 'john.doe@ummat.edu',    role: 'SUPER_ADMIN',  branchId: null,            status: 'Active' },
        { fullName: 'Admin Khalid',    email: 'khalid@ummat.edu',      role: 'BRANCH_ADMIN', branchId: mainCampus.id,   status: 'Active' },
        { fullName: 'Admin Nadia',     email: 'nadia@ummat.edu',       role: 'BRANCH_ADMIN', branchId: northCampus.id,  status: 'Active' },
        { fullName: 'Ms. Sana Malik',  email: 'sana@ummat.edu',        role: 'TEACHER',      branchId: mainCampus.id,   status: 'Active' },
        { fullName: 'Mr. Tariq Ahmed', email: 'tariq@ummat.edu',       role: 'TEACHER',      branchId: northCampus.id,  status: 'Active' },
        { fullName: 'Ms. Ayesha Noor', email: 'ayesha@ummat.edu',      role: 'TEACHER',      branchId: southCampus.id,  status: 'Active' },
        { fullName: 'Mr. Hassan Raza', email: 'hassan@ummat.edu',      role: 'TEACHER',      branchId: mainCampus.id,   status: 'Active' },
        { fullName: 'Accountant Sara', email: 'sara@ummat.edu',        role: 'ACCOUNTANT',   branchId: mainCampus.id,   status: 'Active' },
      ])
      .returning()

  // ── Academic Year ───────────────────────────────────────────────────────────
  console.log('  → Academic Year & Terms')
  const [activeYear] = await db
    .insert(schema.academicYears)
    .values({ label: '2025–2026', isActive: true, isLocked: false })
    .returning()

  const [term1, term2] = await db
    .insert(schema.terms)
    .values([
      { academicYearId: activeYear.id, name: 'Term 1', startDate: '2025-04-01', endDate: '2025-08-31' },
      { academicYearId: activeYear.id, name: 'Term 2', startDate: '2025-09-01', endDate: '2026-01-15' },
    ])
    .returning()

  await db.insert(schema.gradeScales).values({
    academicYearId: activeYear.id,
    maxGpa: '4.0',
    description: 'NCP Compliant',
  })

  // ── System Settings ─────────────────────────────────────────────────────────
  console.log('  → System Settings')
  await db.insert(schema.systemSettings).values([
    { key: 'two_fa_required',      value: 'false',   updatedBy: superAdmin.id },
    { key: 'audit_retention_days', value: '365',     updatedBy: superAdmin.id },
    { key: 'dark_mode_default',    value: 'false',   updatedBy: superAdmin.id },
    { key: 'last_backup_at',       value: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), updatedBy: superAdmin.id },
  ])

  // ── Students ────────────────────────────────────────────────────────────────
  console.log('  → Students')
  const branchStudentCounts = [
    { branch: mainCampus,  count: 120 },
    { branch: northCampus, count: 75  },
    { branch: southCampus, count: 50  },
  ]

  const studentInserts: schema.NewStudent[] = []
  for (const { branch, count } of branchStudentCounts) {
    for (let i = 1; i <= count; i++) {
      studentInserts.push({
        branchId: branch.id,
        name: `Student ${branch.name.split(' ')[0]} ${i}`,
        status: 'Active',
        enrolledAt: format(subDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd'),
      })
    }
  }
  const allStudents = await db.insert(schema.students).values(studentInserts).returning()

  // ── Fee Records ─────────────────────────────────────────────────────────────
  console.log('  → Fee Records')
  const feeInserts: schema.NewFeeRecord[] = []
  const statuses: Array<'paid' | 'pending' | 'overdue'> = ['paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'pending', 'pending', 'overdue']
  for (const student of allStudents) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    feeInserts.push({
      studentId: student.id,
      branchId: student.branchId,
      amount: '12000',
      status,
      dueDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      paidAt: status === 'paid' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
    })
  }
  await db.insert(schema.feeRecords).values(feeInserts)

  // ── Attendance Records ──────────────────────────────────────────────────────
  console.log('  → Attendance Records')
  const classes = ['10-A', '10-B', '9-A', '9-B', '8-A']
  const branchList = [mainCampus, northCampus, southCampus]
  const attendanceInserts: schema.NewAttendanceRecord[] = []

  for (const branch of branchList) {
    for (let w = 6; w >= 0; w--) {
      const weekDate = subWeeks(new Date(), w)
      for (const cls of classes) {
        const total = 28 + Math.floor(Math.random() * 5)
        const present = Math.floor(total * (0.88 + Math.random() * 0.10))
        attendanceInserts.push({
          branchId: branch.id,
          className: cls,
          date: format(weekDate, 'yyyy-MM-dd'),
          presentCount: present,
          totalCount: total,
        })
      }
    }
  }
  await db.insert(schema.attendanceRecords).values(attendanceInserts)

  // ── Assessments ─────────────────────────────────────────────────────────────
  console.log('  → Assessments')
  const subjects = ['English', 'Mathematics', 'Science', 'Islamic Studies', 'Urdu']
  const teachers = [sana, tariq, ayesha, hassan]
  const assessmentStatuses: Array<'pending' | 'approved' | 'revision'> = ['pending', 'pending', 'pending', 'pending', 'approved', 'approved', 'revision']
  const assessmentInserts: schema.NewAssessment[] = []

  for (const branch of branchList) {
    for (const cls of classes) {
      for (const subject of subjects) {
        const teacher = teachers[Math.floor(Math.random() * teachers.length)]
        const status = assessmentStatuses[Math.floor(Math.random() * assessmentStatuses.length)]
        assessmentInserts.push({
          branchId: branch.id,
          termId: term1.id,
          className: cls,
          subject,
          avgScore: String((65 + Math.random() * 30).toFixed(1)),
          status,
          teacherName: teacher.fullName,
          recordedAt: format(subDays(new Date(), Math.floor(Math.random() * 14)), 'yyyy-MM-dd'),
        })
      }
    }
  }
  await db.insert(schema.assessments).values(assessmentInserts)

  // ── Activity Log ────────────────────────────────────────────────────────────
  console.log('  → Activity Log')
  await db.insert(schema.activityLog).values([
    { userName: 'Ms. Sana Malik',  action: 'Submitted assessment',   detail: 'Class 10-A · English · Chapter 2',      entityType: 'assessment', branchId: mainCampus.id,  userId: sana.id },
    { userName: 'Principal Arif',  action: 'Approved assessment',    detail: 'Class 9-B · Math · Chapter 1',           entityType: 'assessment', branchId: mainCampus.id  },
    { userName: 'Admin Khalid',    action: 'Marked fee as paid',     detail: 'Student #3 · PKR 12,000',                entityType: 'fee',        branchId: mainCampus.id,  userId: branchAdminMain.id },
    { userName: 'Mr. Tariq Ahmed', action: 'Submitted assessment',   detail: 'Class 9-B · Mathematics · Chapter 1',   entityType: 'assessment', branchId: northCampus.id, userId: tariq.id },
    { userName: 'Ms. Ayesha Noor', action: 'Submitted assessment',   detail: 'Class 8-A · Science · Chapter 3',       entityType: 'assessment', branchId: southCampus.id, userId: ayesha.id },
    { userName: 'Admin Nadia',     action: 'Updated branch details', detail: 'North Campus · Rawalpindi',              entityType: 'branch',     branchId: northCampus.id, userId: branchAdminNorth.id },
    { userName: 'John Doe',        action: 'Created user',           detail: 'Accountant Sara · ACCOUNTANT',          entityType: 'user',       userId: superAdmin.id },
    { userName: 'John Doe',        action: 'Published academic calendar', detail: '2025–2026',                        entityType: 'academic',   userId: superAdmin.id },
    { userName: 'Mr. Hassan Raza', action: 'Submitted assessment',   detail: 'Class 10-B · Islamic Studies · Ch. 1', entityType: 'assessment', branchId: mainCampus.id,  userId: hassan.id },
    { userName: 'Accountant Sara', action: 'Marked fee as paid',     detail: 'Student #7 · PKR 12,000',               entityType: 'fee',        branchId: mainCampus.id,  userId: sara.id },
  ])

  console.log('✅ Seed complete!')
  console.log(`   Branches: 3 | Users: 8 | Students: ${allStudents.length} | Fee records: ${feeInserts.length}`)
  console.log(`   Attendance records: ${attendanceInserts.length} | Assessments: ${assessmentInserts.length}`)
  process.exit(0)
}

main().catch((e) => {
  console.error('❌ Seed failed:', e)
  process.exit(1)
})
