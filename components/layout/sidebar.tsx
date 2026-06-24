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
  GraduationCap,
} from 'lucide-react'
import { useState } from 'react'
import { useUIStore, UserRole } from '@/lib/store/ui-store'
import { useApprovalStore } from '@/lib/store/approval-store'
import Image from 'next/image'

const ALL_NAV_GROUPS = {
  CORE: {
    label: 'Core',
    items: [{ label: 'Dashboard', href: '/', icon: LayoutDashboard }],
  },
  ACADEMIC: {
    label: 'Academic',
    items: [
      { label: 'Assessment', href: '/assessment', icon: ClipboardList },
      { label: 'Attendance', href: '/attendance', icon: UserCheck },
      { label: 'Students', href: '/students', icon: Users },
      { label: 'Classes', href: '/classes', icon: GraduationCap },
      { label: 'SLO & Curriculum', href: '/slo', icon: BookOpen },
      { label: 'SLO Tracking', href: '/slo-tracking', icon: ScrollText },
      { label: 'Approvals', href: '/approvals', icon: CheckCircle, badge: true },
    ],
  },
  ADMINISTRATION: {
    label: 'Administration',
    items: [
      { label: 'Fee Management', href: '/fees', icon: CreditCard },
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { label: 'Audit Logs', href: '/audit', icon: ScrollText },
    ],
  },
  SYSTEM: {
    label: 'System',
    items: [{ label: 'Admin & Settings', href: '/admin', icon: Settings }],
  },
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['CORE', 'ACADEMIC', 'ADMINISTRATION', 'SYSTEM'],
  BRANCH_ADMIN: ['CORE', 'ACADEMIC', 'ADMINISTRATION', 'SYSTEM'],
  ACCOUNTANT: ['CORE', 'ADMINISTRATION'],
  TEACHER: ['CORE', 'ACADEMIC'],
}

interface SidebarContentProps {
  collapsed?: boolean
  onItemClick?: () => void
}

export function SidebarContent({ collapsed = false, onItemClick }: SidebarContentProps) {
  const pathname = usePathname()
  const { role, logout } = useUIStore()
  const pendingCount = useApprovalStore((s) => s.pending.length)

  const allowedGroups = ROLE_PERMISSIONS[role]
  const navGroups = allowedGroups.map(key => ALL_NAV_GROUPS[key as keyof typeof ALL_NAV_GROUPS])

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1.5">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-white/30">
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
                    onClick={onItemClick}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group relative',
                      isActive
                        ? 'bg-white/10 text-white font-bold shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className={cn('flex-shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-white/50 group-hover:text-white')} />
                    {!collapsed && (
                      <span className="flex-1 leading-none tracking-tight">{item.label}</span>
                    )}
                    {!collapsed && showBadge && (
                      <span className="bg-accent text-white text-[10px] font-black px-2 py-0.5 rounded-full leading-none shadow-lg">
                        {pendingCount}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute left-0 w-1 h-4 bg-white rounded-r-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile/Role Status */}
      {!collapsed && (
        <div className="px-3 py-4">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
             <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">Access Level</p>
             <p className="text-xs font-bold text-white flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               {role.replace('_', ' ')}
             </p>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="border-t border-white/5 p-3">
        <button
          onClick={() => { logout(); onItemClick?.() }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all text-white/50 hover:text-white hover:bg-white/5 text-sm font-medium"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-secondary text-secondary-foreground border-r border-white/5 transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg border border-white/10 overflow-hidden">
              <Image src="/logo.jpg" alt="Ummat Logo" width={32} height={32} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-sm text-white tracking-tight leading-none">Ummat</span>
              <span className="text-[9px] font-bold text-white/50 uppercase tracking-tighter mt-1">Systems</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-white/5 rounded-md transition-colors ml-auto text-white/70 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={16}
            className={cn('transition-transform', collapsed ? 'rotate-180' : '')}
          />
        </button>
      </div>

      <SidebarContent collapsed={collapsed} />
    </aside>
  )
}
