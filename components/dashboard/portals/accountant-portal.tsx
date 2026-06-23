'use client'

import ReactECharts from 'echarts-for-react'
import { MetricCard } from '../metric-card'
import { Wallet, AlertCircle, TrendingUp, CreditCard, ChevronDown, Sparkles, Download, Receipt } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useUIStore } from '@/lib/store/ui-store'
import { toast } from 'sonner'

const monthlyRevenueOpts = {
  tooltip: { trigger: 'axis' },
  grid: { top: 15, right: 10, bottom: 30, left: 45 },
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], axisTick: { show: false }, axisLabel: { fontSize: 10 } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { formatter: (v: number) => `${v / 1000}k`, fontSize: 11 } },
  series: [
    { name: 'Collected', type: 'bar', data: [0, 0, 0, 0, 0], itemStyle: { color: '#2A7A30', borderRadius: [4, 4, 0, 0] }, barMaxWidth: 24 }
  ],
}

const feeHealthOpts = {
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie', radius: ['55%', '80%'], avoidLabelOverlap: false,
    label: { show: false },
    data: [
      { value: 0, name: 'Collected', itemStyle: { color: '#2A7A30' } },
      { value: 0, name: 'Pending',   itemStyle: { color: '#F59E0B' } },
      { value: 0, name: 'Overdue',   itemStyle: { color: '#CC1E1E' } },
    ],
  }],
}

const recentPayments: any[] = []

export function AccountantPortal() {
  const { selectedBranch } = useUIStore()

  const handleBulkInvoicing = () => {
    toast.success('Generated invoices for all pending student accounts!')
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight">
            Financial Ledger & Fees
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            Track student invoice entries, process due payments, and export accounts ledger summaries for {selectedBranch}
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Treasury Synced</span>
        </motion.div>
      </div>

      {/* Action Hub - Premium chunky buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <button 
          onClick={handleBulkInvoicing}
          className="w-full h-14 px-6 bg-primary text-white rounded-2xl flex items-center justify-between shadow-xl shadow-primary/20 hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300 group"
        >
          <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2.5">
            <Receipt size={18} className="transition-transform group-hover:scale-110" />
            Bulk Invoicing
          </span>
          <ChevronDown size={16} className="rotate-270 opacity-60" />
        </button>
        <Link href="/fees">
          <button className="w-full h-14 px-6 bg-primary text-white rounded-2xl flex items-center justify-between shadow-xl shadow-primary/20 hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300 group">
            <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2.5">
              <CreditCard size={18} className="transition-transform group-hover:scale-110" />
              Settle Due Payments
            </span>
            <ChevronDown size={16} className="rotate-270 opacity-60" />
          </button>
        </Link>
        <Link href="/analytics">
          <button className="w-full h-14 px-6 bg-background border border-border text-foreground hover:bg-muted rounded-2xl flex items-center justify-between shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2.5 text-muted-foreground group-hover:text-foreground transition-colors">
              <Download size={18} className="text-primary transition-transform group-hover:scale-110" />
              Export Financial Reports
            </span>
            <ChevronDown size={16} className="rotate-270 opacity-40 group-hover:opacity-85" />
          </button>
        </Link>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Collected", value: "PKR 0", icon: Wallet, trend: { percentage: 0, isPositive: true } },
          { label: "Pending Fees", value: "PKR 0", icon: AlertCircle, trend: { percentage: 0, isPositive: false } },
          { label: "Collection Rate", value: "0%", icon: TrendingUp, trend: { percentage: 0, isPositive: true } },
          { label: "Overdue Profiles", value: "0 Students", icon: AlertCircle, trend: { percentage: 0, isPositive: false } }
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 + 0.1, duration: 0.2 }}
          >
            <MetricCard label={card.label} value={card.value} icon={card.icon} trend={card.trend} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          className="lg:col-span-2 bg-background border border-border/50 rounded-3xl p-6 shadow-md"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Monthly Collection Trend</h3>
          <ReactECharts option={monthlyRevenueOpts} style={{ height: 220 }} />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.2 }}
          className="bg-background border border-border/50 rounded-3xl p-6 shadow-md flex flex-col items-center justify-between"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 self-start">Collection Health</h3>
          <ReactECharts option={feeHealthOpts} style={{ height: 160, width: '100%' }} />
          <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest mt-1">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"/>Collected</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-warning inline-block"/>Pending</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"/>Overdue</span>
          </div>
        </motion.div>
      </div>

      {/* Payment Settlements */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.2 }}
          className="bg-background border border-border/50 rounded-3xl p-6 shadow-md"
        >
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Recent Settlements Ledger</h3>
          <div className="space-y-3">
            {recentPayments.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-2xl border border-border/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                    {p.student.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{p.student}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{p.id} · {p.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-foreground">{p.amount}</span>
                  <p className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">{p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
