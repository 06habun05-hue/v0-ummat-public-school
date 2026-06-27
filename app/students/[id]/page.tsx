'use client'

import { use, useState, useEffect } from 'react'
import { Mail, Phone, MapPin, BookOpen, DollarSign, BarChart3, TrendingUp, AlertCircle, Calendar, GraduationCap, Award, ShieldCheck, X, Printer, Download, User } from 'lucide-react'
import ReactECharts from 'echarts-for-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface StudentData {
  id: string
  name: string
  class: string
  branch: string
  avatar: string
  email: string
  phone: string
  address: string
  dob: string
  admissionDate: string
  registrationNumber: string
  guardianName: string
  guardianPhone: string
  attendanceRate: number
  academicOverview: { name: string; value: number }[]
  performanceTrend: {
    terms: string[]
    gpas: number[]
  }
  sloProgress: { name: string; mastery: number; ncp: string; status: string }[]
  behavioralTrend: {
    weeks: string[]
    scores: number[]
  }
  fees: {
    total: number
    paid: number
    outstanding: number
    lastPayment: string
    status: string
  }
  recentAssessments: { date: string; subject: string; score: number; status: string }[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

const BRANCHES = ['Main Campus', 'North Campus', 'South Campus']
const CLASSES = ['10-A', '10-B', '9-A', '9-B', '8-A', '7-B']
const STATUS_OPTIONS = ['Active', 'Inactive']
const FEE_STATUSES = ['Paid', 'Pending', 'Overdue']

export default function StudentProfilePage({ params }: PageProps) {
  const { id } = use(params)
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'history'>('overview')
  const [showEditModal, setShowEditModal] = useState(false)

  const fetchStudentData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/students/${id}`)
      if (res.ok) {
        const data = await res.json()
        setStudent(data)
      } else {
        toast.error('Failed to load student profile')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load student profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentData()
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    const originalElement = document.getElementById('student-profile-page')
    if (!originalElement) {
      toast.error('Could not find profile content')
      return
    }

    toast.success('Preparing PDF report. Download will start automatically...')

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    script.onload = () => {
      // Clone element
      const element = originalElement.cloneNode(true) as HTMLElement
      // Remove print-hidden elements from clone
      element.querySelectorAll('.print\\:hidden').forEach(el => el.remove())
      
      const opt = {
        margin:       0.5,
        filename:     `${student?.name || 'Student'}_Report.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save();
    }
    document.body.appendChild(script)
  }

  const handleSaveProfile = async (updatedData: Partial<StudentData>) => {
    try {
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData }),
      })
      if (res.ok) {
        toast.success('Profile updated successfully')
        fetchStudentData()
        setShowEditModal(false)
      } else {
        toast.error('Failed to save profile changes')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error saving profile changes')
    }
  }

  // ECharts Options
  const radarOption = student ? {
    radar: {
      indicator: student.academicOverview.map(item => ({ name: item.name, max: 100 })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#64748b', fontSize: 10 },
      splitLine: { lineStyle: { color: ['#e2e8f0'] } },
      splitArea: { show: false }
    },
    series: [{
      type: 'radar',
      data: [{
        value: student.academicOverview.map(item => item.value),
        name: 'Skill Level',
        itemStyle: { color: '#2A7A30' },
        areaStyle: { color: '#2A7A3033' }
      }]
    }]
  } : {}

  const performanceOption = student ? {
    tooltip: { trigger: 'axis' },
    grid: { top: 10, bottom: 30, left: 30, right: 10 },
    xAxis: { type: 'category', data: student.performanceTrend.terms, axisTick: { show: false }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: { type: 'value', min: 0, max: 4, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    series: [{
      data: student.performanceTrend.gpas,
      type: 'line',
      smooth: true,
      symbolSize: 8,
      itemStyle: { color: '#2A7A30' },
      lineStyle: { width: 3 },
      areaStyle: { color: 'rgba(42, 122, 48, 0.1)' }
    }]
  } : {}

  const behavioralOption = student ? {
    tooltip: { trigger: 'axis' },
    grid: { top: 10, bottom: 30, left: 30, right: 10 },
    xAxis: { type: 'category', data: student.behavioralTrend.weeks, axisTick: { show: false }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: { type: 'value', min: 60, max: 100, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    series: [{
      data: student.behavioralTrend.scores,
      type: 'bar',
      itemStyle: { 
        color: '#2A7A30',
        borderRadius: [4, 4, 0, 0]
      },
      barMaxWidth: 20
    }]
  } : {}

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading student profile...
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <AlertCircle size={40} className="text-accent" />
        <p className="font-bold text-foreground">Student not found</p>
      </div>
    )
  }

  return (
    <div id="student-profile-page" className="p-4 sm:p-6 md:p-8 space-y-8 bg-neutral/30 min-h-screen print:p-0 print:bg-white">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:mb-6">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20 print:shadow-none">
             {student.avatar}
           </div>
           <div>
             <h2 className="text-2xl font-black text-foreground tracking-tight">{student.name}</h2>
             <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
               <span>Registration: {student.registrationNumber}</span>
               <span>•</span>
               <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest print:border print:border-primary/20">{student.class}</span>
             </div>
           </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto print:hidden">
          <button 
            onClick={() => setShowEditModal(true)}
            className="flex-1 md:flex-none px-4 py-2 border border-border bg-background rounded-lg text-sm font-bold hover:bg-muted transition-all"
          >
            Edit Profile
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-bold hover:bg-muted/80 transition-all inline-flex items-center justify-center gap-2"
          >
            <Printer size={15} /> Print Report
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex-1 md:flex-none px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 inline-flex items-center justify-center gap-2"
          >
            <Download size={15} /> Download PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-background p-1 rounded-xl w-fit border border-border shadow-sm print:hidden">
        {([['overview', '360 Overview'], ['academic', 'Academic Mastery'], ['history', 'Historical Archive']] as const).map(([tab, label]) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-6 py-2 text-xs font-bold rounded-lg transition-all',
              activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Report Header for Printing */}
      <div className="hidden print:block border-b border-border pb-4 mb-6">
        <h1 className="text-3xl font-black text-center text-primary uppercase">Student Performance Report</h1>
        <p className="text-xs text-muted-foreground text-center mt-1">Ummat Public School System — {student.branch}</p>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-4 space-y-6 print:col-span-12">
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm print:shadow-none">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Contact & Information</h4>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email Address', value: student.email },
                  { icon: Phone, label: 'Phone Number', value: student.phone },
                  { icon: MapPin, label: 'Address', value: student.address },
                  { icon: User, label: 'Guardian Details', value: `${student.guardianName} (${student.guardianPhone})` },
                  { icon: Calendar, label: 'Date of Birth', value: student.dob },
                  { icon: GraduationCap, label: 'Admission Date', value: student.admissionDate },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0 print:hidden"><item.icon size={14}/></div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</p>
                      <p className="text-sm font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm print:shadow-none">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fee Compliance</h4>
                <div className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', student.fees.status === 'Paid' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent')}>
                  {student.fees.status}
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">Outstanding</p>
                     <p className="text-2xl font-black text-foreground">PKR {student.fees.outstanding}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">Last Paid</p>
                     <p className="text-xs font-bold">{student.fees.lastPayment}</p>
                   </div>
                 </div>
                 <div className="w-full h-2 bg-muted rounded-full overflow-hidden print:hidden">
                   <div className="h-full bg-primary" style={{ width: `${(student.fees.total - student.fees.outstanding) / student.fees.total * 100}%` }} />
                 </div>
              </div>
            </div>
          </div>

          {/* Middle/Right Column - Analytics */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 print:col-span-12">
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col print:shadow-none print:break-inside-avoid">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Skill Radar</h4>
              <div className="flex-1 min-h-[250px] print:h-[200px]">
                <ReactECharts option={radarOption} style={{ height: '100%' }} />
              </div>
            </div>
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col print:shadow-none print:break-inside-avoid">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Behavioral Trend</h4>
              <div className="flex-1 min-h-[250px] print:h-[200px]">
                <ReactECharts option={behavioralOption} style={{ height: '100%' }} />
              </div>
            </div>
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm md:col-span-2 flex flex-col print:shadow-none print:break-inside-avoid">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Academic Progression (GPA)</h4>
              <div className="flex-1 min-h-[200px] print:h-[150px]">
                <ReactECharts option={performanceOption} style={{ height: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2">
              {student.sloProgress.map((slo, i) => (
                <div key={i} className="bg-background border border-border rounded-2xl p-5 shadow-sm space-y-3 print:shadow-none print:break-inside-avoid">
                   <div className="flex justify-between items-start">
                     <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black text-xs">{slo.ncp.split('-')[1]}</div>
                     <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', slo.mastery >= 85 ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning')}>
                       {slo.status}
                     </span>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-foreground line-clamp-1">{slo.name}</p>
                     <p className="text-[10px] font-mono text-muted-foreground uppercase">{slo.ncp}</p>
                   </div>
                   <div className="space-y-1">
                     <div className="flex justify-between text-[10px] font-bold">
                       <span>Mastery</span>
                       <span className="text-primary">{slo.mastery}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden print:hidden">
                       <div className="h-full bg-primary" style={{ width: `${slo.mastery}%` }} />
                     </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm print:shadow-none print:break-inside-avoid">
             <div className="p-6 border-b border-border flex items-center justify-between">
               <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Recent Detailed Assessments</h4>
               <Award size={18} className="text-primary" />
             </div>
             <table className="w-full text-sm">
               <thead>
                 <tr className="bg-muted/30 border-b border-border">
                   <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Subject</th>
                   <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Date</th>
                   <th className="px-6 py-4 text-center font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Score</th>
                   <th className="px-6 py-4 text-center font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {student.recentAssessments.map((item, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">{item.subject}</td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">{item.date}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-black text-primary">{item.score}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest print:border print:border-primary/20">{item.status}</span>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="flex flex-col items-center justify-center py-20 bg-background border border-border border-dashed rounded-3xl print:border-none">
           <ShieldCheck size={48} className="text-primary/20 mb-4" />
           <p className="text-lg font-black text-foreground">Archive Locked</p>
           <p className="text-sm text-muted-foreground font-medium">Full historical logs are archived by term.</p>
           <button className="mt-6 px-6 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 print:hidden">Request Archive Access</button>
        </div>
      )}

      {showEditModal && (
        <EditStudentProfileModal
          student={student}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  )
}

function EditStudentProfileModal({
  student,
  onClose,
  onSave,
}: {
  student: StudentData
  onClose: () => void
  onSave: (data: Partial<StudentData>) => Promise<void>
}) {
  const [name, setName] = useState(student.name)
  const [branch, setBranch] = useState(student.branch)
  const [selectedClass, setSelectedClass] = useState(student.class)
  const [guardianName, setGuardianName] = useState(student.guardianName || '')
  const [guardianPhone, setGuardianPhone] = useState(student.guardianPhone || '')
  const [registrationNumber, setRegistrationNumber] = useState(student.registrationNumber || '')
  const [address, setAddress] = useState(student.address || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    await onSave({
      name: name.trim(),
      branch,
      class: selectedClass,
      guardianName: guardianName.trim() || undefined,
      guardianPhone: guardianPhone.trim() || undefined,
      registrationNumber: registrationNumber.trim() || undefined,
      address: address.trim() || undefined,
    })
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative z-10 bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background sticky top-0 z-10">
          <div>
            <h2 className="font-heading font-black text-lg text-foreground">Edit Student Profile</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Update student details</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Student Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mohammad Ali"
              className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Registration Number</label>
              <input
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. REG-12345"
                className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Class *</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Branch *</label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Guardian's Name</label>
              <input
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Akbar Ali"
                className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Guardian's Phone</label>
              <input
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                placeholder="e.g. +92 300 1234567"
                className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Home Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. House 123, Street 4, Sector G-9, Islamabad"
              className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all min-h-[80px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-background sticky bottom-0 z-10">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
