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
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Assessment', href: '/assessment', icon: ClipboardList },
  { label: 'Attendance', href: '/attendance', icon: UserCheck },
  { label: 'Students', href: '/students', icon: Users },
  { label: 'Fee Management', href: '/fees', icon: CreditCard },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'Admin', href: '/admin', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'flex flex-col bg-secondary text-secondary-foreground border-r border-border transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <h1 className="font-heading font-bold text-lg text-primary">Ummat</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-neutral rounded-md transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={20}
            className={cn(
              'transition-transform',
              collapsed ? 'rotate-180' : ''
            )}
          />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-secondary-foreground hover:bg-neutral hover:bg-opacity-50'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border p-3 space-y-2">
        <button
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors',
            'text-secondary-foreground hover:bg-neutral hover:bg-opacity-50'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
