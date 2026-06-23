import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const list = await db
      .select({
        id: schema.approvals.id,
        teacher: schema.approvals.teacherName,
        class: schema.approvals.class,
        subject: schema.approvals.subject,
        chapter: schema.approvals.chapter,
        slo: schema.approvals.slo,
        dateSubmitted: schema.approvals.dateSubmitted,
        studentCount: schema.approvals.studentCount,
        status: schema.approvals.status,
        comment: schema.approvals.comment,
      })
      .from(schema.approvals)

    // Grouping by status
    const pending = list.filter(item => item.status === 'pending')
    const approved = list.filter(item => item.status === 'approved')
    const revision = list.filter(item => item.status === 'revision')

    return NextResponse.json({
      pending,
      approved,
      revision,
      counts: {
        pending: pending.length,
        approved: approved.length,
        revision: revision.length,
      }
    })
  } catch (error: any) {
    console.error('Approvals GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, action, comment } = body

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing required parameters id or action' }, { status: 400 })
    }

    if (action === 'approve') {
      await db
        .update(schema.approvals)
        .set({ status: 'approved', comment: null })
        .where(eq(schema.approvals.id, id))

      // Log audit
      await db.insert(schema.auditLogs).values({
        userName: 'Campus Vice Principal',
        action: `Approved assessment submission ${id}`,
        entity: 'approval',
        branch: 'Main Campus',
      })
    } else if (action === 'revise') {
      if (!comment) {
        return NextResponse.json({ error: 'Comment is required for revision requests' }, { status: 400 })
      }
      await db
        .update(schema.approvals)
        .set({ status: 'revision', comment })
        .where(eq(schema.approvals.id, id))

      // Log audit
      await db.insert(schema.auditLogs).values({
        userName: 'Campus Vice Principal',
        action: `Requested revision for submission ${id}`,
        entity: 'approval',
        branch: 'Main Campus',
      })
    } else {
      return NextResponse.json({ error: 'Invalid action. Must be approve or revise.' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Approvals POST Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
