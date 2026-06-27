'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, ChevronUp, ChevronDown, Eye, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SortKey = 'name' | 'class' | 'attendance' | 'feeStatus'

const feeColors: Record<string, string> = {
  Paid: 'bg-primary/10 text-primary',
  Overdue: 'bg-accent/10 text-accent',
  Pending: 'bg-warning/10 text-warning',
}

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [feeFilter, setFeeFilter] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const perPage = 8

  const branches = ['All', 'Main Campus', 'North Campus', 'South Campus']
  const classes = ['All', '10-A', '10-B', '9-A', '9-B', '8-A', '7-B']
  const feeStatuses = ['All', 'Paid', 'Pending', 'Overdue']

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        branch: branchFilter,
        class: classFilter,
        feeFilter: feeFilter,
        sortKey,
        sortDir,
        page: String(page),
        perPage: String(perPage),
      })
      const res = await fetch(`/api/students?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
        setTotalCount(data.totalCount || 0)
        setTotalPages(data.totalPages || 0)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [search, branchFilter, classFilter, feeFilter, sortKey, sortDir, page])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
    : <ChevronDown size={13} className="opacity-30" />

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground tracking-tight">Students</h2>
          <p className="text-sm text-muted-foreground mt-1">{totalCount} students enrolled across all branches</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all flex-shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:block">Add Student</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>

          <Select value={branchFilter} onValueChange={v => { setBranchFilter(v); setPage(1) }}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map(o => <SelectItem key={o} value={o}>{o === 'All' ? 'All Branches' : o}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={classFilter} onValueChange={v => { setClassFilter(v); setPage(1) }}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(o => <SelectItem key={o} value={o}>{o === 'All' ? 'All Classes' : o}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={feeFilter} onValueChange={v => { setFeeFilter(v); setPage(1) }}>
            <SelectTrigger>
              <SelectValue placeholder="Fee Status" />
            </SelectTrigger>
            <SelectContent>
              {feeStatuses.map(o => <SelectItem key={o} value={o}>{o === 'All' ? 'All Fee Statuses' : o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
              Loading students...
            </div>
          ) : students.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
              No students found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  {([['name', 'Student'], ['class', 'Class'], ['', 'Branch'], ['attendance', 'Attendance %'], ['', 'Last Assessment'], ['feeStatus', 'Fee Status'], ['', '']] as [SortKey | '', string][]).map(([key, label], i) => (
                    <th
                      key={i}
                      onClick={() => key && handleSort(key)}
                      className={cn('px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide', key && 'cursor-pointer hover:text-foreground')}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        {key && <SortIcon k={key} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s, i) => (
                  <tr key={s.id} className={cn('hover:bg-muted/50 transition-colors', i % 2 === 1 && 'bg-muted/20')}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{s.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{s.class}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.branch}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-border rounded-full h-1.5">
                          <div
                            className={cn('h-1.5 rounded-full', s.attendance >= 90 ? 'bg-primary' : s.attendance >= 75 ? 'bg-warning' : 'bg-accent')}
                            style={{ width: `${s.attendance}%` }}
                          />
                        </div>
                        <span className={cn('text-xs font-semibold', s.attendance >= 90 ? 'text-primary' : s.attendance >= 75 ? 'text-warning' : 'text-accent')}>
                          {s.attendance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {s.lastAssessment ? new Date(s.lastAssessment).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[11px] font-semibold px-2 py-1 rounded-full', feeColors[s.feeStatus] || 'bg-muted text-muted-foreground')}>
                        {s.feeStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/students/${s.id}`} className="p-1.5 hover:bg-muted rounded-md inline-flex transition-colors">
                        <Eye size={14} className="text-muted-foreground" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && students.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              Showing {Math.min((page - 1) * perPage + 1, totalCount)}–{Math.min(page * perPage, totalCount)} of {totalCount}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn('w-7 h-7 text-xs rounded-md transition-colors', page === i + 1 ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground')}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <StudentModal
          onClose={() => setShowAddModal(false)}
          onSave={async (newStudentData) => {
            try {
              const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudentData),
              })
              if (res.ok) {
                fetchStudents()
                setShowAddModal(false)
              }
            } catch (err) {
              console.error('Failed to add student:', err)
            }
          }}
          branches={branches.filter(b => b !== 'All')}
          classes={classes.filter(c => c !== 'All')}
          feeStatuses={feeStatuses.filter(f => f !== 'All')}
        />
      )}
    </div>
  )
}

function StudentModal({
  onClose,
  onSave,
  branches,
  classes,
  feeStatuses,
}: {
  onClose: () => void
  onSave: (data: any) => Promise<void>
  branches: string[]
  classes: string[]
  feeStatuses: string[]
}) {
  const [name, setName] = useState('')
  const [branch, setBranch] = useState(branches[0] || '')
  const [selectedClass, setSelectedClass] = useState(classes[0] || '')
  const [feeStatus, setFeeStatus] = useState(feeStatuses[0] || '')
  const [attendance, setAttendance] = useState('100')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    await onSave({
      name: name.trim(),
      branch,
      class: selectedClass,
      feeStatus,
      attendance: Number(attendance),
    })
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative z-10 bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background sticky top-0">
          <div>
            <h2 className="font-heading font-black text-lg text-foreground">Add New Student</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Enter student details to register</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Student Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mohammad Ali"
              className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Class *</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Branch *</label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Fee Status</label>
              <Select value={feeStatus} onValueChange={setFeeStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Fee Status" />
                </SelectTrigger>
                <SelectContent>
                  {feeStatuses.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Attendance (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-background">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  )
}
