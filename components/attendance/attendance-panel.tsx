'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface StudentAttendance {
  id: string
  name: string
  status: 'present' | 'absent' | 'late' | null
}

interface AttendancePanelProps {
  students?: StudentAttendance[]
}

const statusConfig = {
  present: {
    label: 'Present',
    icon: CheckCircle2,
    bgColor: 'bg-success/10',
    textColor: 'text-success',
    borderColor: 'border-success/30',
  },
  absent: {
    label: 'Absent',
    icon: XCircle,
    bgColor: 'bg-danger/10',
    textColor: 'text-danger',
    borderColor: 'border-danger/30',
  },
  late: {
    label: 'Late',
    icon: Clock,
    bgColor: 'bg-warning/10',
    textColor: 'text-warning',
    borderColor: 'border-warning/30',
  },
  null: {
    label: 'Not Marked',
    icon: null,
    bgColor: 'bg-muted',
    textColor: 'text-muted-foreground',
    borderColor: 'border-border',
  },
}

export function AttendancePanel({
  students: initialStudents = [],
}: AttendancePanelProps) {
  const [students, setStudents] = useState<StudentAttendance[]>(
    initialStudents.length > 0
      ? initialStudents
      : [
          { id: '1', name: 'Ahmed Hassan', status: null },
          { id: '2', name: 'Fatima Khan', status: null },
          { id: '3', name: 'Muhammad Ali', status: null },
          { id: '4', name: 'Zainab Ahmed', status: null },
          { id: '5', name: 'Hassan Ibrahim', status: null },
          { id: '6', name: 'Aisha Mohammed', status: null },
          { id: '7', name: 'Omar Ahmed', status: null },
          { id: '8', name: 'Layla Hassan', status: null },
          { id: '9', name: 'Ibrahim Khan', status: null },
          { id: '10', name: 'Noor Ali', status: null },
          { id: '11', name: 'Salim Hassan', status: null },
          { id: '12', name: 'Mariam Ahmed', status: null },
        ]
  )

  const markStatus = (id: string, status: 'present' | 'absent' | 'late') => {
    setStudents(
      students.map((s) =>
        s.id === id ? { ...s, status } : s
      )
    )
  }

  const markAllPresent = () => {
    setStudents(students.map((s) => ({ ...s, status: 'present' })))
    toast.success('All students marked as present')
  }

  const markAllAbsent = () => {
    setStudents(students.map((s) => ({ ...s, status: 'absent' })))
    toast.success('All students marked as absent')
  }

  const handleSave = () => {
    toast.success('Attendance saved successfully')
  }

  const markedCount = students.filter((s) => s.status !== null).length

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        <div className="bg-success/10 border border-success/30 rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
            Present
          </p>
          <p className="text-2xl font-heading font-bold text-success">
            {students.filter((s) => s.status === 'present').length}
          </p>
        </div>
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
            Absent
          </p>
          <p className="text-2xl font-heading font-bold text-danger">
            {students.filter((s) => s.status === 'absent').length}
          </p>
        </div>
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
            Late
          </p>
          <p className="text-2xl font-heading font-bold text-warning">
            {students.filter((s) => s.status === 'late').length}
          </p>
        </div>
        <div className="bg-muted border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
            Marked
          </p>
          <p className="text-2xl font-heading font-bold text-foreground">
            {markedCount}/{students.length}
          </p>
        </div>
      </div>

      {/* Attendance Grid */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {students.map((student) => {
              const config = statusConfig[student.status || 'null']
              const Icon = config.icon

              return (
                <div
                  key={student.id}
                  className={cn(
                    'border-2 rounded-lg p-4 transition-all',
                    config.borderColor,
                    config.bgColor
                  )}
                >
                  <p className="font-medium text-foreground mb-3 text-sm">
                    {student.name}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => markStatus(student.id, 'present')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-md text-sm font-medium transition-all',
                        student.status === 'present'
                          ? 'bg-success text-success-foreground'
                          : 'bg-success/10 text-success hover:bg-success/20'
                      )}
                      title="Mark as present"
                    >
                      <CheckCircle2 size={16} />
                      <span className="hidden sm:inline">P</span>
                    </button>
                    <button
                      onClick={() => markStatus(student.id, 'late')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-md text-sm font-medium transition-all',
                        student.status === 'late'
                          ? 'bg-warning text-warning-foreground'
                          : 'bg-warning/10 text-warning hover:bg-warning/20'
                      )}
                      title="Mark as late"
                    >
                      <Clock size={16} />
                      <span className="hidden sm:inline">L</span>
                    </button>
                    <button
                      onClick={() => markStatus(student.id, 'absent')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-md text-sm font-medium transition-all',
                        student.status === 'absent'
                          ? 'bg-danger text-danger-foreground'
                          : 'bg-danger/10 text-danger hover:bg-danger/20'
                      )}
                      title="Mark as absent"
                    >
                      <XCircle size={16} />
                      <span className="hidden sm:inline">A</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={markAllPresent}
          className="flex-1 px-4 py-2.5 bg-success text-success-foreground rounded-lg font-semibold hover:bg-success/90 transition-colors text-sm"
        >
          Mark All Present
        </button>
        <button
          onClick={markAllAbsent}
          className="flex-1 px-4 py-2.5 bg-danger text-danger-foreground rounded-lg font-semibold hover:bg-danger/90 transition-colors text-sm"
        >
          Mark All Absent
        </button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Save Attendance
        </button>
      </div>
    </div>
  )
}
