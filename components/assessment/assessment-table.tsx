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
import { useAssessmentStore } from '@/lib/store/assessment-store'
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

export function AssessmentTable({ slos, data: initialData = [] }: AssessmentTableProps) {
  const { saveStatus, setSaveStatus } = useAssessmentStore()
  const [data, setData] = useState<StudentAssessment[]>(
    initialData.length > 0
      ? initialData
      : [
          { id: '1', name: 'Ahmed Hassan' },
          { id: '2', name: 'Fatima Khan' },
          { id: '3', name: 'Muhammad Ali' },
          { id: '4', name: 'Zainab Ahmed' },
          { id: '5', name: 'Hassan Ibrahim' },
        ]
  )

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
    if (!editingCell) return
    
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

    setData(newData)
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
              onClick={() => setEditingCell({ rowIndex, columnId })}
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
                      const newData = [...data]
                      newData[rowIndex] = { ...newData[rowIndex], [columnId]: val }
                      setData(newData)
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
                      const newData = [...data]
                      newData[rowIndex] = { ...newData[rowIndex], [columnId]: null }
                      setData(newData)
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
                    // Slight delay to allow for click on another cell without losing focus state first
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
           <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
             <Info size={14} className="text-primary" />
             <span>Copy from Excel and paste anywhere in the grid</span>
           </div>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={() => {
                if(confirm('Clear all grades for this chapter?')) {
                  const cleared = data.map(s => {
                    const { id, name } = s
                    return { id, name } as StudentAssessment
                  })
                  setData(cleared)
                  toast.success('Grades cleared')
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md hover:bg-accent hover:text-white text-xs font-bold transition-all"
            >
              <Trash2 size={14} /> Reset
            </button>
        </div>
      </div>

      <div className="border border-border rounded-2xl shadow-xl bg-background overflow-hidden">
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
              {/* Dynamic Average Row */}
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

      <div className="flex justify-end gap-3 pt-4">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-background border-2 border-primary/20 text-primary rounded-xl hover:bg-primary/5 transition-all text-xs font-black uppercase tracking-widest active:scale-95">
          Download PDF Report
        </button>
        <button 
          onClick={() => toast.success('Grades locked and submitted for approval')}
          className="flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/25 active:scale-95"
        >
          <Check size={16} /> Finalize Grades
        </button>
      </div>
    </div>
  )
}
