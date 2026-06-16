'use server'

import { db } from '@/lib/db'
import { students, feeRecords, attendanceRecords, assessments, users, activityLog } from '@/lib/db/schema'
import { eq, and, gte, sql, count, desc } from 'drizzle-orm'
import { subDays, subMonths, subWeeks, format, startOfWeek, endOfWeek } from 'date-fns'

type DateRange = 'week' | 'month' | 'quarter'

function getDateFilter(range: DateRange): Date {
  const now = new Date()
  if (range === 'week') return subWeeks(now, 1)
  if (range === 'quarter') return subMonths(now, 3)
  return subMonths(now, 1) // default: month
}

export async function getDashboardKPIs(options?: { branchId?: string; dateRange?: DateRange }) {
  const { branchId, dateRange = 'month' } = options ?? {}

  // Total active students
  const studentQuery = db
    .select({ count: count() })
    .from(students)
    .where(
      branchId
        ? and(eq(students.status, 'Active'), eq(students.branchId, branchId))
        : eq(students.status, 'Active')
    )
  const [{ count: totalStudents }] = await studentQuery

  // Total active teachers
  const teacherQuery = db
    .select({ count: count() })
    .from(users)
    .where(
      branchId
        ? and(eq(users.role, 'TEACHER'), eq(users.status, 'Active'), eq(users.branchId, branchId))
        : and(eq(users.role, 'TEACHER'), eq(users.status, 'Active'))
    )
  const [{ count: totalTeachers }] = await teacherQuery

  // Attendance rate — average of present/total across recent records
  const since = getDateFilter(dateRange)
  const attendanceQuery = db
    .select({
      totalPresent: sql<number>`sum(${attendanceRecords.presentCount})`,
      totalStudents: sql<number>`sum(${attendanceRecords.totalCount})`,
    })
    .from(attendanceRecords)
    .where(
      branchId
        ? and(eq(attendanceRecords.branchId, branchId), gte(attendanceRecords.date, format(since, 'yyyy-MM-dd')))
        : gte(attendanceRecords.date, format(since, 'yyyy-MM-dd'))
    )
  const [attRow] = await attendanceQuery
  const attendanceRate =
    attRow.totalStudents > 0
      ? ((attRow.totalPresent / attRow.totalStudents) * 100).toFixed(1)
      : '0.0'

  // Fee collection rate
  const feeQuery = db
    .select({
      status: feeRecords.status,
      total: count(),
    })
    .from(feeRecords)
    .where(branchId ? eq(feeRecords.branchId, branchId) : sql`1=1`)
    .groupBy(feeRecords.status)
  const feeRows = await feeQuery
  const feeTotal = feeRows.reduce((sum, r) => sum + Number(r.total), 0)
  const feePaid = feeRows.find((r) => r.status === 'paid')?.total ?? 0
  const feeRate = feeTotal > 0 ? ((Number(feePaid) / feeTotal) * 100).toFixed(1) : '0.0'

  // Pending approvals count
  const pendingQuery = db
    .select({ count: count() })
    .from(assessments)
    .where(
      branchId
        ? and(eq(assessments.status, 'pending'), eq(assessments.branchId, branchId))
        : eq(assessments.status, 'pending')
    )
  const [{ count: pendingApprovals }] = await pendingQuery

  return {
    totalStudents: Number(totalStudents),
    totalTeachers: Number(totalTeachers),
    attendanceRate,
    feeCollectionRate: feeRate,
    pendingApprovals: Number(pendingApprovals),
  }
}

export async function getClassPerformance(options?: { branchId?: string }) {
  const { branchId } = options ?? {}

  const rows = await db
    .select({
      className: assessments.className,
      avgScore: sql<number>`avg(${assessments.avgScore})`,
    })
    .from(assessments)
    .where(branchId ? eq(assessments.branchId, branchId) : sql`1=1`)
    .groupBy(assessments.className)
    .orderBy(assessments.className)

  return rows.map((r) => ({
    className: r.className,
    avgScore: Number(Number(r.avgScore).toFixed(1)),
  }))
}

export async function getAttendanceTrend(options?: { branchId?: string; dateRange?: DateRange }) {
  const { branchId, dateRange = 'month' } = options ?? {}
  const since = getDateFilter(dateRange)

  const rows = await db
    .select({
      week: sql<string>`to_char(date_trunc('week', ${attendanceRecords.date}::date), 'Mon DD')`,
      totalPresent: sql<number>`sum(${attendanceRecords.presentCount})`,
      totalCount: sql<number>`sum(${attendanceRecords.totalCount})`,
    })
    .from(attendanceRecords)
    .where(
      branchId
        ? and(eq(attendanceRecords.branchId, branchId), gte(attendanceRecords.date, format(since, 'yyyy-MM-dd')))
        : gte(attendanceRecords.date, format(since, 'yyyy-MM-dd'))
    )
    .groupBy(sql`date_trunc('week', ${attendanceRecords.date}::date)`)
    .orderBy(sql`date_trunc('week', ${attendanceRecords.date}::date)`)

  return rows.map((r) => ({
    week: r.week,
    rate: r.totalCount > 0 ? Number(((r.totalPresent / r.totalCount) * 100).toFixed(1)) : 0,
  }))
}

export async function getFeeBreakdown(options?: { branchId?: string }) {
  const { branchId } = options ?? {}

  const rows = await db
    .select({
      status: feeRecords.status,
      total: count(),
    })
    .from(feeRecords)
    .where(branchId ? eq(feeRecords.branchId, branchId) : sql`1=1`)
    .groupBy(feeRecords.status)

  const total = rows.reduce((sum, r) => sum + Number(r.total), 0)
  const get = (s: string) => {
    const found = rows.find((r) => r.status === s)
    return total > 0 ? Math.round((Number(found?.total ?? 0) / total) * 100) : 0
  }

  return {
    collected: get('paid'),
    pending: get('pending'),
    overdue: get('overdue'),
  }
}

export async function getDashboardActivity(options?: { branchId?: string; limit?: number }) {
  const { branchId, limit = 8 } = options ?? {}

  const rows = await db
    .select()
    .from(activityLog)
    .where(branchId ? eq(activityLog.branchId, branchId) : sql`1=1`)
    .orderBy(desc(activityLog.createdAt))
    .limit(limit)

  return rows
}

export async function getPendingApprovals(options?: { branchId?: string }) {
  const { branchId } = options ?? {}

  return db
    .select()
    .from(assessments)
    .where(
      branchId
        ? and(eq(assessments.status, 'pending'), eq(assessments.branchId, branchId))
        : eq(assessments.status, 'pending')
    )
    .orderBy(desc(assessments.recordedAt))
    .limit(10)
}
