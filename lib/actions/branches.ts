'use server'

import { db } from '@/lib/db'
import { branches, students, users } from '@/lib/db/schema'
import { eq, count, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { logActivity } from './activity'

export async function getBranches() {
  const result = await db
    .select({
      id: branches.id,
      name: branches.name,
      location: branches.location,
      principalName: branches.principalName,
      status: branches.status,
      createdAt: branches.createdAt,
      studentCount: count(students.id),
    })
    .from(branches)
    .leftJoin(students, eq(students.branchId, branches.id))
    .groupBy(branches.id)
    .orderBy(branches.createdAt)

  return result
}

export async function createBranch(data: {
  name: string
  location: string
  principalName?: string
  actorName: string
  actorId: string
}) {
  const [branch] = await db
    .insert(branches)
    .values({
      name: data.name,
      location: data.location,
      principalName: data.principalName,
      status: 'Active',
    })
    .returning()

  await logActivity({
    userId: data.actorId,
    userName: data.actorName,
    action: 'Created branch',
    detail: `${data.name} · ${data.location}`,
    entityType: 'branch',
    entityId: branch.id,
  })

  revalidatePath('/admin')
  return branch
}

export async function updateBranch(
  id: string,
  data: { name?: string; location?: string; principalName?: string; status?: string },
  actor: { id: string; name: string }
) {
  const [branch] = await db
    .update(branches)
    .set(data)
    .where(eq(branches.id, id))
    .returning()

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: 'Updated branch',
    detail: branch.name,
    entityType: 'branch',
    entityId: id,
  })

  revalidatePath('/admin')
  return branch
}

export async function deleteBranch(
  id: string,
  actor: { id: string; name: string }
) {
  const [branch] = await db
    .update(branches)
    .set({ status: 'Inactive' })
    .where(eq(branches.id, id))
    .returning()

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: 'Deactivated branch',
    detail: branch.name,
    entityType: 'branch',
    entityId: id,
  })

  revalidatePath('/admin')
  return branch
}

export async function getBranchUsers(branchId: string) {
  return db
    .select()
    .from(users)
    .where(eq(users.branchId, branchId))
    .orderBy(users.fullName)
}
