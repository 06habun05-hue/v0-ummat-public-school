import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

import { eq } from 'drizzle-orm'

async function seed() {
  console.log('🌱 Starting database seeding...')
  const { db } = await import('./index')
  const schema = await import('./schema')

  // 1. Seed Students
  const existingStudents = await db.select().from(schema.students)
  let studentIds: string[] = []
  if (existingStudents.length === 0) {
    console.log('Inserting students...')
    const studentList = [
      { name: 'Ahmed Hassan', branch: 'Main Campus', class: '10-A', status: 'Active' },
      { name: 'Fatima Khan', branch: 'Main Campus', class: '10-A', status: 'Active' },
      { name: 'Muhammad Ali', branch: 'Main Campus', class: '10-A', status: 'Active' },
      { name: 'Zainab Ahmed', branch: 'Main Campus', class: '10-A', status: 'Active' },
      { name: 'Hassan Ibrahim', branch: 'Main Campus', class: '10-A', status: 'Active' },
      { name: 'Ayesha Siddiqua', branch: 'North Campus', class: '10-B', status: 'Active' },
      { name: 'Bilal Farooq', branch: 'South Campus', class: '9-A', status: 'Active' },
    ]
    const inserted = await db.insert(schema.students).values(studentList).returning()
    studentIds = inserted.map(s => s.id)
    console.log(`Inserted ${inserted.length} students.`)
  } else {
    studentIds = existingStudents.map(s => s.id)
    console.log('Students already exist, skipping.')
  }

  // 2. Seed Users (Teachers / Admins)
  const existingUsers = await db.select().from(schema.users)
  let teacherId: string = ''
  if (existingUsers.length === 0) {
    console.log('Inserting users...')
    const userList = [
      { name: 'Sarah Ahmed', email: 'sarah.ahmed@ummat.edu', role: 'TEACHER', branch: 'Main Campus', status: 'Active' },
      { name: 'Yasir Khan', email: 'yasir.khan@ummat.edu', role: 'TEACHER', branch: 'North Campus', status: 'Active' },
      { name: 'Zafar Iqbal', email: 'zafar.iqbal@ummat.edu', role: 'SUPER_ADMIN', branch: 'Main Campus', status: 'Active' },
    ]
    const inserted = await db.insert(schema.users).values(userList).returning()
    teacherId = inserted[0].id
    console.log(`Inserted ${inserted.length} users.`)
  } else {
    teacherId = existingUsers[0].id
    console.log('Users already exist, skipping.')
  }

  // 3. Seed SLOs
  const existingSLOs = await db.select().from(schema.slos)
  if (existingSLOs.length === 0) {
    console.log('Inserting SLOs...')
    const sloList = [
      { id: 'SLO-001', description: 'Students can identify structural rhetorical devices in formal essays', class: '10-A', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-141' },
      { id: 'SLO-002', description: 'Students can analyze dynamic themes in classical English literature', class: '10-A', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-142' },
      { id: 'SLO-003', description: 'Students can analyze ecosystem food web dynamics and energy flow', class: '10-A', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-301' },
      { id: 'SLO-004', description: 'Students can compute velocity vectors on multi-dimensional planes', class: '10-A', subject: 'Mathematics', chapter: 'Chapter 2', ncp: 'NCP-MAT-211' },
      { id: 'SLO-005', description: 'Students can explain early Islamic trading network logistics', class: '10-A', subject: 'Islamic Studies', chapter: 'Chapter 1', ncp: 'NCP-ISL-301' },
      { id: 'SLO-006', description: 'Students understand geographical boundaries and historical partition context', class: '10-A', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-202' },
    ]
    const inserted = await db.insert(schema.slos).values(sloList).returning()
    console.log(`Inserted ${inserted.length} SLOs.`)
  } else {
    console.log('SLOs already exist, skipping.')
  }

  // 4. Seed Attendance
  const existingAttendance = await db.select().from(schema.attendance)
  if (existingAttendance.length === 0 && studentIds.length > 0) {
    console.log('Inserting attendance records...')
    const attendanceList = studentIds.slice(0, 5).flatMap(sId => [
      { studentId: sId, branch: 'Main Campus', class: '10-A', subject: 'English', date: new Date().toISOString().split('T')[0], status: 'present' },
      { studentId: sId, branch: 'Main Campus', class: '10-A', subject: 'English', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: Math.random() > 0.15 ? 'present' : 'absent' }
    ])
    await db.insert(schema.attendance).values(attendanceList)
    console.log(`Inserted attendance logs.`)
  }

  // 5. Seed Grades
  const existingGrades = await db.select().from(schema.grades)
  if (existingGrades.length === 0 && studentIds.length > 0) {
    console.log('Inserting assessment grades...')
    const gradesList = studentIds.slice(0, 5).flatMap(sId => [
      { studentId: sId, branch: 'Main Campus', class: '10-A', subject: 'English', chapter: 'Chapter 1', sloId: 'SLO-001', score: Math.floor(Math.random() * 4) + 1 },
      { studentId: sId, branch: 'Main Campus', class: '10-A', subject: 'English', chapter: 'Chapter 1', sloId: 'SLO-002', score: Math.floor(Math.random() * 4) + 1 },
    ])
    await db.insert(schema.grades).values(gradesList)
    console.log(`Inserted grades.`)
  }

  // 6. Seed Approvals
  const existingApprovals = await db.select().from(schema.approvals)
  if (existingApprovals.length === 0 && teacherId) {
    console.log('Inserting approvals queue...')
    const approvalsList = [
      { teacherId, teacherName: 'Sarah Ahmed', class: '10-A', subject: 'English', chapter: 'Chapter 1', slo: 'SLO-001', studentCount: 5, status: 'pending' },
      { teacherId, teacherName: 'Sarah Ahmed', class: '10-A', subject: 'English', chapter: 'Chapter 1', slo: 'SLO-002', studentCount: 5, status: 'approved' },
      { teacherId, teacherName: 'Yasir Khan', class: '10-B', subject: 'English', chapter: 'Chapter 2', slo: 'SLO-003', studentCount: 15, status: 'revision', comment: 'Please recheck Zainab\'s grades.' },
    ]
    await db.insert(schema.approvals).values(approvalsList)
    console.log('Inserted approvals.')
  }

  // 7. Seed Assessment Events (SLO Tracking)
  const existingEvents = await db.select().from(schema.assessmentEvents)
  if (existingEvents.length === 0) {
    console.log('Inserting assessment events...')
    const eventsList = [
      { sloId: 'SLO-001', class: '10-A', testDate: new Date().toISOString().split('T')[0], testMethod: 'Writing', teachingMethod: 'Lecture', status: 'Completed' },
      { sloId: 'SLO-002', class: '10-A', testDate: new Date().toISOString().split('T')[0], testMethod: 'Oral', teachingMethod: 'Group Activity', status: 'Pending' },
      { sloId: 'SLO-003', class: '10-A', testDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], testMethod: 'MCQs', teachingMethod: 'Direct Instruction', status: 'Re-test Scheduled' },
    ]
    await db.insert(schema.assessmentEvents).values(eventsList)
    console.log('Inserted assessment events.')
  }

  // 8. Seed Fees
  const existingFees = await db.select().from(schema.fees)
  if (existingFees.length === 0 && studentIds.length > 0) {
    console.log('Inserting fee records...')
    const studentsData = await db.select().from(schema.students)
    const feeList = studentsData.flatMap((student, index) => {
      // Create current term invoice
      const statuses = ['collected', 'pending', 'overdue']
      const status = statuses[index % 3]
      const currentInvoice = {
        studentId: student.id,
        branch: student.branch,
        amount: '12000.00',
        status,
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        paidDate: status === 'collected' ? new Date().toISOString().split('T')[0] : null
      }

      // Create historical invoices for past months to populate collection graphs
      const historicalInvoices = [
        {
          studentId: student.id,
          branch: student.branch,
          amount: '12000.00',
          status: 'collected',
          dueDate: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
          paidDate: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0]
        },
        {
          studentId: student.id,
          branch: student.branch,
          amount: '12000.00',
          status: 'collected',
          dueDate: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0],
          paidDate: new Date(Date.now() - 59 * 86400000).toISOString().split('T')[0]
        }
      ]

      return [currentInvoice, ...historicalInvoices]
    })
    await db.insert(schema.fees).values(feeList)
    console.log('Inserted fees.')
  }

  // 9. Seed Audit Logs
  const existingAuditLogs = await db.select().from(schema.auditLogs)
  if (existingAuditLogs.length === 0) {
    console.log('Inserting audit logs...')
    const auditLogsList = [
      { userName: 'Sarah Ahmed', action: 'Assessment Edit', entity: 'assessment', branch: 'Main Campus', createdAt: new Date(Date.now() - 3600000 * 2) },
      { userName: 'Sarah Ahmed', action: 'Assessment Approval', entity: 'approval', branch: 'Main Campus', createdAt: new Date(Date.now() - 3600000 * 3) },
      { userName: 'Zafar Iqbal', action: 'Fee Update', entity: 'fee', branch: 'Main Campus', createdAt: new Date(Date.now() - 3600000 * 5) },
      { userName: 'Yasir Khan', action: 'Student Update', entity: 'assessment', branch: 'North Campus', createdAt: new Date(Date.now() - 3600000 * 12) },
      { userName: 'Sarah Ahmed', action: 'Login', entity: 'approval', branch: 'Main Campus', createdAt: new Date(Date.now() - 3600000 * 24) },
      { userName: 'Zafar Iqbal', action: 'Settings Change', entity: 'approval', branch: 'Main Campus', createdAt: new Date(Date.now() - 3600000 * 48) },
    ]
    await db.insert(schema.auditLogs).values(auditLogsList)
    console.log('Inserted audit logs.')
  }

  console.log('🎉 Database seeding completed successfully!')
}

seed().catch(err => {
  console.error('❌ Error seeding database:', err)
  process.exit(1)
})
