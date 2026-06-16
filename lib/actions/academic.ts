'use server'

import { db } from '@/lib/db'
import { academicYears, terms, gradeScales } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { logActivity } from './activity'

export async function getActiveAcademicYear() {
  const [year] = await db
    .select()
    .from(academicYears)
    .where(eq(academicYears.isActive, true))
    .limit(1)

  if (!year) return null

  const yearTerms = await db
    .select()
    .from(terms)
    .where(eq(terms.academicYearId, year.id))
    .orderBy(terms.startDate)

  const [gradeScale] = await db
    .select()
    .from(gradeScales)
    .where(eq(gradeScales.academicYearId, year.id))
    .limit(1)

  return { year, terms: yearTerms, gradeScale }
}

export async function updateTerm(
  id: string,
  data: { name?: string; startDate?: string; endDate?: string },
  actor: { id: string; name: string }
) {
  const [term] = await db
    .update(terms)
    .set(data)
    .where(eq(terms.id, id))
    .returning()

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: 'Updated term dates',
    detail: `${term.name}: ${term.startDate} → ${term.endDate}`,
    entityType: 'academic',
    entityId: id,
  })

  revalidatePath('/admin')
  return term
}

export async function updateGradeScale(
  id: string,
  data: { maxGpa?: string; description?: string },
  actor: { id: string; name: string }
) {
  const [scale] = await db
    .update(gradeScales)
    .set(data)
    .where(eq(gradeScales.id, id))
    .returning()

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: 'Updated grade scale',
    detail: `Max GPA: ${scale.maxGpa}`,
    entityType: 'academic',
    entityId: id,
  })

  revalidatePath('/admin')
  return scale
}

export async function publishAcademicCalendar(
  data: {
    label: string
    term1: { name: string; startDate: string; endDate: string }
    term2: { name: string; startDate: string; endDate: string }
    maxGpa: string
    description?: string
  },
  actor: { id: string; name: string }
) {
  // Deactivate all existing years
  await db.update(academicYears).set({ isActive: false })

  // Create new active year
  const [newYear] = await db
    .insert(academicYears)
    .values({ label: data.label, isActive: true, isLocked: false })
    .returning()

  // Create terms
  await db.insert(terms).values([
    { academicYearId: newYear.id, ...data.term1 },
    { academicYearId: newYear.id, ...data.term2 },
  ])

  // Create grade scale
  await db.insert(gradeScales).values({
    academicYearId: newYear.id,
    maxGpa: data.maxGpa,
    description: data.description,
  })

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: 'Published academic calendar',
    detail: data.label,
    entityType: 'academic',
    entityId: newYear.id,
  })

  revalidatePath('/admin')
  return newYear
}

export async function lockAcademicYear(id: string, actor: { id: string; name: string }) {
  const [year] = await db
    .update(academicYears)
    .set({ isLocked: true })
    .where(eq(academicYears.id, id))
    .returning()

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: 'Locked academic year',
    detail: year.label,
    entityType: 'academic',
    entityId: id,
  })

  revalidatePath('/admin')
  return year
}

export async function unlockAcademicYear(id: string, actor: { id: string; name: string }) {
  const [year] = await db
    .update(academicYears)
    .set({ isLocked: false })
    .where(eq(academicYears.id, id))
    .returning()

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: 'Unlocked academic year',
    detail: year.label,
    entityType: 'academic',
    entityId: id,
  })

  revalidatePath('/admin')
  return year
}
