import { create } from 'zustand'
import { mockSLOs, mockSLOEvents, SLO, SLOAssessmentEvent } from '@/lib/data/curriculum'

export interface StudentAssessment {
  id: string
  name: string
  [key: string]: string | number | null // For dynamic SLO grades
}

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
  
  // Curriculum Outcomes State
  sloList: SLO[]
  addSLO: (slo: SLO) => void
  bulkImportSLOs: (slos: SLO[]) => void
  
  // Dynamic Grades Data (key: branch_class_subject_chapter)
  gradesData: Record<string, StudentAssessment[]>
  setGradesData: (key: string, data: StudentAssessment[]) => void
  updateSingleGrade: (key: string, rowIndex: number, columnId: string, value: number | null) => void
  clearGrades: (key: string) => void
  
  // SLO Assessment tracking events
  assessmentEvents: SLOAssessmentEvent[]
  addAssessmentEvent: (event: SLOAssessmentEvent) => void
}

// Generate unique storage index
export const getGradesKey = (branch: string, className: string, subject: string, chapter: string) => {
  return `${branch}_${className}_${subject}_${chapter}`.replace(/\s+/g, '-')
}

const defaultStudents = [
  { id: '1', name: 'Ahmed Hassan' },
  { id: '2', name: 'Fatima Khan' },
  { id: '3', name: 'Muhammad Ali' },
  { id: '4', name: 'Zainab Ahmed' },
  { id: '5', name: 'Hassan Ibrahim' },
]

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  filters: { branch: 'Main Campus', class: '10-A', subject: 'English', chapter: 'Chapter 1', slo: 'SLO-001' },
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  saveStatus: 'idle',
  setSaveStatus: (saveStatus) => set({ saveStatus }),
  
  // Curriculum Outcomes
  sloList: mockSLOs,
  addSLO: (slo) => set((s) => ({ sloList: [slo, ...s.sloList] })),
  bulkImportSLOs: (newSlos) => set((s) => {
    // Resolve duplicate code on import
    const resolved = newSlos.map(row => {
      const exists = s.sloList.some(item => item.id === row.id)
      if (exists) {
        return { ...row, id: `${row.id}-NEW` }
      }
      return row
    })
    return { sloList: [...resolved, ...s.sloList] }
  }),
  
  // Grades Data
  gradesData: {},
  setGradesData: (key, data) => set((s) => ({
    gradesData: { ...s.gradesData, [key]: data }
  })),
  updateSingleGrade: (key, rowIndex, columnId, value) => set((s) => {
    const list = s.gradesData[key] ? [...s.gradesData[key]] : defaultStudents.map(student => ({ ...student }))
    if (rowIndex < list.length) {
      list[rowIndex] = {
        ...list[rowIndex],
        [columnId]: value
      }
    }
    return {
      gradesData: { ...s.gradesData, [key]: list }
    }
  }),
  clearGrades: (key) => set((s) => {
    const current = s.gradesData[key] || defaultStudents
    const cleared = current.map(student => ({ id: student.id, name: student.name }))
    return {
      gradesData: { ...s.gradesData, [key]: cleared }
    }
  }),

  // SLO Events
  assessmentEvents: mockSLOEvents,
  addAssessmentEvent: (event) => set((s) => ({ assessmentEvents: [event, ...s.assessmentEvents] }))
}))
