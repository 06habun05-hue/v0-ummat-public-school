'use client'

import { useState } from 'react'
import { Search, Filter, Clock, User, Settings, DollarSign, FileText, LogIn, LogOut, Trash2, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const actionIcons: Record<string, React.ElementType> = {
  'Assessment Edit': Edit,
  'Assessment Approval': FileText,
  'Fee Update': DollarSign,
  'Student Update': User,
  'Login': LogIn,
  'Logout': LogOut,
  'Deletion': Trash2,
  'Settings Change': Settings,
}

const actionColors: Record<string, string> = {
  'Assessment Edit': 'bg-primary/10 text-primary',
  'Assessment Approval': 'bg-primary/10 text-primary',
  'Fee Update': 'bg-warning/10 text-warning',
  'Student Update': 'bg-muted text-muted-foreground',
  'Login': 'bg-primary/10 text-primary',
  'Logout': 'bg-muted text-muted-foreground',
  'Deletion': 'bg-accent/10 text-accent',
  'Settings Change': 'bg-muted text-muted-foreground',
}

const mockLogs = [
  { id: 'LOG001', timestamp: '2025-05-09 14:32:05', user: 'Ms. Sana Malik', role: 'Teacher', action: 'Assessment Edit', module: 'Assessment', detail: 'Edited grades for Class 10-A, English, Chapter 2', ip: '192.168.1.42' },
  { id: 'LOG002', timestamp: '2025-05-09 14:15:22', user: 'Principal Arif', role: 'Principal', action: 'Assessment Approval', module: 'Approvals', detail: 'Approved APV002 — Class 9-B Mathematics', ip: '192.168.1.10' },
  { id: 'LOG003', timestamp: '2025-05-09 13:55:11', user: 'Admin Khalid', role: 'Branch Admin', action: 'Fee Update', module: 'Fee Management', detail: 'Marked STU003 fee as Paid — PKR 12,000', ip: '192.168.1.5' },
  { id: 'LOG004', timestamp: '2025-05-09 13:30:45', user: 'Mr. Tariq Ahmed', role: 'Teacher', action: 'Assessment Edit', module: 'Assessment', detail: 'Submitted assessment for Class 9-B, Mathematics', ip: '192.168.1.55' },
  { id: 'LOG005', timestamp: '2025-05-09 13:00:00', user: 'Admin Khalid', role: 'Branch Admin', action: 'Login', module: 'Auth', detail: 'Logged in from Main Campus', ip: '192.168.1.5' },
  { id: 'LOG006', timestamp: '2025-05-09 12:45:18', user: 'Ms. Ayesha Noor', role: 'Teacher', action: 'Student Update', module: 'Students', detail: 'Updated profile for STU007 — Omar Farooq', ip: '192.168.1.33' },
  { id: 'LOG007', timestamp: '2025-05-09 12:10:55', user: 'Principal Arif', role: 'Principal', action: 'Assessment Approval', module: 'Approvals', detail: 'Requested revision on APV003 — insufficient data', ip: '192.168.1.10' },
  { id: 'LOG008', timestamp: '2025-05-09 11:50:30', user: 'Admin Khalid', role: 'Branch Admin', action: 'Deletion', module: 'Students', detail: 'Deleted duplicate record STU099', ip: '192.168.1.5' },
  { id: 'LOG009', timestamp: '2025-05-09 11:20:00', user: 'Super Admin', role: 'Super Admin', action: 'Settings Change', module: 'Admin', detail: 'Updated academic year to 2025–26', ip: '10.0.0.1' },
  { id: 'LOG010', timestamp: '2025-05-09 10:55:44', user: 'Ms. Sana Malik', role: 'Teacher', action: 'Login', module: 'Auth', detail: 'Logged in from Main Campus', ip: '192.168.1.42' },
  { id: 'LOG011', timestamp: '2025-05-08 17:30:00', user: 'Mr. Hassan Raza', role: 'Teacher', action: 'Assessment Edit', module: 'Assessment', detail: 'Submitted assessment for Class 10-B, Islamic Studies', ip: '192.168.1.61' },
  { id: 'LOG012', timestamp: '2025-05-08 16:15:22', user: 'Admin Khalid', role: 'Branch Admin', action: 'Fee Update', module: 'Fee Management', detail: 'Marked STU008 fee as Paid — PKR 10,000', ip: '192.168.1.5' },
]

const perPage = 8

export default function AuditPage() {
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('All')
  const [actionFilter, setActionFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All')
  const [page, setPage] = useState(1)

  const modules = ['All', 'Assessment', 'Approvals', 'Fee Management', 'Students', 'Auth', 'Admin']
  const actions = ['All', ...Array.from(new Set(mockLogs.map(l => l.action)))]
  const roles = ['All', 'Teacher', 'Principal', 'Branch Admin', 'Super Admin']

  const filtered = mockLogs.filter(l =>
    (search === '' || l.user.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase())) &&
    (moduleFilter === 'All' || l.module === moduleFilter) &&
    (actionFilter === 'All' || l.action === actionFilter) &&
    (roleFilter === 'All' || l.role === roleFilter)
  )

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-foreground tracking-tight">Audit Logs</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete activity trail across all system modules</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-background border border-border rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-all shadow-sm">
          <FileText size={14} /> Export CSV
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
              placeholder="Search user or action..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>

          <Select value={moduleFilter} onValueChange={v => { setModuleFilter(v); setPage(1) }}>
            <SelectTrigger>
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              {modules.map(o => <SelectItem key={o} value={o}>{o === 'All' ? 'All Modules' : o}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={actionFilter} onValueChange={v => { setActionFilter(v); setPage(1) }}>
            <SelectTrigger>
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              {actions.map(o => <SelectItem key={o} value={o}>{o === 'All' ? 'All Actions' : o}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1) }}>
            <SelectTrigger>
              <SelectValue placeholder="User Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(o => <SelectItem key={o} value={o}>{o === 'All' ? 'All Roles' : o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Log Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                {['Timestamp', 'User', 'Role', 'Action', 'Module', 'Detail', 'IP'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((log, i) => {
                const Icon = actionIcons[log.action] || Edit
                return (
                  <tr key={log.id} className={cn('hover:bg-muted/50 transition-colors', i % 2 === 1 && 'bg-muted/20')}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={11} />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-xs whitespace-nowrap">{log.user}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-full whitespace-nowrap">{log.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap w-fit', actionColors[log.action])}>
                        <Icon size={10} />{log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{log.module}</td>
                    <td className="px-4 py-3 text-xs text-foreground max-w-xs truncate">{log.detail}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">{log.ip}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length} entries</p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={cn('w-7 h-7 text-xs rounded-md transition-colors', page === i + 1 ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground')}>{i + 1}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
