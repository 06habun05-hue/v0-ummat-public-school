'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, Edit, Trash2, Shield, Building2, Settings, Moon, Sun, Bell, X, Check } from 'lucide-react'

const tabs = ['Users & Roles', 'Branches', 'Academic Config', 'System'] as const
type Tab = typeof tabs[number]

const mockUsers = [
  { id: 'U001', name: 'Principal Arif', email: 'arif@ummat.edu', role: 'Principal', branch: 'Main Campus', status: 'Active' },
  { id: 'U002', name: 'Admin Khalid', email: 'khalid@ummat.edu', role: 'Branch Admin', branch: 'Main Campus', status: 'Active' },
  { id: 'U003', name: 'Ms. Sana Malik', email: 'sana@ummat.edu', role: 'Teacher', branch: 'Main Campus', status: 'Active' },
  { id: 'U004', name: 'Mr. Tariq Ahmed', email: 'tariq@ummat.edu', role: 'Teacher', branch: 'North Campus', status: 'Active' },
  { id: 'U005', name: 'Ms. Ayesha Noor', email: 'ayesha@ummat.edu', role: 'Teacher', branch: 'South Campus', status: 'Active' },
  { id: 'U006', name: 'Accountant Sara', email: 'sara@ummat.edu', role: 'Accountant', branch: 'Main Campus', status: 'Active' },
  { id: 'U007', name: 'Coordinator Bilal', email: 'bilal@ummat.edu', role: 'Coordinator', branch: 'Main Campus', status: 'Inactive' },
]

const mockBranches = [
  { id: 'B001', name: 'Main Campus', location: 'Islamabad', principal: 'Principal Arif', students: 1200, status: 'Active' },
  { id: 'B002', name: 'North Campus', location: 'Rawalpindi', principal: 'Principal Nadia', students: 750, status: 'Active' },
  { id: 'B003', name: 'South Campus', location: 'Lahore', principal: 'Principal Imran', students: 508, status: 'Active' },
]

const roles = ['Super Admin', 'Branch Admin', 'Principal', 'Teacher', 'Accountant', 'Coordinator']

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-accent/10 text-accent',
  'Branch Admin': 'bg-primary/10 text-primary',
  'Principal': 'bg-warning/10 text-warning',
  'Teacher': 'bg-muted text-muted-foreground',
  'Accountant': 'bg-muted text-muted-foreground',
  'Coordinator': 'bg-muted text-muted-foreground',
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Users & Roles')
  const [showUserModal, setShowUserModal] = useState(false)
  const [notifications, setNotifications] = useState({ email: true, approvals: true, fees: false, attendance: true })
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Admin & Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage users, branches, configuration and system preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={cn('px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors', activeTab===t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Users & Roles ── */}
      {activeTab === 'Users & Roles' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowUserModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus size={14} /> Add User
            </button>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  {['Name','Email','Role','Branch','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockUsers.map((u, i) => (
                  <tr key={u.id} className={cn('hover:bg-muted/50', i%2===1&&'bg-muted/20')}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                        </div>
                        <span className="font-medium text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', roleColors[u.role])}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.branch}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', u.status==='Active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-muted rounded transition-colors"><Edit size={13} className="text-muted-foreground" /></button>
                        <button className="p-1.5 hover:bg-muted rounded transition-colors"><Trash2 size={13} className="text-accent" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Branches ── */}
      {activeTab === 'Branches' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBranches.map(b => (
              <div key={b.id} className="bg-background border border-border rounded-lg p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{b.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.location}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{b.status}</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Principal</span><span className="font-medium">{b.principal}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Students</span><span className="font-medium">{b.students.toLocaleString()}</span></div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 py-1.5 border border-border rounded text-xs font-medium hover:bg-muted transition-colors">Edit</button>
                </div>
              </div>
            ))}
            <div className="border-2 border-dashed border-border rounded-lg p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
              <Plus size={22} />
              <span className="text-sm font-medium">Add Branch</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Academic Config ── */}
      {activeTab === 'Academic Config' && (
        <div className="space-y-4 max-w-lg">
          {[
            { label: 'Academic Year', value: '2025–2026' },
            { label: 'Term 1 Start', value: '2025-04-01' },
            { label: 'Term 1 End', value: '2025-08-31' },
            { label: 'Term 2 Start', value: '2025-09-01' },
            { label: 'Term 2 End', value: '2026-01-15' },
            { label: 'Grade Scale (Max)', value: '4' },
          ].map(field => (
            <div key={field.label} className="bg-background border border-border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{field.label}</p>
                <p className="font-medium text-foreground mt-0.5">{field.value}</p>
              </div>
              <button className="p-1.5 hover:bg-muted rounded transition-colors"><Edit size={14} className="text-muted-foreground" /></button>
            </div>
          ))}
          <button className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors">Save Configuration</button>
        </div>
      )}

      {/* ── System ── */}
      {activeTab === 'System' && (
        <div className="space-y-4 max-w-lg">
          <div className="bg-background border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2"><Settings size={16} /> Appearance</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark interface</p>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className={cn('w-10 h-5 rounded-full transition-colors relative', darkMode ? 'bg-primary' : 'bg-border')}>
                <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', darkMode ? 'translate-x-5' : 'translate-x-0.5')} />
              </button>
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2"><Bell size={16} /> Notifications</h3>
            {Object.entries(notifications).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <p className="text-sm text-foreground capitalize">{key.replace(/([A-Z])/g,' $1')} notifications</p>
                <button onClick={() => setNotifications(n => ({ ...n, [key]: !val }))} className={cn('w-10 h-5 rounded-full transition-colors relative', val ? 'bg-primary' : 'bg-border')}>
                  <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', val ? 'translate-x-5' : 'translate-x-0.5')} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-background border border-border rounded-lg p-5 space-y-2">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2"><Shield size={16} /> Platform Info</h3>
            {[['Version','1.0.0-beta'],['Framework','Next.js 16'],['Database','PostgreSQL (pending)'],['Environment','Development']].map(([k,v]) => (
              <div key={k} className="flex justify-between text-xs py-1 border-b border-border last:border-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-mono font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowUserModal(false)} />
          <div className="relative bg-background border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold">Add New User</h3>
              <button onClick={() => setShowUserModal(false)} className="p-1 hover:bg-muted rounded-md"><X size={16} /></button>
            </div>
            {[['Full Name','e.g. Ms. Sarah Khan'],['Email','user@ummat.edu']].map(([label, ph]) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-foreground mb-1.5">{label}</label>
                <input placeholder={ph} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Role</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm">{roles.map(r => <option key={r}>{r}</option>)}</select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Branch</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm">
                  {['Main Campus','North Campus','South Campus'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowUserModal(false)} className="flex-1 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => setShowUserModal(false)} className="flex-1 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors">Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
