import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const className = searchParams.get('class') || 'All'
    const subject = searchParams.get('subject') || 'All'
    const chapter = searchParams.get('chapter') || 'All'

    const conditions = []
    if (className !== 'All') {
      conditions.push(eq(schema.slos.class, className))
    }
    if (subject !== 'All') {
      conditions.push(eq(schema.slos.subject, subject))
    }
    if (chapter !== 'All') {
      conditions.push(eq(schema.slos.chapter, chapter))
    }

    const slosList = await db
      .select()
      .from(schema.slos)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    return NextResponse.json({ slos: slosList })
  } catch (error: any) {
    console.error('SLO GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Check if bulk import
    if (body.slos && Array.isArray(body.slos)) {
      const sloList = body.slos
      if (sloList.length === 0) {
        return NextResponse.json({ success: true, count: 0 })
      }

      // Format records
      const insertValues = sloList.map((slo: any) => ({
        id: String(slo.id).toUpperCase(),
        description: slo.description,
        class: slo.class,
        subject: slo.subject,
        chapter: slo.chapter,
        ncp: slo.ncp || 'NCP-GENERIC'
      }))

      // Batch insert or resolve duplicates by conflict update
      // Since it's Neon Postgres, we can do insert onConflictDoUpdate
      // For simplicity and safety across dialects, we insert one by one or delete existing and re-insert
      const ids = insertValues.map(v => v.id)
      
      // Let's resolve duplicate codes: check existing SLOs
      const existing = await db.select({ id: schema.slos.id }).from(schema.slos)
      const existingIds = new Set(existing.map(e => e.id))

      const resolved = insertValues.map(row => {
        if (existingIds.has(row.id)) {
          return { ...row, id: `${row.id}-NEW` }
        }
        return row
      })

      await db.insert(schema.slos).values(resolved)

      // Create an audit log record
      await db.insert(schema.auditLogs).values({
        userName: 'Academic Director',
        action: `Bulk imported ${resolved.length} SLO definitions`,
        entity: 'approval', // maps to 'approval' or 'assessment'
        branch: 'Main Campus'
      })

      return NextResponse.json({ success: true, count: resolved.length })
    } 
    
    // Single SLO insert
    const { id, description, class: className, subject, chapter, ncp } = body
    if (!id || !description || !className || !subject || !chapter) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const newId = String(id).toUpperCase().trim()

    // Check duplicate
    const duplicate = await db
      .select({ id: schema.slos.id })
      .from(schema.slos)
      .where(eq(schema.slos.id, newId))
      .limit(1)

    if (duplicate.length > 0) {
      return NextResponse.json({ error: `SLO Code ${newId} already exists.` }, { status: 400 })
    }

    await db.insert(schema.slos).values({
      id: newId,
      description,
      class: className,
      subject,
      chapter,
      ncp: ncp || 'NCP-GENERIC'
    })

    // Create an audit log record
    await db.insert(schema.auditLogs).values({
      userName: 'Academic Director',
      action: `Created SLO ${newId}`,
      entity: 'approval',
      branch: 'Main Campus'
    })

    return NextResponse.json({ success: true, id: newId })
  } catch (error: any) {
    console.error('SLO POST Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
