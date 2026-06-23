import { create } from 'zustand'

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
  comment?: string
}

interface ApprovalStore {
  pending: PendingApproval[]
  approved: PendingApproval[]
  revision: PendingApproval[]
  approve: (id: string) => void
  requestRevision: (id: string, comment: string) => void
}

const mockPending: PendingApproval[] = []

export const useApprovalStore = create<ApprovalStore>((set) => ({
  pending: mockPending,
  approved: [],
  revision: [],
  approve: (id) =>
    set((s) => {
      const item = s.pending.find((p) => p.id === id)
      if (!item) return s
      return {
        pending: s.pending.filter((p) => p.id !== id),
        approved: [{ ...item, status: 'approved' }, ...s.approved],
      }
    }),
  requestRevision: (id, comment) =>
    set((s) => {
      const item = s.pending.find((p) => p.id === id)
      if (!item) return s
      return {
        pending: s.pending.filter((p) => p.id !== id),
        revision: [{ ...item, status: 'revision', comment }, ...s.revision],
      }
    }),
}))
