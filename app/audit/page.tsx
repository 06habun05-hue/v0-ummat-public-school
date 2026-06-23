'use client'

import { useState } from 'react'
import { Search, Clock, User, Settings, DollarSign, FileText, LogIn, LogOut, Trash2, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const actionIcons: Record<string, React.ElementType> = {
  'Assessment Edit':     Edit,
  'Assessment Approval': FileText,
  'Fee Update':          DollarSign,
  'Student Update':      User,
  'Login':               LogIn,
  'Logout':              LogOut,
  'Deletion':            Trash2,
  'Settings Change':     Settings,
}

const actionColors: Record<string, { pill: string; icon: string }> = {
  'Assessment Edit':     { pill: 'bg-primary/10 text-primary border-primary/20',     icon: 'text-primary'           },
  'Assessment Approval': { pill: 'bg-primary/10 text-primary border-primary/20',     icon: 'text-primary'           },
  'Fee Update':          { pill: 'bg-amber-100 text-amber-700 border-amber-200',      icon: 'text-amber-600'         },
  'Student Update':      { pill: 'bg-muted text-muted-foreground border-border',      icon: 'text-muted-foreground'  },
  'Login':               { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200',icon: 'text-emerald-600'       },
  'Logout':              { pill: 'bg-muted text-muted-foreground border-border',      icon: 'text-muted-foreground'  },
  'Deletion':            { pill: 'bg-accent/10 text-accent border-accent/20',         icon: 'text-accent'            },
  'Settings Change':     { pill: 'bg-muted text-muted-foreground border-border',      icon: 'text-muted-foreground'  },
}

const mockLogs: any[] = []

const perPage = 8

export default function AuditPage() {
  const [search, setSearch]             = useState('')
  const [moduleFilter, setModuleFilter] = useState('All')
  const [actionFilter, setActionFilter] = useState('All')
  const [roleFilter, setRoleFilter]     = useState('All')
  const [page, setPage]                 = useState(1)

  const modules = ['All', 'Assessment', 'Approvals', 'Fee Management', 'Students', 'Auth', 'Admin']
  const actions = ['All', ...Array.from(new Set(mockLogs.map(l => l.action)))]
  const roles   = ['All', 'Teacher', 'Principal', 'Branch Admin', 'Super Admin']

  const filtered = mockLogs.filter(l =>
    (search === '' || l.user.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase())) &&
    (moduleFilter === 'All' || l.module === moduleFilter) &&
    (actionFilter === 'All' || l.action === actionFilter) &&
    (roleFilter === 'All' || l.role === roleFilter)
  )

  const paginated   = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages  = Math.ceil(filtered.length / perPage)

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-foreground tracking-tight">Audit Logs</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete activity trail across all system modules</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-background border border-border rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-all shadow-sm w-full sm:w-auto">
          <FileText size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
            <SelectTrigger><SelectValue placeholder="Module" /></SelectTrigger>
            <SelectContent>{modules.map(o => <SelectItem key={o} value={o}>{o === 'All' ? 'All Modules' : o}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={v => { setActionFilter(v); setPage(1) }}>
            <SelectTrigger><SelectValue placeholder="Action" /></SelectTrigger>
            <SelectContent>{actions.map(o => <SelectItem key={o} value={o}>{o === 'All' ? 'All Actions' : o}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1) }}>
            <SelectTrigger><SelectValue placeholder="User Role" /></SelectTrigger>
            <SelectContent>{roles.map(o => <SelectItem key={o} value={o}>{o === 'All' ? 'All Roles' : o}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {/* ── MOBILE CARDS (hidden lg+) ── */}
      <div className="lg:hidden space-y-3">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-muted-foreground">
            <FileText size={32} className="mb-3 opacity-30" />
            <p className="text-sm font-bold">No log entries found</p>
          </div>
        ) : paginated.map(log => {
          const Icon = actionIcons[log.action] ?? Edit
          const colors = actionColors[log.action] ?? actionColors['Student Update']
          return (
            <div key={log.id} className="bg-background border border-border rounded-2xl p-4 shadow-sm space-y-3">
              {/* Top: action + timestamp */}
              <div className="flex items-start justify-between gap-3">
                <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider', colors.pill)}>
                  <Icon size={10} className={colors.icon} />
                  {log.action}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium flex-shrink-0">
                  <Clock size={10} />
                  {log.timestamp.split(' ')[1]}
                </div>
              </div>

              {/* User */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black flex-shrink-0">
                  {log.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-foreground truncate">{log.user}</p>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{log.role}</p>
                </div>
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full border border-border flex-shrink-0">{log.module}</span>
              </div>

              {/* Detail */}
              <p className="text-[11px] text-foreground leading-snug border-t border-border/50 pt-2.5">{log.detail}</p>

              {/* Footer: date + IP */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground font-medium">{log.timestamp.split(' ')[0]}</span>
                <span className="text-[9px] font-mono text-muted-foreground">{log.ip}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── DESKTOP TABLE (hidden on mobile) ── */}
      <div className="hidden lg:block border border-border rounded-2xl overflow-hidden">
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
                const Icon = actionIcons[log.action] ?? Edit
                const colors = actionColors[log.action] ?? actionColors['Student Update']
                return (
                  <tr key={log.id} className={cn('hover:bg-muted/50 transition-colors', i % 2 === 1 && 'bg-muted/20')}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={11} /> {log.timestamp}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-xs whitespace-nowrap">{log.user}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-full whitespace-nowrap">{log.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap w-fit border', colors.pill)}>
                        <Icon size={10} /> {log.action}
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length} entries
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

      {/* Mobile Pagination */}
      <div className="lg:hidden flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-border disabled:opacity-40 hover:bg-muted transition-colors"
          >← Prev</button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-border disabled:opacity-40 hover:bg-muted transition-colors"
          >Next →</button>
        </div>
      </div>
    </div>
  )
}
