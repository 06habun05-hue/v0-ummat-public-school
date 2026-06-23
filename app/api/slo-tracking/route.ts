import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const className = searchParams.get('class') || 'All'

    const conditions = []
    if (className !== 'All') {
      conditions.push(eq(schema.assessmentEvents.class, className))
    }

    const eventsList = await db
      .select({
        id: schema.assessmentEvents.id,
        sloId: schema.assessmentEvents.sloId,
        description: schema.slos.description,
        class: schema.assessmentEvents.class,
        testDate: schema.assessmentEvents.testDate,
        testMethod: schema.assessmentEvents.testMethod,
        teachingMethod: schema.assessmentEvents.teachingMethod,
        status: schema.assessmentEvents.status,
      })
      .from(schema.assessmentEvents)
      .leftJoin(schema.slos, eq(schema.slos.id, schema.assessmentEvents.sloId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(schema.assessmentEvents.testDate))

    return NextResponse.json({ events: eventsList })
  } catch (error: any) {
    console.error('SLO Tracking GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sloId, class: className, testDate, testMethod, teachingMethod, status } = body

    if (!sloId || !className || !testDate || !testMethod || !teachingMethod || !status) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Insert tracking event
    const newEvent = await db
      .insert(schema.assessmentEvents)
      .values({
        sloId,
        class: className,
        testDate,
        testMethod,
        teachingMethod,
        status,
      })
      .returning()

    // Create an audit log record
    await db.insert(schema.auditLogs).values({
      userName: 'Academic Coordinator',
      action: `Logged assessment event for ${sloId}`,
      entity: 'assessment',
      branch: 'Main Campus',
    })

    return NextResponse.json({ success: true, event: newEvent[0] })
  } catch (error: any) {
    console.error('SLO Tracking POST Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
