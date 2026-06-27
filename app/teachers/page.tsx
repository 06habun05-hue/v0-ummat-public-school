'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Mail, BookOpen, ToggleLeft, ToggleRight, X, User, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Teacher {
  id: string
  name: string
  email: string
  specialization: string
  status: 'Active' | 'Inactive'
  classes: string[]
}

const SPECIALIZATIONS = [
  'Mathematics', 'English', 'Urdu', 'Science', 'Social Studies',
  'Islamic Studies', 'Computer Science', 'Physics', 'Chemistry',
  'Biology', 'Pakistan Studies', 'Art & Craft'
]

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        specialization: subjectFilter,
        status: statusFilter,
      })
      const res = await fetch(`/api/teachers?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setTeachers(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [search, subjectFilter, statusFilter])

  const handleToggleStatus = async (id: string, currentStatus: 'Active' | 'Inactive') => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
    try {
      const res = await fetch('/api/teachers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      })
      if (res.ok) {
        setTeachers(prev =>
          prev.map(t => (t.id === id ? { ...t, status: nextStatus } : t))
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddTeacher = async (data: Omit<Teacher, 'id' | 'classes'> & { password?: string }) => {
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        fetchTeachers()
        setShowAddModal(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = teachers

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-black text-foreground tracking-tight">Teachers Directory</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage teacher records, contact details, specializations, and access status</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary/90 transition-all flex-shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:block">Add Teacher</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-background/50 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Specializations</SelectItem>
              {SPECIALIZATIONS.map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Loading teachers...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <User size={28} className="text-muted-foreground/50" />
          </div>
          <p className="font-bold text-foreground">No teachers found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-background/60 backdrop-blur-sm border border-border rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {t.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <button
                    onClick={() => handleToggleStatus(t.id, t.status)}
                    className={cn(
                      'p-1 rounded-lg transition-colors',
                      t.status === 'Active' ? 'text-primary hover:bg-primary/10' : 'text-muted-foreground hover:bg-muted'
                    )}
                    title={`Click to set ${t.status === 'Active' ? 'Inactive' : 'Active'}`}
                  >
                    {t.status === 'Active' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>

                <div>
                  <h3 className="font-heading font-black text-sm text-foreground">{t.name}</h3>
                  <span className={cn(
                    'inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5',
                    t.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    {t.status}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={13} className="flex-shrink-0" />
                    <span className="truncate">{t.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen size={13} className="flex-shrink-0" />
                    <span>{t.specialization}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1.5">Assigned Classes</p>
                <div className="flex flex-wrap gap-1">
                  {t.classes.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">None</span>
                  ) : (
                    t.classes.map(c => (
                      <span key={c} className="px-1.5 py-0.5 rounded bg-secondary/10 text-foreground text-[10px] font-semibold">
                        {c}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddTeacherModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTeacher}
        />
      )}
    </div>
  )
}

function AddTeacherModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (data: Omit<Teacher, 'id' | 'classes'> & { password?: string }) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [specialization, setSpecialization] = useState(SPECIALIZATIONS[0] || '')
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    onSave({
      name: name.trim(),
      email: email.trim(),
      password: password.trim() || undefined,
      specialization,
      status,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative z-10 bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background">
          <div>
            <h2 className="font-heading font-black text-lg text-foreground">Add New Teacher</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Register a new instructor profile</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name *</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Prof. Tariq Jamil"
              className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address *</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. tariq.jamil@ummat.edu.pk"
              className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password (optional)"
                className="w-full pl-3.5 pr-10 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Specialization *</label>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Status</label>
              <Select value={status} onValueChange={(val: 'Active' | 'Inactive') => setStatus(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-background">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || !email.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Add Teacher
          </button>
        </div>
      </form>
    </div>
  )
}
