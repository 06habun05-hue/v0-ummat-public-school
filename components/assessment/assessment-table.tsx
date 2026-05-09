'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from '@tanstack/react-table'
import { AlertCircle, Check, Save, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAssessmentStore } from '@/lib/store/assessment-store'

interface Student {
  id: string
  name: string
  listening: number | null
  reading: number | null
  speaking: number | null
  understanding: number | null
  behavior: number | null
  uniform: number | null
  interaction: number | null
  attendance: number | null
}

const grades = [1, 2, 3, 4]

const gradeColorMap: Record<number, string> = {
  4: 'bg-primary/20 text-primary border-primary/30',
  3: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  2: 'bg-warning/20 text-warning-foreground border-warning/30',
  1: 'bg-accent/20 text-accent border-accent/30',
}

interface AssessmentTableProps {
  data?: Student[]
}

export function AssessmentTable({ data: initialData = [] }: AssessmentTableProps) {
  const { saveStatus, setSaveStatus } = useAssessmentStore()
  const [data, setData] = useState<Student[]>(
    initialData.length > 0
      ? initialData
      : [
          { id: '1', name: 'Ahmed Hassan', listening: 4, reading: 3, speaking: 4, understanding: 3, behavior: 4, uniform: 4, interaction: 3, attendance: 4 },
          { id: '2', name: 'Fatima Khan', listening: 3, reading: 4, speaking: 3, understanding: 4, behavior: 4, uniform: 4, interaction: 4, attendance: 4 },
          { id: '3', name: 'Muhammad Ali', listening: 2, reading: 2, speaking: 2, understanding: 2, behavior: 3, uniform: 3, interaction: 2, attendance: 3 },
          { id: '4', name: 'Zainab Ahmed', listening: 4, reading: 4, speaking: 4, understanding: 4, behavior: 4, uniform: 4, interaction: 4, attendance: null },
          { id: '5', name: 'Hassan Ibrahim', listening: 3, reading: 3, speaking: null, understanding: 3, behavior: 3, uniform: 3, interaction: 3, attendance: 3 },
        ]
  )

  const [editingCell, setEditingCell] = useState<{
    rowIndex: number
    columnId: string
  } | null>(null)
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Autosave logic
  const triggerAutosave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setSaveStatus('saving')
    timeoutRef.current = setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 1500)
  }, [setSaveStatus])

  const columnHelper = createColumnHelper<Student>()

  const gradeColumns = ['listening', 'reading', 'speaking', 'understanding', 'behavior', 'uniform', 'interaction', 'attendance'] as const
  const gradeLabels: Record<string, string> = {
    listening: 'Listening',
    reading: 'Reading',
    speaking: 'Speaking',
    understanding: 'Understanding',
    behavior: 'Behavior',
    uniform: 'Uniform',
    interaction: 'Interaction',
    attendance: 'Attendance',
  }

  const columns: ColumnDef<Student>[] = [
    columnHelper.accessor('name', {
      header: 'Student Name',
      size: 200,
      cell: (info) => (
        <div className="font-medium text-foreground sticky left-0 bg-background z-10 pl-4 py-2 border-r border-border">
          {info.getValue()}
        </div>
      ),
    }),
    ...gradeColumns.map((grade) =>
      columnHelper.accessor(grade, {
        header: gradeLabels[grade],
        size: 100,
        cell: (info) => {
          const rowIndex = info.row.index
          const columnId = grade
          const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === columnId
          const value = info.getValue() as number | null

          return (
            <div
              className={cn(
                'h-12 flex items-center px-2 cursor-pointer transition-colors border-r border-border last:border-r-0',
                isEditing ? 'bg-primary/5 ring-2 ring-primary ring-inset z-20' : 'hover:bg-muted/50',
                !value && !isEditing && 'bg-warning/5'
              )}
              onClick={() => setEditingCell({ rowIndex, columnId })}
            >
              {isEditing ? (
                <select
                  autoFocus
                  value={value || ''}
                  onChange={(e) => {
                    const newValue = e.target.value ? parseInt(e.target.value) : null
                    const newData = [...data]
                    newData[rowIndex] = { ...newData[rowIndex], [columnId]: newValue }
                    setData(newData)
                    triggerAutosave()
                  }}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Tab') {
                      setEditingCell(null)
                    }
                  }}
                  className="w-full h-8 bg-transparent border-none focus:ring-0 text-sm font-bold"
                >
                  <option value="">-</option>
                  {grades.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center justify-center w-full">
                  {value ? (
                    <span className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold border transition-all',
                      gradeColorMap[value]
                    )}>
                      {value}
                    </span>
                  ) : (
                    <AlertCircle size={14} className="text-warning opacity-50" />
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

  // Calculate class averages
  const getAverage = (columnId: typeof gradeColumns[number]) => {
    const values = data.map(s => s[columnId]).filter(v => v !== null) as number[]
    if (values.length === 0) return 0
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status:</span>
           <div className="flex items-center gap-1.5 min-w-[80px]">
             {saveStatus === 'saving' && (
               <>
                 <Loader2 size={14} className="animate-spin text-primary" />
                 <span className="text-xs font-medium text-primary">Saving...</span>
               </>
             )}
             {saveStatus === 'saved' && (
               <>
                 <Check size={14} className="text-primary" />
                 <span className="text-xs font-medium text-primary">Saved ✓</span>
               </>
             )}
             {saveStatus === 'idle' && (
               <span className="text-xs font-medium text-muted-foreground">Ready</span>
             )}
           </div>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md hover:bg-muted text-xs font-medium transition-colors">
              <Trash2 size={14} /> Clear
            </button>
        </div>
      </div>

      <div className="border border-border rounded-xl shadow-sm bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-muted/50 border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase text-[10px] tracking-wider border-r border-border last:border-r-0"
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
                <tr key={row.id} className="hover:bg-muted/20 group transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Average Row */}
              <tr className="bg-primary/5 font-bold border-t-2 border-primary/20">
                <td className="px-4 py-3 sticky left-0 bg-primary/5 z-10 border-r border-border">Class Average</td>
                {gradeColumns.map((col) => (
                  <td key={col} className="px-4 py-3 text-center border-r border-border last:border-r-0 text-primary">
                    {getAverage(col)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-semibold shadow-sm shadow-accent/20">
          <AlertCircle size={16} /> Export as PDF
        </button>
        <button 
          onClick={() => toast.success('Assessment submitted for principal approval')}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-sm font-bold shadow-sm shadow-primary/20 active:scale-95"
        >
          <Check size={16} /> Submit for Approval
        </button>
      </div>
    </div>
  )
}
