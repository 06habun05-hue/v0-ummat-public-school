'use client'

import ReactECharts from 'echarts-for-react'
import { MetricCard } from './metric-card'
import { Users, BookOpen, CheckCircle2, AlertCircle, CreditCard, Calendar, ChevronDown, Clock, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useApprovalStore } from '@/lib/store/approval-store'
import { useUIStore } from '@/lib/store/ui-store'
import { cn } from '@/lib/utils'

const classPerformanceOpts = {
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 10, bottom: 30, left: 45 },
  xAxis: { type: 'category', data: ['10-A','10-B','9-A','9-B','8-A'], axisTick: { show: false }, axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { fontSize: 11 } },
  series: [{ type: 'bar', data: [82,78,85,74,80], itemStyle: { color: '#2A7A30', borderRadius: [4,4,0,0] }, barMaxWidth: 36 }],
}

const attendanceTrendOpts = {
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 10, bottom: 30, left: 45 },
  xAxis: { type: 'category', data: ['Week 1','Week 2','Week 3','Week 4','Week 5'], axisTick: { show: false }, axisLabel: { fontSize: 10 } },
  yAxis: { type: 'value', min: 80, max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { fontSize: 11 } },
  series: [{ type: 'line', smooth: true, data: [91,93,90,94,94], lineStyle: { color: '#2A7A30', width: 2 }, itemStyle: { color: '#2A7A30' }, areaStyle: { color: '#2A7A3015' } }],
}

const feeOpts = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['50%','78%'], avoidLabelOverlap: false,
    label: { show: false },
    data: [
      { value: 87, name: 'Collected', itemStyle: { color: '#2A7A30' } },
      { value: 7,  name: 'Pending',   itemStyle: { color: '#F59E0B' } },
      { value: 6,  name: 'Overdue',   itemStyle: { color: '#CC1E1E' } },
    ],
  }],
}

const recentActivity = [
  { user: 'Ms. Sana Malik', action: 'Submitted assessment', detail: 'Class 10-A · English · Chapter 2', time: '5m ago', type: 'submit' },
  { user: 'Principal Arif', action: 'Approved assessment', detail: 'Class 9-B · Math · Chapter 1', time: '22m ago', type: 'approve' },
  { user: 'Admin Khalid',   action: 'Marked fee as paid', detail: 'STU003 · PKR 12,000', time: '1h ago', type: 'fee' },
  { user: 'Mr. Tariq',      action: 'Submitted assessment', detail: 'Class 9-B · Math · Chapter 1', time: '2h ago', type: 'submit' },
]


const actColor: Record<string,string> = {
  submit: 'bg-primary/10 text-primary',
  approve: 'bg-primary/10 text-primary',
  fee: 'bg-warning/10 text-warning',
}

export function Dashboard() {
  const [dateRange, setDateRange] = useState('month')
  const [dateOpen, setDateOpen] = useState(false)
  const { pending } = useApprovalStore()
  const { role, selectedBranch } = useUIStore()

  const isBranchAdmin = role === 'BRANCH_ADMIN'
  const isSuperAdmin = role === 'SUPER_ADMIN'

  // Mock data variation based on branch
  const getBranchMultiplier = () => {
    if (selectedBranch === 'North Campus') return 0.8
    if (selectedBranch === 'South Campus') return 0.6
    return 1.0
  }

  const m = getBranchMultiplier()

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {isBranchAdmin ? `${selectedBranch} Overview` : 'Analytics Overview'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isBranchAdmin ? `Performance metrics for ${selectedBranch}` : 'Real-time metrics and performance insights'}
          </p>
        </div>
        <div className="relative">
          <button onClick={() => setDateOpen(!dateOpen)} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
            <Calendar size={14} />
            {dateRange === 'month' ? 'This Month' : 'This Quarter'}
            <ChevronDown size={14} />
          </button>
          {dateOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-background border border-border rounded-lg shadow-lg z-10 py-1">
              {[['month','This Month'],['quarter','This Quarter'],['week','This Week']].map(([v,l]) => (
                <button key={v} onClick={() => { setDateRange(v); setDateOpen(false) }} className={cn('block w-full text-left px-3 py-2 text-xs transition-colors', dateRange===v ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted')}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard label="Total Students" value={String(Math.round(2458 * m))} icon={Users} trend={{ percentage: 12, isPositive: true }} />
        <MetricCard label="Total Teachers" value={String(Math.round(124 * m))} icon={BookOpen} trend={{ percentage: 5, isPositive: true }} />
        <MetricCard label="Attendance Rate" value={(94.2 * m).toFixed(1) + '%'} icon={CheckCircle2} trend={{ percentage: 3, isPositive: true }} />
        <MetricCard label="Pending Approvals" value={String(Math.round(pending.length * m))} icon={AlertCircle} trend={{ percentage: 8, isPositive: false }} />
        <MetricCard label="Fee Collection" value={(87.5 * m).toFixed(1) + '%'} icon={CreditCard} trend={{ percentage: 6, isPositive: true }} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-background border border-border rounded-lg p-5">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Class Performance</h3>
          <ReactECharts option={classPerformanceOpts} style={{ height: 200 }} />
        </div>
        <div className="bg-background border border-border rounded-lg p-5">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Attendance Trend</h3>
          <ReactECharts option={attendanceTrendOpts} style={{ height: 200 }} />
        </div>
      </div>

      {/* Bottom Row: Fee + Approvals Queue + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Fee donut */}
        <div className="bg-background border border-border rounded-lg p-5 flex flex-col items-center">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-2 self-start">Fee Collection</h3>
          <ReactECharts option={feeOpts} style={{ height: 160, width: '100%' }} />
          <div className="flex gap-4 text-xs mt-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block"/>Collected</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning inline-block"/>Pending</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent inline-block"/>Overdue</span>
          </div>
        </div>

        {/* Approval Queue */}
        <div className="bg-background border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-sm text-foreground">Pending Approvals</h3>
            <Link href="/approvals" className="text-xs text-primary hover:underline font-medium">View all</Link>
          </div>
          {pending.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-muted-foreground">
              <CheckCheck size={28} className="mb-2 text-primary/40" />
              <p className="text-xs">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pending.slice(0,4).map(p => (
                <div key={p.id} className="flex items-start gap-2.5 p-2.5 bg-muted/40 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{p.teacher}</p>
                    <p className="text-[10px] text-muted-foreground">{p.class} · {p.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-background border border-border rounded-lg p-5">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0', actColor[a.type])}>
                  {a.user.split(' ').map(n=>n[0]).slice(0,2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{a.user}</p>
                  <p className="text-[10px] text-muted-foreground">{a.action} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
