import { useState, useCallback, useEffect, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from '@tanstack/react-table'
import { AlertCircle, Check, Trash2, Loader2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAssessmentStore, getGradesKey, StudentAssessment } from '@/lib/store/assessment-store'
import { useUIStore } from '@/lib/store/ui-store'
import { SLO } from '@/lib/data/curriculum'

interface StudentAssessment {
  id: string
  name: string
  [key: string]: string | number | null // For dynamic SLO grades
}

interface AssessmentTableProps {
  slos: SLO[]
  data?: StudentAssessment[]
}

const grades = [1, 2, 3, 4]

const gradeColorMap: Record<number, string> = {
  4: 'bg-primary/20 text-primary border-primary/30',
  3: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  2: 'bg-warning/20 text-warning-foreground border-warning/30',
  1: 'bg-accent/20 text-accent border-accent/30',
}

const gradeLabels: Record<number, string> = {
  4: 'Exceeded',
  3: 'Met',
  2: 'Approaching',
  1: 'Below',
}

const gradeBtnMap: Record<number, string> = {
  4: 'bg-primary text-white shadow-primary/40',
  3: 'bg-blue-500 text-white shadow-blue-500/40',
  2: 'bg-amber-400 text-white shadow-amber-400/40',
  1: 'bg-accent text-white shadow-accent/40',
}

export function AssessmentTable({ slos, data: initialData = [] }: AssessmentTableProps) {
  const { role } = useUIStore()
  const isReadOnly = role !== 'TEACHER'
  const { filters, gradesData, updateSingleGrade, clearGrades, setGradesData, saveStatus, setSaveStatus } = useAssessmentStore()
  const key = getGradesKey(filters.branch, filters.class, filters.subject, filters.chapter)
  
  const defaultStudents: StudentAssessment[] = []
  
  const data = gradesData[key] || defaultStudents

  const [activeStudent, setActiveStudent] = useState<StudentAssessment | null>(null)
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number
    columnId: string
  } | null>(null)
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  // Autosave logic
  const triggerAutosave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setSaveStatus('saving')
    timeoutRef.current = setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 1500)
  }, [setSaveStatus])

  // Paste Logic
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (!editingCell || isReadOnly) return
    
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    const rows = text.split(/\r?\n/).filter(row => row.length > 0)
    const grid = rows.map(row => row.split('\t'))

    const newData = [...data]
    const { rowIndex, columnId } = editingCell
    const startColIndex = slos.findIndex(s => s.id === columnId)

    if (startColIndex === -1) return

    grid.forEach((pastedRow, rOffset) => {
      const targetRowIndex = rowIndex + rOffset
      if (targetRowIndex < newData.length) {
        pastedRow.forEach((pastedValue, cOffset) => {
          const targetColIndex = startColIndex + cOffset
          if (targetColIndex < slos.length) {
            const sloId = slos[targetColIndex].id
            const val = parseInt(pastedValue.trim())
            if (!isNaN(val) && grades.includes(val)) {
              newData[targetRowIndex] = { 
                ...newData[targetRowIndex], 
                [sloId]: val 
              }
            }
          }
        })
      }
    })

    setGradesData(key, newData)
    triggerAutosave()
    toast.success('Pasted grades successfully')
  }, [editingCell, data, slos, triggerAutosave])

  const columnHelper = createColumnHelper<StudentAssessment>()

  const columns: ColumnDef<StudentAssessment>[] = [
    columnHelper.accessor('name', {
      header: 'Student Name',
      size: 200,
      cell: (info) => (
        <div className="font-medium text-foreground sticky left-0 bg-background z-10 pl-4 py-2 border-r border-border min-w-[180px]">
          {info.getValue() as string}
        </div>
      ),
    }),
    ...slos.map((slo) =>
      columnHelper.accessor(slo.id, {
        header: () => (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-primary">{slo.id}</span>
            <span className="text-[9px] lowercase opacity-70 truncate max-w-[80px] leading-tight" title={slo.description}>
              {slo.description}
            </span>
          </div>
        ),
        size: 100,
        cell: (info) => {
          const rowIndex = info.row.index
          const columnId = slo.id
          const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === columnId
          const value = info.getValue() as number | null

          return (
            <div
              className={cn(
                'h-14 flex items-center px-2 cursor-pointer transition-all border-r border-border last:border-r-0 relative group/cell',
                isEditing ? 'bg-primary/10 ring-2 ring-primary ring-inset z-20 shadow-inner' : 'hover:bg-muted/50',
                !value && !isEditing && 'bg-warning/5'
              )}
              onClick={() => !isReadOnly && setEditingCell({ rowIndex, columnId })}
            >
              {isEditing ? (
                <input
                  autoFocus
                  type="text"
                  maxLength={1}
                  className="w-full h-full bg-transparent border-none focus:ring-0 text-center text-sm font-black text-primary p-0"
                  value={value || ''}
                  onChange={(e) => {
                    const char = e.target.value.slice(-1)
                    const val = parseInt(char)
                    if (grades.includes(val)) {
                      updateSingleGrade(key, rowIndex, columnId, val)
                      triggerAutosave()
                      
                      // Auto-advance logic
                      const currentSloIndex = slos.findIndex(s => s.id === columnId)
                      if (currentSloIndex < slos.length - 1) {
                        setEditingCell({ rowIndex, columnId: slos[currentSloIndex + 1].id })
                      } else if (rowIndex < data.length - 1) {
                        setEditingCell({ rowIndex: rowIndex + 1, columnId: slos[0].id })
                      } else {
                        setEditingCell(null)
                      }
                    } else if (char === '') {
                      updateSingleGrade(key, rowIndex, columnId, null)
                    }
                  }}
                  onKeyDown={(e) => {
                    const currentSloIndex = slos.findIndex(s => s.id === columnId)
                    if (e.key === 'ArrowRight' && currentSloIndex < slos.length - 1) {
                      setEditingCell({ rowIndex, columnId: slos[currentSloIndex + 1].id })
                    } else if (e.key === 'ArrowLeft' && currentSloIndex > 0) {
                      setEditingCell({ rowIndex, columnId: slos[currentSloIndex - 1].id })
                    } else if (e.key === 'ArrowDown' && rowIndex < data.length - 1) {
                      setEditingCell({ rowIndex: rowIndex + 1, columnId })
                    } else if (e.key === 'ArrowUp' && rowIndex > 0) {
                      setEditingCell({ rowIndex: rowIndex - 1, columnId })
                    } else if (e.key === 'Escape' || e.key === 'Enter') {
                      setEditingCell(null)
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setEditingCell(prev => 
                        (prev?.rowIndex === rowIndex && prev?.columnId === columnId) ? null : prev
                      )
                    }, 50)
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full">
                  {value ? (
                    <span className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black border transition-all shadow-sm',
                      gradeColorMap[value]
                    )}>
                      {value}
                    </span>
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
              )}
            </div>
          )
        },
      })
    ),
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Calculate averages dynamically
  const getAverage = (sloId: string) => {
    const values = data.map(s => s[sloId]).filter(v => v !== null) as number[]
    if (values.length === 0) return '-'
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
  }

  const studentRowIndex = (studentId: string) => data.findIndex(s => s.id === studentId)

  return (
    <div className="space-y-4" onPaste={handlePaste}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full border border-border">
             <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status</span>
             <div className="flex items-center gap-1.5 min-w-[70px]">
               {saveStatus === 'saving' && (
                 <Loader2 size={12} className="animate-spin text-primary" />
               )}
               {saveStatus === 'saved' && (
                 <Check size={12} className="text-primary" />
               )}
               <span className={cn(
                 "text-[10px] font-bold uppercase",
                 saveStatus === 'idle' ? "text-muted-foreground" : "text-primary"
               )}>
                 {saveStatus}
               </span>
             </div>
           </div>
            {isReadOnly ? (
              <div className="flex items-center gap-2 text-xs text-primary font-bold">
                <AlertCircle size={14} className="text-primary" />
                <span className="hidden sm:inline">Viewing in Read-Only Mode</span>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <Info size={14} className="text-primary" />
                <span>Copy from Excel and paste anywhere in the grid</span>
              </div>
            )}
        </div>
        {!isReadOnly && (
          <div className="flex gap-2">
              <button 
                onClick={() => {
                  if(confirm('Clear all grades for this chapter?')) {
                    clearGrades(key)
                    toast.success('Grades cleared')
                  }
                }}
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md hover:bg-accent hover:text-white text-xs font-bold transition-all"
              >
                <Trash2 size={14} /> Reset
              </button>
          </div>
        )}
      </div>

      {/* ── MOBILE CARD VIEW (lg:hidden) ── */}
      <div className="lg:hidden space-y-3">
        {slos.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <AlertCircle size={32} className="mb-3 opacity-30" />
            <p className="text-sm font-bold">No SLOs found for this chapter</p>
          </div>
        ) : (
          data.map((student) => {
            const filledCount = slos.filter(s => student[s.id] !== null && student[s.id] !== undefined).length
            const avgVals = slos.map(s => student[s.id]).filter(v => v !== null) as number[]
            const avg = avgVals.length > 0 ? (avgVals.reduce((a, b) => a + b, 0) / avgVals.length).toFixed(1) : null

            return (
              <div
                key={student.id}
                onClick={() => !isReadOnly && setActiveStudent(student)}
                className={cn(
                  'bg-background border border-border rounded-2xl p-4 shadow-sm transition-all duration-200',
                  !isReadOnly && 'cursor-pointer hover:border-primary/40 hover:shadow-md active:scale-[0.98]'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-black">
                      {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{student.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{filledCount}/{slos.length} graded</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {avg && (
                      <span className={cn('text-sm font-black px-2.5 py-1 rounded-lg border',
                        parseFloat(avg) >= 3.5 ? gradeColorMap[4] : parseFloat(avg) >= 2.5 ? gradeColorMap[3] : parseFloat(avg) >= 1.5 ? gradeColorMap[2] : gradeColorMap[1]
                      )}>
                        {avg}
                      </span>
                    )}
                    {!isReadOnly && (
                      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {slos.slice(0, 6).map(slo => {
                    const val = student[slo.id] as number | null
                    return (
                      <span key={slo.id} className={cn('px-2 py-0.5 rounded-full text-[9px] font-black border',
                        val ? gradeColorMap[val] : 'bg-muted text-muted-foreground border-border'
                      )}>
                        {slo.id.replace('SLO-', '')} · {val ?? '–'}
                      </span>
                    )
                  })}
                  {slos.length > 6 && <span className="px-2 py-0.5 rounded-full text-[9px] font-black border bg-muted text-muted-foreground border-border">+{slos.length - 6}</span>}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── DESKTOP TABLE (hidden on mobile) ── */}
      <div className="hidden lg:block border border-border rounded-2xl shadow-xl bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" ref={tableRef}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-muted/50 border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-4 text-left font-black text-muted-foreground uppercase text-[10px] tracking-widest border-r border-border last:border-r-0"
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-primary/[0.02] group transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-primary/5 font-black border-t-2 border-primary/10">
                <td className="px-4 py-4 sticky left-0 bg-primary/[0.04] z-10 border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Avg</span>
                    <span>Class Performance</span>
                  </div>
                </td>
                {slos.map((slo) => (
                  <td key={slo.id} className="px-4 py-4 text-center border-r border-border last:border-r-0 text-primary font-mono">
                    {getAverage(slo.id)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {!isReadOnly && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-background border-2 border-primary/20 text-primary rounded-xl hover:bg-primary/5 transition-all text-xs font-black uppercase tracking-widest active:scale-95">
            Download PDF Report
          </button>
          <button 
            onClick={() => toast.success('Grades locked and submitted for approval')}
            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/25 active:scale-95"
          >
            <Check size={16} /> Finalize Grades
          </button>
        </div>
      )}

      {/* ── MOBILE GRADING DRAWER ── */}
      {activeStudent && !isReadOnly && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveStudent(null)} />
          <div className="relative bg-background rounded-t-3xl shadow-2xl border-t border-border max-h-[88vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-black">
                  {activeStudent.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-black text-base text-foreground leading-tight">{activeStudent.name}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                    {filters.class} · {filters.subject} · {filters.chapter}
                  </p>
                </div>
              </div>
              <button onClick={() => setActiveStudent(null)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-bold">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
              {slos.map((slo) => {
                const rowIndex = studentRowIndex(activeStudent.id)
                const currentVal = data[rowIndex]?.[slo.id] as number | null
                return (
                  <div key={slo.id} className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-black text-primary uppercase tracking-wider">{slo.id}</span>
                        <p className="text-xs text-muted-foreground leading-snug mt-0.5">{slo.description}</p>
                      </div>
                      {currentVal && (
                        <span className={cn('text-sm font-black px-2.5 py-1 rounded-lg border flex-shrink-0', gradeColorMap[currentVal])}>{currentVal}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {grades.map(g => (
                        <button
                          key={g}
                          onClick={() => {
                            const rowIdx = studentRowIndex(activeStudent.id)
                            if (rowIdx === -1) return
                            const newVal = currentVal === g ? null : g
                            updateSingleGrade(key, rowIdx, slo.id, newVal)
                            setActiveStudent(prev => prev ? { ...prev, [slo.id]: newVal } : prev)
                            triggerAutosave()
                          }}
                          className={cn(
                            'h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all active:scale-95 shadow-sm',
                            currentVal === g ? `${gradeBtnMap[g]} border-transparent shadow-lg scale-[1.02]` : 'bg-background border-border text-muted-foreground'
                          )}
                        >
                          <span className="text-xl font-black leading-none">{g}</span>
                          <span className="text-[8px] font-bold uppercase tracking-tight opacity-75">{gradeLabels[g]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="px-5 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={() => { toast.success(`Grades saved for ${activeStudent.name}`); setActiveStudent(null) }}
                className="w-full h-13 py-3.5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Check size={18} /> Done — Save Grades
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
