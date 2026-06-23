export interface SLO {
  id: string
  description: string
  subject: string
  chapter: string
  ncp: string
  class: string
}

export interface SLOAssessmentEvent {
  id: string
  sloId: string
  class: string
  testDate: string
  testMethod: 'MCQs' | 'Writing' | 'Oral' | 'Practical' | 'Project'
  teachingMethod: 'Lecture' | 'Group Activity' | 'Direct Instruction' | 'Research'
  status: 'Completed' | 'Pending' | 'Re-test Scheduled'
}

export const mockSLOs: SLO[] = []

export const mockSLOEvents: SLOAssessmentEvent[] = []

export const getSLOsByChapter = (subject: string, chapter: string): SLO[] => {
  return mockSLOs.filter(s => s.subject === subject && s.chapter === chapter)
}

export const curriculumSubjects = ['English', 'Mathematics', 'Science', 'Islamic Studies', 'Social Studies']
export const curriculumChapters = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4']

export const subjects = curriculumSubjects
export const chapters = curriculumChapters
