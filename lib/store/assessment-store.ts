import { create } from 'zustand'

interface AssessmentFilters {
  branch: string
  class: string
  subject: string
  chapter: string
  slo: string
}

type SaveStatus = 'idle' | 'saving' | 'saved'

interface AssessmentStore {
  filters: AssessmentFilters
  setFilters: (f: Partial<AssessmentFilters>) => void
  saveStatus: SaveStatus
  setSaveStatus: (s: SaveStatus) => void
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  filters: { branch: 'Main Campus', class: '10-A', subject: 'English', chapter: 'Chapter 1', slo: 'SLO-001' },
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  saveStatus: 'idle',
  setSaveStatus: (saveStatus) => set({ saveStatus }),
}))
