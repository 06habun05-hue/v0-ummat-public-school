'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, XCircle, Clock, Search, Users, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useUIStore } from '@/lib/store/ui-store'

interface StudentAttendance {
  id: string
  name: string
  status: 'present' | 'absent' | 'late' | null
  history?: Record<string, 'present' | 'absent' | 'late' | null>
}

interface AttendancePanelProps {
  students?: StudentAttendance[]
}

const statusConfig = {
  present: {
    label: 'Present',
    short: 'P',
    icon: CheckCircle2,
    color: 'text-primary',
    bg: 'bg-primary/10',
    activeBg: 'bg-primary',
    activeText: 'text-white',
    border: 'border-primary/20',
    ring: 'ring-primary/30',
  },
  absent: {
    label: 'Absent',
    short: 'A',
    icon: XCircle,
    color: 'text-accent',
    bg: 'bg-accent/10',
    activeBg: 'bg-accent',
    activeText: 'text-white',
    border: 'border-accent/20',
    ring: 'ring-accent/30',
  },
  late: {
    label: 'Late',
    short: 'L',
    icon: Clock,
    color: 'text-warning',
    bg: 'bg-warning/10',
    activeBg: 'bg-warning',
    activeText: 'text-white',
    border: 'border-warning/20',
    ring: 'ring-warning/30',
  },
}

const weekDayStatusConfig = {
  present: { label: 'P', bg: 'bg-primary/10', color: 'text-primary', border: 'border-primary/20' },
  absent:  { label: 'A', bg: 'bg-accent/10',  color: 'text-accent',  border: 'border-accent/20'  },
  late:    { label: 'L', bg: 'bg-warning/10', color: 'text-warning', border: 'border-warning/20' },
  null:    { label: '–', bg: 'bg-muted/50',   color: 'text-muted-foreground', border: 'border-border' },
}

export function AttendancePanel({ students: initialStudents = [] }: AttendancePanelProps) {
  const { role } = useUIStore()
  const isReadOnly = role !== 'TEACHER'

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily')
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState<StudentAttendance[]>(
    initialStudents.length > 0 ? initialStudents : [
      { id: '1', name: 'Ahmed Hassan',  status: null, history: { Mon: 'present', Tue: 'present', Wed: 'late',    Thu: 'present', Fri: null } },
      { id: '2', name: 'Fatima Khan',   status: null, history: { Mon: 'present', Tue: 'present', Wed: 'present', Thu: 'present', Fri: null } },
      { id: '3', name: 'Muhammad Ali',  status: null, history: { Mon: 'absent',  Tue: 'present', Wed: 'present', Thu: 'absent',  Fri: null } },
      { id: '4', name: 'Zainab Ahmed',  status: null, history: { Mon: 'present', Tue: 'late',    Wed: 'present', Thu: 'present', Fri: null } },
      { id: '5', name: 'Hassan Ibrahim',status: null, history: { Mon: 'present', Tue: 'present', Wed: 'present', Thu: 'present', Fri: null } },
      { id: '6', name: 'Aisha Mohammed',status: null, history: { Mon: 'present', Tue: 'present', Wed: 'present', Thu: 'present', Fri: null } },
      { id: '7', name: 'Omar Ahmed',    status: null, history: { Mon: 'late',    Tue: 'present', Wed: 'present', Thu: 'present', Fri: null } },
      { id: '8', name: 'Layla Hassan',  status: null, history: { Mon: 'present', Tue: 'present', Wed: 'present', Thu: 'present', Fri: null } },
    ]
  )

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  const filteredStudents = useMemo(() =>
    students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [students, searchQuery]
  )

  const markStatus = (id: string, status: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const markAll = (status: 'present' | 'absent') => {
    setStudents(prev => prev.map(s => ({ ...s, status })))
    toast.success(`All students marked as ${status}`)
  }

  const stats = useMemo(() => {
    const present = students.filter(s => s.status === 'present').length
    const absent  = students.filter(s => s.status === 'absent').length
    const late    = students.filter(s => s.status === 'late').length
    const total   = students.length
    return { present, absent, late, total, marked: present + absent + late }
  }, [students])

  return (
    <div className="space-y-5">

      {/* ── Header Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* View Toggle */}
        <div className="flex bg-muted p-1 rounded-xl w-fit">
          {(['daily', 'weekly'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'px-4 py-1.5 text-xs font-black uppercase tracking-wide rounded-lg transition-all capitalize',
                viewMode === mode ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
          />
        </div>

        {/* Bulk Actions */}
        {!isReadOnly && (
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => markAll('present')}
              className="flex-1 sm:flex-none px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black hover:bg-primary/20 transition-all"
            >
              All Present
            </button>
            <button
              onClick={() => markAll('absent')}
              className="flex-1 sm:flex-none px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-xl text-xs font-black hover:bg-accent/20 transition-all"
            >
              All Absent
            </button>
          </div>
        )}
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Present', value: stats.present, icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Absent',  value: stats.absent,  icon: XCircle,      color: 'text-accent',  bg: 'bg-accent/10'  },
          { label: 'Late',    value: stats.late,    icon: Clock,        color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Marked',  value: `${stats.marked}/${stats.total}`, icon: Users, color: 'text-muted-foreground', bg: 'bg-muted' },
        ].map(card => (
          <div key={card.label} className="bg-background border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', card.bg)}>
              <card.icon size={18} className={card.color} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{card.label}</p>
              <p className="text-xl font-black text-foreground leading-tight">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── DAILY VIEW ── */}
      {viewMode === 'daily' && (
        <>
          {/* Mobile card list (hidden on lg+) */}
          <div className="lg:hidden space-y-2.5">
            {filteredStudents.map(student => (
              <div key={student.id} className="bg-background border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-black flex-shrink-0">
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <p className="text-sm font-bold text-foreground">{student.name}</p>
                  </div>
                  {student.status && (
                    <span className={cn(
                      'text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border',
                      statusConfig[student.status].bg,
                      statusConfig[student.status].color,
                      statusConfig[student.status].border
                    )}>
                      {statusConfig[student.status].label}
                    </span>
                  )}
                </div>

                {/* Large touch-friendly P / L / A buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {(['present', 'late', 'absent'] as const).map(status => {
                    const cfg = statusConfig[status]
                    const isActive = student.status === status
                    return (
                      <button
                        key={status}
                        disabled={isReadOnly}
                        onClick={() => markStatus(student.id, status)}
                        className={cn(
                          'h-12 rounded-xl flex items-center justify-center gap-2 border-2 transition-all active:scale-95 font-black text-xs uppercase tracking-wide',
                          isActive
                            ? `${cfg.activeBg} ${cfg.activeText} border-transparent shadow-lg`
                            : `bg-background border-border text-muted-foreground`,
                          isReadOnly && 'cursor-default opacity-60'
                        )}
                      >
                        <cfg.icon size={15} />
                        {cfg.short}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table (hidden on mobile) */}
          <div className="hidden lg:block border border-border rounded-2xl bg-background overflow-hidden shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-muted/50 z-10">Student</th>
                  <th className="px-6 py-4 text-center font-black text-[10px] uppercase tracking-widest text-muted-foreground">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground sticky left-0 bg-background z-10 border-r border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        {student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {(['present', 'late', 'absent'] as const).map(status => {
                          const cfg = statusConfig[status]
                          const isActive = student.status === status
                          return (
                            <button
                              key={status}
                              disabled={isReadOnly}
                              onClick={() => markStatus(student.id, status)}
                              className={cn(
                                'flex flex-col items-center gap-1 px-5 py-2 rounded-xl border transition-all min-w-[72px]',
                                isActive
                                  ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-2 ${cfg.ring} shadow-sm`
                                  : 'bg-background text-muted-foreground border-border hover:bg-muted',
                                isReadOnly && 'cursor-default'
                              )}
                            >
                              <cfg.icon size={15} />
                              <span className="text-[9px] font-black uppercase">{cfg.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── WEEKLY VIEW ── */}
      {viewMode === 'weekly' && (
        <>
          {/* Mobile weekly cards */}
          <div className="lg:hidden space-y-2.5">
            {filteredStudents.map(student => (
              <div key={student.id} className="bg-background border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-black flex-shrink-0">
                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <p className="text-sm font-bold text-foreground">{student.name}</p>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {days.map(day => {
                    const status = student.history?.[day] ?? null
                    const cfg = weekDayStatusConfig[status as keyof typeof weekDayStatusConfig] ?? weekDayStatusConfig.null
                    return (
                      <div key={day} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase">{day}</span>
                        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black border', cfg.bg, cfg.color, cfg.border)}>
                          {cfg.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop weekly table */}
          <div className="hidden lg:block border border-border rounded-2xl bg-background overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-4 text-left font-black text-[10px] uppercase tracking-widest text-muted-foreground sticky left-0 bg-muted/50 z-10">Student</th>
                    {days.map(day => (
                      <th key={day} className="px-4 py-4 text-center font-black text-[10px] uppercase tracking-widest text-muted-foreground border-l border-border">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground sticky left-0 bg-background z-10 border-r border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          {student.name}
                        </div>
                      </td>
                      {days.map(day => {
                        const status = student.history?.[day] ?? null
                        const cfg = weekDayStatusConfig[status as keyof typeof weekDayStatusConfig] ?? weekDayStatusConfig.null
                        return (
                          <td key={day} className="px-4 py-4 text-center border-l border-border">
                            <div className={cn('w-8 h-8 mx-auto flex items-center justify-center rounded-xl text-[10px] font-black border', cfg.bg, cfg.color, cfg.border)}>
                              {cfg.label}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Save Button ── */}
      {!isReadOnly && (
        <div className="flex justify-end pt-1">
          <button
            onClick={() => toast.success('Attendance records saved successfully')}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Check size={16} /> Save Attendance
          </button>
        </div>
      )}
    </div>
  )
}
