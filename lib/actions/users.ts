'use server'

import { db } from '@/lib/db'
import { users, branches } from '@/lib/db/schema'
import { eq, ilike, or, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { logActivity } from './activity'

export async function getUsers(filters?: { search?: string; role?: string }) {
  const result = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      status: users.status,
      branchId: users.branchId,
      branchName: branches.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(branches, eq(users.branchId, branches.id))
    .orderBy(users.fullName)

  let filtered = result

  if (filters?.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    )
  }

  if (filters?.role) {
    filtered = filtered.filter((u) => u.role === filters.role)
  }

  return filtered
}

export async function createUser(data: {
  fullName: string
  email: string
  role: string
  branchId?: string
  actorId: string
  actorName: string
}) {
  const [user] = await db
    .insert(users)
    .values({
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      branchId: data.branchId || null,
      status: 'Active',
    })
    .returning()

  await logActivity({
    userId: data.actorId,
    userName: data.actorName,
    action: 'Created user',
    detail: `${data.fullName} · ${data.role}`,
    entityType: 'user',
    entityId: user.id,
    branchId: data.branchId,
  })

  revalidatePath('/admin')
  return user
}

export async function updateUser(
  id: string,
  data: { fullName?: string; email?: string; role?: string; branchId?: string | null; status?: string },
  actor: { id: string; name: string }
) {
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning()

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: 'Updated user',
    detail: user.fullName,
    entityType: 'user',
    entityId: id,
  })

  revalidatePath('/admin')
  return user
}

export async function deleteUser(
  id: string,
  actor: { id: string; name: string }
) {
  const [user] = await db
    .update(users)
    .set({ status: 'Inactive' })
    .where(eq(users.id, id))
    .returning()

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: 'Deactivated user',
    detail: user.fullName,
    entityType: 'user',
    entityId: id,
  })

  revalidatePath('/admin')
  return user
}
