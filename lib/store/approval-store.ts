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

const mockPending: PendingApproval[] = [
  { id: 'APV001', teacher: 'Ms. Sana Malik', class: '10-A', subject: 'English', chapter: 'Chapter 2', slo: 'SLO-003', dateSubmitted: '2025-05-09', studentCount: 28, status: 'pending' },
  { id: 'APV002', teacher: 'Mr. Tariq Ahmed', class: '9-B', subject: 'Mathematics', chapter: 'Chapter 1', slo: 'SLO-001', dateSubmitted: '2025-05-09', studentCount: 30, status: 'pending' },
  { id: 'APV003', teacher: 'Ms. Ayesha Noor', class: '8-A', subject: 'Science', chapter: 'Chapter 3', slo: 'SLO-002', dateSubmitted: '2025-05-08', studentCount: 25, status: 'pending' },
  { id: 'APV004', teacher: 'Mr. Hassan Raza', class: '10-B', subject: 'Islamic Studies', chapter: 'Chapter 1', slo: 'SLO-004', dateSubmitted: '2025-05-08', studentCount: 27, status: 'pending' },
]

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
