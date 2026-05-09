'use client'

import { usePathname } from 'next/navigation'
import { Bell, Settings, LogOut, ChevronDown, Search, Sun, Moon, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/lib/store/ui-store'
import Link from 'next/link'

const pathLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/assessment': 'Assessment',
  '/attendance': 'Attendance',
  '/students': 'Students',
  '/fees': 'Fee Management',
  '/analytics': 'Analytics',
  '/slo': 'SLO & Curriculum',
  '/approvals': 'Approvals',
  '/audit': 'Audit Logs',
  '/admin': 'Admin & Settings',
}

const allLinks = [
  { label: 'Dashboard', href: '/' },
  { label: 'Assessment Matrix', href: '/assessment' },
  { label: 'Attendance', href: '/attendance' },
  { label: 'Students', href: '/students' },
  { label: 'Fee Management', href: '/fees' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'SLO & Curriculum', href: '/slo' },
  { label: 'Approvals', href: '/approvals' },
  { label: 'Audit Logs', href: '/audit' },
  { label: 'Admin & Settings', href: '/admin' },
]

const notifications = [
  { title: 'Attendance Due', desc: 'Class 10-A pending today', time: '5m ago' },
  { title: 'Approval Needed', desc: '3 assessments awaiting review', time: '20m ago' },
  { title: 'Fee Overdue', desc: '12 students have outstanding fees', time: '1h ago' },
]

export function TopNav() {
  const pathname = usePathname()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const { selectedBranch, setSelectedBranch, isDarkMode, toggleDarkMode } = useUIStore()
  const branches = ['All Branches', 'Main Campus', 'North Campus', 'South Campus']
  const [branchOpen, setBranchOpen] = useState(false)

  const pageTitle = Object.entries(pathLabels).find(([key]) =>
    key === '/' ? pathname === '/' : pathname.startsWith(key)
  )?.[1] ?? 'Dashboard'

  // dark mode class on html
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => searchRef.current?.focus(), 50)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const filteredLinks = allLinks.filter(l =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      {/* Command Palette Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setSearchOpen(false); setSearchQuery('') }} />
          <div className="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={16} className="text-muted-foreground" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search modules, students..."
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery('') }}>
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="py-2 max-h-72 overflow-y-auto">
              {filteredLinks.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">No results found</p>
              ) : (
                filteredLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-sm text-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {link.label}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between px-5 py-3">
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">Home</span>
            <span className="text-muted-foreground text-xs hidden sm:block">/</span>
            <h1 className="text-sm font-heading font-semibold text-foreground">{pageTitle}</h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <button
              onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50) }}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground text-xs border border-border hidden sm:flex"
            >
              <Search size={14} />
              <span>Search</span>
              <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </button>

            {/* Branch Selector */}
            <div className="relative">
              <button
                onClick={() => setBranchOpen(!branchOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-xs font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {selectedBranch}
                <ChevronDown size={13} />
              </button>
              {branchOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-background border border-border rounded-lg shadow-lg z-50 py-1">
                  {branches.map(branch => (
                    <button
                      key={branch}
                      onClick={() => { setSelectedBranch(branch); setBranchOpen(false) }}
                      className={cn(
                        'block w-full text-left px-3 py-2 text-xs transition-colors',
                        selectedBranch === branch ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
                      )}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <Bell size={17} className="text-foreground" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-xs">Notifications</h3>
                    <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full font-semibold">{notifications.length}</span>
                  </div>
                  <div className="divide-y divide-border">
                    {notifications.map((n, i) => (
                      <div key={i} className="px-4 py-3 hover:bg-muted transition-colors cursor-pointer">
                        <p className="font-semibold text-xs text-foreground">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                  JD
                </div>
                <ChevronDown size={13} className="text-muted-foreground" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-background border border-border rounded-lg shadow-lg z-50 py-1">
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-xs font-semibold text-foreground">John Doe</p>
                    <p className="text-[10px] text-muted-foreground">Branch Admin</p>
                  </div>
                  <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors">
                    <Settings size={13} /> Settings
                  </Link>
                  <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors text-danger">
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
