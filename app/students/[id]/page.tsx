'use client'

import { use, useState, useMemo } from 'react'
import { Mail, Phone, MapPin, BookOpen, DollarSign, BarChart3, TrendingUp, AlertCircle, Calendar, GraduationCap, Award, ShieldCheck, ChevronRight } from 'lucide-react'
import ReactECharts from 'echarts-for-react'
import { cn } from '@/lib/utils'

// Mock student data
const studentData = {
  id: 'STU001',
  name: 'Ahmed Hassan',
  class: '10-A',
  branch: 'Main Campus',
  avatar: 'AH',
  email: 'ahmed.hassan@school.edu',
  phone: '+966-55-1234567',
  address: 'Riyadh, Saudi Arabia',
  gender: 'Male',
  dob: '2009-05-15',
  admissionDate: '2020-08-20',
  
  academicOverview: [
    { name: 'Listening', value: 85 },
    { name: 'Reading', value: 90 },
    { name: 'Speaking', value: 80 },
    { name: 'Understanding', value: 88 },
    { name: 'Behavior', value: 92 },
  ],
  
  performanceTrend: {
    terms: ['Term 1', 'Term 2', 'Term 3'],
    gpas: [3.6, 3.7, 3.8]
  },
  
  sloProgress: [
    { name: 'SLO-001: Main Idea', mastery: 85, ncp: 'NCP-ENG-101', status: 'Mastered' },
    { name: 'SLO-042: Quadratic Roots', mastery: 78, ncp: 'NCP-MAT-301', status: 'Proficient' },
    { name: 'SLO-072: Cellular Organelles', mastery: 92, ncp: 'NCP-SCI-201', status: 'Mastered' },
    { name: 'SLO-087: Surah Al-Baqarah', mastery: 88, ncp: 'NCP-ISL-101', status: 'Mastered' },
  ],
  
  behavioralTrend: {
    weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    scores: [85, 88, 84, 90, 92, 91]
  },
  
  fees: {
    total: 45000,
    paid: 45000,
    outstanding: 0,
    lastPayment: '2025-05-01',
    status: 'Paid',
  },
  
  recentAssessments: [
    { date: '2025-05-05', subject: 'English', score: 92, status: 'Excellence' },
    { date: '2025-05-03', subject: 'Mathematics', score: 88, status: 'Great' },
    { date: '2025-05-01', subject: 'Science', score: 85, status: 'Great' },
  ],
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function StudentProfilePage({ params }: PageProps) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'history'>('overview')

  // ECharts Options
  const radarOption = {
    radar: {
      indicator: studentData.academicOverview.map(item => ({ name: item.name, max: 100 })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#64748b', fontSize: 10 },
      splitLine: { lineStyle: { color: ['#e2e8f0'] } },
      splitArea: { show: false }
    },
    series: [{
      type: 'radar',
      data: [{
        value: studentData.academicOverview.map(item => item.value),
        name: 'Skill Level',
        itemStyle: { color: '#2A7A30' },
        areaStyle: { color: '#2A7A3033' }
      }]
    }]
  }

  const performanceOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 10, bottom: 30, left: 30, right: 10 },
    xAxis: { type: 'category', data: studentData.performanceTrend.terms, axisTick: { show: false }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: { type: 'value', min: 0, max: 4, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    series: [{
      data: studentData.performanceTrend.gpas,
      type: 'line',
      smooth: true,
      symbolSize: 8,
      itemStyle: { color: '#2A7A30' },
      lineStyle: { width: 3 },
      areaStyle: { color: 'rgba(42, 122, 48, 0.1)' }
    }]
  }

  const behavioralOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 10, bottom: 30, left: 30, right: 10 },
    xAxis: { type: 'category', data: studentData.behavioralTrend.weeks, axisTick: { show: false }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: { type: 'value', min: 60, max: 100, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    series: [{
      data: studentData.behavioralTrend.scores,
      type: 'bar',
      itemStyle: { 
        color: '#2A7A30',
        borderRadius: [4, 4, 0, 0]
      },
      barMaxWidth: 20
    }]
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-neutral/30 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20">
             {studentData.avatar}
           </div>
           <div>
             <h2 className="text-2xl font-black text-foreground tracking-tight">{studentData.name}</h2>
             <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
               <span>ID: {studentData.id}</span>
               <span>•</span>
               <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">{studentData.class}</span>
             </div>
           </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 border border-border bg-background rounded-lg text-sm font-bold hover:bg-muted transition-all">Edit Profile</button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Print Report</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-background p-1 rounded-xl w-fit border border-border shadow-sm">
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

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Contact & Information</h4>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email Address', value: studentData.email },
                  { icon: Phone, label: 'Phone Number', value: studentData.phone },
                  { icon: MapPin, label: 'Address', value: studentData.address },
                  { icon: Calendar, label: 'Date of Birth', value: studentData.dob },
                  { icon: GraduationCap, label: 'Admission Date', value: studentData.admissionDate },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0"><item.icon size={14}/></div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</p>
                      <p className="text-sm font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fee Compliance</h4>
                <div className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', studentData.fees.status === 'Paid' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent')}>
                  {studentData.fees.status}
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">Outstanding</p>
                     <p className="text-2xl font-black text-foreground">PKR {studentData.fees.outstanding}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">Last Paid</p>
                     <p className="text-xs font-bold">{studentData.fees.lastPayment}</p>
                   </div>
                 </div>
                 <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: '100%' }} />
                 </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Analytics */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Skill Radar</h4>
              <div className="flex-1 min-h-[250px]">
                <ReactECharts option={radarOption} style={{ height: '100%' }} />
              </div>
            </div>
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Behavioral Trend</h4>
              <div className="flex-1 min-h-[250px]">
                <ReactECharts option={behavioralOption} style={{ height: '100%' }} />
              </div>
            </div>
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm md:col-span-2 flex flex-col">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Academic Progression (GPA)</h4>
              <div className="flex-1 min-h-[200px]">
                <ReactECharts option={performanceOption} style={{ height: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {studentData.sloProgress.map((slo, i) => (
                <div key={i} className="bg-background border border-border rounded-2xl p-5 shadow-sm space-y-3">
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
                     <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${slo.mastery}%` }} />
                     </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
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
                  {studentData.recentAssessments.map((item, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">{item.subject}</td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">{item.date}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-black text-primary">{item.score}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="flex flex-col items-center justify-center py-20 bg-background border border-border border-dashed rounded-3xl">
           <ShieldCheck size={48} className="text-primary/20 mb-4" />
           <p className="text-lg font-black text-foreground">Archive Locked</p>
           <p className="text-sm text-muted-foreground font-medium">Full historical logs are archived by term.</p>
           <button className="mt-6 px-6 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">Request Archive Access</button>
        </div>
      )}
    </div>
  )
}
