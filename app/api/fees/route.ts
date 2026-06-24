import { NextResponse } from 'next/server'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const allFees = await db
      .select({
        id: schema.fees.id,
        studentId: schema.students.id,
        name: schema.students.name,
        class: schema.students.class,
        branch: schema.students.branch,
        amount: schema.fees.amount,
        status: schema.fees.status,
        dueDate: schema.fees.dueDate,
        paidDate: schema.fees.paidDate,
      })
      .from(schema.fees)
      .innerJoin(schema.students, eq(schema.fees.studentId, schema.students.id))

    const mapped = allFees.map(f => {
      const isPaid = f.status === 'collected'
      const amountNum = parseFloat(f.amount)
      return {
        id: f.id,
        studentId: f.studentId,
        name: f.name,
        class: f.class,
        branch: f.branch,
        amount: amountNum,
        paid: isPaid ? amountNum : 0,
        balance: isPaid ? 0 : amountNum,
        status: f.status === 'collected' ? 'Paid' : f.status === 'overdue' ? 'Overdue' : 'Pending',
        lastPayment: f.paidDate,
        dueDate: f.dueDate,
      }
    })

    // Grouping collection data for chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyStats: Record<string, { collected: number; outstanding: number }> = {}
    
    const today = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const mLabel = months[d.getMonth()]
      monthlyStats[mLabel] = { collected: 0, outstanding: 0 }
    }

    mapped.forEach(f => {
      if (f.dueDate) {
        const d = new Date(f.dueDate)
        const mLabel = months[d.getMonth()]
        if (monthlyStats[mLabel] !== undefined) {
          if (f.status === 'Paid') {
            monthlyStats[mLabel].collected += f.amount
          } else {
            monthlyStats[mLabel].outstanding += f.amount
          }
        }
      }
    })

    const collectionData = Object.entries(monthlyStats).map(([month, val]) => ({
      month,
      collected: val.collected,
      outstanding: val.outstanding,
    }))

    return NextResponse.json({
      fees: mapped,
      collectionData
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ error: 'Fee ID is required' }, { status: 400 })
    }

    const [updated] = await db
      .update(schema.fees)
      .set({
        status: 'collected',
        paidDate: new Date().toISOString().split('T')[0]
      })
      .where(eq(schema.fees.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Fee record not found' }, { status: 404 })
    }

    // Insert into audit logs
    const [student] = await db
      .select({ name: schema.students.name, branch: schema.students.branch })
      .from(schema.students)
      .where(eq(schema.students.id, updated.studentId))

    await db.insert(schema.auditLogs).values({
      userName: 'Zafar Iqbal',
      action: 'Fee Update',
      entity: 'fee',
      branch: student?.branch || 'Main Campus',
    })

    return NextResponse.json({ success: true, fee: updated })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
