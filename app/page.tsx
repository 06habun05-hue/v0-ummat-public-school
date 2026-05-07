import { Metadata } from 'next'
import { Dashboard } from '@/components/dashboard/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard | Ummat Systems',
  description: 'View your academic analytics and metrics',
}

export default function DashboardPage() {
  return <Dashboard />
}
