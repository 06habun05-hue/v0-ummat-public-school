'use client'

import { useState } from 'react'
import { AssessmentTable } from '@/components/assessment/assessment-table'
import { ChevronDown } from 'lucide-react'

export default function AssessmentPage() {
  const [filters, setFilters] = useState({
    branch: 'Main Campus',
    class: '10-A',
    subject: 'English',
    chapter: 'Chapter 1',
    slo: 'SLO-001',
  })

  const branches = ['Main Campus', 'North Campus', 'South Campus']
  const classes: Record<string, string[]> = {
    'Main Campus': ['10-A', '10-B', '9-A', '9-B', '8-A'],
    'North Campus': ['10-A', '10-B', '7-A', '7-B'],
    'South Campus': ['10-A', '9-A', '8-A', '8-B'],
  }
  const subjects = ['English', 'Mathematics', 'Science', 'Social Studies', 'Islamic Studies']
  const chapters = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4']
  const slos = ['SLO-001', 'SLO-002', 'SLO-003', 'SLO-004']

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Assessment Matrix
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Evaluate and grade student performance across learning outcomes
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-background border border-border rounded-lg p-6 sticky top-20 z-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

          {/* Chapter */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 uppercase">
              Chapter
            </label>
            <select
              value={filters.chapter}
              onChange={(e) => setFilters({ ...filters, chapter: e.target.value })}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm"
            >
              {chapters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* SLO */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 uppercase">
              SLO
            </label>
            <select
              value={filters.slo}
              onChange={(e) => setFilters({ ...filters, slo: e.target.value })}
              className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm"
            >
              {slos.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assessment Table */}
      <AssessmentTable />

      {/* Info Box */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          <strong>Tip:</strong> Double-click any cell to edit the grade. Use grades 1-4 scale. Required fields are highlighted in yellow.
        </p>
      </div>
    </div>
  )
}
