'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUIStore } from '@/lib/store/ui-store'
import { toast } from 'sonner'
import {
  Plus, Edit, Trash2, Shield, Building2, Settings,
  Moon, Sun, Bell, X, Check, Calendar, Globe,
  Database, Palette, Lock, Users as UsersIcon,
  ChevronRight, Clock, Search
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Actions
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/actions/users'
import { getBranches, createBranch, updateBranch, deleteBranch } from '@/lib/actions/branches'
import { getActiveAcademicYear, updateTerm, updateGradeScale, publishAcademicCalendar, unlockAcademicYear, lockAcademicYear } from '@/lib/actions/academic'
import { getSystemSettings, updateSetting } from '@/lib/actions/settings'

// Components
import { UserFormModal } from '@/components/admin/user-form-modal'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import { BranchFormModal } from '@/components/admin/branch-form-modal'
import { BranchDetailSheet } from '@/components/admin/branch-detail-sheet'

const tabs = ['Users & Roles', 'Branches', 'Academic Config', 'System'] as const
type Tab = typeof tabs[number]

const roleColors: Record<string, string> = {
  SUPER_ADMIN:  'bg-accent/10 text-accent border-accent/20',
  BRANCH_ADMIN: 'bg-primary/10 text-primary border-primary/20',
  PRINCIPAL:    'bg-warning/10 text-warning border-warning/20',
  TEACHER:      'bg-muted text-muted-foreground border-border',
  ACCOUNTANT:   'bg-muted text-muted-foreground border-border',
  COORDINATOR:  'bg-muted text-muted-foreground border-border',
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin', BRANCH_ADMIN: 'Branch Admin',
  PRINCIPAL: 'Principal', TEACHER: 'Teacher',
  ACCOUNTANT: 'Accountant', COORDINATOR: 'Coordinator',
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Users & Roles')
  const [search, setSearch] = useState('')
  const { userName, isDarkMode, toggleDarkMode } = useUIStore()
  const qc = useQueryClient()

  // ── Actor for logging ──────────────────────────────────────────────────────
  const actor = { id: 'system', name: userName }

  // ── Users & Roles state ────────────────────────────────────────────────────
  const [userModal, setUserModal] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: any }>({ open: false, mode: 'add' })
  const [deleteUser_, setDeleteUser_] = useState<{ open: boolean; id?: string; name?: string }>({ open: false })

  // ── Branches state ─────────────────────────────────────────────────────────
  const [branchModal, setBranchModal] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: any }>({ open: false, mode: 'add' })
  const [deleteBranch_, setDeleteBranch_] = useState<{ open: boolean; id?: string; name?: string }>({ open: false })
  const [branchDetail, setBranchDetail] = useState<{ open: boolean; branch?: any }>({ open: false })

  // ── Academic Config state ──────────────────────────────────────────────────
  const [editingField, setEditingField] = useState<string | null>(null)
  const [fieldValue, setFieldValue] = useState('')
  const [publishModal, setPublishModal] = useState(false)
  const [publishForm, setPublishForm] = useState({
    label: '', t1Start: '', t1End: '', t2Start: '', t2End: '', maxGpa: '4.0'
  })

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => getUsers({ search }),
  })

  const { data: branches = [], isLoading: branchesLoading } = useQuery({
    queryKey: ['admin-branches'],
    queryFn: getBranches,
  })

  const { data: academic, isLoading: academicLoading } = useQuery({
    queryKey: ['admin-academic'],
    queryFn: getActiveAcademicYear,
  })

  const { data: settings = {}, isLoading: settingsLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: getSystemSettings,
  })

  // ── User mutations ─────────────────────────────────────────────────────────
  const createUserMut = useMutation({
    mutationFn: (data: any) => createUser({ ...data, branchId: data.branchId === 'none' ? undefined : data.branchId, actorId: actor.id, actorName: actor.name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User created'); setUserModal({ open: false, mode: 'add' }) },
    onError: () => toast.error('Failed to create user'),
  })

  const updateUserMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, { ...data, branchId: data.branchId === 'none' ? null : data.branchId }, actor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User updated'); setUserModal({ open: false, mode: 'add' }) },
    onError: () => toast.error('Failed to update user'),
  })

  const deleteUserMut = useMutation({
    mutationFn: (id: string) => deleteUser(id, actor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User deactivated'); setDeleteUser_({ open: false }) },
    onError: () => toast.error('Failed to delete user'),
  })

  // ── Branch mutations ───────────────────────────────────────────────────────
  const createBranchMut = useMutation({
    mutationFn: (data: any) => createBranch({ ...data, actorName: actor.name, actorId: actor.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-branches'] }); toast.success('Branch created'); setBranchModal({ open: false, mode: 'add' }) },
    onError: () => toast.error('Failed to create branch'),
  })

  const updateBranchMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBranch(id, data, actor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-branches'] }); toast.success('Branch updated'); setBranchModal({ open: false, mode: 'add' }) },
    onError: () => toast.error('Failed to update branch'),
  })

  const deleteBranchMut = useMutation({
    mutationFn: (id: string) => deleteBranch(id, actor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-branches'] }); toast.success('Branch deactivated'); setDeleteBranch_({ open: false }) },
    onError: () => toast.error('Failed to delete branch'),
  })

  // ── Academic mutations ─────────────────────────────────────────────────────
  const updateTermMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTerm(id, data, actor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-academic'] }); toast.success('Term updated'); setEditingField(null) },
  })

  const updateGpaMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateGradeScale(id, data, actor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-academic'] }); toast.success('Grade scale updated'); setEditingField(null) },
  })

  const publishCalendarMut = useMutation({
    mutationFn: () => publishAcademicCalendar({
      label: publishForm.label,
      term1: { name: 'Term 1', startDate: publishForm.t1Start, endDate: publishForm.t1End },
      term2: { name: 'Term 2', startDate: publishForm.t2Start, endDate: publishForm.t2End },
      maxGpa: publishForm.maxGpa,
    }, actor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-academic'] }); toast.success('Calendar published'); setPublishModal(false) },
    onError: () => toast.error('Failed to publish calendar'),
  })

  const unlockMut = useMutation({
    mutationFn: (id: string) => unlockAcademicYear(id, actor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-academic'] }); toast.success('Academic year unlocked') },
  })

  const lockMut = useMutation({
    mutationFn: (id: string) => lockAcademicYear(id, actor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-academic'] }); toast.success('Academic year locked') },
  })

  // ── Settings mutation ──────────────────────────────────────────────────────
  const updateSettingMut = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => updateSetting(key, value, actor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-settings'] }); toast.success('Setting updated') },
  })

  const handleToggleSetting = (key: string, current: string) => {
    const newVal = current === 'true' ? 'false' : 'true'
    updateSettingMut.mutate({ key, value: newVal })
    if (key === 'dark_mode_default') toggleDarkMode()
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const saveField = (type: 'term' | 'gpa', id: string, field: string, value: string) => {
    if (type === 'term') updateTermMut.mutate({ id, data: { [field]: value } })
    else updateGpaMut.mutate({ id, data: { [field]: value } })
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight">Admin Control Center</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">Manage users, branches, and system settings</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-hide pb-px -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              'px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest border-b-2 -mb-px transition-all whitespace-nowrap',
              activeTab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >

          {/* ── Users & Roles ─────────────────────────────────────────────── */}
          {activeTab === 'Users & Roles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
                  />
                </div>
                <Button
                  onClick={() => setUserModal({ open: true, mode: 'add' })}
                  className="w-full sm:w-auto h-12 px-8 bg-primary text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-primary/90 shadow-xl shadow-primary/20"
                >
                  <Plus size={16} className="mr-2" /> Add New User
                </Button>
              </div>

              {usersLoading ? (
                <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-16 bg-muted/40 rounded-2xl animate-pulse" />)}</div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden lg:block border border-border rounded-2xl overflow-hidden shadow-xl bg-background">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            {['User', 'Email', 'Role', 'Branch', 'Status', 'Actions'].map((h) => (
                              <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {users.map((u) => (
                            <tr key={u.id} className="group hover:bg-primary/[0.02] transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-black shadow-inner">
                                    {u.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-foreground text-sm leading-tight">{u.fullName}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{u.email}</td>
                              <td className="px-6 py-4">
                                <Badge variant="outline" className={cn('text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5', roleColors[u.role])}>
                                  {roleLabels[u.role] ?? u.role}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-xs font-bold text-muted-foreground">{u.branchName ?? '—'}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className={cn('w-2 h-2 rounded-full', u.status === 'Active' ? 'bg-emerald-500' : 'bg-muted-foreground/30')} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{u.status}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setUserModal({ open: true, mode: 'edit', data: { id: u.id, fullName: u.fullName, email: u.email, role: u.role, branchId: u.branchId ?? 'none' } })}
                                    className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteUser_({ open: true, id: u.id, name: u.fullName })}
                                    className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-accent"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile cards */}
                  <div className="lg:hidden space-y-4">
                    {users.map((u) => (
                      <div key={u.id} className="bg-background border border-border rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-black">
                              {u.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <span className="font-bold text-foreground text-sm">{u.fullName}</span>
                              <p className="text-[10px] text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setUserModal({ open: true, mode: 'edit', data: { id: u.id, fullName: u.fullName, email: u.email, role: u.role, branchId: u.branchId ?? 'none' } })} className="p-2 hover:bg-muted rounded-xl text-muted-foreground">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => setDeleteUser_({ open: true, id: u.id, name: u.fullName })} className="p-2 hover:bg-muted rounded-xl text-muted-foreground">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <Badge variant="outline" className={cn('text-[9px] font-black uppercase', roleColors[u.role])}>{roleLabels[u.role]}</Badge>
                          <span className="text-[10px] font-bold text-muted-foreground">{u.branchName ?? 'No Branch'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Branches ──────────────────────────────────────────────────── */}
          {activeTab === 'Branches' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {branchesLoading
                ? [1, 2, 3].map((i) => <div key={i} className="h-56 bg-muted/40 rounded-3xl animate-pulse" />)
                : branches.filter((b) => b.status === 'Active').map((b) => (
                  <Card key={b.id} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-border overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Building2 size={80} />
                    </div>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                          <Building2 size={24} />
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setBranchModal({ open: true, mode: 'edit', data: { id: b.id, name: b.name, location: b.location, principalName: b.principalName } })}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteBranch_({ open: true, id: b.id, name: b.name })}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-accent transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-heading font-black tracking-tight">{b.name}</CardTitle>
                      <CardDescription className="text-xs font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-widest">
                        <Globe size={12} /> {b.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs py-2 border-b border-border/50">
                          <span className="text-muted-foreground font-medium">Principal</span>
                          <span className="font-black text-foreground">{b.principalName ?? '—'}</span>
                        </div>
                        <div className="flex justify-between text-xs py-2 border-b border-border/50">
                          <span className="text-muted-foreground font-medium">Enrollment</span>
                          <span className="font-black text-foreground">{Number(b.studentCount).toLocaleString()} Students</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setBranchDetail({ open: true, branch: b })}
                        className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all group-hover:border-primary"
                      >
                        Manage Branch
                      </Button>
                    </CardContent>
                  </Card>
                ))
              }
              {/* Add Branch card */}
              <div
                onClick={() => setBranchModal({ open: true, mode: 'add' })}
                className="border-2 border-dashed border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all cursor-pointer bg-muted/20 hover:bg-primary/[0.02]"
              >
                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                  <Plus size={32} />
                </div>
                <div className="text-center">
                  <span className="text-sm font-black uppercase tracking-widest">Add Branch</span>
                  <p className="text-[10px] opacity-60 mt-1">Initialize settings for a new campus</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Academic Config ───────────────────────────────────────────── */}
          {activeTab === 'Academic Config' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-heading font-black uppercase tracking-wider flex items-center gap-2 text-foreground">
                    <Calendar size={18} className="text-primary" /> Term Schedule
                  </CardTitle>
                  <CardDescription className="text-xs font-medium">Define academic cycles and grading parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {academicLoading ? (
                    <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-14 bg-muted/40 rounded-2xl animate-pulse" />)}</div>
                  ) : !academic ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No active academic year. Publish one below.</p>
                  ) : (
                    <>
                      {/* Academic Year label */}
                      <div className="group p-4 bg-muted/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground">
                            <Shield size={14} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Academic Year</p>
                            <p className="font-bold text-sm text-foreground">{academic.year.label}</p>
                          </div>
                        </div>
                      </div>

                      {/* Terms */}
                      {academic.terms.map((term) => (
                        <div key={term.id} className="group p-4 bg-muted/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                              <Clock size={14} />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{term.name} Duration</p>
                              {editingField === `term-${term.id}-start` ? (
                                <div className="flex gap-1 items-center mt-1">
                                  <input
                                    type="date"
                                    defaultValue={term.startDate}
                                    onChange={(e) => setFieldValue(e.target.value)}
                                    className="text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                                  />
                                  <button onClick={() => saveField('term', term.id, 'startDate', fieldValue)} className="text-primary text-xs font-bold px-2">Save</button>
                                  <button onClick={() => setEditingField(null)} className="text-muted-foreground text-xs px-1">✕</button>
                                </div>
                              ) : editingField === `term-${term.id}-end` ? (
                                <div className="flex gap-1 items-center mt-1">
                                  <input
                                    type="date"
                                    defaultValue={term.endDate}
                                    onChange={(e) => setFieldValue(e.target.value)}
                                    className="text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                                  />
                                  <button onClick={() => saveField('term', term.id, 'endDate', fieldValue)} className="text-primary text-xs font-bold px-2">Save</button>
                                  <button onClick={() => setEditingField(null)} className="text-muted-foreground text-xs px-1">✕</button>
                                </div>
                              ) : (
                                <p className="font-bold text-sm text-foreground">{term.startDate} – {term.endDate}</p>
                              )}
                            </div>
                          </div>
                          {editingField?.startsWith(`term-${term.id}`) ? null : (
                            <div className="flex gap-1">
                              <button onClick={() => { setEditingField(`term-${term.id}-start`); setFieldValue(term.startDate) }} className="p-2 hover:bg-background rounded-xl text-muted-foreground hover:text-primary transition-all"><Edit size={12} /></button>
                              <button onClick={() => { setEditingField(`term-${term.id}-end`); setFieldValue(term.endDate) }} className="p-2 hover:bg-background rounded-xl text-muted-foreground hover:text-primary transition-all"><Edit size={12} /></button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Grade Scale */}
                      {academic.gradeScale && (
                        <div className="group p-4 bg-muted/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                              <Check size={14} />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Max Grade Scale</p>
                              {editingField === 'gpa' ? (
                                <div className="flex gap-1 items-center mt-1">
                                  <input
                                    type="number"
                                    step="0.1"
                                    defaultValue={String(academic.gradeScale.maxGpa)}
                                    onChange={(e) => setFieldValue(e.target.value)}
                                    className="text-xs border border-border rounded px-2 py-1 bg-background w-20 focus:outline-none focus:ring-1 focus:ring-primary/30"
                                  />
                                  <button onClick={() => saveField('gpa', academic.gradeScale!.id, 'maxGpa', fieldValue)} className="text-primary text-xs font-bold px-2">Save</button>
                                  <button onClick={() => setEditingField(null)} className="text-muted-foreground text-xs px-1">✕</button>
                                </div>
                              ) : (
                                <p className="font-bold text-sm text-foreground">{String(academic.gradeScale.maxGpa)} ({academic.gradeScale.description})</p>
                              )}
                            </div>
                          </div>
                          {editingField === 'gpa' ? null : (
                            <button onClick={() => { setEditingField('gpa'); setFieldValue(String(academic.gradeScale!.maxGpa)) }} className="p-2 hover:bg-background rounded-xl text-muted-foreground hover:text-primary transition-all">
                              <Edit size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  <Button onClick={() => setPublishModal(true)} className="w-full h-12 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-2">
                    Publish New Academic Calendar
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Policy Insights</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    The academic calendar is synchronized across all branches. Changing the Term start/end dates will automatically update the Teacher Assessment Matrix and Student Attendance Registries.
                  </p>
                </div>
                {academic && (
                  <div className="bg-background border border-border rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h5 className="text-[10px] sm:text-xs font-black text-foreground uppercase tracking-widest">
                          {academic.year.isLocked ? 'Locked Period' : 'Period Unlocked'}
                        </h5>
                        <p className="text-[9px] text-muted-foreground font-bold mt-0.5">
                          {academic.year.isLocked ? 'Previous records are archived.' : 'Records are editable.'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => academic.year.isLocked ? unlockMut.mutate(academic.year.id) : lockMut.mutate(academic.year.id)}
                      className="text-[10px] font-black uppercase text-primary"
                    >
                      {academic.year.isLocked ? 'Unlock' : 'Lock'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── System ────────────────────────────────────────────────────── */}
          {activeTab === 'System' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Appearance */}
              <Card className="border-border shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2"><Palette size={20} /></div>
                  <CardTitle className="text-sm font-heading font-black uppercase tracking-widest text-foreground">Appearance</CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase tracking-tight">Branding and themes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-[11px] font-medium text-muted-foreground">Deep Dark Mode</span>
                    <button
                      onClick={() => handleToggleSetting('dark_mode_default', settings['dark_mode_default'] ?? 'false')}
                      className={cn('w-8 h-4 rounded-full transition-all relative', settings['dark_mode_default'] === 'true' ? 'bg-primary' : 'bg-muted')}
                    >
                      <div className={cn('absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm', settings['dark_mode_default'] === 'true' ? 'translate-x-4' : 'translate-x-0.5')} />
                    </button>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white border border-transparent hover:border-primary/20">
                    View Advanced <ChevronRight size={14} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Security */}
              <Card className="border-border shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2"><Lock size={20} /></div>
                  <CardTitle className="text-sm font-heading font-black uppercase tracking-widest text-foreground">Security</CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase tracking-tight">Access logs & safety</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-[11px] font-medium text-muted-foreground">2FA Enforcement</span>
                    <button
                      onClick={() => handleToggleSetting('two_fa_required', settings['two_fa_required'] ?? 'false')}
                      className={cn('w-8 h-4 rounded-full transition-all relative', settings['two_fa_required'] === 'true' ? 'bg-primary' : 'bg-muted')}
                    >
                      <div className={cn('absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm', settings['two_fa_required'] === 'true' ? 'translate-x-4' : 'translate-x-0.5')} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-[11px] font-medium text-muted-foreground">Audit Log Retention</span>
                    <span className="text-[9px] font-black text-foreground uppercase tracking-widest">
                      {settingsLoading ? '…' : `${settings['audit_retention_days'] ?? 365} Days`}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white border border-transparent hover:border-primary/20">
                    View Advanced <ChevronRight size={14} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Database */}
              <Card className="border-border shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2"><Database size={20} /></div>
                  <CardTitle className="text-sm font-heading font-black uppercase tracking-widest text-foreground">Database</CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase tracking-tight">Storage & cloud sync</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-[11px] font-medium text-muted-foreground">Last Backup</span>
                    <span className="text-[9px] font-black text-foreground uppercase tracking-widest">
                      {settingsLoading ? '…' : settings['last_backup_at']
                        ? new Date(settings['last_backup_at']).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white border border-transparent hover:border-primary/20">
                    View Advanced <ChevronRight size={14} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* ── Publish Academic Calendar Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {publishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPublishModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-background border border-border rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-3xl" />
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-heading font-black tracking-tight">New Academic Calendar</h3>
                <button onClick={() => setPublishModal(false)} className="p-2 hover:bg-muted rounded-xl"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Academic Year Label', key: 'label', ph: 'e.g. 2026–2027' },
                  { label: 'Term 1 Start', key: 't1Start', type: 'date' },
                  { label: 'Term 1 End', key: 't1End', type: 'date' },
                  { label: 'Term 2 Start', key: 't2Start', type: 'date' },
                  { label: 'Term 2 End', key: 't2End', type: 'date' },
                  { label: 'Max GPA', key: 'maxGpa', ph: '4.0' },
                ].map(({ label, key, ph, type }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</label>
                    <input
                      type={type ?? 'text'}
                      placeholder={ph}
                      value={publishForm[key as keyof typeof publishForm]}
                      onChange={(e) => setPublishForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" onClick={() => setPublishModal(false)} className="flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</Button>
                <Button onClick={() => publishCalendarMut.mutate()} disabled={publishCalendarMut.isPending} className="flex-1 h-11 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {publishCalendarMut.isPending ? 'Publishing…' : 'Publish'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modals & Dialogs ─────────────────────────────────────────────────── */}
      <UserFormModal
        open={userModal.open}
        mode={userModal.mode}
        onClose={() => setUserModal({ open: false, mode: 'add' })}
        branches={branches.map((b) => ({ id: b.id, name: b.name }))}
        defaultValues={userModal.data}
        onSubmit={async (data) => {
          if (userModal.mode === 'add') await createUserMut.mutateAsync(data)
          else await updateUserMut.mutateAsync({ id: userModal.data.id, data })
        }}
      />

      <DeleteConfirmDialog
        open={deleteUser_.open}
        title={`Deactivate ${deleteUser_.name}?`}
        description="This will set the user as Inactive. They will lose access to the system."
        onClose={() => setDeleteUser_({ open: false })}
        onConfirm={() => deleteUserMut.mutateAsync(deleteUser_.id!)}
      />

      <BranchFormModal
        open={branchModal.open}
        mode={branchModal.mode}
        onClose={() => setBranchModal({ open: false, mode: 'add' })}
        defaultValues={branchModal.data}
        onSubmit={async (data) => {
          if (branchModal.mode === 'add') await createBranchMut.mutateAsync(data)
          else await updateBranchMut.mutateAsync({ id: branchModal.data.id, data })
        }}
      />

      <DeleteConfirmDialog
        open={deleteBranch_.open}
        title={`Deactivate ${deleteBranch_.name}?`}
        description="This will mark the branch as Inactive. All associated data will be preserved."
        onClose={() => setDeleteBranch_({ open: false })}
        onConfirm={() => deleteBranchMut.mutateAsync(deleteBranch_.id!)}
      />

      <BranchDetailSheet
        open={branchDetail.open}
        branch={branchDetail.branch}
        onClose={() => setBranchDetail({ open: false })}
      />
    </div>
  )
}
