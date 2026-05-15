'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  Plus, Edit, Trash2, Shield, Building2, Settings, 
  Moon, Sun, Bell, X, Check, Calendar, Globe, 
  Database, Palette, Lock, Users as UsersIcon,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const tabs = ['Users & Roles', 'Branches', 'Academic Config', 'System'] as const
type Tab = typeof tabs[number]

const mockUsers = [
  { id: 'U001', name: 'Principal Arif', email: 'arif@ummat.edu', role: 'Principal', branch: 'Main Campus', status: 'Active' },
  { id: 'U002', name: 'Admin Khalid', email: 'khalid@ummat.edu', role: 'Branch Admin', branch: 'Main Campus', status: 'Active' },
  { id: 'U003', name: 'Ms. Sana Malik', email: 'sana@ummat.edu', role: 'Teacher', branch: 'Main Campus', status: 'Active' },
  { id: 'U004', name: 'Mr. Tariq Ahmed', email: 'tariq@ummat.edu', role: 'Teacher', branch: 'North Campus', status: 'Active' },
  { id: 'U005', name: 'Ms. Ayesha Noor', email: 'ayesha@ummat.edu', role: 'Teacher', branch: 'South Campus', status: 'Active' },
  { id: 'U006', name: 'Accountant Sara', email: 'sara@ummat.edu', role: 'Accountant', branch: 'Main Campus', status: 'Active' },
]

const mockBranches = [
  { id: 'B001', name: 'Main Campus', location: 'Islamabad', principal: 'Principal Arif', students: 1200, status: 'Active' },
  { id: 'B002', name: 'North Campus', location: 'Rawalpindi', principal: 'Principal Nadia', students: 750, status: 'Active' },
  { id: 'B003', name: 'South Campus', location: 'Lahore', principal: 'Principal Imran', students: 508, status: 'Active' },
]

const roles = ['Super Admin', 'Branch Admin', 'Principal', 'Teacher', 'Accountant', 'Coordinator']

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-accent/10 text-accent border-accent/20',
  'Branch Admin': 'bg-primary/10 text-primary border-primary/20',
  'Principal': 'bg-warning/10 text-warning border-warning/20',
  'Teacher': 'bg-muted text-muted-foreground border-border',
  'Accountant': 'bg-muted text-muted-foreground border-border',
  'Coordinator': 'bg-muted text-muted-foreground border-border',
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Users & Roles')
  const [showUserModal, setShowUserModal] = useState(false)
  const [notifications, setNotifications] = useState({ email: true, approvals: true, fees: false, attendance: true })
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-heading font-black text-foreground tracking-tight">Admin Control Center</h2>
          <p className="text-sm text-muted-foreground mt-1">Orchestrate users, branches, and system-wide configurations</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="px-4 py-2 bg-background border border-border rounded-2xl shadow-sm flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">System Health</span>
              <span className="text-xs font-bold text-emerald-500 mt-1">Operational</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-hide pb-px">
        {tabs.map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)} 
            className={cn(
              'px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 -mb-px transition-all whitespace-nowrap', 
              activeTab === t 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── Users & Roles ── */}
          {activeTab === 'Users & Roles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                   <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                   <input placeholder="Search users..." className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <Button onClick={() => setShowUserModal(true)} className="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  <Plus size={16} className="mr-2" /> Add New User
                </Button>
              </div>

              <div className="border border-border rounded-2xl overflow-hidden shadow-xl bg-background">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        {['User Profile','Email','Access Role','Branch Assignment','Status','Actions'].map(h => (
                          <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockUsers.map((u, i) => (
                        <tr key={u.id} className="group hover:bg-primary/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-black shadow-inner border border-white/10">
                                {u.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-foreground text-sm leading-tight">{u.name}</span>
                                <span className="text-[10px] text-muted-foreground font-mono mt-0.5">{u.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{u.email}</td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={cn('text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5', roleColors[u.role])}>
                              {u.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-muted-foreground">{u.branch}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={cn('w-2 h-2 rounded-full', u.status==='Active' ? 'bg-emerald-500' : 'bg-muted-foreground/30')} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                {u.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"><Edit size={14} /></button>
                              <button className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-accent"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Branches ── */}
          {activeTab === 'Branches' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBranches.map(b => (
                <Card key={b.id} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-border overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Building2 size={80} />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                        <Building2 size={24} />
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                        {b.status}
                      </Badge>
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
                        <span className="font-black text-foreground">{b.principal}</span>
                      </div>
                      <div className="flex justify-between text-xs py-2 border-b border-border/50">
                        <span className="text-muted-foreground font-medium">Total Enrollment</span>
                        <span className="font-black text-foreground">{b.students.toLocaleString()} Students</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all group-hover:border-primary">
                      Manage Infrastructure
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <div className="border-2 border-dashed border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all cursor-pointer bg-muted/20 hover:bg-primary/[0.02]">
                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                  <Plus size={32} />
                </div>
                <div className="text-center">
                  <span className="text-sm font-black uppercase tracking-widest">Provision New Branch</span>
                  <p className="text-[10px] opacity-60 mt-1">Initialize settings for a new campus</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Academic Config ── */}
          {activeTab === 'Academic Config' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-heading font-black uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={18} className="text-primary" /> Term Schedule
                  </CardTitle>
                  <CardDescription>Define academic cycles and grading parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Academic Year', value: '2025–2026', icon: Shield },
                    { label: 'Term 1 Duration', value: 'Apr 01 – Aug 31', icon: Clock },
                    { label: 'Term 2 Duration', value: 'Sep 01 – Jan 15', icon: Clock },
                    { label: 'Max Grade Scale', value: '4.0 (NCP Compliant)', icon: Check },
                  ].map(field => (
                    <div key={field.label} className="group p-4 bg-muted/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                          <field.icon size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{field.label}</p>
                          <p className="font-bold text-sm text-foreground">{field.value}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-background rounded-xl text-muted-foreground hover:text-primary transition-all">
                        <Edit size={14} />
                      </button>
                    </div>
                  ))}
                  <Button className="w-full bg-primary text-white rounded-xl py-6 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-2">
                    Publish New Academic Calendar
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                 <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                   <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-3">Policy Insights</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                     The academic calendar is synchronized across all branches. Changing the Term start/end dates will automatically update the Teacher Assessment Matrix and Student Attendance Registries.
                   </p>
                 </div>
                 <div className="bg-background border border-border rounded-3xl p-6 shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                       <AlertCircle size={24} />
                     </div>
                     <div>
                       <h5 className="text-sm font-black text-foreground uppercase tracking-widest">Locked Period</h5>
                       <p className="text-[10px] text-muted-foreground font-bold mt-0.5">Previous term records are currently archived.</p>
                     </div>
                   </div>
                   <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-primary">Unlock</Button>
                 </div>
              </div>
            </div>
          )}

          {/* ── System ── */}
          {activeTab === 'System' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Appearance', desc: 'Interface theme and branding', icon: Palette, items: [
                  { label: 'Deep Dark Mode', status: darkMode ? 'Active' : 'Disabled', action: () => setDarkMode(!darkMode) }
                ]},
                { title: 'Security', desc: 'Access logs and encryption', icon: Lock, items: [
                  { label: '2FA Enforcement', status: 'Required' },
                  { label: 'Audit Trail Retention', status: '365 Days' }
                ]},
                { title: 'Database', desc: 'Storage and cloud synchronization', icon: Database, items: [
                  { label: 'Sync Status', status: 'Operational' },
                  { label: 'Last Backup', status: '2h ago' }
                ]},
              ].map(section => (
                <Card key={section.title} className="border-border shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <section.icon size={20} />
                    </div>
                    <CardTitle className="text-base font-heading font-black uppercase tracking-widest">{section.title}</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-tight">{section.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {section.items.map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                        {item.action ? (
                          <button onClick={item.action} className={cn('w-8 h-4 rounded-full transition-all relative', item.status === 'Active' ? 'bg-primary' : 'bg-muted')}>
                            <div className={cn('absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm', item.status === 'Active' ? 'translate-x-4.5' : 'translate-x-0.5')} />
                          </button>
                        ) : (
                          <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{item.status}</span>
                        )}
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white border border-transparent hover:border-primary/20">
                      Configure Advanced <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setShowUserModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-background border border-border rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-heading font-black tracking-tight text-foreground">Add New User</h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">System Provisioning</p>
                </div>
                <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-muted rounded-xl transition-colors"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Full Name', ph: 'e.g. Ms. Sarah Khan', type: 'text' },
                  { label: 'Email Address', ph: 'user@ummat.edu', type: 'email' }
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">{f.label}</label>
                    <input type={f.type} placeholder={f.ph} className="w-full px-4 py-3 border border-border rounded-2xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">Role</label>
                    <Select>
                      <SelectTrigger className="w-full h-11 rounded-2xl">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 ml-1">Campus</label>
                    <Select>
                      <SelectTrigger className="w-full h-11 rounded-2xl">
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Main Campus', 'North Campus', 'South Campus'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="ghost" onClick={() => setShowUserModal(false)} className="flex-1 rounded-2xl py-6 text-xs font-black uppercase tracking-widest">Cancel</Button>
                <Button onClick={() => setShowUserModal(false)} className="flex-1 bg-primary text-white rounded-2xl py-6 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90">Create Account</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
