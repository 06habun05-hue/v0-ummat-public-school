'use client'

import { useState, useMemo, useEffect } from 'react'
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
  students: StudentAttendance[]
  onSave: (attendanceList: { studentId: string; status: 'present' | 'absent' | 'late' }[]) => Promise<void>
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

export function AttendancePanel({ students: initialStudents = [], onSave }: AttendancePanelProps) {
  const { role } = useUIStore()
  const isReadOnly = role !== 'TEACHER'

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily')
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState<StudentAttendance[]>(initialStudents)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setStudents(initialStudents)
  }, [initialStudents])

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

  const handleSave = async () => {
    setSaving(true)
    try {
      const records = students.map(s => ({
        studentId: s.id,
        status: s.status || 'present'
      }))
      await onSave(records)
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false)
    }
  }

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
          { label: 'Total Enrolled', val: stats.total, color: 'text-foreground' },
          { label: 'Present Today', val: stats.present, color: 'text-primary' },
          { label: 'Absent Today', val: stats.absent, color: 'text-accent' },
          { label: 'Late Arrivals', val: stats.late, color: 'text-warning' },
        ].map((card, i) => (
          <div key={i} className="bg-background border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{card.label}</span>
            <span className={cn('text-2xl font-black mt-1', card.color)}>{card.val}</span>
          </div>
        ))}
      </div>

      {viewMode === 'daily' ? (
        <>
          {/* Daily list / grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredStudents.map(student => {
              const status = student.status || 'present'
              return (
                <div key={student.id} className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-black">
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{student.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Status: <span className="font-semibold uppercase">{status}</span></p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {(['present', 'absent', 'late'] as const).map(s => {
                      const cfg = statusConfig[s]
                      const isActive = status === s
                      const Icon = cfg.icon
                      return (
                        <button
                          key={s}
                          disabled={isReadOnly}
                          onClick={() => markStatus(student.id, s)}
                          className={cn(
                            'w-9 h-9 rounded-xl flex items-center justify-center border transition-all',
                            isActive ? `${cfg.activeBg} ${cfg.activeText} border-transparent shadow-md scale-105` : `${cfg.bg} ${cfg.color} ${cfg.border} hover:bg-muted`
                          )}
                          title={cfg.label}
                        >
                          <Icon size={16} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <>
          {/* Mobile weekly list */}
          <div className="lg:hidden space-y-3">
            {filteredStudents.map(student => (
              <div key={student.id} className="bg-background border border-border rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <p className="text-xs font-bold text-foreground">{student.name}</p>
                </div>
                <div className="grid grid-cols-5 gap-2 pt-2 border-t border-border">
                  {days.map(day => {
                    const status = student.history?.[day] ?? null
                    const cfg = weekDayStatusConfig[status as keyof typeof weekDayStatusConfig] ?? weekDayStatusConfig.null
                    return (
                      <div key={day} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{day}</span>
                        <div className={cn('w-7 h-7 flex items-center justify-center rounded-lg text-[9px] font-black border', cfg.bg, cfg.color, cfg.border)}>
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
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={16} /> {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      )}
    </div>
  )
}
