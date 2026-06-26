import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const list = await db
      .select()
      .from(schema.classes)
      .orderBy(schema.classes.name)

    return NextResponse.json(list)
  } catch (error: any) {
    console.error('Classes GET API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, name, grade, subjects, sections } = body

    if (!name || !grade) {
      return NextResponse.json({ error: 'Name and grade are required' }, { status: 400 })
    }

    const newClassId = id || `cls-${Date.now()}`

    const [newClass] = await db
      .insert(schema.classes)
      .values({
        id: newClassId,
        name,
        grade,
        subjects: subjects || [],
        sections: sections || [],
      })
      .returning()

    return NextResponse.json(newClass)
  } catch (error: any) {
    console.error('Classes POST API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, grade, subjects, sections } = body

    if (!id || !name || !grade) {
      return NextResponse.json({ error: 'ID, name, and grade are required' }, { status: 400 })
    }

    const [updatedClass] = await db
      .update(schema.classes)
      .set({
        name,
        grade,
        subjects: subjects || [],
        sections: sections || [],
      })
      .where(eq(schema.classes.id, id))
      .returning()

    if (!updatedClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    return NextResponse.json(updatedClass)
  } catch (error: any) {
    console.error('Classes PUT API Error:', error)
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

    const [deletedClass] = await db
      .delete(schema.classes)
      .where(eq(schema.classes.id, id))
      .returning()

    if (!deletedClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    return NextResponse.json(deletedClass)
  } catch (error: any) {
    console.error('Classes DELETE API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
