'use client'

import { useState, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from '@tanstack/react-table'
import { AlertCircle, Check, Save, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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

interface AssessmentTableProps {
  data?: Student[]
}

export function AssessmentTable({ data: initialData = [] }: AssessmentTableProps) {
  const [data, setData] = useState<Student[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            id: '1',
            name: 'Ahmed Hassan',
            listening: 4,
            reading: 3,
            speaking: 4,
            understanding: 3,
            behavior: 4,
            uniform: 4,
            interaction: 3,
            attendance: 4,
          },
          {
            id: '2',
            name: 'Fatima Khan',
            listening: 3,
            reading: 4,
            speaking: 3,
            understanding: 4,
            behavior: 4,
            uniform: 4,
            interaction: 4,
            attendance: 4,
          },
          {
            id: '3',
            name: 'Muhammad Ali',
            listening: 2,
            reading: 2,
            speaking: 2,
            understanding: 2,
            behavior: 3,
            uniform: 3,
            interaction: 2,
            attendance: 3,
          },
          {
            id: '4',
            name: 'Zainab Ahmed',
            listening: 4,
            reading: 4,
            speaking: 4,
            understanding: 4,
            behavior: 4,
            uniform: 4,
            interaction: 4,
            attendance: null,
          },
          {
            id: '5',
            name: 'Hassan Ibrahim',
            listening: 3,
            reading: 3,
            speaking: null,
            understanding: 3,
            behavior: 3,
            uniform: 3,
            interaction: 3,
            attendance: 3,
          },
        ]
  )

  const [editingCell, setEditingCell] = useState<{
    rowIndex: number
    columnId: string
  } | null>(null)
  const [savingRows, setSavingRows] = useState<Set<string>>(new Set())

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
        <div className="font-medium text-foreground sticky left-0 bg-background z-10 pl-4">
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
          const value = info.getValue()
          const isRequired = !value && editingCell?.rowIndex !== rowIndex

          return (
            <div
              className={cn(
                'h-10 flex items-center px-2',
                isEditing && 'bg-background',
                value === null && 'bg-warning/10'
              )}
              onDoubleClick={() => setEditingCell({ rowIndex, columnId })}
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
                  }}
                  onBlur={() => setEditingCell(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditingCell(null)
                      handleSaveRow(rowIndex)
                    } else if (e.key === 'Escape') {
                      setEditingCell(null)
                    }
                  }}
                  className="w-full px-2 py-1 border border-primary rounded bg-background text-foreground text-sm"
                >
                  <option value="">Select grade</option>
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium">{value || '-'}</span>
                  {isRequired && <AlertCircle size={14} className="text-warning" />}
                </div>
              )}
            </div>
          )
        },
      })
    ),
  ]

  const handleSaveRow = useCallback(
    (rowIndex: number) => {
      setSavingRows((prev) => new Set(prev).add(data[rowIndex].id))
      setTimeout(() => {
        setSavingRows((prev) => {
          const newSet = new Set(prev)
          newSet.delete(data[rowIndex].id)
          return newSet
        })
        toast.success('Row saved successfully')
      }, 500)
    },
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-semibold text-foreground"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-border hover:bg-muted transition-colors',
                    idx % 2 === 1 && 'bg-muted/30'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{ width: cell.column.columnDef.size }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end">
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
          <Trash2 size={16} />
          Clear All
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-danger text-danger-foreground rounded-lg hover:bg-danger/90 transition-colors text-sm font-medium">
          <AlertCircle size={16} />
          Export as PDF
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
          <Check size={16} />
          Submit for Approval
        </button>
      </div>
    </div>
  )
}
