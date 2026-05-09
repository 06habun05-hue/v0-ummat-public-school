'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, XCircle, Clock, Search, Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface StudentAttendance {
  id: string
  name: string
  status: 'present' | 'absent' | 'late' | null
  history?: Record<string, 'present' | 'absent' | 'late' | null> // For week view
}

interface AttendancePanelProps {
  students?: StudentAttendance[]
}

const statusConfig = {
  present: { label: 'P', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', hover: 'hover:bg-primary/20' },
  absent: { label: 'A', icon: XCircle, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', hover: 'hover:bg-accent/20' },
  late: { label: 'L', icon: Clock, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', hover: 'hover:bg-warning/20' },
  null: { label: '-', icon: null, color: 'text-muted-foreground', bg: 'bg-muted/50', border: 'border-border', hover: 'hover:bg-muted' },
}

export function AttendancePanel({ students: initialStudents = [] }: AttendancePanelProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily')
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState<StudentAttendance[]>(
    initialStudents.length > 0 ? initialStudents : [
      { id: '1', name: 'Ahmed Hassan', status: null, history: { 'Mon': 'present', 'Tue': 'present', 'Wed': 'late', 'Thu': 'present', 'Fri': null } },
      { id: '2', name: 'Fatima Khan', status: null, history: { 'Mon': 'present', 'Tue': 'present', 'Wed': 'present', 'Thu': 'present', 'Fri': null } },
      { id: '3', name: 'Muhammad Ali', status: null, history: { 'Mon': 'absent', 'Tue': 'present', 'Wed': 'present', 'Thu': 'absent', 'Fri': null } },
      { id: '4', name: 'Zainab Ahmed', status: null, history: { 'Mon': 'present', 'Tue': 'late', 'Wed': 'present', 'Thu': 'present', 'Fri': null } },
      { id: '5', name: 'Hassan Ibrahim', status: null, history: { 'Mon': 'present', 'Tue': 'present', 'Wed': 'present', 'Thu': 'present', 'Fri': null } },
      { id: '6', name: 'Aisha Mohammed', status: null, history: { 'Mon': 'present', 'Tue': 'present', 'Wed': 'present', 'Thu': 'present', 'Fri': null } },
      { id: '7', name: 'Omar Ahmed', status: null, history: { 'Mon': 'late', 'Tue': 'present', 'Wed': 'present', 'Thu': 'present', 'Fri': null } },
      { id: '8', name: 'Layla Hassan', status: null, history: { 'Mon': 'present', 'Tue': 'present', 'Wed': 'present', 'Thu': 'present', 'Fri': null } },
    ]
  )

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  const filteredStudents = useMemo(() => {
    return students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [students, searchQuery])

  const markStatus = (id: string, status: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const markAll = (status: 'present' | 'absent') => {
    setStudents(prev => prev.map(s => ({ ...s, status })))
    toast.success(`All filtered students marked as ${status}`)
  }

  const stats = useMemo(() => {
    const present = students.filter(s => s.status === 'present').length
    const absent = students.filter(s => s.status === 'absent').length
    const late = students.filter(s => s.status === 'late').length
    const total = students.length
    return { present, absent, late, total, marked: present + absent + late }
  }, [students])

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-muted p-1 rounded-lg w-fit">
          <button 
            onClick={() => setViewMode('daily')}
            className={cn('px-4 py-1.5 text-xs font-semibold rounded-md transition-all', viewMode === 'daily' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
          >
            Daily View
          </button>
          <button 
            onClick={() => setViewMode('weekly')}
            className={cn('px-4 py-1.5 text-xs font-semibold rounded-md transition-all', viewMode === 'weekly' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
          >
            Weekly View
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={() => markAll('present')} className="flex-1 md:flex-none px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
            All Present
          </button>
          <button onClick={() => markAll('absent')} className="flex-1 md:flex-none px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg text-xs font-bold hover:bg-accent/20 transition-all">
            All Absent
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><CheckCircle2 size={20}/></div>
          <div><p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Present</p><p className="text-xl font-bold">{stats.present}</p></div>
        </div>
        <div className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent"><XCircle size={20}/></div>
          <div><p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Absent</p><p className="text-xl font-bold">{stats.absent}</p></div>
        </div>
        <div className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning"><Clock size={20}/></div>
          <div><p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Late</p><p className="text-xl font-bold">{stats.late}</p></div>
        </div>
        <div className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground"><Users size={20}/></div>
          <div><p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Marked</p><p className="text-xl font-bold">{stats.marked}/{stats.total}</p></div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="border border-border rounded-xl bg-background overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Student Name</th>
                {viewMode === 'daily' ? (
                  <th className="px-6 py-4 text-center font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Attendance Status</th>
                ) : (
                  days.map(day => (
                    <th key={day} className="px-4 py-4 text-center font-bold text-[10px] uppercase tracking-widest text-muted-foreground border-l border-border">{day}</th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">{student.name}</td>
                  {viewMode === 'daily' ? (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {(['present', 'late', 'absent'] as const).map(status => {
                          const config = statusConfig[status]
                          const isActive = student.status === status
                          return (
                            <button
                              key={status}
                              onClick={() => markStatus(student.id, status)}
                              className={cn(
                                'flex flex-col items-center gap-1 px-4 py-2 rounded-lg border transition-all min-w-[70px]',
                                isActive ? `${config.bg} ${config.color} ${config.border} ring-2 ring-primary/20` : `bg-background text-muted-foreground border-border ${config.hover} hover:text-foreground`
                              )}
                            >
                              <config.icon size={16} />
                              <span className="text-[10px] font-bold uppercase">{status}</span>
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  ) : (
                    days.map(day => {
                      const status = student.history?.[day] || null
                      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.null
                      return (
                        <td key={day} className="px-4 py-4 text-center border-l border-border">
                          <div className={cn(
                            'w-8 h-8 mx-auto flex items-center justify-center rounded-md text-[10px] font-black border',
                            config.bg, config.color, config.border
                          )}>
                            {config.label}
                          </div>
                        </td>
                      )
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button 
          onClick={() => toast.success('Attendance records saved successfully')}
          className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2"
        >
          <Check size={18}/> Save Attendance
        </button>
      </div>
    </div>
  )
}
