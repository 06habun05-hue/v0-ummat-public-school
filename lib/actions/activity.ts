'use server'

import { db } from '@/lib/db'
import { activityLog } from '@/lib/db/schema'

export async function logActivity(data: {
  userId?: string
  userName: string
  action: string
  detail?: string
  entityType?: string
  entityId?: string
  branchId?: string
}) {
  await db.insert(activityLog).values({
    userId: data.userId,
    userName: data.userName,
    action: data.action,
    detail: data.detail,
    entityType: data.entityType,
    entityId: data.entityId,
    branchId: data.branchId,
  })
}

export async function getRecentActivity(options?: { branchId?: string; limit?: number }) {
  const { limit = 10 } = options ?? {}

  const query = db
    .select()
    .from(activityLog)
    .orderBy(activityLog.createdAt)
    .limit(limit)

  return query
}
