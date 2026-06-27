import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq, and, ilike, or, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const branch = searchParams.get('branch') || 'All'
    const className = searchParams.get('class') || 'All'
    const feeFilter = searchParams.get('feeFilter') || 'All'
    const sortKey = searchParams.get('sortKey') || 'name'
    const sortDir = searchParams.get('sortDir') || 'asc'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '8', 10)

    // Build conditions
    const conditions = []
    if (search) {
      conditions.push(
        or(
          ilike(schema.students.name, `%${search}%`),
          ilike(schema.students.id, `%${search}%`)
        )
      )
    }
    if (branch !== 'All') {
      conditions.push(eq(schema.students.branch, branch))
    }
    if (className !== 'All') {
      conditions.push(eq(schema.students.class, className))
    }

    // Subquery or aggregation queries using sql template tags for performance
    // Fetch students list
    const allStudents = await db
      .select({
        id: schema.students.id,
        name: schema.students.name,
        branch: schema.students.branch,
        class: schema.students.class,
        // Attendance aggregation: present rate
        attendanceRate: sql<number>`COALESCE(
          (
            COUNT(CASE WHEN ${schema.attendance.status} IN ('present', 'late') THEN 1 END) * 100.0 / 
            NULLIF(COUNT(${schema.attendance.id}), 0)
          ),
          100.0
        )::integer`,
        // Last assessment date
        lastAssessment: sql<string>`COALESCE(
          MAX(${schema.grades.createdAt})::text,
          ${schema.students.createdAt}::text
        )`,
        // Latest fee status
        feeStatus: sql<string>`COALESCE(
          (
            SELECT status FROM ${schema.fees} 
            WHERE ${schema.fees.studentId} = ${schema.students.id} 
            ORDER BY ${schema.fees.dueDate} DESC LIMIT 1
          ),
          'pending'
        )`
      })
      .from(schema.students)
      .leftJoin(schema.attendance, eq(schema.attendance.studentId, schema.students.id))
      .leftJoin(schema.grades, eq(schema.grades.studentId, schema.students.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(schema.students.id)

    // Map feeStatus values to UI expected terms: collected -> Paid, pending -> Pending, overdue -> Overdue
    let mapped = allStudents.map(s => {
      let uiFeeStatus = 'Pending'
      if (s.feeStatus === 'collected') uiFeeStatus = 'Paid'
      else if (s.feeStatus === 'overdue') uiFeeStatus = 'Overdue'

      return {
        id: s.id,
        name: s.name,
        class: s.class,
        branch: s.branch,
        attendance: s.attendanceRate,
        lastAssessment: s.lastAssessment,
        feeStatus: uiFeeStatus,
      }
    })

    // Filter by fee status if requested
    if (feeFilter !== 'All') {
      mapped = mapped.filter(s => s.feeStatus === feeFilter)
    }

    // Sorting logic
    mapped.sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'attendance') {
        return (a.attendance - b.attendance) * mult
      }
      if (sortKey === 'class') {
        return a.class.localeCompare(b.class) * mult
      }
      if (sortKey === 'feeStatus') {
        return a.feeStatus.localeCompare(b.feeStatus) * mult
      }
      return a.name.localeCompare(b.name) * mult
    })

    // Pagination
    const totalCount = mapped.length
    const totalPages = Math.ceil(totalCount / perPage)
    const paginated = mapped.slice((page - 1) * perPage, page * perPage)

    return NextResponse.json({
      students: paginated,
      totalCount,
      totalPages,
      page,
      perPage
    })
  } catch (error: any) {
    console.error('Students API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, branch, class: className, status, guardianName, guardianPhone, registrationNumber, address } = body

    if (!name || !branch || !className) {
      return NextResponse.json({ error: 'Name, branch, and class are required' }, { status: 400 })
    }

    const [newStudent] = await db
      .insert(schema.students)
      .values({
        name,
        branch,
        class: className,
        status: status || 'Active',
        guardianName: guardianName || null,
        guardianPhone: guardianPhone || null,
        registrationNumber: registrationNumber || null,
        address: address || null,
      })
      .returning()

    return NextResponse.json(newStudent)
  } catch (error: any) {
    console.error('Students POST API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, branch, class: className, status } = body

    if (!id || !name || !branch || !className) {
      return NextResponse.json({ error: 'ID, name, branch, and class are required' }, { status: 400 })
    }

    const [updatedStudent] = await db
      .update(schema.students)
      .set({
        name,
        branch,
        class: className,
        status: status || 'Active',
      })
      .where(eq(schema.students.id, id))
      .returning()

    if (!updatedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(updatedStudent)
  } catch (error: any) {
    console.error('Students PUT API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const [deletedStudent] = await db
      .delete(schema.students)
      .where(eq(schema.students.id, id))
      .returning()

    if (!deletedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(deletedStudent)
  } catch (error: any) {
    console.error('Students DELETE API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

