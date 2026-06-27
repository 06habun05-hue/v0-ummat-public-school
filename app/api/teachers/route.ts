import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const specialization = searchParams.get('specialization') || 'All'
    const status = searchParams.get('status') || 'All'

    // Fetch teachers (users with role = 'TEACHER')
    const conditions = [eq(schema.users.role, 'TEACHER')]

    const dbTeachers = await db.query.users.findMany({
      where: and(...conditions),
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    })

    // Map database results to frontend structure
    let mapped = dbTeachers.map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      specialization: t.specialization || 'Unassigned',
      status: t.status as 'Active' | 'Inactive',
      // Mocking assigned classes dynamically or returning empty since it's a new database column integration
      classes: t.specialization ? ['10-A', '9-B'] : [],
    }))

    // Apply client filters if requested
    if (search) {
      mapped = mapped.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (specialization !== 'All') {
      mapped = mapped.filter((t) => t.specialization === specialization)
    }

    if (status !== 'All') {
      mapped = mapped.filter((t) => t.status === status)
    }

    return NextResponse.json(mapped)
  } catch (error: any) {
    console.error('Teachers GET API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, specialization, status, password, branch } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Insert new teacher into users table
    const [newTeacher] = await db
      .insert(schema.users)
      .values({
        name,
        email,
        role: 'TEACHER',
        branch: branch || 'Main Campus',
        status: status || 'Active',
        password: password || null,
        specialization: specialization || null,
      })
      .returning()

    return NextResponse.json({
      id: newTeacher.id,
      name: newTeacher.name,
      email: newTeacher.email,
      specialization: newTeacher.specialization || 'Unassigned',
      status: newTeacher.status,
      classes: [],
    })
  } catch (error: any) {
    console.error('Teachers POST API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 })
    }

    const [updated] = await db
      .update(schema.users)
      .set({ status })
      .where(eq(schema.users.id, id))
      .returning()

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Teachers PUT API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
