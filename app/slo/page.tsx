'use client'

import { useState } from 'react'
import { Search, Plus, CheckSquare, Square, BookOpen, ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { mockSLOs, subjects as curriculumSubjects, chapters as curriculumChapters } from '@/lib/data/curriculum'


const subjects = ['All', ...curriculumSubjects]
const chapters = ['All', ...curriculumChapters]

// Curriculum Map data: chapters x subjects, which SLOs are mapped
const curriculumMap = [
  { chapter: 'Chapter 1', English: 'SLO-001', Mathematics: null, Science: null, 'Islamic Studies': 'SLO-004', 'Social Studies': 'SLO-008' },
  { chapter: 'Chapter 2', English: 'SLO-005', Mathematics: null, Science: 'SLO-003', 'Islamic Studies': null, 'Social Studies': null },
  { chapter: 'Chapter 3', English: null, Mathematics: 'SLO-002', Science: 'SLO-007', 'Islamic Studies': null, 'Social Studies': null },
  { chapter: 'Chapter 4', English: null, Mathematics: 'SLO-006', Science: null, 'Islamic Studies': null, 'Social Studies': null },
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
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-foreground tracking-tight">SLO & Curriculum Mapping</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage learning outcomes and curriculum alignment</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Plus size={15} /> Add SLO
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[['registry', 'SLO Registry'], ['map', 'Curriculum Map']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key as 'registry' | 'map')} className={cn('px-6 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 -mb-px', activeTab === key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {label}
          </button>
        ))}
      </div>


      {activeTab === 'registry' && (
        <>
          <div className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search SLO..."
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </div>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(s => <SelectItem key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={chapterFilter} onValueChange={setChapterFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Chapter" />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map(c => <SelectItem key={c} value={c}>{c === 'All' ? 'All Chapters' : c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  {['SLO Code', 'Description', 'Subject', 'Chapter', 'NCP Alignment', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((slo, i) => (
                  <tr key={slo.id} className={cn('hover:bg-muted/50 transition-colors', i % 2 === 1 && 'bg-muted/20')}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{slo.id}</td>
                    <td className="px-4 py-3 text-xs text-foreground max-w-xs">{slo.description}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{slo.subject}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{slo.chapter}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{slo.ncp}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', slo.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                        {slo.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'map' && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky left-0 bg-muted z-10">Chapter</th>
                  {mapSubjects.map(s => (
                    <th key={s} className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {curriculumMap.map((row, i) => (
                  <tr key={row.chapter} className={cn('hover:bg-muted/50 transition-colors', i % 2 === 1 && 'bg-muted/20')}>
                    <td className="px-4 py-4 font-semibold text-xs sticky left-0 bg-background z-10 border-r border-border">{row.chapter}</td>
                    {mapSubjects.map(sub => {
                      const val = row[sub as keyof typeof row]
                      return (
                        <td key={sub} className="px-4 py-4 text-center">
                          {val ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-3 h-3 rounded-full bg-primary" />
                              <span className="text-[10px] font-mono text-primary">{val}</span>
                            </div>
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-border mx-auto" />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary inline-block" /> Mapped SLO</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-border inline-block" /> Not Mapped</span>
          </div>
        </div>
      )}


      {/* Add SLO Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-background border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-foreground">Add New SLO</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded-md"><X size={16} /></button>
            </div>
            {[
              ['SLO Code', 'e.g. SLO-009'],
              ['Description', 'Describe the learning outcome...'],
              ['NCP Alignment', 'e.g. NCP-LIT-03'],
              ['NCP Description', 'Detailed NCP alignment details...']
            ].map(([label, placeholder]) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-foreground mb-1.5">{label}</label>
                {label.includes('Description') ? (
                  <textarea rows={label === 'Description' ? 3 : 2} placeholder={placeholder} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                ) : (
                  <input placeholder={placeholder} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                )}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Subject</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm">{subjects.slice(1).map(s => <option key={s}>{s}</option>)}</select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Chapter</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm">{chapters.slice(1).map(c => <option key={c}>{c}</option>)}</select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors">Save SLO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
