'use client'

import { useState } from 'react'
import { Calendar, BookOpen, CheckCircle2, Clock, AlertTriangle, Search, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockSLOEvents, mockSLOs, SLOAssessmentEvent } from '@/lib/data/curriculum'

const methodColors: Record<string, string> = {
  'MCQs': 'bg-blue-100 text-blue-700 border-blue-200',
  'Writing': 'bg-purple-100 text-purple-700 border-purple-200',
  'Oral': 'bg-amber-100 text-amber-700 border-amber-200',
  'Practical': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Project': 'bg-rose-100 text-rose-700 border-rose-200',
}

const teachingColors: Record<string, string> = {
  'Lecture': 'bg-slate-100 text-slate-700 border-slate-200',
  'Group Activity': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Direct Instruction': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Research': 'bg-orange-100 text-orange-700 border-orange-200',
}

const statusIcons: Record<string, any> = {
  'Completed': { icon: CheckCircle2, color: 'text-emerald-500' },
  'Pending': { icon: Clock, color: 'text-amber-500' },
  'Re-test Scheduled': { icon: AlertTriangle, color: 'text-rose-500' },
}

export function AssessmentLog() {
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('All')

  const classes = ['All', ...Array.from(new Set(mockSLOEvents.map(e => e.class)))]

  const filteredEvents = mockSLOEvents.filter(event => {
    const slo = mockSLOs.find(s => s.id === event.sloId)
    const matchesSearch = 
      event.sloId.toLowerCase().includes(search.toLowerCase()) ||
      slo?.description.toLowerCase().includes(search.toLowerCase())
    const matchesClass = filterClass === 'All' || event.class === filterClass
    return matchesSearch && matchesClass
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-background/50 backdrop-blur-sm border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search SLO or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={16} className="text-muted-foreground" />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            {classes.map(c => <option key={c} value={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-2xl overflow-hidden shadow-xl bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">SLO Details</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Class</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Test Date</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assessment Method</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Teaching Method</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEvents.map((event) => {
                const slo = mockSLOs.find(s => s.id === event.sloId)
                const StatusIcon = statusIcons[event.status].icon
                
                return (
                  <tr key={event.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-primary text-xs">{event.sloId}</span>
                        <span className="text-[11px] text-muted-foreground line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                          {slo?.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground">Class {event.class}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Calendar size={14} className="text-primary/60" />
                        {new Date(event.testDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider shadow-sm",
                        methodColors[event.testMethod]
                      )}>
                        {event.testMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-muted-foreground" />
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider",
                          teachingColors[event.teachingMethod]
                        )}>
                          {event.teachingMethod}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon size={16} className={statusIcons[event.status].color} />
                        <span className="text-[10px] font-bold uppercase tracking-wide text-foreground">
                          {event.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
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
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <BookOpen size={20} className="text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-black text-primary uppercase tracking-wider">Curriculum Audit Insights</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            This log tracks the "Life Cycle" of each Student Learning Outcome. It ensures that every mapped SLO is not only taught but also formally assessed using diverse methods to guarantee comprehensive student mastery.
          </p>
        </div>
      </div>
    </div>
  )
}
