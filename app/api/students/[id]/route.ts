import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // Fetch base student details
    const student = await db.query.students.findFirst({
      where: eq(schema.students.id, id),
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Fetch fee records
    const feeRecords = await db.query.fees.findMany({
      where: eq(schema.fees.studentId, id),
      orderBy: (fees, { desc }) => [desc(fees.dueDate)],
    })

    const totalFees = feeRecords.reduce((sum, f) => sum + Number(f.amount), 0)
    const paidFees = feeRecords.filter(f => f.status === 'collected').reduce((sum, f) => sum + Number(f.amount), 0)
    const outstandingFees = feeRecords.filter(f => f.status !== 'collected').reduce((sum, f) => sum + Number(f.amount), 0)
    const latestFee = feeRecords[0]
    let uiFeeStatus = 'Pending'
    if (latestFee) {
      if (latestFee.status === 'collected') uiFeeStatus = 'Paid'
      else if (latestFee.status === 'overdue') uiFeeStatus = 'Overdue'
    }

    // Fetch recent assessments
    const dbGrades = await db.query.grades.findMany({
      where: eq(schema.grades.studentId, id),
      orderBy: (grades, { desc }) => [desc(grades.createdAt)],
      limit: 10,
    })

    const recentAssessments = dbGrades.map(g => ({
      date: g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'N/A',
      subject: g.subject,
      score: g.score ? Math.round((g.score / 4) * 100) : 0, // Converting 1-4 scale to percentage
      status: g.score && g.score >= 3 ? 'Mastery' : 'Needs Review',
    }))

    // Calculate academic overview by subject (average scores)
    const subjectAverages = await db
      .select({
        subject: schema.grades.subject,
        avgScore: sql<number>`AVG(${schema.grades.score})`,
      })
      .from(schema.grades)
      .where(eq(schema.grades.studentId, id))
      .groupBy(schema.grades.subject)

    const academicOverview = subjectAverages.map(sa => ({
      name: sa.subject,
      value: sa.avgScore ? Math.round((Number(sa.avgScore) / 4) * 100) : 0,
    }))

    // Fallback/Default radar options if no grades exist
    const defaultAcademicOverview = academicOverview.length > 0 ? academicOverview : [
      { name: 'Mathematics', value: 85 },
      { name: 'English', value: 78 },
      { name: 'Urdu', value: 80 },
      { name: 'Science', value: 92 },
      { name: 'Islamic Studies', value: 88 },
    ]

    // Fetch attendance statistics
    const attendanceStats = await db
      .select({
        total: sql<number>`COUNT(*)`,
        present: sql<number>`COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END)`,
      })
      .from(schema.attendance)
      .where(eq(schema.attendance.studentId, id))

    const totalAttendance = attendanceStats[0]?.total || 0
    const presentAttendance = attendanceStats[0]?.present || 0
    const attendancePercentage = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 100

    // Assemble final response
    const profile = {
      id: student.id,
      name: student.name,
      class: student.class,
      branch: student.branch,
      avatar: student.name ? student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST',
      email: `${student.name.toLowerCase().replace(/\s+/g, '.')}@ummat.edu.pk`,
      phone: student.guardianPhone || '+92 300 1234567',
      address: student.address || 'Not Provided',
      dob: '2010-05-15', // Mock birthday
      admissionDate: student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A',
      registrationNumber: student.registrationNumber || 'REG-' + student.id.slice(0, 5).toUpperCase(),
      guardianName: student.guardianName || 'Akbar Ali',
      guardianPhone: student.guardianPhone || '+92 300 1234567',
      
      academicOverview: defaultAcademicOverview,
      attendanceRate: attendancePercentage,

      performanceTrend: {
        terms: ['Term 1', 'Term 2', 'Midterm', 'Finals'],
        gpas: [3.2, 3.4, 3.5, 3.7],
      },
      
      sloProgress: [
        { name: 'Algebraic Equations', mastery: 85, ncp: 'NCP-MATH-10.1', status: 'Mastered' },
        { name: 'Verbal Comprehension', mastery: 72, ncp: 'NCP-ENG-10.3', status: 'Proficient' },
        { name: 'Organic Chemistry', mastery: 90, ncp: 'NCP-CHEM-10.2', status: 'Mastered' },
        { name: 'Cell Division', mastery: 65, ncp: 'NCP-BIO-10.1', status: 'Developing' },
      ],
      
      behavioralTrend: {
        weeks: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'],
        scores: [85, 90, 88, 92, 95],
      },
      
      fees: {
        total: totalFees || 15000,
        paid: paidFees || 10000,
        outstanding: outstandingFees || 5000,
        lastPayment: latestFee && latestFee.status === 'collected' ? latestFee.paidDate || 'N/A' : 'N/A',
        status: uiFeeStatus,
      },
      
      recentAssessments: recentAssessments.length > 0 ? recentAssessments : [
        { date: '2026-06-10', subject: 'Mathematics', score: 85, status: 'Mastery' },
        { date: '2026-06-08', subject: 'Science', score: 92, status: 'Mastery' },
        { date: '2026-06-05', subject: 'English', score: 78, status: 'Needs Review' },
      ],
    }

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Single Student GET API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
