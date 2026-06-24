import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branch = searchParams.get('branch')
    const className = searchParams.get('class')
    const subject = searchParams.get('subject')
    const date = searchParams.get('date')

    if (!branch || !className || !subject || !date) {
      return NextResponse.json({ error: 'Missing parameters branch, class, subject, or date' }, { status: 400 })
    }

    // 1. Fetch students in this class
    const studentsList = await db
      .select({ id: schema.students.id, name: schema.students.name })
      .from(schema.students)
      .where(and(eq(schema.students.branch, branch), eq(schema.students.class, className)))

    // 2. Fetch attendance records for this date
    const attendanceRecords = await db
      .select({ studentId: schema.attendance.studentId, status: schema.attendance.status })
      .from(schema.attendance)
      .where(
        and(
          eq(schema.attendance.branch, branch),
          eq(schema.attendance.class, className),
          eq(schema.attendance.subject, subject),
          eq(schema.attendance.date, date)
        )
      )

    const attendanceMap: Record<string, string> = {}
    attendanceRecords.forEach(r => {
      attendanceMap[r.studentId] = r.status
    })

    // 3. Merge students with attendance status
    const result = studentsList.map(s => ({
      id: s.id,
      name: s.name,
      status: attendanceMap[s.id] ?? 'present' // default to 'present' if not logged yet
    }))

    return NextResponse.json({ students: result })
  } catch (error: any) {
    console.error('Attendance GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { branch, class: className, subject, date, attendanceList } = body

    if (!branch || !className || !subject || !date || !Array.isArray(attendanceList)) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // 1. Delete existing attendance records for the class/subject/date
    await db.delete(schema.attendance).where(
      and(
        eq(schema.attendance.branch, branch),
        eq(schema.attendance.class, className),
        eq(schema.attendance.subject, subject),
        eq(schema.attendance.date, date)
      )
    )

    // 2. Insert new records
    if (attendanceList.length > 0) {
      const insertValues = attendanceList.map((item: any) => ({
        studentId: item.studentId,
        branch,
        class: className,
        subject,
        date,
        status: item.status // 'present' | 'absent' | 'late'
      }))
      await db.insert(schema.attendance).values(insertValues)
    }

    // Create an audit log record
    await db.insert(schema.auditLogs).values({
      userName: 'Branch Teacher',
      action: `Recorded attendance for ${className} ${subject}`,
      entity: 'attendance',
      branch,
    })

    return NextResponse.json({ success: true, count: attendanceList.length })
  } catch (error: any) {
    console.error('Attendance POST Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
