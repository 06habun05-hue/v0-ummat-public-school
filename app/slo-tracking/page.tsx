'use client'

import { AssessmentLog } from '@/components/slo/assessment-log'
import { ScrollText } from 'lucide-react'

export default function SLOTrackingPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ScrollText size={20} className="text-primary" />
            <h2 className="text-2xl font-heading font-black text-foreground tracking-tight">
              SLO Assessment Tracking
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Audit and monitor the assessment life cycle of all Student Learning Outcomes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-background border border-border rounded-xl shadow-sm text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Curriculum Coverage
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AssessmentLog />

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">Goal Alignment</h4>
          <p className="text-xs text-foreground font-medium leading-relaxed">
            Ensures that every instructional unit is verified against the National Curriculum Priorities (NCP).
          </p>
        </div>
        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">Assessment Quality</h4>
          <p className="text-xs text-foreground font-medium leading-relaxed">
            Tracks diversified testing methods like Oral, Practical, and Projects to ensure balanced evaluation.
          </p>
        </div>
        <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">Teaching Audit</h4>
          <p className="text-xs text-foreground font-medium leading-relaxed">
            Monitors the pedagogical strategies used for each SLO to maintain high academic standards.
          </p>
        </div>
      </div>
    </div>
  )
}
