'use client'

import { useState } from 'react'
import { Search, Plus, BookOpen, ChevronDown, ChevronUp, X, Filter, Target, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { mockSLOs, subjects as curriculumSubjects, chapters as curriculumChapters } from '@/lib/data/curriculum'
import { AssessmentLog } from '@/components/slo/assessment-log'

const subjects = ['All', ...curriculumSubjects]
const chapters = ['All', ...curriculumChapters]

// Curriculum Map data: chapters x subjects, which SLOs are mapped
const curriculumMap = [
  { chapter: 'Chapter 1', English: 'SLO-001', Mathematics: 'SLO-019', Science: 'SLO-052', 'Islamic Studies': 'SLO-087', 'Social Studies': 'SLO-095' },
  { chapter: 'Chapter 2', English: 'SLO-013', Mathematics: 'SLO-034', Science: 'SLO-072', 'Islamic Studies': null, 'Social Studies': null },
  { chapter: 'Chapter 3', English: null, Mathematics: 'SLO-042', Science: 'SLO-082', 'Islamic Studies': null, 'Social Studies': null },
  { chapter: 'Chapter 4', English: null, Mathematics: 'SLO-047', Science: null, 'Islamic Studies': null, 'Social Studies': null },
]
const mapSubjects = curriculumSubjects

export default function SLOPage() {
  const [activeTab, setActiveTab] = useState<'registry' | 'map'>('registry')
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [chapterFilter, setChapterFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)

  const filtered = mockSLOs.filter(s =>
    (search === '' || s.id.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())) &&
    (subjectFilter === 'All' || s.subject === subjectFilter) &&
    (chapterFilter === 'All' || s.chapter === chapterFilter)
  )

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight">Curriculum Intelligence</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Orchestrate learning outcomes and architectural mapping</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto h-12 px-8 bg-primary text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
            <Plus size={18} className="mr-2" /> Provision SLO
          </Button>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          ['registry', 'SLO Registry'],
          ['map', 'Curriculum Map'],
        ].map(([key, label]) => (
          <button 
            key={key} 
            onClick={() => setActiveTab(key as any)} 
            className={cn(
              'px-6 sm:px-8 py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border-b-2 -mb-px whitespace-nowrap', 
              activeTab === key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'registry' && (
            <div className="space-y-6">
              <div className="bg-background/50 backdrop-blur-md border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative lg:col-span-2">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search infrastructure..."
                      className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl sm:rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                    />
                  </div>

                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="h-12 rounded-xl sm:rounded-2xl border-border bg-background shadow-inner">
                      <div className="flex items-center gap-2">
                        <Filter size={14} className="text-primary" />
                        <SelectValue placeholder="Subject" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(s => <SelectItem key={s} value={s}>{s === 'All' ? 'Global Subjects' : s}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={chapterFilter} onValueChange={setChapterFilter}>
                    <SelectTrigger className="h-12 rounded-xl sm:rounded-2xl border-border bg-background shadow-inner">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-primary" />
                        <SelectValue placeholder="Chapter" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map(c => <SelectItem key={c} value={c}>{c === 'All' ? 'All Chapters' : c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* SLO List: Desktop Table */}
              <div className="hidden lg:block border border-border rounded-3xl overflow-hidden shadow-2xl bg-background">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        {['Outcome Code', 'Objective Description', 'Subject', 'Curriculum Unit', 'NCP Alignment', 'Status'].map(h => (
                          <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((slo) => (
                        <tr key={slo.id} className="group hover:bg-primary/[0.02] transition-colors">
                          <td className="px-6 py-5 font-mono text-xs font-black text-primary uppercase tracking-tighter">{slo.id}</td>
                          <td className="px-6 py-5">
                             <div className="max-w-md">
                               <span className="text-sm font-bold text-foreground leading-snug">{slo.description}</span>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <Badge variant="secondary" className="bg-muted text-foreground border-border text-[10px] font-black uppercase tracking-widest px-3 py-1">
                               {slo.subject}
                             </Badge>
                          </td>
                          <td className="px-6 py-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">{slo.chapter}</td>
                          <td className="px-6 py-5 font-mono text-[10px] font-black text-muted-foreground/60">{slo.ncp}</td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-primary">Active</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SLO List: Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filtered.map((slo) => (
                  <div key={slo.id} className="bg-background border border-border rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-primary uppercase tracking-tighter">{slo.id}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">Active</span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-bold text-foreground leading-relaxed">{slo.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Subject</p>
                        <Badge variant="secondary" className="bg-muted text-foreground border-border text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                          {slo.subject}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">NCP Alignment</p>
                        <p className="text-[10px] font-mono font-bold text-muted-foreground">{slo.ncp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="border border-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-background relative">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      <th className="px-4 sm:px-6 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest sticky left-0 bg-muted z-20 border-r border-border min-w-[120px]">Archetype</th>
                      {mapSubjects.map(s => (
                        <th key={s} className="px-6 py-5 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap min-w-[140px]">{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {curriculumMap.map((row) => (
                      <tr key={row.chapter} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-4 sm:px-6 py-6 font-black text-[10px] sm:text-xs sticky left-0 bg-background z-10 border-r border-border group-hover:bg-primary/[0.02] transition-colors shadow-[2px_0_5px_rgba(0,0,0,0.05)] sm:shadow-none">{row.chapter}</td>
                        {mapSubjects.map(sub => {
                          const val = row[sub as keyof typeof row]
                          return (
                            <td key={sub} className="px-6 py-6 text-center">
                              {val ? (
                                <motion.div 
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="flex flex-col items-center gap-2 group/node"
                                >
                                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10 group-hover/node:ring-primary/30 transition-all" />
                                  <span className="text-[9px] sm:text-[10px] font-black font-mono text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">{val}</span>
                                </motion.div>
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-border/40 mx-auto" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 sm:px-6 py-4 border-t border-border bg-muted/30 flex items-center gap-4 sm:gap-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary shadow-sm" /> Mapped</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-border/40" /> Vacant</span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add SLO Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setShowModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 100 }}
              className="relative bg-background border-t sm:border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
               <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-foreground uppercase tracking-widest">Provision SLO</h3>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Curriculum Architectural Node</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-xl transition-colors"><X size={20} /></button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-hide">
                <div>
                  <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">SLO Code</label>
                  <input placeholder="e.g. SLO-105" className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-inner" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">Subject</label>
                    <Select>
                      <SelectTrigger className="w-full h-11 rounded-xl sm:rounded-2xl shadow-inner bg-background border-border text-sm font-medium">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {curriculumSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">Chapter Name</label>
                    <input placeholder="e.g. Chapter 1: Poetry" className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-inner" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">SLO Description</label>
                  <textarea rows={3} placeholder="Describe the outcome to be learned by students..." className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none shadow-inner" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">NCP Alignment Code</label>
                    <input placeholder="e.g. NCP-ENG-105" className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-inner" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">NCP Alignment Description</label>
                    <input placeholder="e.g. Grade 10 Language alignment" className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-inner" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 pb-4 sm:pb-0">
                <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest">Abort</Button>
                <Button onClick={() => setShowModal(false)} className="flex-1 h-12 bg-primary text-white rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90">Commit Node</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
