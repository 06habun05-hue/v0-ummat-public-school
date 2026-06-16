'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, MapPin } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getBranchUsers } from '@/lib/actions/branches'
import { cn } from '@/lib/utils'

interface BranchDetailSheetProps {
  open: boolean
  onClose: () => void
  branch: {
    id: string
    name: string
    location: string
    principalName: string | null
    studentCount: number
    status: string
  } | null
}

const roleColors: Record<string, string> = {
  BRANCH_ADMIN: 'bg-primary/10 text-primary border-primary/20',
  PRINCIPAL:    'bg-warning/10 text-warning border-warning/20',
  TEACHER:      'bg-muted text-muted-foreground border-border',
  ACCOUNTANT:   'bg-muted text-muted-foreground border-border',
  COORDINATOR:  'bg-muted text-muted-foreground border-border',
}

export function BranchDetailSheet({ open, onClose, branch }: BranchDetailSheetProps) {
  const { data: branchUsers, isLoading } = useQuery({
    queryKey: ['branch-users', branch?.id],
    queryFn: () => getBranchUsers(branch!.id),
    enabled: !!branch?.id && open,
  })

  if (!branch) return null

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto">
        <SheetHeader className="p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 size={24} />
            </div>
            <div>
              <SheetTitle className="font-heading font-black text-xl tracking-tight">{branch.name}</SheetTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin size={11} /> {branch.location}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Students', value: branch.studentCount.toLocaleString(), icon: Users },
              { label: 'Principal',      value: branch.principalName ?? '—', icon: Building2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
                <p className="font-black text-sm text-foreground leading-tight">{value}</p>
              </div>
            ))}
          </div>

          {/* Users in branch */}
          <div>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-3">
              Staff Members
            </p>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-muted/40 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : !branchUsers || branchUsers.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No staff assigned to this branch.</p>
            ) : (
              <div className="space-y-2">
                {branchUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-2xl border border-border/30">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                      {u.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{u.fullName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge variant="outline" className={cn('text-[9px] font-black uppercase tracking-wider px-2 py-0.5 flex-shrink-0', roleColors[u.role])}>
                      {u.role.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
