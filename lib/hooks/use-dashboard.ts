'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getDashboardKPIs,
  getClassPerformance,
  getAttendanceTrend,
  getFeeBreakdown,
  getDashboardActivity,
  getPendingApprovals,
} from '@/lib/actions/dashboard'

type DateRange = 'week' | 'month' | 'quarter'

export function useDashboardKPIs(branchId?: string, dateRange: DateRange = 'month') {
  return useQuery({
    queryKey: ['dashboard-kpis', branchId, dateRange],
    queryFn: () => getDashboardKPIs({ branchId, dateRange }),
    staleTime: 30_000,
  })
}

export function useClassPerformance(branchId?: string) {
  return useQuery({
    queryKey: ['class-performance', branchId],
    queryFn: () => getClassPerformance({ branchId }),
    staleTime: 60_000,
  })
}

export function useAttendanceTrend(branchId?: string, dateRange: DateRange = 'month') {
  return useQuery({
    queryKey: ['attendance-trend', branchId, dateRange],
    queryFn: () => getAttendanceTrend({ branchId, dateRange }),
    staleTime: 30_000,
  })
}

export function useFeeBreakdown(branchId?: string) {
  return useQuery({
    queryKey: ['fee-breakdown', branchId],
    queryFn: () => getFeeBreakdown({ branchId }),
    staleTime: 30_000,
  })
}

export function useDashboardActivity(branchId?: string) {
  return useQuery({
    queryKey: ['dashboard-activity', branchId],
    queryFn: () => getDashboardActivity({ branchId, limit: 8 }),
    staleTime: 30_000,
  })
}

export function usePendingApprovals(branchId?: string) {
  return useQuery({
    queryKey: ['pending-approvals', branchId],
    queryFn: () => getPendingApprovals({ branchId }),
    staleTime: 30_000,
  })
}
