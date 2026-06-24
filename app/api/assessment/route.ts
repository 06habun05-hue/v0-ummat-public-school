import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq, and, inArray } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branch = searchParams.get('branch')
    const className = searchParams.get('class')
    const subject = searchParams.get('subject')
    const chapter = searchParams.get('chapter')

    if (!branch || !className || !subject || !chapter) {
      return NextResponse.json({ error: 'Missing parameters branch, class, subject, or chapter' }, { status: 400 })
    }

    // 1. Fetch all students in this branch and class
    const studentsList = await db
      .select({ id: schema.students.id, name: schema.students.name })
      .from(schema.students)
      .where(and(eq(schema.students.branch, branch), eq(schema.students.class, className)))

    // 2. Fetch all SLOs matching the class, subject, and chapter
    const slosList = await db
      .select()
      .from(schema.slos)
      .where(and(eq(schema.slos.class, className), eq(schema.slos.subject, subject), eq(schema.slos.chapter, chapter)))

    // 3. Fetch all grades in this context
    const gradesList = await db
      .select()
      .from(schema.grades)
      .where(
        and(
          eq(schema.grades.branch, branch),
          eq(schema.grades.class, className),
          eq(schema.grades.subject, subject),
          eq(schema.grades.chapter, chapter)
        )
      )

    // 4. Map grades into matrix structure: Student ID -> SLO ID -> Score
    const gradeMap: Record<string, Record<string, number | null>> = {}
    gradesList.forEach(g => {
      if (!gradeMap[g.studentId]) {
        gradeMap[g.studentId] = {}
      }
      gradeMap[g.studentId][g.sloId] = g.score
    })

    // 5. Build final student list with dynamic keys for each SLO
    const studentsAssessment = studentsList.map(student => {
      const assessment: Record<string, any> = {
        id: student.id,
        name: student.name
      }
      // Populate each SLO column value
      slosList.forEach(slo => {
        assessment[slo.id] = gradeMap[student.id]?.[slo.id] ?? null
      })
      return assessment
    })

    return NextResponse.json({
      students: studentsAssessment,
      slos: slosList
    })
  } catch (error: any) {
    console.error('Assessment GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { branch, class: className, subject, chapter, grades } = body

    if (!branch || !className || !subject || !chapter || !Array.isArray(grades)) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Retrieve SLO IDs in this context to avoid saving random properties
    const slosList = await db
      .select({ id: schema.slos.id })
      .from(schema.slos)
      .where(and(eq(schema.slos.class, className), eq(schema.slos.subject, subject), eq(schema.slos.chapter, chapter)))
    const activeSloIds = slosList.map(s => s.id)

    // Batch process student grades
    const insertValues: any[] = []

    for (const studentRecord of grades) {
      const studentId = studentRecord.id
      if (!studentId) continue

      // Iterate through SLO keys in the studentRecord
      for (const sloId of activeSloIds) {
        if (sloId in studentRecord) {
          const score = studentRecord[sloId]
          insertValues.push({
            studentId,
            branch,
            class: className,
            subject,
            chapter,
            sloId,
            score: score !== null && score !== undefined ? parseInt(String(score), 10) : null
          })
        }
      }
    }

    // Upsert grades using conflict resolution or deletion & insertion for simplicity and reliability in cross-platform postgres
    if (insertValues.length > 0) {
      // 1. Delete existing grades in this context
      await db.delete(schema.grades).where(
        and(
          eq(schema.grades.branch, branch),
          eq(schema.grades.class, className),
          eq(schema.grades.subject, subject),
          eq(schema.grades.chapter, chapter)
        )
      )
      // 2. Insert new grades
      await db.insert(schema.grades).values(insertValues)
    }

    // Create an audit log record
    await db.insert(schema.auditLogs).values({
      userName: 'Academic Admin',
      action: `Saved assessment grades for ${className} ${subject}`,
      entity: 'assessment',
      branch,
    })

    return NextResponse.json({ success: true, count: insertValues.length })
  } catch (error: any) {
    console.error('Assessment POST Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
