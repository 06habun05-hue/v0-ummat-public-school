'use client'

import { usePathname } from 'next/navigation'
import { Bell, Settings, LogOut, ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const pathLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/assessment': 'Assessment',
  '/attendance': 'Attendance',
  '/students': 'Students',
  '/fees': 'Fee Management',
  '/reports': 'Reports',
  '/admin': 'Admin',
}

export function TopNav() {
  const pathname = usePathname()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [branchOpen, setBranchOpen] = useState(false)

  const pageTitle = pathLabels[pathname] || 'Dashboard'
  const branches = ['All Branches', 'Main Campus', 'North Campus', 'South Campus']
  const [selectedBranch, setSelectedBranch] = useState('All Branches')

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Breadcrumbs & Title */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Home</span>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-heading font-semibold text-foreground">
            {pageTitle}
          </h1>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:flex items-center gap-2 text-muted-foreground"
            title="Search (Cmd+K)"
          >
            <Search size={18} />
            <span className="text-xs hidden md:inline">Cmd+K</span>
          </button>

          {/* Branch Selector */}
          <div className="relative">
            <button
              onClick={() => setBranchOpen(!branchOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              {selectedBranch}
              <ChevronDown size={16} />
            </button>
            {branchOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                {branches.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => {
                      setSelectedBranch(branch)
                      setBranchOpen(false)
                    }}
                    className={cn(
                      'block w-full text-left px-4 py-2.5 text-sm transition-colors',
                      selectedBranch === branch
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell size={20} className="text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            </button>
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                <div className="p-3 space-y-2">
                  <div className="p-2 bg-muted rounded text-sm">
                    <p className="font-medium">Attendance Due</p>
                    <p className="text-xs text-muted-foreground">Class 10-A pending</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-sm">
                    <p className="font-medium">Assessment Submission</p>
                    <p className="text-xs text-muted-foreground">2 classes pending approval</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
              title="Profile"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
              <ChevronDown size={16} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                <button className="block w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2">
                  <Settings size={16} />
                  Settings
                </button>
                <button className="block w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-danger">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
