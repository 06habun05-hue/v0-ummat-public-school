'use client'

import { useState } from 'react'
import { Search, Filter, ChevronUp, ChevronDown, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const mockStudents = [
  { id: 'STU001', name: 'Ahmed Hassan', class: '10-A', branch: 'Main Campus', attendance: 95, lastAssessment: '2025-05-09', feeStatus: 'Paid' },
  { id: 'STU002', name: 'Fatima Khan', class: '10-A', branch: 'Main Campus', attendance: 88, lastAssessment: '2025-05-09', feeStatus: 'Paid' },
  { id: 'STU003', name: 'Muhammad Ali', class: '9-B', branch: 'Main Campus', attendance: 72, lastAssessment: '2025-05-08', feeStatus: 'Overdue' },
  { id: 'STU004', name: 'Zainab Ahmed', class: '10-B', branch: 'North Campus', attendance: 98, lastAssessment: '2025-05-09', feeStatus: 'Paid' },
  { id: 'STU005', name: 'Hassan Ibrahim', class: '8-A', branch: 'South Campus', attendance: 85, lastAssessment: '2025-05-07', feeStatus: 'Pending' },
  { id: 'STU006', name: 'Aisha Mohammed', class: '9-A', branch: 'Main Campus', attendance: 91, lastAssessment: '2025-05-09', feeStatus: 'Paid' },
  { id: 'STU007', name: 'Omar Farooq', class: '10-A', branch: 'North Campus', attendance: 65, lastAssessment: '2025-05-06', feeStatus: 'Overdue' },
  { id: 'STU008', name: 'Layla Hassan', class: '7-B', branch: 'North Campus', attendance: 93, lastAssessment: '2025-05-09', feeStatus: 'Paid' },
  { id: 'STU009', name: 'Ibrahim Khan', class: '8-A', branch: 'South Campus', attendance: 79, lastAssessment: '2025-05-08', feeStatus: 'Pending' },
  { id: 'STU010', name: 'Noor Fatima', class: '10-B', branch: 'Main Campus', attendance: 97, lastAssessment: '2025-05-09', feeStatus: 'Paid' },
  { id: 'STU011', name: 'Salim Ahmad', class: '9-B', branch: 'South Campus', attendance: 82, lastAssessment: '2025-05-07', feeStatus: 'Paid' },
  { id: 'STU012', name: 'Mariam Yusuf', class: '10-A', branch: 'Main Campus', attendance: 96, lastAssessment: '2025-05-09', feeStatus: 'Paid' },
]

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
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Students</h2>
        <p className="text-sm text-muted-foreground mt-1">{filtered.length} students found</p>
      </div>

      {/* Filters */}
      <div className="bg-background border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name or ID..."
              className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {([['Branch', branches, branchFilter, (v: string) => { setBranchFilter(v); setPage(1) }],
             ['Class', classes, classFilter, (v: string) => { setClassFilter(v); setPage(1) }],
             ['Fee Status', feeStatuses, feeFilter, (v: string) => { setFeeFilter(v); setPage(1) }]] as const).map(([label, opts, val, setter]) => (
            <select
              key={label}
              value={val}
              onChange={e => setter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {opts.map(o => <option key={o} value={o}>{label}: {o}</option>)}
            </select>
          ))}
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
