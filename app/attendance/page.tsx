'use client'

import { useState } from 'react'
import { AttendancePanel } from '@/components/attendance/attendance-panel'
import { Calendar } from 'lucide-react'

export default function AttendancePage() {
  const [filters, setFilters] = useState({
    branch: 'Main Campus',
    class: '10-A',
    subject: 'English',
    date: new Date().toISOString().split('T')[0],
  })

  const [viewMode, setViewMode] = useState<'date' | 'week'>('date')

  const branches = ['Main Campus', 'North Campus', 'South Campus']
  const classes: Record<string, string[]> = {
    'Main Campus': ['10-A', '10-B', '9-A', '9-B', '8-A'],
    'North Campus': ['10-A', '10-B', '7-A', '7-B'],
    'South Campus': ['10-A', '9-A', '8-A', '8-B'],
  }
  const subjects = ['English', 'Mathematics', 'Science', 'Social Studies', 'Islamic Studies']

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Attendance Management
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Mark and track student attendance for classes
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-background border border-border rounded-lg p-6 sticky top-20 z-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Branch */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 uppercase">
              Branch
            </label>
            <select
              value={filters.branch}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  branch: e.target.value,
                  class: classes[e.target.value]?.[0] || '',
                })
              }}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 uppercase">
              Class
            </label>
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm"
            >
              {(classes[filters.branch] || []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 uppercase">
              Subject
            </label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 uppercase">
              Date
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('date')}
              className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'date'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        {/* Info Message */}
        <p className="text-xs text-muted-foreground">
          Filtering by <span className="font-semibold">{filters.branch}</span> • <span className="font-semibold">{filters.class}</span> • <span className="font-semibold">{filters.subject}</span>
        </p>
      </div>

      {/* Attendance Panel */}
      <AttendancePanel />
    </div>
  )
}
