'use client'

import { useUIStore } from '@/lib/store/ui-store'
import { TeacherPortal } from './portals/teacher-portal'
import { AccountantPortal } from './portals/accountant-portal'
import { AdminPortal } from './portals/admin-portal'

export function Dashboard() {
  const { role } = useUIStore()

  switch (role) {
    case 'SUPER_ADMIN':
    case 'BRANCH_ADMIN':
      return <AdminPortal />
    case 'ACCOUNTANT':
      return <AccountantPortal />
    case 'TEACHER':
      return <TeacherPortal />
    default:
      return <AdminPortal />
  }
}

