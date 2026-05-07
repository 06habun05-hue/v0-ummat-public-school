'use client'

import { MetricCard } from './metric-card'
import { ClassPerformanceChart } from './class-performance-chart'
import { AttendanceTrendsChart } from './attendance-trends-chart'
import { FeeCollectionChart } from './fee-collection-chart'
import {
  Users,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from 'lucide-react'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Dashboard() {
  const [dateRange, setDateRange] = useState('month')
  const [selectedBranch, setSelectedBranch] = useState('All Branches')

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Analytics Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time metrics and performance insights
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Date Range Filter */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
              <Calendar size={16} />
              <span>Last {dateRange === 'month' ? 'Month' : 'Quarter'}</span>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
              <span>{selectedBranch}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Total Students"
          value="2,458"
          icon={Users}
          trend={{ percentage: 12, isPositive: true }}
        />
        <MetricCard
          label="Total Teachers"
          value="124"
          icon={BookOpen}
          trend={{ percentage: 5, isPositive: true }}
        />
        <MetricCard
          label="Attendance Rate"
          value="94.2%"
          icon={CheckCircle2}
          trend={{ percentage: 3, isPositive: true }}
        />
        <MetricCard
          label="Pending Approvals"
          value="18"
          icon={AlertCircle}
          trend={{ percentage: 8, isPositive: false }}
        />
        <MetricCard
          label="Fee Collection"
          value="87.5%"
          icon={CreditCard}
          trend={{ percentage: 6, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
            Class Performance
          </h3>
          <ClassPerformanceChart />
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
            Attendance Trends
          </h3>
          <AttendanceTrendsChart />
        </div>

        <div className="bg-background border border-border rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
            Fee Collection Status
          </h3>
          <FeeCollectionChart />
        </div>
      </div>
    </div>
  )
}
