import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const logs = await db
      .select({
        id: schema.auditLogs.id,
        userName: schema.auditLogs.userName,
        action: schema.auditLogs.action,
        entity: schema.auditLogs.entity,
        branch: schema.auditLogs.branch,
        createdAt: schema.auditLogs.createdAt,
        userRole: schema.users.role,
      })
      .from(schema.auditLogs)
      .leftJoin(schema.users, eq(schema.auditLogs.userName, schema.users.name))
      .orderBy(desc(schema.auditLogs.createdAt))

    const mapped = logs.map(l => {
      let moduleName = 'Admin'
      if (l.entity === 'assessment') moduleName = 'Assessment'
      else if (l.entity === 'approval') moduleName = 'Approvals'
      else if (l.entity === 'fee') moduleName = 'Fee Management'

      let roleName = 'Teacher'
      if (l.userRole === 'SUPER_ADMIN') roleName = 'Super Admin'
      else if (l.userRole === 'BRANCH_ADMIN') roleName = 'Branch Admin'
      else if (l.userRole === 'ACCOUNTANT') roleName = 'Accountant'

      let detail = `${l.userName} performed ${l.action} on ${l.entity}`
      if (l.action === 'Assessment Edit') detail = `Modified grades for Class 10-A`
      else if (l.action === 'Assessment Approval') detail = `Approved SLO-002 assessment results`
      else if (l.action === 'Fee Update') detail = `Updated monthly invoice status`
      else if (l.action === 'Student Update') detail = `Updated profile detail for student`
      else if (l.action === 'Login') detail = `Successfully authenticated session`
      else if (l.action === 'Settings Change') detail = `Updated default global term dates`

      return {
        id: l.id,
        action: l.action,
        timestamp: format(l.createdAt, 'yyyy-MM-dd HH:mm:ss'),
        user: l.userName,
        role: roleName,
        module: moduleName,
        detail: detail,
        ip: '192.168.1.10'
      }
    })

    return NextResponse.json({ logs: mapped })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
