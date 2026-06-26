'use client'

import { useState, useEffect } from 'react'
import {
  GraduationCap,
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  LayoutGrid,
  List,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types

interface Section {
  id: string
  name: string
  capacity: number
  teacher: string
}

interface ClassRecord {
  id: string
  name: string
  grade: string
  subjects: string[]
  sections: Section[]
  createdAt: string
}

// Seed Data

const SUBJECT_OPTIONS = [
  'Mathematics', 'English', 'Urdu', 'Science', 'Social Studies',
  'Islamic Studies', 'Computer Science', 'Physics', 'Chemistry',
  'Biology', 'Pakistan Studies', 'Art & Craft',
]

const TEACHER_OPTIONS = [
  'Mr. Aamir Khan', 'Ms. Fatima Zahra', 'Mr. Hassan Ali',
  'Ms. Ayesha Siddiqui', 'Mr. Bilal Ahmed', 'Ms. Zara Malik',
  'Mr. Usman Ghani', 'Ms. Sana Javed',
]

const INITIAL_CLASSES: ClassRecord[] = [] // Empty INITIAL_CLASSES as request to remove mock data

function uid() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function SubjectBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
      {label}
    </span>
  )
}

function ClassCard({ cls, onEdit, onDelete }: { cls: ClassRecord; onEdit: (c: ClassRecord) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const totalCapacity = cls.sections.reduce((s, sec) => s + sec.capacity, 0)

  return (
    <div className="bg-background/60 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
              <GraduationCap size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-foreground">{cls.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {cls.sections.length} {cls.sections.length === 1 ? 'Section' : 'Sections'} &middot; {totalCapacity} seats
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(cls)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Edit class">
              <Pencil size={14} />
            </button>
            <button onClick={() => onDelete(cls.id)} className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors" title="Delete class">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-muted/40 rounded-xl p-2.5 flex items-center gap-2">
            <Users size={13} className="text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">Sections</p>
              <p className="text-sm font-black text-foreground">{cls.sections.length}</p>
            </div>
          </div>
          <div className="bg-muted/40 rounded-xl p-2.5 flex items-center gap-2">
            <BookOpen size={13} className="text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">Subjects</p>
              <p className="text-sm font-black text-foreground">{cls.subjects.length}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {cls.subjects.slice(0, 4).map(sub => (
            <SubjectBadge key={sub} label={sub} />
          ))}
          {cls.subjects.length > 4 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-semibold">
              +{cls.subjects.length - 4} more
            </span>
          )}
        </div>

        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1">
          <span>View Sections</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border bg-muted/20 px-5 pb-5 pt-3 space-y-2">
          {cls.sections.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-2">No sections yet</p>
          ) : (
            cls.sections.map(sec => (
              <div key={sec.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-secondary/30 flex items-center justify-center text-xs font-black text-white">
                    {sec.name}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Section {sec.name}</p>
                    <p className="text-[11px] text-muted-foreground">{sec.teacher || 'Unassigned'} &middot; Capacity: {sec.capacity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

interface ClassFormData {
  name: string
  grade: string
  subjects: string[]
  sections: Section[]
}

function ClassModal({ initial, onSave, onClose }: { initial?: ClassRecord; onSave: (data: ClassFormData) => void; onClose: () => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [grade, setGrade] = useState(initial?.grade ?? '')
  const [subjects, setSubjects] = useState<string[]>(initial?.subjects ?? [])
  const [sections, setSections] = useState<Section[]>(initial?.sections ?? [])
  const [secName, setSecName] = useState('')
  const [secCapacity, setSecCapacity] = useState('30')
  const [secTeacher, setSecTeacher] = useState('')
  const [secError, setSecError] = useState('')

  function toggleSubject(sub: string) {
    setSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub])
  }

  function addSection() {
    if (!secName.trim()) { setSecError('Section name is required'); return }
    if (sections.some(s => s.name.toLowerCase() === secName.trim().toLowerCase())) { setSecError('Section name already exists'); return }
    setSections(prev => [...prev, { id: uid(), name: secName.trim().toUpperCase(), capacity: Number(secCapacity) || 30, teacher: secTeacher }])
    setSecName(''); setSecCapacity('30'); setSecTeacher(''); setSecError('')
  }

  function removeSection(id: string) {
    setSections(prev => prev.filter(s => s.id !== id))
  }

  const isValid = name.trim() && grade.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-background z-10">
          <div>
            <h2 className="font-heading font-black text-lg text-foreground">{initial ? 'Edit Class' : 'Add New Class'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{initial ? 'Update class details and sections' : 'Create a new class for the school'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Class Name <span className="text-accent">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Grade 6" className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Grade / Level <span className="text-accent">*</span></label>
                <input value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g. 6" className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Subjects <span className="text-foreground font-normal normal-case tracking-normal">({subjects.length} selected)</span></h3>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map(sub => (
                <button key={sub} onClick={() => toggleSubject(sub)} className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all', subjects.includes(sub) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-muted/40 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground')}>
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Sections</h3>
            {sections.length > 0 && (
              <div className="space-y-2 mb-4">
                {sections.map(sec => (
                  <div key={sec.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-muted/40 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center text-xs font-black text-foreground">{sec.name}</div>
                      <div>
                        <p className="text-xs font-bold">Section {sec.name}</p>
                        <p className="text-[11px] text-muted-foreground">{sec.teacher || 'No teacher'} &middot; {sec.capacity} seats</p>
                      </div>
                    </div>
                    <button onClick={() => removeSection(sec.id)} className="p-1.5 rounded-md hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-muted/30 border border-dashed border-border rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">Add a Section</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Section Name</label>
                  <input value={secName} onChange={e => { setSecName(e.target.value); setSecError('') }} placeholder="A, B, C..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Capacity</label>
                  <input type="number" value={secCapacity} onChange={e => setSecCapacity(e.target.value)} min="1" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Teacher (optional)</label>
                  <select value={secTeacher} onChange={e => setSecTeacher(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all appearance-none">
                    <option value="">— Unassigned —</option>
                    {TEACHER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {secError && <p className="text-xs text-accent flex items-center gap-1"><AlertTriangle size={11} /> {secError}</p>}
              <button onClick={addSection} className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg text-xs font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Plus size={13} /> Add Section
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-background">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">Cancel</button>
          <button onClick={() => isValid && onSave({ name: name.trim(), grade: grade.trim(), subjects, sections })} disabled={!isValid} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            {initial ? 'Save Changes' : 'Create Class'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteModal({ className, onConfirm, onClose }: { className: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-background border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-accent" />
        </div>
        <h3 className="font-heading font-black text-base text-foreground mb-1">Delete Class</h3>
        <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete <strong>{className}</strong>? This action cannot be undone.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-all">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent/90 transition-all">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editTarget, setEditTarget] = useState<ClassRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ClassRecord | null>(null)

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes')
      if (res.ok) {
        const data = await res.json()
        setClasses(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const filtered = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.grade.toLowerCase().includes(search.toLowerCase())
  )

  async function handleAdd(data: ClassFormData) {
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: uid(), ...data }),
      })
      if (res.ok) {
        fetchClasses()
        setShowAddModal(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleEdit(data: ClassFormData) {
    if (!editTarget) return
    try {
      const res = await fetch('/api/classes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editTarget.id, ...data }),
      })
      if (res.ok) {
        fetchClasses()
        setEditTarget(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/classes?id=${deleteTarget.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchClasses()
        setDeleteTarget(null)
      }
    } catch (err) {
      console.error(err)
    }
  }



  const totalSections = classes.reduce((sum, c) => sum + c.sections.length, 0)
  const totalSeats = classes.reduce((sum, c) => sum + c.sections.reduce((s2, sec) => s2 + sec.capacity, 0), 0)

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-foreground tracking-tight">Classes &amp; Sections</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage all classes, sections, subject assignments, and teacher allocations</p>
        </div>
        <button id="add-class-btn" onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all flex-shrink-0">
          <Plus size={16} />
          <span className="hidden sm:block">Add Class</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Classes', value: classes.length, Icon: GraduationCap, color: 'text-primary bg-primary/10' },
          { label: 'Total Sections', value: totalSections, Icon: LayoutGrid, color: 'text-violet-500 bg-violet-500/10' },
          { label: 'Total Seats', value: totalSeats, Icon: Users, color: 'text-emerald-500 bg-emerald-500/10' },
        ].map(stat => (
          <div key={stat.label} className="bg-background/60 backdrop-blur-sm border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', stat.color)}>
              <stat.Icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground leading-none">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search classes or grades..." className="w-full pl-10 pr-4 py-2.5 bg-background/60 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
        </div>
        <div className="flex items-center bg-muted/40 border border-border rounded-xl p-1 gap-0.5">
          <button onClick={() => setView('grid')} className={cn('p-2 rounded-lg transition-all', view === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')} title="Grid view"><LayoutGrid size={15} /></button>
          <button onClick={() => setView('list')} className={cn('p-2 rounded-lg transition-all', view === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')} title="List view"><List size={15} /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4"><GraduationCap size={28} className="text-muted-foreground/50" /></div>
          <p className="font-bold text-foreground">No classes found</p>
          <p className="text-sm text-muted-foreground mt-1">{search ? 'Try adjusting your search' : 'Add your first class to get started'}</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(cls => (
            <ClassCard key={cls.id} cls={cls} onEdit={setEditTarget} onDelete={(id) => setDeleteTarget(classes.find(c => c.id === id)!)} />
          ))}
        </div>
      ) : (
        <div className="bg-background/60 border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                {['Class', 'Grade', 'Sections', 'Subjects', 'Total Seats', ''].map((h, i) => (
                  <th key={i} className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(cls => {
                const seats = cls.sections.reduce((s, sec) => s + sec.capacity, 0)
                return (
                  <tr key={cls.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><GraduationCap size={15} className="text-primary" /></div>
                        <span className="font-bold text-foreground">{cls.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground font-mono text-xs">Grade {cls.grade}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        {cls.sections.map(s => (
                          <span key={s.id} className="w-6 h-6 rounded-md bg-secondary/20 flex items-center justify-center text-[10px] font-black text-foreground">{s.name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {cls.subjects.slice(0, 3).map(sub => <SubjectBadge key={sub} label={sub} />)}
                        {cls.subjects.length > 3 && <span className="text-[11px] text-muted-foreground">+{cls.subjects.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">{seats}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditTarget(cls)} className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Pencil size={13} /></button>
                        <button onClick={() => setDeleteTarget(cls)} className="p-1.5 rounded-md hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && <ClassModal onSave={handleAdd} onClose={() => setShowAddModal(false)} />}
      {editTarget && <ClassModal initial={editTarget} onSave={handleEdit} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <DeleteModal className={deleteTarget.name} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
    </div>
  )
}
