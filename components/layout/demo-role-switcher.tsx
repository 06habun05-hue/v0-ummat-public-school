'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ShieldAlert, GraduationCap, Wallet, ChevronDown, Check, Sparkles } from 'lucide-react'
import { useUIStore, UserRole } from '@/lib/store/ui-store'
import { cn } from '@/lib/utils'

const rolesConfig: Record<UserRole, {
  label: string
  desc: string
  color: string
  bg: string
  border: string
  icon: any
}> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    desc: 'Full system authorization',
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    icon: ShieldAlert,
  },
  BRANCH_ADMIN: {
    label: 'Branch Admin',
    desc: 'Campus wide administration',
    color: 'text-indigo-500 dark:text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    icon: Shield,
  },
  ACCOUNTANT: {
    label: 'Accountant',
    desc: 'Treasury & billing controls',
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: Wallet,
  },
  TEACHER: {
    label: 'Teacher',
    desc: 'Classes, grading & attendance',
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: GraduationCap,
  },
}

export function DemoRoleSwitcher() {
  const { role, setRole } = useUIStore()
  const [open, setOpen] = useState(false)
  const current = rolesConfig[role]
  const CurrentIcon = current.icon

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all duration-300 shadow-sm active:scale-95 select-none',
          current.bg,
          current.color,
          current.border
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
        <CurrentIcon size={12} className="stroke-[2.5]" />
        <span>{current.label}</span>
        <ChevronDown size={10} className={cn('transition-transform duration-300', open ? 'rotate-180' : '')} />
      </button>

      {/* Popover list */}
      <AnimatePresence>
        {open && (
          <>
            {/* Click outside backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 py-2.5 overflow-hidden origin-top-right"
            >
              {/* Header inside popover */}
              <div className="px-4 py-2 border-b border-border mb-1 flex items-center justify-between bg-muted/30">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={10} className="text-amber-500 animate-pulse" />
                  Select Demo Persona
                </span>
                <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Mock</span>
              </div>

              {/* Roles list */}
              <div className="space-y-0.5 px-1.5">
                {(Object.keys(rolesConfig) as UserRole[]).map((key) => {
                  const item = rolesConfig[key]
                  const ItemIcon = item.icon
                  const isSelected = role === key

                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setRole(key)
                        setOpen(false)
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 border border-transparent select-none relative group',
                        isSelected 
                          ? 'bg-primary/5 text-primary border-primary/10 font-bold' 
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105',
                        isSelected ? item.bg : 'bg-muted/80'
                      )}>
                        <ItemIcon size={14} className={cn('stroke-[2.2]', isSelected ? item.color : 'text-muted-foreground group-hover:text-foreground')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-xs leading-none font-semibold transition-colors', isSelected ? 'text-primary' : 'text-foreground')}>
                          {item.label}
                        </p>
                        <p className="text-[9px] text-muted-foreground truncate mt-1 tracking-tight font-medium">
                          {item.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div layoutId="activeRoleCheck" className="text-primary pr-1">
                          <Check size={14} className="stroke-[3]" />
                        </motion.div>
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
