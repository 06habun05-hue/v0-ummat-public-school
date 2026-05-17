'use client'

import ReactECharts from 'echarts-for-react'
import { MetricCard } from '../metric-card'
import { Users, BookOpen, CheckCircle2, AlertCircle, Calendar, ChevronDown, CheckCheck, Sparkles, Plus, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useUIStore } from '@/lib/store/ui-store'

const attendanceTrendOpts = {
  tooltip: { trigger: 'axis' },
  grid: { top: 15, right: 10, bottom: 30, left: 45 },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], axisTick: { show: false }, axisLabel: { fontSize: 10 } },
  yAxis: { type: 'value', min: 80, max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { fontSize: 11 } },
  series: [{ type: 'line', smooth: true, data: [95, 96, 94, 97, 96.4], lineStyle: { color: '#2A7A30', width: 2.5 }, itemStyle: { color: '#2A7A30' }, areaStyle: { color: '#2A7A3015' } }],
}

const sloMasteryOpts = {
  tooltip: { trigger: 'axis' },
  grid: { top: 15, right: 10, bottom: 30, left: 45 },
  xAxis: { type: 'category', data: ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4', 'Ch 5'], axisTick: { show: false }, axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { fontSize: 11 } },
  series: [{ type: 'bar', data: [90, 85, 78, 92, 80], itemStyle: { color: '#2A7A30', borderRadius: [4, 4, 0, 0] }, barMaxWidth: 24 }],
}

const recentGrading = [
  { student: 'Ahmed Hassan', class: '10-A', subject: 'English', detail: 'SLO-001 · Exceeded Expectation', time: '10m ago' },
  { student: 'Fatima Khan', class: '10-A', subject: 'English', detail: 'SLO-001 · Met Expectation', time: '15m ago' },
  { student: 'Zainab Ahmed', class: '10-B', subject: 'English', detail: 'SLO-002 · Met Expectation', time: '1h ago' },
]

export function TeacherPortal() {
  const { selectedBranch } = useUIStore()

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight">
            Teacher Workspace
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            Manage your classes, record student attendance, and assess learning outcomes at {selectedBranch}
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl"
        >
          <Sparkles size={14} className="text-primary animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-primary">Academic Term active</span>
        </motion.div>
      </div>

      {/* Action Hub - Premium chunky buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Link href="/attendance">
          <button className="w-full h-14 px-6 bg-primary text-white rounded-2xl flex items-center justify-between shadow-xl shadow-primary/20 hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300 group">
            <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2.5">
              <CheckCircle2 size={18} className="transition-transform group-hover:scale-110" />
              Mark Attendance
            </span>
            <ChevronDown size={16} className="rotate-270 opacity-60" />
          </button>
        </Link>
        <Link href="/assessment">
          <button className="w-full h-14 px-6 bg-primary text-white rounded-2xl flex items-center justify-between shadow-xl shadow-primary/20 hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300 group">
            <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2.5">
              <ClipboardList size={18} className="transition-transform group-hover:scale-110" />
              Record Student Grades
            </span>
            <ChevronDown size={16} className="rotate-270 opacity-60" />
          </button>
        </Link>
        <Link href="/slo">
          <button className="w-full h-14 px-6 bg-background border border-border text-foreground hover:bg-muted rounded-2xl flex items-center justify-between shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2.5 text-muted-foreground group-hover:text-foreground transition-colors">
              <BookOpen size={18} className="text-primary transition-transform group-hover:scale-110" />
              SLO & Curriculum Maps
            </span>
            <ChevronDown size={16} className="rotate-270 opacity-40 group-hover:opacity-85" />
          </button>
        </Link>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "My Classes", value: "4 Sections", icon: Users, trend: { percentage: 0, isPositive: true } },
          { label: "Class Attendance", value: "96.4%", icon: CheckCircle2, trend: { percentage: 2, isPositive: true } },
          { label: "SLOs Mapped", value: "18 Chapters", icon: BookOpen, trend: { percentage: 10, isPositive: true } },
          { label: "Pending Reviews", value: "3 Grades", icon: AlertCircle, trend: { percentage: 0, isPositive: false } }
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 + 0.1, duration: 0.2 }}
          >
            <MetricCard label={card.label} value={card.value} icon={card.icon} trend={card.trend.percentage > 0 ? card.trend : undefined} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          className="bg-background border border-border/50 rounded-3xl p-6 shadow-md"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Class Attendance Trend (Weekly)</h3>
          <ReactECharts option={attendanceTrendOpts} style={{ height: 220 }} />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.2 }}
          className="bg-background border border-border/50 rounded-3xl p-6 shadow-md"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">SLO Mastery Rates</h3>
          <ReactECharts option={sloMasteryOpts} style={{ height: 220 }} />
        </motion.div>
      </div>

      {/* Recent Activity / Graded list */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.2 }}
          className="bg-background border border-border/50 rounded-3xl p-6 shadow-md"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Recent Grade Entries</h3>
          <div className="space-y-3">
            {recentGrading.map((g, i) => (
              <div key={i} className="flex items-start justify-between p-3 bg-muted/40 rounded-2xl border border-border/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black uppercase">
                    {g.student.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{g.student}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{g.class} · {g.subject} · {g.detail}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-muted-foreground/50 uppercase">{g.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
