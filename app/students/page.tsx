'use client'

import { useState } from 'react'
import { Search, Filter, ChevronUp, ChevronDown, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const mockStudents: any[] = []

type SortKey = 'name' | 'class' | 'attendance' | 'feeStatus'

const feeColors: Record<string, string> = {
  Paid: 'bg-primary/10 text-primary',
  Overdue: 'bg-accent/10 text-accent',
  Pending: 'bg-warning/10 text-warning',
}

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [feeFilter, setFeeFilter] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const perPage = 8

  const branches = ['All', 'Main Campus', 'North Campus', 'South Campus']
  const classes = ['All', '10-A', '10-B', '9-A', '9-B', '8-A', '7-B']
  const feeStatuses = ['All', 'Paid', 'Pending', 'Overdue']

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = mockStudents
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()))
    .filter(s => branchFilter === 'All' || s.branch === branchFilter)
    .filter(s => classFilter === 'All' || s.class === classFilter)
    .filter(s => feeFilter === 'All' || s.feeStatus === feeFilter)
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'attendance') return (a.attendance - b.attendance) * mult
      return String(a[sortKey]).localeCompare(String(b[sortKey])) * mult
    })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
    : <ChevronDown size={13} className="opacity-30" />

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground tracking-tight">Students</h2>
        <p className="text-sm text-muted-foreground mt-1">{filtered.length} students enrolled across all branches</p>
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
              {paginated.map((s, i) => (
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
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(s.lastAssessment).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[11px] font-semibold px-2 py-1 rounded-full', feeColors[s.feeStatus])}>
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
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
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
      </div>
    </div>
  )
}
