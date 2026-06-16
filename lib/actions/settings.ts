'use server'

import { db } from '@/lib/db'
import { systemSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { logActivity } from './activity'

export async function getSystemSettings() {
  const rows = await db.select().from(systemSettings)
  // Convert array to a key→value map for easy consumption
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>
}

export async function updateSetting(
  key: string,
  value: string,
  actor: { id: string; name: string }
) {
  // Upsert: update if exists, insert if not
  const existing = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.key, key))
    .limit(1)

  let setting
  if (existing.length > 0) {
    const [updated] = await db
      .update(systemSettings)
      .set({ value, updatedBy: actor.id, updatedAt: new Date() })
      .where(eq(systemSettings.key, key))
      .returning()
    setting = updated
  } else {
    const [inserted] = await db
      .insert(systemSettings)
      .values({ key, value, updatedBy: actor.id })
      .returning()
    setting = inserted
  }

  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: 'Updated system setting',
    detail: `${key} → ${value}`,
    entityType: 'setting',
    entityId: setting.id,
  })

  revalidatePath('/admin')
  return setting
}
