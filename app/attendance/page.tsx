'use client'

import { useState } from 'react'
import { AttendancePanel } from '@/components/attendance/attendance-panel'
import { Calendar as CalendarIcon, Filter, MapPin, BookOpen, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

export default function AttendancePage() {
  const [filters, setFilters] = useState({
    branch: 'Main Campus',
    class: '10-A',
    subject: 'English',
    date: new Date(),
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
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight">
            Student Attendance
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Record student attendance and class participation
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex bg-muted/50 p-1 rounded-xl sm:rounded-2xl border border-border">
            <button
              onClick={() => setViewMode('date')}
              className={cn(
                'px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all',
                viewMode === 'date' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Daily Attendance
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={cn(
                'px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all',
                viewMode === 'week' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Weekly Overview
            </button>
          </div>
        </motion.div>
      </div>

      {/* Filter Bar */}
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
              Grade
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
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-muted-foreground mb-1 ml-1 uppercase tracking-widest">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl border-border bg-background text-left font-medium shadow-inner",
                    !filters.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  <span className="truncate">{filters.date ? format(filters.date, "PPP") : <span>Pick a date</span>}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-border shadow-2xl" align="start">
                <Calendar
                  mode="single"
                  selected={filters.date}
                  onSelect={(date) => date && setFilters({ ...filters, date })}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Info Message */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-4 bg-primary/5 border border-primary/10 rounded-2xl">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Class: <span className="text-primary font-black ml-1">{filters.class}</span> • <span className="text-primary font-black">{filters.subject}</span>
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest">
            Syncing <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* Attendance Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AttendancePanel />
      </motion.div>
    </div>
  )
}
