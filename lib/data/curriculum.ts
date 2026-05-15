export interface SLO {
  id: string
  description: string
  subject: string
  chapter: string
  ncp: string
}

export const mockSLOs: SLO[] = [
  { id: 'SLO-001', description: 'Students can identify main ideas in a passage', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-LIT-01' },
  { id: 'SLO-002', description: 'Students can solve quadratic equations', subject: 'Mathematics', chapter: 'Chapter 3', ncp: 'NCP-MATH-02' },
  { id: 'SLO-003', description: 'Students understand cell structure and function', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-01' },
  { id: 'SLO-004', description: 'Students can recite and explain Surah Al-Baqarah verses', subject: 'Islamic Studies', chapter: 'Chapter 1', ncp: 'NCP-ISL-01' },
  { id: 'SLO-005', description: 'Students demonstrate speaking fluency in conversation', subject: 'English', chapter: 'Chapter 2', ncp: 'NCP-LIT-02' },
  { id: 'SLO-006', description: 'Students apply Pythagoras theorem to real problems', subject: 'Mathematics', chapter: 'Chapter 4', ncp: 'NCP-MATH-03' },
  { id: 'SLO-007', description: 'Students describe photosynthesis process', subject: 'Science', chapter: 'Chapter 3', ncp: 'NCP-SCI-02' },
  { id: 'SLO-008', description: 'Students analyze Pakistan movement causes', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-01' },
  { id: 'SLO-009', description: 'Students can draft formal letters', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-LIT-03' },
  { id: 'SLO-010', description: 'Students understand punctuation rules', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-LIT-04' },
]

export const getSLOsByChapter = (subject: string, chapter: string): SLO[] => {
  return mockSLOs.filter(s => s.subject === subject && s.chapter === chapter)
}

export const subjects = ['English', 'Mathematics', 'Science', 'Islamic Studies', 'Social Studies']
export const chapters = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4']
