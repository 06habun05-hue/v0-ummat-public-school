'use client'

import ReactECharts from 'echarts-for-react'
import { MetricCard } from '../metric-card'
import { Users, BookOpen, CheckCircle2, AlertCircle, CreditCard, Calendar, ChevronDown, Clock, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useApprovalStore } from '@/lib/store/approval-store'
import { useUIStore } from '@/lib/store/ui-store'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const classPerformanceOpts = {
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 10, bottom: 30, left: 45 },
  xAxis: { type: 'category', data: [], axisTick: { show: false }, axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { fontSize: 11 } },
  series: [{ type: 'bar', data: [], itemStyle: { color: '#2A7A30', borderRadius: [4,4,0,0] }, barMaxWidth: 36 }],
}

const attendanceTrendOpts = {
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 10, bottom: 30, left: 45 },
  xAxis: { type: 'category', data: [], axisTick: { show: false }, axisLabel: { fontSize: 10 } },
  yAxis: { type: 'value', min: 80, max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { fontSize: 11 } },
  series: [{ type: 'line', smooth: true, data: [], lineStyle: { color: '#2A7A30', width: 2 }, itemStyle: { color: '#2A7A30' }, areaStyle: { color: '#2A7A3015' } }],
}

const feeOpts = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['50%','78%'], avoidLabelOverlap: false,
    label: { show: false },
    data: [
      { value: 0, name: 'Collected', itemStyle: { color: '#2A7A30' } },
      { value: 0,  name: 'Pending',   itemStyle: { color: '#F59E0B' } },
      { value: 0,  name: 'Overdue',   itemStyle: { color: '#CC1E1E' } },
    ],
  }],
}

const recentActivity: any[] = []

const actColor: Record<string,string> = {
  submit: 'bg-primary/10 text-primary',
  approve: 'bg-primary/10 text-primary',
  fee: 'bg-warning/10 text-warning',
}

export function AdminPortal() {
  const [dateRange, setDateRange] = useState('month')
  const [dateOpen, setDateOpen] = useState(false)
  const { pending } = useApprovalStore()
  const { role, selectedBranch } = useUIStore()

  const isBranchAdmin = role === 'BRANCH_ADMIN'

  // Mock data variation based on branch
  const getBranchMultiplier = () => {
    return 1.0
  }

  const m = getBranchMultiplier()

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight">
            {isBranchAdmin ? `${selectedBranch} Overview` : 'Analytics Overview'}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            {isBranchAdmin ? `Performance metrics for ${selectedBranch}` : 'Real-time metrics and performance insights'}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative">
          <button onClick={() => setDateOpen(!dateOpen)} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
            <Calendar size={14} />
            {dateRange === 'month' ? 'This Month' : 'This Quarter'}
            <ChevronDown size={14} />
          </button>
          {dateOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-background border border-border rounded-lg shadow-lg z-10 py-1 animate-slide-in">
              {[['month','This Month'],['quarter','This Quarter'],['week','This Week']].map(([v,l]) => (
                <button key={v} onClick={() => { setDateRange(v); setDateOpen(false) }} className={cn('block w-full text-left px-3 py-2 text-xs transition-colors', dateRange===v ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted')}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Students", value: "0", icon: Users, trend: { percentage: 0, isPositive: true } },
          { label: "Total Teachers", value: "0", icon: BookOpen, trend: { percentage: 0, isPositive: true } },
          { label: "Attendance Rate", value: "0%", icon: CheckCircle2, trend: { percentage: 0, isPositive: true } },
          { label: "Pending Approvals", value: "0", icon: AlertCircle, trend: { percentage: 0, isPositive: false } },
          { label: "Fee Collection", value: "0%", icon: CreditCard, trend: { percentage: 0, isPositive: true } }
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <MetricCard label={card.label} value={card.value} icon={card.icon} trend={card.trend} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-background border border-border/50 rounded-3xl p-6 shadow-md"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Class Performance</h3>
          <ReactECharts option={classPerformanceOpts} style={{ height: 200 }} />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background border border-border/50 rounded-3xl p-6 shadow-md"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Attendance Trend</h3>
          <ReactECharts option={attendanceTrendOpts} style={{ height: 200 }} />
        </motion.div>
      </div>

      {/* Bottom Row: Fee + Approvals Queue + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee donut */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-background border border-border/50 rounded-3xl p-6 shadow-md flex flex-col items-center"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 self-start">Fee Collection</h3>
          <ReactECharts option={feeOpts} style={{ height: 160, width: '100%' }} />
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest mt-1">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary inline-block"/>Collected</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning inline-block"/>Pending</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent inline-block"/>Overdue</span>
          </div>
        </motion.div>

        {/* Approval Queue */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-background border border-border/50 rounded-3xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pending Approvals</h3>
            <Link href="/approvals" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View all</Link>
          </div>
          {pending.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-muted-foreground">
              <CheckCheck size={28} className="mb-2 text-primary/40" />
              <p className="text-xs font-bold uppercase tracking-wider">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.slice(0,4).map(p => (
                <div key={p.id} className="flex items-start gap-2.5 p-3 bg-muted/40 rounded-2xl border border-border/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{p.teacher}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{p.class} · {p.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-background border border-border/50 rounded-3xl p-6 shadow-md"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase flex-shrink-0', actColor[a.type])}>
                  {a.user.split(' ').map(n=>n[0]).slice(0,2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{a.user}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{a.action} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
