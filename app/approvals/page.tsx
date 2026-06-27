'use client'

import { useState, useEffect } from 'react'
import { Check, RotateCcw, Clock, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export interface PendingApproval {
  id: string
  teacher: string
  class: string
  subject: string
  chapter: string
  slo: string
  dateSubmitted: string
  studentCount: number
  status: 'pending' | 'approved' | 'revision'
  comment: string | null
}

const tabs = ['Pending', 'Approved', 'Revision Requested'] as const
type Tab = typeof tabs[number]

function ApprovalCard({ item, onApprove, onRevise }: {
  item: PendingApproval
  onApprove?: () => void
  onRevise?: (comment: string) => void
}) {
  const [reviseOpen, setReviseOpen] = useState(false)
  const [comment, setComment] = useState('')

  return (
    <div className="bg-background border border-border rounded-lg p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
            <span className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide',
              item.status === 'pending' && 'bg-warning/10 text-warning',
              item.status === 'approved' && 'bg-primary/10 text-primary',
              item.status === 'revision' && 'bg-accent/10 text-accent',
            )}>
              {item.status === 'revision' ? 'Revision' : item.status}
            </span>
          </div>
          <h3 className="font-semibold text-sm text-foreground">{item.teacher}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.class} · {item.subject} · {item.chapter} · {item.slo}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-muted-foreground">{new Date(item.dateSubmitted).toLocaleDateString()}</p>
          <p className="text-xs font-medium mt-0.5">{item.studentCount} students</p>
        </div>
      </div>

      {item.comment && (
        <div className="bg-accent/5 border border-accent/20 rounded-md p-3">
          <p className="text-xs text-accent font-semibold mb-1 flex items-center gap-1"><MessageSquare size={11} /> Revision Comment</p>
          <p className="text-xs text-foreground">{item.comment}</p>
        </div>
      )}

      {onApprove && onRevise && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => onApprove()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Check size={13} /> Approve
            </button>
            <button
              onClick={() => setReviseOpen(!reviseOpen)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-accent text-accent text-xs font-semibold rounded-md hover:bg-accent/5 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} /> Request Revision
            </button>
          </div>
          {reviseOpen && (
            <div className="space-y-2">
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Describe what needs to be corrected..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => {
                  if (!comment.trim()) return
                  onRevise(comment)
                  setReviseOpen(false)
                  setComment('')
                }}
                className="w-full py-2 bg-accent text-white text-xs font-semibold rounded-md hover:bg-accent/90 transition-colors cursor-pointer"
              >
                Send Revision Request
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Pending')
  const [pending, setPending] = useState<PendingApproval[]>([])
  const [approved, setApproved] = useState<PendingApproval[]>([])
  const [revision, setRevision] = useState<PendingApproval[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApprovals = async () => {
    try {
      const res = await fetch('/api/approvals')
      if (res.ok) {
        const data = await res.json()
        setPending(data.pending || [])
        setApproved(data.approved || [])
        setRevision(data.revision || [])
      } else {
        toast.error('Failed to load approvals')
      }
    } catch {
      toast.error('Error loading approvals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovals()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'approve' }),
      })
      if (res.ok) {
        toast.success('Assessment approved successfully!')
        fetchApprovals()
      } else {
        toast.error('Failed to approve assessment')
      }
    } catch {
      toast.error('Error approving assessment')
    }
  }

  const handleRevise = async (id: string, comment: string) => {
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'revision', comment }),
      })
      if (res.ok) {
        toast.info('Revision requested successfully!')
        fetchApprovals()
      } else {
        toast.error('Failed to request revision')
      }
    } catch {
      toast.error('Error requesting revision')
    }
  }

  const lists = {
    'Pending': pending,
    'Approved': approved,
    'Revision Requested': revision,
  }

  const current = lists[activeTab]

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Approval Workflow</h2>
          <p className="text-sm text-muted-foreground mt-1">Review and approve teacher assessment submissions</p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-1.5 bg-warning/10 text-warning border border-warning/20 rounded-md font-semibold">{pending.length} Pending</div>
          <div className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-md font-semibold">{approved.length} Approved</div>
          <div className="px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-md font-semibold">{revision.length} Revision</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer',
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
            <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-full">{lists[tab].length}</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm font-medium">
          Loading approval workflows...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {current.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-16 text-muted-foreground">
              <CheckCircle2 size={40} className="mb-3 text-primary/40" />
              <p className="font-medium">No {activeTab.toLowerCase()} items</p>
            </div>
          ) : (
            current.map(item => (
              <ApprovalCard
                key={item.id}
                item={item}
                onApprove={activeTab === 'Pending' ? () => handleApprove(item.id) : undefined}
                onRevise={activeTab === 'Pending' ? (cmt) => handleRevise(item.id, cmt) : undefined}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
