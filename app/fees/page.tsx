'use client'

import { useState } from 'react'
import { Search, DollarSign, TrendingUp, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactECharts from 'echarts-for-react'

const mockStudentFees = [
  { id: 'STU001', name: 'Ahmed Hassan', class: '10-A', branch: 'Main Campus', amount: 15000, paid: 15000, balance: 0, status: 'Paid', lastPayment: '2025-05-01' },
  { id: 'STU002', name: 'Fatima Khan', class: '10-A', branch: 'Main Campus', amount: 15000, paid: 15000, balance: 0, status: 'Paid', lastPayment: '2025-04-28' },
  { id: 'STU003', name: 'Muhammad Ali', class: '9-B', branch: 'Main Campus', amount: 12000, paid: 0, balance: 12000, status: 'Overdue', lastPayment: '2025-03-15' },
  { id: 'STU004', name: 'Zainab Ahmed', class: '10-B', branch: 'North Campus', amount: 15000, paid: 15000, balance: 0, status: 'Paid', lastPayment: '2025-05-02' },
  { id: 'STU005', name: 'Hassan Ibrahim', class: '8-A', branch: 'South Campus', amount: 10000, paid: 5000, balance: 5000, status: 'Partial', lastPayment: '2025-04-20' },
  { id: 'STU006', name: 'Aisha Mohammed', class: '9-A', branch: 'Main Campus', amount: 12000, paid: 12000, balance: 0, status: 'Paid', lastPayment: '2025-04-30' },
  { id: 'STU007', name: 'Omar Farooq', class: '10-A', branch: 'North Campus', amount: 15000, paid: 0, balance: 15000, status: 'Overdue', lastPayment: '2025-02-10' },
  { id: 'STU008', name: 'Layla Hassan', class: '7-B', branch: 'North Campus', amount: 10000, paid: 10000, balance: 0, status: 'Paid', lastPayment: '2025-05-03' },
  { id: 'STU009', name: 'Ibrahim Khan', class: '8-A', branch: 'South Campus', amount: 10000, paid: 0, balance: 10000, status: 'Pending', lastPayment: '' },
  { id: 'STU010', name: 'Noor Fatima', class: '10-B', branch: 'Main Campus', amount: 15000, paid: 15000, balance: 0, status: 'Paid', lastPayment: '2025-05-01' },
]

const collectionData = [
  { month: 'Jan', collected: 180000, outstanding: 42000 },
  { month: 'Feb', collected: 195000, outstanding: 38000 },
  { month: 'Mar', collected: 172000, outstanding: 55000 },
  { month: 'Apr', collected: 210000, outstanding: 30000 },
  { month: 'May', collected: 145000, outstanding: 37000 },
]

const statusColors: Record<string, string> = {
  Paid: 'bg-primary/10 text-primary',
  Overdue: 'bg-accent/10 text-accent',
  Partial: 'bg-warning/10 text-warning',
  Pending: 'bg-muted text-muted-foreground',
}

const collectionChartOpts = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['Collected', 'Outstanding'], bottom: 0, textStyle: { fontSize: 11 } },
  grid: { top: 10, right: 10, bottom: 30, left: 50 },
  xAxis: { type: 'category', data: collectionData.map(d => d.month), axisLine: { lineStyle: { color: '#e5e5e5' } }, axisTick: { show: false } },
  yAxis: { type: 'value', axisLabel: { formatter: (v: number) => `${v / 1000}k` }, splitLine: { lineStyle: { color: '#f0f0f0' } } },
  series: [
    { name: 'Collected', type: 'bar', data: collectionData.map(d => d.collected), itemStyle: { color: '#2A7A30', borderRadius: [4, 4, 0, 0] } },
    { name: 'Outstanding', type: 'bar', data: collectionData.map(d => d.outstanding), itemStyle: { color: '#CC1E1E', borderRadius: [4, 4, 0, 0] } },
  ],
}

const donutOpts = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['55%', '80%'], avoidLabelOverlap: false,
    label: { show: false },
    data: [
      { value: 70, name: 'Collected', itemStyle: { color: '#2A7A30' } },
      { value: 15, name: 'Pending', itemStyle: { color: '#F59E0B' } },
      { value: 15, name: 'Overdue', itemStyle: { color: '#CC1E1E' } },
    ],
  }],
}

export default function FeesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortKey, setSortKey] = useState<'name' | 'balance' | 'status'>('balance')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const totalCollected = mockStudentFees.reduce((s, f) => s + f.paid, 0)
  const totalOutstanding = mockStudentFees.reduce((s, f) => s + f.balance, 0)
  const totalAmount = mockStudentFees.reduce((s, f) => s + f.amount, 0)
  const collectionRate = Math.round((totalCollected / totalAmount) * 100)
  const overdueCount = mockStudentFees.filter(f => f.status === 'Overdue').length

  const filtered = mockStudentFees
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.id.toLowerCase().includes(search.toLowerCase()))
    .filter(f => statusFilter === 'All' || f.status === statusFilter)
    .sort((a, b) => {
      const m = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'balance') return (a.balance - b.balance) * m
      return String(a[sortKey]).localeCompare(String(b[sortKey])) * m
    })

  const handleSort = (k: typeof sortKey) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('asc') }
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">Fee Management</h2>
        <p className="text-sm text-muted-foreground mt-1">Track student fees, payments, and outstanding balances</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected', value: `PKR ${(totalCollected / 1000).toFixed(0)}k`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Outstanding', value: `PKR ${(totalOutstanding / 1000).toFixed(0)}k`, icon: AlertCircle, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Collection Rate', value: `${collectionRate}%`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Overdue Students', value: `${overdueCount}`, icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10' },
        ].map(card => (
          <div key={card.label} className="bg-background border border-border rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">{card.label}</p>
                <p className="text-2xl font-heading font-bold text-foreground">{card.value}</p>
              </div>
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', card.bg)}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background border border-border rounded-lg p-5">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4">Monthly Collection vs Outstanding</h3>
          <ReactECharts option={collectionChartOpts} style={{ height: 220 }} />
        </div>
        <div className="bg-background border border-border rounded-lg p-5 flex flex-col items-center justify-center">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-2">Collection Breakdown</h3>
          <ReactECharts option={donutOpts} style={{ height: 180, width: '100%' }} />
          <div className="flex gap-4 text-xs mt-2">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />Collected</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" />Pending</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />Overdue</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..." className="w-full pl-8 pr-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none">
            {['All', 'Paid', 'Partial', 'Pending', 'Overdue'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {[['name', 'Student'], ['', 'Class'], ['', 'Fee Amount'], ['balance', 'Balance'], ['status', 'Status'], ['', 'Last Payment'], ['', 'Action']].map(([key, label], i) => (
                  <th key={i} onClick={() => key && handleSort(key as typeof sortKey)} className={cn('px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide', key && 'cursor-pointer hover:text-foreground')}>
                    <span className="flex items-center gap-1">{label}{key && (sortKey === key ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronDown size={12} className="opacity-30" />)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((f, i) => (
                <tr key={f.id} className={cn('hover:bg-muted/50 transition-colors', i % 2 === 1 && 'bg-muted/20')}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{f.name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{f.id}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{f.class}</td>
                  <td className="px-4 py-3 font-medium">PKR {f.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={cn('font-bold', f.balance > 0 ? 'text-accent' : 'text-primary')}>
                      PKR {f.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[11px] font-semibold px-2 py-1 rounded-full', statusColors[f.status])}>{f.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{f.lastPayment ? new Date(f.lastPayment).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-40" disabled={f.status === 'Paid'}>
                      {f.status === 'Paid' ? 'Paid ✓' : 'Mark Paid'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
