export interface SLO {
  id: string
  description: string
  subject: string
  chapter: string
  ncp: string
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

export const mockSLOs: SLO[] = [
  // === ENGLISH ===
  // Chapter 1 (12 SLOs)
  { id: 'SLO-001', description: 'Students can identify main ideas in a reading passage', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-101' },
  { id: 'SLO-002', description: 'Students can distinguish between facts and opinions', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-102' },
  { id: 'SLO-003', description: 'Students can use context clues to define unfamiliar vocabulary', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-103' },
  { id: 'SLO-004', description: 'Students can summarize text elements in sequential order', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-104' },
  { id: 'SLO-005', description: 'Students can analyze character motivations and traits', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-105' },
  { id: 'SLO-006', description: 'Students can write a clear persuasive paragraph outline', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-106' },
  { id: 'SLO-007', description: 'Students can recognize active and passive voice constructions', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-107' },
  { id: 'SLO-008', description: 'Students can identify correct subject-verb agreements', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-108' },
  { id: 'SLO-009', description: 'Students can draft structured formal letters and inquiries', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-109' },
  { id: 'SLO-010', description: 'Students understand complex punctuation and colon rules', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-110' },
  { id: 'SLO-011', description: 'Students can distinguish literal and figurative statements', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-111' },
  { id: 'SLO-012', description: 'Students can apply rhetorical devices to express arguments', subject: 'English', chapter: 'Chapter 1', ncp: 'NCP-ENG-112' },
  
  // Chapter 2 (6 SLOs)
  { id: 'SLO-013', description: 'Students demonstrate speaking fluency in formal dialogue', subject: 'English', chapter: 'Chapter 2', ncp: 'NCP-ENG-201' },
  { id: 'SLO-014', description: 'Students can evaluate bias and tone in speeches', subject: 'English', chapter: 'Chapter 2', ncp: 'NCP-ENG-202' },
  { id: 'SLO-015', description: 'Students can identify poetic structures and stanzas', subject: 'English', chapter: 'Chapter 2', ncp: 'NCP-ENG-203' },
  { id: 'SLO-016', description: 'Students can perform comparative literary analysis', subject: 'English', chapter: 'Chapter 2', ncp: 'NCP-ENG-204' },
  { id: 'SLO-017', description: 'Students apply correct prepositions in complex clauses', subject: 'English', chapter: 'Chapter 2', ncp: 'NCP-ENG-205' },
  { id: 'SLO-018', description: 'Students can write narrative essays with sensory details', subject: 'English', chapter: 'Chapter 2', ncp: 'NCP-ENG-206' },

  // === MATHEMATICS ===
  // Chapter 1 (15 SLOs)
  { id: 'SLO-019', description: 'Students understand variable equations and parameters', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-101' },
  { id: 'SLO-020', description: 'Students can solve simple linear equations in one step', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-102' },
  { id: 'SLO-021', description: 'Students can graph linear inequalities on number lines', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-103' },
  { id: 'SLO-022', description: 'Students can calculate slope using the coordinate formula', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-104' },
  { id: 'SLO-023', description: 'Students can plot linear equations on coordinate planes', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-105' },
  { id: 'SLO-024', description: 'Students understand slope-intercept graphing parameters', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-106' },
  { id: 'SLO-025', description: 'Students solve simultaneous linear systems algebraically', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-107' },
  { id: 'SLO-026', description: 'Students solve matrix additions and subtractions', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-108' },
  { id: 'SLO-027', description: 'Students can calculate determinants of 2x2 matrices', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-109' },
  { id: 'SLO-028', description: 'Students apply Cramers Rule to simultaneous equations', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-110' },
  { id: 'SLO-029', description: 'Students can simplify rational algebraic fractions', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-111' },
  { id: 'SLO-030', description: 'Students understand operations with polynomial terms', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-112' },
  { id: 'SLO-031', description: 'Students can factorize simple quadratic expressions', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-113' },
  { id: 'SLO-032', description: 'Students can solve problems involving ratios and scales', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-114' },
  { id: 'SLO-033', description: 'Students can compute percentages in financial scenarios', subject: 'Mathematics', chapter: 'Chapter 1', ncp: 'NCP-MAT-115' },

  // Chapter 2 (8 SLOs)
  { id: 'SLO-034', description: 'Students understand indices and laws of exponents', subject: 'Mathematics', chapter: 'Chapter 2', ncp: 'NCP-MAT-201' },
  { id: 'SLO-035', description: 'Students can simplify complex radical expressions', subject: 'Mathematics', chapter: 'Chapter 2', ncp: 'NCP-MAT-202' },
  { id: 'SLO-036', description: 'Students can convert numbers to scientific notation', subject: 'Mathematics', chapter: 'Chapter 2', ncp: 'NCP-MAT-203' },
  { id: 'SLO-037', description: 'Students understand base-10 logarithmic concepts', subject: 'Mathematics', chapter: 'Chapter 2', ncp: 'NCP-MAT-204' },
  { id: 'SLO-038', description: 'Students can apply log laws to expand expressions', subject: 'Mathematics', chapter: 'Chapter 2', ncp: 'NCP-MAT-205' },
  { id: 'SLO-039', description: 'Students can solve exponential equations using logs', subject: 'Mathematics', chapter: 'Chapter 2', ncp: 'NCP-MAT-206' },
  { id: 'SLO-040', description: 'Students understand concepts of sets and subsets', subject: 'Mathematics', chapter: 'Chapter 2', ncp: 'NCP-MAT-207' },
  { id: 'SLO-041', description: 'Students can diagram set intersections and unions', subject: 'Mathematics', chapter: 'Chapter 2', ncp: 'NCP-MAT-208' },

  // Chapter 3 (5 SLOs)
  { id: 'SLO-042', description: 'Students can solve quadratic equations by factoring', subject: 'Mathematics', chapter: 'Chapter 3', ncp: 'NCP-MAT-301' },
  { id: 'SLO-043', description: 'Students can apply the quadratic formula to solve roots', subject: 'Mathematics', chapter: 'Chapter 3', ncp: 'NCP-MAT-302' },
  { id: 'SLO-044', description: 'Students understand the discriminant of quadratic equations', subject: 'Mathematics', chapter: 'Chapter 3', ncp: 'NCP-MAT-303' },
  { id: 'SLO-045', description: 'Students solve verbal word problems using quadratic logic', subject: 'Mathematics', chapter: 'Chapter 3', ncp: 'NCP-MAT-304' },
  { id: 'SLO-046', description: 'Students can graph simple quadratic parabolas in grid', subject: 'Mathematics', chapter: 'Chapter 3', ncp: 'NCP-MAT-305' },

  // Chapter 4 (5 SLOs)
  { id: 'SLO-047', description: 'Students apply Pythagoras theorem to real-world objects', subject: 'Mathematics', chapter: 'Chapter 4', ncp: 'NCP-MAT-401' },
  { id: 'SLO-048', description: 'Students can calculate basic trigonometric ratios in triangles', subject: 'Mathematics', chapter: 'Chapter 4', ncp: 'NCP-MAT-402' },
  { id: 'SLO-049', description: 'Students understand sine and cosine graphs and limits', subject: 'Mathematics', chapter: 'Chapter 4', ncp: 'NCP-MAT-403' },
  { id: 'SLO-050', description: 'Students can measure angles in radians and degree circles', subject: 'Mathematics', chapter: 'Chapter 4', ncp: 'NCP-MAT-404' },
  { id: 'SLO-051', description: 'Students solve word problems on heights and distances', subject: 'Mathematics', chapter: 'Chapter 4', ncp: 'NCP-MAT-405' },

  // === SCIENCE ===
  // Chapter 1 (20 SLOs)
  { id: 'SLO-052', description: 'Students understand Newton\'s first law of inertia', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-101' },
  { id: 'SLO-053', description: 'Students can formulate the F = ma relation quantitatively', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-102' },
  { id: 'SLO-054', description: 'Students understand action-reaction force pairs', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-103' },
  { id: 'SLO-055', description: 'Students can define gravitational acceleration parameters', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-104' },
  { id: 'SLO-056', description: 'Students can calculate free fall velocity equations', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-105' },
  { id: 'SLO-057', description: 'Students understand friction factors in dry surfaces', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-106' },
  { id: 'SLO-058', description: 'Students can calculate static and kinetic friction limits', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-107' },
  { id: 'SLO-059', description: 'Students understand circular motion and centripetal forces', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-108' },
  { id: 'SLO-060', description: 'Students can compute torque and rotational moments', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-109' },
  { id: 'SLO-061', description: 'Students understand the center of mass in uniform shapes', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-110' },
  { id: 'SLO-062', description: 'Students understand kinetic energy conversion rules', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-111' },
  { id: 'SLO-063', description: 'Students can compute work done by angled forces', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-112' },
  { id: 'SLO-064', description: 'Students understand mechanical power and efficiency ratios', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-113' },
  { id: 'SLO-065', description: 'Students can explain the pressure formula in fluids', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-114' },
  { id: 'SLO-066', description: 'Students understand Pascal\'s law in hydraulic presses', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-115' },
  { id: 'SLO-067', description: 'Students can explain Archimedes\' upthrust principles', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-116' },
  { id: 'SLO-068', description: 'Students understand Hooke\'s law of elastic springs', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-117' },
  { id: 'SLO-069', description: 'Students can compute Young\'s modulus of elasticity', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-118' },
  { id: 'SLO-070', description: 'Students explain Celsius and Kelvin temperature conversions', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-119' },
  { id: 'SLO-071', description: 'Students understand specific heat capacity coefficients', subject: 'Science', chapter: 'Chapter 1', ncp: 'NCP-SCI-120' },

  // Chapter 2 (10 SLOs)
  { id: 'SLO-072', description: 'Students understand cell organelles and functions', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-201' },
  { id: 'SLO-073', description: 'Students can distinguish plant and animal cells', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-202' },
  { id: 'SLO-074', description: 'Students understand cell membrane diffusion properties', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-203' },
  { id: 'SLO-075', description: 'Students can explain osmosis processes in solutions', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-204' },
  { id: 'SLO-076', description: 'Students understand simple mitosis phase divisions', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-205' },
  { id: 'SLO-077', description: 'Students understand meiosis division anomalies', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-206' },
  { id: 'SLO-078', description: 'Students can trace cellular tissue grouping models', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-207' },
  { id: 'SLO-079', description: 'Students can diagram basic plant xylem flow structures', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-208' },
  { id: 'SLO-080', description: 'Students understand human digestive enzyme catalogs', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-209' },
  { id: 'SLO-081', description: 'Students explain capillary gas exchange mechanisms', subject: 'Science', chapter: 'Chapter 2', ncp: 'NCP-SCI-210' },

  // Chapter 3 (5 SLOs)
  { id: 'SLO-082', description: 'Students describe light photosynthesis processes', subject: 'Science', chapter: 'Chapter 3', ncp: 'NCP-SCI-301' },
  { id: 'SLO-083', description: 'Students can calculate chloroplast reaction rates', subject: 'Science', chapter: 'Chapter 3', ncp: 'NCP-SCI-302' },
  { id: 'SLO-084', description: 'Students understand cellular respiration processes', subject: 'Science', chapter: 'Chapter 3', ncp: 'NCP-SCI-303' },
  { id: 'SLO-085', description: 'Students can distinguish aerobic and anaerobic respiration', subject: 'Science', chapter: 'Chapter 3', ncp: 'NCP-SCI-304' },
  { id: 'SLO-086', description: 'Students understand glucose breakdown pathways', subject: 'Science', chapter: 'Chapter 3', ncp: 'NCP-SCI-305' },

  // === ISLAMIC STUDIES ===
  // Chapter 1 (8 SLOs)
  { id: 'SLO-087', description: 'Students can recite and explain Surah Al-Baqarah verses', subject: 'Islamic Studies', chapter: 'Chapter 1', ncp: 'NCP-ISL-101' },
  { id: 'SLO-088', description: 'Students understand Pillars of Faith in daily living', subject: 'Islamic Studies', chapter: 'Chapter 1', ncp: 'NCP-ISL-102' },
  { id: 'SLO-089', description: 'Students can outline the Seerah of Prophet Muhammad (PBUH)', subject: 'Islamic Studies', chapter: 'Chapter 1', ncp: 'NCP-ISL-103' },
  { id: 'SLO-090', description: 'Students understand ethical values of honesty and justice', subject: 'Islamic Studies', chapter: 'Chapter 1', ncp: 'NCP-ISL-104' },
  { id: 'SLO-091', description: 'Students can write historical notes on early Muslim Caliphates', subject: 'Islamic Studies', chapter: 'Chapter 1', ncp: 'NCP-ISL-105' },
  { id: 'SLO-092', description: 'Students understand societal obligations of Zakat and charity', subject: 'Islamic Studies', chapter: 'Chapter 1', ncp: 'NCP-ISL-106' },
  { id: 'SLO-093', description: 'Students demonstrate basic rulings of cleanliness and Wudu', subject: 'Islamic Studies', chapter: 'Chapter 1', ncp: 'NCP-ISL-107' },
  { id: 'SLO-094', description: 'Students can discuss Quranic teachings on human rights', subject: 'Islamic Studies', chapter: 'Chapter 1', ncp: 'NCP-ISL-108' },

  // === SOCIAL STUDIES ===
  // Chapter 1 (10 SLOs)
  { id: 'SLO-095', description: 'Students analyze Pakistan movement causes and struggles', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-101' },
  { id: 'SLO-096', description: 'Students understand geographical regions of Pakistan', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-102' },
  { id: 'SLO-097', description: 'Students can analyze historical events of 1947 independence', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-103' },
  { id: 'SLO-098', description: 'Students understand constitution laws and state assemblies', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-104' },
  { id: 'SLO-099', description: 'Students describe national integration and civic duties', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-105' },
  { id: 'SLO-100', description: 'Students can locate major historical Indus Valley sites', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-106' },
  { id: 'SLO-101', description: 'Students understand local administration setups and systems', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-107' },
  { id: 'SLO-102', description: 'Students explain environmental hazards and solutions', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-108' },
  { id: 'SLO-103', description: 'Students analyze Pakistan trade agreements globally', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-109' },
  { id: 'SLO-104', description: 'Students understand climate patterns and agricultural zones', subject: 'Social Studies', chapter: 'Chapter 1', ncp: 'NCP-SOC-110' },
]

export const mockSLOEvents: SLOAssessmentEvent[] = [
  { id: 'EVT-001', sloId: 'SLO-001', class: '10-A', testDate: '2025-05-10', testMethod: 'Writing', teachingMethod: 'Lecture', status: 'Completed' },
  { id: 'EVT-002', sloId: 'SLO-087', class: '10-A', testDate: '2025-05-12', testMethod: 'Oral', teachingMethod: 'Direct Instruction', status: 'Completed' },
  { id: 'EVT-003', sloId: 'SLO-095', class: '9-B', testDate: '2025-05-14', testMethod: 'MCQs', teachingMethod: 'Research', status: 'Completed' },
  { id: 'EVT-004', sloId: 'SLO-042', class: '10-B', testDate: '2025-05-15', testMethod: 'Writing', teachingMethod: 'Direct Instruction', status: 'Pending' },
  { id: 'EVT-005', sloId: 'SLO-013', class: '10-A', testDate: '2025-05-18', testMethod: 'Oral', teachingMethod: 'Group Activity', status: 'Re-test Scheduled' },
]

export const getSLOsByChapter = (subject: string, chapter: string): SLO[] => {
  return mockSLOs.filter(s => s.subject === subject && s.chapter === chapter)
}

export const curriculumSubjects = ['English', 'Mathematics', 'Science', 'Islamic Studies', 'Social Studies']
export const curriculumChapters = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4']

export const subjects = curriculumSubjects
export const chapters = curriculumChapters
