'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  CheckCircle,
  BookOpen,
  ScrollText,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import { useApprovalStore } from '@/lib/store/approval-store'

const navGroups = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Academic',
    items: [
      { label: 'Assessment', href: '/assessment', icon: ClipboardList },
      { label: 'Attendance', href: '/attendance', icon: UserCheck },
      { label: 'Students', href: '/students', icon: Users },
      { label: 'SLO & Curriculum', href: '/slo', icon: BookOpen },
      { label: 'Approvals', href: '/approvals', icon: CheckCircle, badge: true },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Fee Management', href: '/fees', icon: CreditCard },
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { label: 'Audit Logs', href: '/audit', icon: ScrollText },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Admin & Settings', href: '/admin', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const pendingCount = useApprovalStore((s) => s.pending.length)

  return (
    <aside
      className={cn(
        'flex flex-col bg-secondary text-secondary-foreground border-r border-secondary/20 transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <ShieldCheck size={15} className="text-white" />
            </div>
            <span className="font-heading font-bold text-base text-white">Ummat</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors ml-auto"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={16}
            className={cn('transition-transform text-white/70', collapsed ? 'rotate-180' : '')}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                const showBadge = item.badge && pendingCount > 0
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm',
                      isActive
                        ? 'bg-primary text-white font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/8'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={17} className="flex-shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 leading-none">{item.label}</span>
                    )}
                    {!collapsed && showBadge && (
                      <span className="bg-warning text-warning-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-2">
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-md w-full transition-colors text-white/50 hover:text-white hover:bg-white/8 text-sm"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
