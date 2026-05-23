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

import { mockSLOs, subjects as curriculumSubjects, chapters as curriculumChapters, SLO } from '@/lib/data/curriculum'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

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
  
  // Dynamic State integration
  const [sloList, setSloList] = useState<SLO[]>(mockSLOs)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  
  // Single SLO form state
  const [singleSlo, setSingleSlo] = useState({
    id: '',
    subject: 'English',
    chapter: 'Chapter 1',
    description: '',
    ncp: '',
    ncpDesc: ''
  })
  
  // Bulk import states
  const [bulkText, setBulkText] = useState('')
  const [parsedSLOs, setParsedSLOs] = useState<SLO[]>([])

  const filtered = sloList.filter(s =>
    (search === '' || s.id.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())) &&
    (subjectFilter === 'All' || s.subject === subjectFilter) &&
    (chapterFilter === 'All' || s.chapter === chapterFilter)
  )

  // Single SLO commit handler
  const handleCommitSingle = () => {
    if (!singleSlo.id.trim() || !singleSlo.description.trim()) {
      toast.error('Outcome Code and Description are required!')
      return
    }
    const newId = singleSlo.id.trim().toUpperCase()
    
    // Duplicate check
    if (sloList.some(s => s.id === newId)) {
      toast.error(`SLO Code ${newId} already exists in the curriculum database!`)
      return
    }

    const newEntry: SLO = {
      id: newId,
      description: singleSlo.description.trim(),
      subject: singleSlo.subject,
      chapter: singleSlo.chapter,
      ncp: singleSlo.ncp.trim() || 'NCP-GENERIC'
    }
    
    setSloList([newEntry, ...sloList])
    toast.success(`Successfully provisioned node ${newEntry.id}!`)
    setShowModal(false)
    setSingleSlo({ id: '', subject: 'English', chapter: 'Chapter 1', description: '', ncp: '', ncpDesc: '' })
  }

  // Smart Multi-Delimiter spreadsheet copy-paste parser
  const handleParseBulk = (text: string) => {
    if (!text.trim()) {
      setParsedSLOs([])
      return
    }
    const lines = text.split(/\r?\n/)
    const rows: SLO[] = []
    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return
      
      let cols: string[] = []
      
      // Delimiter detection
      if (trimmedLine.includes('\t')) {
        cols = trimmedLine.split('\t')
      } else if (trimmedLine.includes('|')) {
        cols = trimmedLine.split('|')
      } else if (/\s{2,}/.test(trimmedLine)) {
        cols = trimmedLine.split(/\s{2,}/)
      } else if (trimmedLine.includes(';')) {
        cols = trimmedLine.split(';')
      } else if (trimmedLine.includes(',')) {
        cols = trimmedLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      } else {
        // No explicit delimiter. Inspect for a leading code pattern (e.g. SLO-201, NCP-301)
        const codePatternMatch = trimmedLine.match(/^([A-Z0-9_-]{2,10}-\d+|SLO-?\d+|[A-Z]{2,4}[0-9]+)\s+(.+)$/i)
        if (codePatternMatch) {
          cols = [codePatternMatch[1], codePatternMatch[2]]
        } else {
          // Fallback: treat the entire line as the description and auto-generate code
          cols = ['', trimmedLine]
        }
      }
      
      if (cols[0] || cols[1]) {
        const generatedId = `SLO-${String(sloList.length + rows.length + 1).padStart(3, '0')}`
        const idVal = cols[0]?.trim() || generatedId
        rows.push({
          id: idVal.toUpperCase().replace(/^"|"$/g, ''),
          description: cols[1]?.trim().replace(/^"|"$/g, '') || 'Imported learning objective description',
          subject: cols[2]?.trim().replace(/^"|"$/g, '') || 'English',
          chapter: cols[3]?.trim().replace(/^"|"$/g, '') || 'Chapter 1',
          ncp: cols[4]?.trim().replace(/^"|"$/g, '') || 'NCP-GENERIC'
        })
      }
    })
    setParsedSLOs(rows)
  }

  // Drag and drop spreadsheet handlers
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) parseFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
  }

  const parseFile = (file: File) => {
    const fileName = file.name.toLowerCase()
    const isCSV = fileName.endsWith('.csv')
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls')

    if (!isCSV && !isExcel) {
      toast.error('Please upload a standard .csv, .xlsx, or .xls spreadsheet file!')
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        if (!sheet) {
          toast.error('No sheets found in the Excel workbook!')
          return
        }
        
        const jsonRows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 })
        if (jsonRows.length === 0) {
          toast.error('The uploaded spreadsheet file is empty!')
          return
        }

        // Smart Column Mapping: check first 5 rows to locate a header row
        let headerRowIndex = 0
        let headers: string[] = []
        
        for (let i = 0; i < Math.min(jsonRows.length, 5); i++) {
          const row = jsonRows[i]
          if (row && row.some(cell => typeof cell === 'string' && (cell.toLowerCase().includes('code') || cell.toLowerCase().includes('description') || cell.toLowerCase().includes('subject')))) {
            headers = row.map(cell => String(cell || '').trim().toLowerCase())
            headerRowIndex = i
            break
          }
        }

        // Fallback: assume column positions
        if (headers.length === 0) {
          headers = ['outcome code', 'objective description', 'subject', 'curriculum unit', 'ncp alignment']
          headerRowIndex = -1 // Start reading from first row directly
        }

        const colIndex = {
          id: headers.findIndex(h => h.includes('code') || h.includes('id') || h.includes('outcome')),
          description: headers.findIndex(h => h.includes('description') || h.includes('objective') || h.includes('slo')),
          subject: headers.findIndex(h => h.includes('subject') || h.includes('course')),
          chapter: headers.findIndex(h => h.includes('chapter') || h.includes('unit') || h.includes('curriculum')),
          ncp: headers.findIndex(h => h.includes('ncp') || h.includes('alignment'))
        }

        if (colIndex.id === -1) colIndex.id = 0
        if (colIndex.description === -1) colIndex.description = 1
        if (colIndex.subject === -1) colIndex.subject = 2
        if (colIndex.chapter === -1) colIndex.chapter = 3
        if (colIndex.ncp === -1) colIndex.ncp = 4

        const rows: SLO[] = []
        const startIndex = headerRowIndex + 1
        
        for (let i = startIndex; i < jsonRows.length; i++) {
          const row = jsonRows[i]
          if (!row || row.length === 0 || row.every(cell => cell === null || cell === undefined || cell === '')) {
            continue
          }

          const idValRaw = String(row[colIndex.id] || '').trim()
          const descVal = String(row[colIndex.description] || '').trim()
          
          if (!idValRaw && !descVal) continue

          const idVal = idValRaw || `SLO-${String(sloList.length + rows.length + 1).padStart(3, '0')}`

          rows.push({
            id: idVal.toUpperCase(),
            description: descVal || 'Imported curriculum outcomes',
            subject: String(row[colIndex.subject] || 'English').trim(),
            chapter: String(row[colIndex.chapter] || 'Chapter 1').trim(),
            ncp: String(row[colIndex.ncp] || 'NCP-GENERIC').trim()
          })
        }

        setParsedSLOs(rows)
        toast.success(`Successfully parsed ${rows.length} rows from ${isCSV ? 'CSV' : 'Excel'}!`)
      } catch (error) {
        console.error('Spreadsheet parsing error:', error)
        toast.error(`Failed to parse ${isCSV ? 'CSV' : 'Excel'} file.`)
      }
    }

    reader.readAsArrayBuffer(file)
  }

  // Commit imported rows to active database
  const handleCommitBulk = () => {
    if (parsedSLOs.length === 0) {
      toast.error('No rows found. Paste Excel data or drop a CSV file first!')
      return
    }
    
    // Filter duplicates
    const finalRows: SLO[] = []
    parsedSLOs.forEach(row => {
      if (sloList.some(s => s.id === row.id) || finalRows.some(s => s.id === row.id)) {
        // Resolve duplicate code on import
        row.id = `${row.id}-NEW`
      }
      finalRows.push(row)
    })

    setSloList([...finalRows, ...sloList])
    toast.success(`Successfully imported and committed ${finalRows.length} SLO records!`)
    setShowBulkModal(false)
    setBulkText('')
    setParsedSLOs([])
  }

  // Functional CSV exporter
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error('No curriculum entries match the active filters to export!')
      return
    }
    const headers = ['Outcome Code', 'Description', 'Subject', 'Curriculum Unit', 'NCP Alignment', 'Status']
    const csvRows = filtered.map(slo => [
      slo.id,
      `"${slo.description.replace(/"/g, '""')}"`,
      slo.subject,
      slo.chapter,
      slo.ncp,
      'Active'
    ])
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `SLO_Curriculum_${subjectFilter}_${chapterFilter}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Curriculum CSV file downloaded successfully!`)
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight">Curriculum Intelligence</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Orchestrate learning outcomes and architectural mapping</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button onClick={() => setShowBulkModal(true)} variant="outline" className="flex-1 sm:flex-none h-12 px-6 rounded-xl sm:rounded-2xl border-border bg-background hover:bg-muted text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm">
            <Globe size={16} className="mr-2 text-primary" /> Bulk Import
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="flex-1 sm:flex-none h-12 px-6 rounded-xl sm:rounded-2xl border-border bg-background hover:bg-muted text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm">
            Export CSV
          </Button>
          <Button onClick={() => setShowModal(true)} className="flex-1 sm:flex-none h-12 px-6 bg-primary text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
            <Plus size={18} className="mr-2" /> Add SLO
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
                  <input 
                    value={singleSlo.id}
                    onChange={e => setSingleSlo({...singleSlo, id: e.target.value})}
                    placeholder="e.g. SLO-105" 
                    className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-inner" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">Subject</label>
                    <Select value={singleSlo.subject} onValueChange={val => setSingleSlo({...singleSlo, subject: val})}>
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
                    <input 
                      value={singleSlo.chapter}
                      onChange={e => setSingleSlo({...singleSlo, chapter: e.target.value})}
                      placeholder="e.g. Chapter 1: Poetry" 
                      className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-inner" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">SLO Description</label>
                  <textarea 
                    value={singleSlo.description}
                    onChange={e => setSingleSlo({...singleSlo, description: e.target.value})}
                    rows={3} 
                    placeholder="Describe the outcome to be learned by students..." 
                    className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none shadow-inner" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">NCP Alignment Code</label>
                    <input 
                      value={singleSlo.ncp}
                      onChange={e => setSingleSlo({...singleSlo, ncp: e.target.value})}
                      placeholder="e.g. NCP-ENG-105" 
                      className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-inner" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">NCP Alignment Description</label>
                    <input 
                      value={singleSlo.ncpDesc}
                      onChange={e => setSingleSlo({...singleSlo, ncpDesc: e.target.value})}
                      placeholder="e.g. Grade 10 Language alignment" 
                      className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-inner" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 pb-4 sm:pb-0">
                <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest">Abort</Button>
                <Button onClick={handleCommitSingle} className="flex-1 h-12 bg-primary text-white rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90">Commit Node</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => {
                setShowBulkModal(false)
                setBulkText('')
                setParsedSLOs([])
              }} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 100 }}
              className="relative bg-background border-t sm:border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
               <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-foreground uppercase tracking-widest">Bulk Import Excel / CSV</h3>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Copy-paste spreadsheet ranges or drop a CSV file</p>
                </div>
                <button onClick={() => {
                  setShowBulkModal(false)
                  setBulkText('')
                  setParsedSLOs([])
                }} className="p-2 hover:bg-muted rounded-xl transition-colors"><X size={20} /></button>
              </div>

              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 scrollbar-hide">
                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 text-center transition-all bg-muted/20 relative group"
                >
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.xls" 
                    onChange={handleFileSelect} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Globe className="mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-2" size={28} />
                  <p className="text-xs font-bold text-foreground">Drag & Drop `.csv`, `.xlsx`, or `.xls` File Here</p>
                  <p className="text-[10px] text-muted-foreground mt-1">or click to browse local folders</p>
                </div>

                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="px-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Or Paste From Clipboard</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Paste Area */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">Paste Excel Spreadsheet Range</label>
                  <textarea 
                    rows={4}
                    value={bulkText}
                    onChange={(e) => {
                      setBulkText(e.target.value)
                      handleParseBulk(e.target.value)
                    }}
                    placeholder="Example Format (Tab-separated columns from Excel):&#13;SLO-105	Students can analyze thermal properties	Science	Chapter 1	NCP-SCI-121&#13;SLO-106	Students can solve algebraic limits	Mathematics	Chapter 2	NCP-MAT-116"
                    className="w-full px-4 py-3 border border-border rounded-xl sm:rounded-2xl bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono resize-none shadow-inner h-[120px] placeholder:font-sans leading-relaxed"
                  />
                </div>

                {/* Preview Grid */}
                {parsedSLOs.length > 0 && (
                  <div className="border border-border rounded-2xl overflow-hidden shadow-sm bg-muted/10">
                    <div className="px-4 py-2.5 bg-muted/50 border-b border-border flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Parsed Preview ({parsedSLOs.length} Rows)</span>
                      <span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-2.5 py-0.5 rounded-full font-sans">Ready to Commit</span>
                    </div>
                    <div className="max-h-[160px] overflow-y-auto">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            <th className="p-2.5 pl-4">Code</th>
                            <th className="p-2.5">Description</th>
                            <th className="p-2.5">Subject</th>
                            <th className="p-2.5">Chapter</th>
                            <th className="p-2.5">NCP</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {parsedSLOs.map((row, idx) => (
                            <tr key={idx} className="hover:bg-background/80 transition-colors">
                              <td className="p-2.5 pl-4 font-mono font-bold text-primary uppercase">{row.id}</td>
                              <td className="p-2.5 truncate max-w-[150px] font-semibold text-foreground">{row.description}</td>
                              <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-muted border text-[9px] font-bold text-foreground">{row.subject}</span></td>
                              <td className="p-2.5 text-muted-foreground font-medium">{row.chapter}</td>
                              <td className="p-2.5 font-mono text-[9px] text-muted-foreground/60">{row.ncp}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 pb-4 sm:pb-0">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowBulkModal(false)
                    setBulkText('')
                    setParsedSLOs([])
                  }} 
                  className="flex-1 h-12 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCommitBulk} 
                  className="flex-1 h-12 bg-primary text-white rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90"
                >
                  Commit Import ({parsedSLOs.length})
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
