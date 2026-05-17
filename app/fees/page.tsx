'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { 
  Search, DollarSign, TrendingUp, AlertCircle, 
  CheckCircle2, ChevronDown, ChevronUp, Filter,
  ArrowUpRight, Download, Receipt, Wallet,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactECharts from 'echarts-for-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
  Paid: 'bg-primary/10 text-primary border-primary/20',
  Overdue: 'bg-accent/10 text-accent border-accent/20',
  Partial: 'bg-warning/10 text-warning border-warning/20',
  Pending: 'bg-muted text-muted-foreground border-border',
}

const collectionChartOpts = {
  tooltip: { trigger: 'axis', backgroundColor: '#fff', borderRadius: 12, shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.1)' },
  legend: { data: ['Collected', 'Outstanding'], bottom: 0, textStyle: { fontSize: 10, fontWeight: 'bold', color: '#666' }, icon: 'circle' },
  grid: { top: 20, right: 10, bottom: 40, left: 50 },
  xAxis: { type: 'category', data: collectionData.map(d => d.month), axisLine: { lineStyle: { color: '#eee' } }, axisTick: { show: false }, axisLabel: { color: '#999', fontSize: 10 } },
  yAxis: { type: 'value', axisLabel: { formatter: (v: number) => `${v / 1000}k`, color: '#999', fontSize: 10 }, splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } } },
  series: [
    { name: 'Collected', type: 'bar', data: collectionData.map(d => d.collected), itemStyle: { color: '#2A7A30', borderRadius: [6, 6, 0, 0] }, barWidth: '35%' },
    { name: 'Outstanding', type: 'bar', data: collectionData.map(d => d.outstanding), itemStyle: { color: '#CC1E1E', borderRadius: [6, 6, 0, 0] }, barWidth: '35%' },
  ],
}

const donutOpts = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['60%', '85%'], avoidLabelOverlap: false,
    label: { show: false },
    emphasis: { label: { show: false } },
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
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-heading font-black text-foreground tracking-tight">Fee Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Track and manage student payments</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-border bg-background hover:bg-muted transition-all text-xs font-black uppercase tracking-widest">
            <Download size={16} className="mr-2" /> Export Report
          </Button>
          <Button className="h-12 px-8 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">
            <Receipt size={16} className="mr-2" /> Bulk Invoicing
          </Button>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Collected', value: `PKR ${(totalCollected / 1000).toFixed(0)}k`, icon: Wallet, color: 'text-primary', bg: 'bg-primary/10', trend: '+12% vs last term' },
          { label: 'Pending Fees', value: `PKR ${(totalOutstanding / 1000).toFixed(0)}k`, icon: AlertCircle, color: 'text-accent', bg: 'bg-accent/10', trend: '-5% this month' },
          { label: 'Collection Rate', value: `${collectionRate}%`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', trend: 'Target: 95%' },
          { label: 'Overdue Profiles', value: `${overdueCount}`, icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', trend: 'Critical Attention' },
        ].map((card, i) => (
          <motion.div 
            key={card.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-background border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <card.icon size={48} />
            </div>
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{card.label}</p>
                <p className="text-2xl font-heading font-black text-foreground tracking-tight">{card.value}</p>
                <p className={cn("text-[9px] font-bold uppercase", card.color)}>{card.trend}</p>
              </div>
              <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner', card.bg)}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" /> Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ReactECharts option={collectionChartOpts} style={{ height: 260 }} />
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-xl rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" /> Collection Health
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col items-center justify-center">
            <ReactECharts option={donutOpts} style={{ height: 200, width: '100%' }} />
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
              {[
                { label: 'Collected', color: 'bg-primary' },
                { label: 'Pending', color: 'bg-warning' },
                { label: 'Overdue', color: 'bg-accent' },
                { label: 'Waivers', color: 'bg-muted' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', item.color)} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table/Card View */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-background border border-border rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 border-b border-border bg-muted/20">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search student profiles..." 
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner" 
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-2xl border-border bg-background shadow-inner">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-muted-foreground" />
                <SelectValue placeholder="Status Filter" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {['All', 'Paid', 'Partial', 'Pending', 'Overdue'].map(s => (
                <SelectItem key={s} value={s}>{s === 'All' ? 'Global Status' : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {[['name', 'Student Name'], ['', 'Class'], ['', 'Total Amount'], ['balance', 'Balance'], ['status', 'Status'], ['', 'Last Payment'], ['', 'Action']].map(([key, label], i) => (
                  <th 
                    key={i} 
                    onClick={() => key && handleSort(key as typeof sortKey)} 
                    className={cn(
                      'px-6 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest', 
                      key && 'cursor-pointer hover:text-primary transition-colors'
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {label}
                      {key && (sortKey === key ? (sortDir === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />) : <ChevronDown size={12} className="opacity-20" />)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((f) => (
                <tr key={f.id} className="group hover:bg-primary/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xs font-black text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          {f.name.split(' ').map(n=>n[0]).join('')}
                       </div>
                       <div>
                        <p className="font-bold text-foreground leading-tight">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{f.id}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-border bg-muted/30 text-muted-foreground">
                       {f.class}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-bold text-xs text-foreground/70">PKR {f.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={cn('text-sm font-black tracking-tight', f.balance > 0 ? 'text-accent' : 'text-primary')}>
                      PKR {f.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn('text-[9px] font-black uppercase tracking-widest px-3 py-1 border shadow-sm', statusColors[f.status])}>
                       {f.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase">
                     {f.lastPayment ? format(new Date(f.lastPayment), 'MMM dd, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <Button 
                      size="sm" 
                      className="rounded-xl h-9 px-4 text-[10px] font-black uppercase tracking-widest shadow-md transition-all disabled:opacity-30"
                      disabled={f.status === 'Paid'}
                      variant={f.status === 'Paid' ? 'ghost' : 'default'}
                    >
                      {f.status === 'Paid' ? 'Audited ✓' : 'Settle'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-border">
          {filtered.map((f) => (
            <div key={f.id} className="p-5 space-y-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xs font-black text-muted-foreground">
                    {f.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm leading-tight">{f.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{f.id}</p>
                  </div>
                </div>
                <Badge className={cn('text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border shadow-sm', statusColors[f.status])}>
                  {f.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Outstanding</p>
                  <p className={cn('text-sm font-black tracking-tight', f.balance > 0 ? 'text-accent' : 'text-primary')}>
                    PKR {f.balance.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Last Settlement</p>
                  <p className="text-xs font-bold text-foreground/80">
                    {f.lastPayment ? format(new Date(f.lastPayment), 'MMM dd') : '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-border bg-muted/30 text-muted-foreground">
                  {f.class}
                </Badge>
                <Button 
                  size="sm" 
                  className="rounded-xl h-8 px-4 text-[9px] font-black uppercase tracking-widest shadow-md transition-all disabled:opacity-30"
                  disabled={f.status === 'Paid'}
                >
                  {f.status === 'Paid' ? 'Audited' : 'Settle'}
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground/30">
                <Search size={24} />
              </div>
              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">No matching profiles</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
