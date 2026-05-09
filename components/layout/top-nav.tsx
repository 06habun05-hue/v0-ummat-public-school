'use client'

import { usePathname } from 'next/navigation'
import { Bell, Settings, LogOut, ChevronDown, Search, Sun, Moon, X, ShieldCheck } from 'lucide-react'
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
  const [roleOpen, setRoleOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const { selectedBranch, setSelectedBranch, isDarkMode, toggleDarkMode, role, setRole } = useUIStore()
  const branches = ['All Branches', 'Main Campus', 'North Campus', 'South Campus']
  const roles: UserRole[] = ['SUPER_ADMIN', 'BRANCH_ADMIN', 'ACCOUNTANT', 'TEACHER']
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
          <div className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search size={18} className="text-muted-foreground" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search modules, students..."
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground font-medium"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery('') }} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="py-2 max-h-80 overflow-y-auto">
              {filteredLinks.length === 0 ? (
                <p className="px-6 py-4 text-sm text-muted-foreground font-medium text-center">No results found</p>
              ) : (
                filteredLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted transition-colors text-sm text-foreground group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors flex-shrink-0" />
                    <span className="font-semibold">{link.label}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-3.5">
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 hidden sm:block">Portal</span>
            <span className="text-muted-foreground/30 text-[10px] hidden sm:block">/</span>
            <h1 className="text-sm font-heading font-black text-foreground tracking-tight">{pageTitle}</h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50) }}
              className="flex items-center gap-3 px-4 py-2 hover:bg-muted rounded-xl transition-all text-muted-foreground text-xs border border-border hidden lg:flex bg-muted/30"
            >
              <Search size={14} />
              <span className="font-semibold">Quick Search</span>
              <kbd className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded-md font-mono font-bold shadow-sm">⌘K</kbd>
            </button>

            {/* Role Switcher (Preview Only) */}
            <div className="relative">
              <button
                onClick={() => setRoleOpen(!roleOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-xl hover:bg-accent/20 transition-all text-[11px] font-black text-accent uppercase tracking-wider"
              >
                <ShieldCheck size={13} />
                {role.replace('_', ' ')}
                <ChevronDown size={13} />
              </button>
              {roleOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-slide-in">
                  <p className="px-4 py-2 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Switch Identity</p>
                  {roles.map(r => (
                    <button
                      key={r}
                      onClick={() => { setRole(r); setRoleOpen(false) }}
                      className={cn(
                        'block w-full text-left px-4 py-2.5 text-xs font-bold transition-all',
                        role === r ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {r.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Branch Selector */}
            <div className="relative">
              <button
                onClick={() => setBranchOpen(!branchOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-xl hover:bg-muted transition-all text-xs font-bold"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(42,122,48,0.5)]" />
                {selectedBranch}
                <ChevronDown size={13} className="text-muted-foreground" />
              </button>
              {branchOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-background border border-border rounded-2xl shadow-2xl z-50 py-2 animate-slide-in">
                  {branches.map(branch => (
                    <button
                      key={branch}
                      onClick={() => { setSelectedBranch(branch); setBranchOpen(false) }}
                      className={cn(
                        'block w-full text-left px-4 py-2.5 text-xs font-bold transition-all',
                        selectedBranch === branch ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Icons Group */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground"
                title="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 hover:bg-muted rounded-xl transition-all group"
                >
                  <Bell size={19} className="text-foreground transition-transform group-hover:rotate-12" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background animate-pulse" />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-in">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                      <h3 className="font-black text-xs uppercase tracking-widest">Inbox</h3>
                      <span className="text-[10px] bg-accent text-white px-2 py-0.5 rounded-full font-black shadow-sm">{notifications.length}</span>
                    </div>
                    <div className="divide-y divide-border">
                      {notifications.map((n, i) => (
                        <div key={i} className="px-5 py-4 hover:bg-muted transition-all cursor-pointer group">
                          <p className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">{n.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{n.desc}</p>
                          <p className="text-[10px] font-black uppercase text-muted-foreground/40 mt-2 tracking-tighter">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 hover:bg-muted rounded-xl transition-all border border-transparent hover:border-border"
              >
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-black text-xs shadow-inner">
                  JD
                </div>
                <div className="hidden sm:flex flex-col items-start mr-1">
                  <span className="text-[10px] font-black text-foreground leading-none">John Doe</span>
                  <span className="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-tighter mt-0.5">{role.split('_')[0]}</span>
                </div>
                <ChevronDown size={13} className="text-muted-foreground" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-background border border-border rounded-2xl shadow-2xl z-50 py-2 animate-slide-in">
                  <div className="px-4 py-3 border-b border-border mb-1">
                    <p className="text-[11px] font-black text-foreground">Account Info</p>
                    <p className="text-[10px] text-muted-foreground font-medium truncate">john.doe@ummat.edu</p>
                  </div>
                  <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                    <Settings size={15} /> My Settings
                  </Link>
                  <button className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-xs font-bold text-accent hover:bg-accent/5 transition-all">
                    <LogOut size={15} /> Sign Out
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
