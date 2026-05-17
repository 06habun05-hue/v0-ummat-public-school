'use client'

import { useState, useMemo } from 'react'
import { AssessmentTable } from '@/components/assessment/assessment-table'
import { getSLOsByChapter, subjects as curriculumSubjects, chapters as curriculumChapters } from '@/lib/data/curriculum'
import { 
  Trophy, BookOpen, Filter, MapPin, 
  ChevronRight, Sparkles, LayoutGrid, List
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function AssessmentPage() {
  const [filters, setFilters] = useState({
    branch: 'Main Campus',
    class: '10-A',
    subject: 'English',
    chapter: 'Chapter 1',
  })

  const branches = ['Main Campus', 'North Campus', 'South Campus']
  const classes: Record<string, string[]> = {
    'Main Campus': ['10-A', '10-B', '9-A', '9-B', '8-A'],
    'North Campus': ['10-A', '10-B', '7-A', '7-B'],
    'South Campus': ['10-A', '9-A', '8-A', '8-B'],
  }

  const activeSLOs = useMemo(() => {
    return getSLOsByChapter(filters.subject, filters.chapter)
  }, [filters.subject, filters.chapter])

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight">
            Student Assessments
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            Record grades and track student learning outcomes
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-border bg-background hover:bg-primary hover:text-white transition-all text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm">
            Export
          </Button>
          <Button className="flex-1 sm:flex-none h-10 sm:h-12 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-primary text-white text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">
            Save Grades
          </Button>
        </motion.div>
      </div>

      {/* Control Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/50 backdrop-blur-md border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl sticky top-20 z-30"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Branch */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-muted-foreground mb-1 ml-1 uppercase tracking-widest">
              Campus
            </label>
            <Select
              value={filters.branch}
              onValueChange={(val) => {
                setFilters({
                  ...filters,
                  branch: val,
                  class: classes[val]?.[0] || '',
                })
              }}
            >
              <SelectTrigger className="h-11 sm:h-12 rounded-xl sm:rounded-2xl border-border bg-background shadow-inner">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <SelectValue placeholder="Branch" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-muted-foreground mb-1 ml-1 uppercase tracking-widest">
              Grade Level
            </label>
            <Select
              value={filters.class}
              onValueChange={(val) => setFilters({ ...filters, class: val })}
            >
              <SelectTrigger className="h-11 sm:h-12 rounded-xl sm:rounded-2xl border-border bg-background shadow-inner">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-primary" />
                  <SelectValue placeholder="Class" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {(classes[filters.branch] || []).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-muted-foreground mb-1 ml-1 uppercase tracking-widest">
              Subject
            </label>
            <Select
              value={filters.subject}
              onValueChange={(val) => setFilters({ ...filters, subject: val })}
            >
              <SelectTrigger className="h-11 sm:h-12 rounded-xl sm:rounded-2xl border-border bg-background shadow-inner">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-primary" />
                  <SelectValue placeholder="Subject" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {curriculumSubjects.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chapter */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-muted-foreground mb-1 ml-1 uppercase tracking-widest">
              Chapter
            </label>
            <Select
              value={filters.chapter}
              onValueChange={(val) => setFilters({ ...filters, chapter: val })}
            >
              <SelectTrigger className="h-11 sm:h-12 rounded-xl sm:rounded-2xl border-border bg-background shadow-inner">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={14} className="text-primary" />
                  <SelectValue placeholder="Chapter" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {curriculumChapters.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dynamic Context Bar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-4 bg-primary/5 border border-primary/10 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Unlocked</span>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
              {filters.class} <ChevronRight size={10} className="inline mx-1" /> {filters.subject}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Auto-Saving Enabled</span>
          </div>
        </div>
      </motion.div>

      {/* Assessment Matrix Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10"
      >
        <AssessmentTable slos={activeSLOs} />
      </motion.div>

      {/* Info Box */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-primary/5 border border-primary/20 rounded-3xl p-6"
      >
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={20} />
           </div>
            <div>
               <p className="text-sm font-black text-foreground uppercase tracking-wider">Quick Entry Tips</p>
               <p className="text-xs text-muted-foreground font-medium">Select a cell and use your keyboard (1-4) for rapid entry. Bulk pasting from external spreadsheets is supported.</p>
            </div>
        </div>
      </motion.div>
    </div>
  )
}
