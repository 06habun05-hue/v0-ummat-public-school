'use client'

import { useState } from 'react'
import { Calendar, BookOpen, CheckCircle2, Clock, AlertTriangle, Search, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAssessmentStore } from '@/lib/store/assessment-store'
import { mockSLOs } from '@/lib/data/curriculum'

const methodColors: Record<string, string> = {
  'MCQs':      'bg-blue-100 text-blue-700 border-blue-200',
  'Writing':   'bg-purple-100 text-purple-700 border-purple-200',
  'Oral':      'bg-amber-100 text-amber-700 border-amber-200',
  'Practical': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Project':   'bg-rose-100 text-rose-700 border-rose-200',
}

const teachingColors: Record<string, string> = {
  'Lecture':            'bg-slate-100 text-slate-700 border-slate-200',
  'Group Activity':     'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Direct Instruction': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Research':           'bg-orange-100 text-orange-700 border-orange-200',
}

const statusConfig: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  'Completed':        { icon: CheckCircle2,  color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  'Pending':          { icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200'   },
  'Re-test Scheduled':{ icon: AlertTriangle, color: 'text-rose-600',    bg: 'bg-rose-50',     border: 'border-rose-200'    },
}

export function AssessmentLog() {
  const { assessmentEvents, sloList } = useAssessmentStore()
  const [search, setSearch]           = useState('')
  const [filterClass, setFilterClass] = useState('All')

  // Combine store SLOs with mockSLOs for lookup
  const allSLOs = [...sloList, ...mockSLOs.filter(m => !sloList.some(s => s.id === m.id))]
  const classes = ['All', ...Array.from(new Set(assessmentEvents.map(e => e.class)))]

  const filtered = assessmentEvents.filter(event => {
    const slo = allSLOs.find(s => s.id === event.sloId)
    const matchesSearch =
      event.sloId.toLowerCase().includes(search.toLowerCase()) ||
      slo?.description.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (filterClass === 'All' || event.class === filterClass)
  })

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-background/50 backdrop-blur-sm border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            placeholder="Search SLO or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground flex-shrink-0" />
          <select
            value={filterClass}
            onChange={e => setFilterClass(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            {classes.map(c => <option key={c} value={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>)}
          </select>
        </div>
      </div>

      {/* ── MOBILE TIMELINE CARDS (hidden lg+) ── */}
      <div className="lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-muted-foreground">
            <BookOpen size={32} className="mb-3 opacity-30" />
            <p className="text-sm font-bold">No assessment records found</p>
          </div>
        ) : filtered.map(event => {
          const slo = allSLOs.find(s => s.id === event.sloId)
          const status = statusConfig[event.status] ?? statusConfig['Pending']
          const StatusIcon = status.icon
          return (
            <div key={event.id} className="bg-background border border-border rounded-2xl p-4 shadow-sm space-y-3">
              {/* Top row: SLO + Status badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-black text-primary uppercase tracking-wider">{event.sloId}</span>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-2">{slo?.description}</p>
                </div>
                <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider flex-shrink-0', status.bg, status.color, status.border)}>
                  <StatusIcon size={10} />
                  {event.status === 'Re-test Scheduled' ? 'Re-test' : event.status}
                </div>
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/50">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Class</span>
                  <span className="text-xs font-black text-foreground">{event.class}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Date</span>
                  <span className="text-xs font-bold text-foreground">
                    {new Date(event.testDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Method</span>
                  <span className={cn('text-[9px] font-black px-1.5 py-0.5 rounded-full border w-fit', methodColors[event.testMethod])}>
                    {event.testMethod}
                  </span>
                </div>
              </div>

              {/* Teaching method */}
              <div className="flex items-center gap-2">
                <BookOpen size={12} className="text-muted-foreground flex-shrink-0" />
                <span className={cn('text-[9px] font-black px-2 py-0.5 rounded-full border', teachingColors[event.teachingMethod])}>
                  {event.teachingMethod}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── DESKTOP TABLE (hidden on mobile) ── */}
      <div className="hidden lg:block border border-border rounded-2xl overflow-hidden shadow-xl bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {['SLO Details', 'Class', 'Test Date', 'Assessment Method', 'Teaching Method', 'Status'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(event => {
                const slo = allSLOs.find(s => s.id === event.sloId)
                const status = statusConfig[event.status] ?? statusConfig['Pending']
                const StatusIcon = status.icon
                return (
                  <tr key={event.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-primary text-xs">{event.sloId}</span>
                        <span className="text-[11px] text-muted-foreground line-clamp-1 group-hover:line-clamp-none transition-all duration-300">{slo?.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">Class {event.class}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Calendar size={13} className="text-primary/60" />
                        {new Date(event.testDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider shadow-sm', methodColors[event.testMethod])}>
                        {event.testMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen size={13} className="text-muted-foreground" />
                        <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider', teachingColors[event.teachingMethod])}>
                          {event.teachingMethod}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full border w-fit text-[10px] font-black uppercase tracking-wide', status.bg, status.color, status.border)}>
                        <StatusIcon size={13} />
                        {event.status}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    No assessment records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <BookOpen size={18} className="text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-black text-primary uppercase tracking-wider">Curriculum Audit Insights</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            This log tracks the life cycle of each Student Learning Outcome — ensuring every mapped SLO is formally assessed using diverse methods to guarantee comprehensive student mastery.
          </p>
        </div>
      </div>
    </div>
  )
}
