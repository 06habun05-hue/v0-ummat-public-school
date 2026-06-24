'use client'

import { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { cn } from '@/lib/utils'
import { TrendingUp, Users, BookOpen, BarChart3 } from 'lucide-react'

const tabs = ['Overview', 'Academic', 'Attendance', 'Teacher Performance', 'Behavioral'] as const
type Tab = typeof tabs[number]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [analyticsData, setAnalyticsData] = useState<any>({
    kpis: {
      totalStudents: 0,
      avgScore: '0%',
      attendanceRate: '0%',
      activeTeachers: 0,
    },
    branchComparison: {
      scores: [0, 0, 0],
      attendance: [0, 0, 0],
    },
    radarData: [0, 0, 0, 0, 0],
    bottomSLOs: [],
    teacherRows: [],
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics')
        if (res.ok) {
          const data = await res.json()
          setAnalyticsData(data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchAnalytics()
  }, [])

  const { kpis, branchComparison, radarData, bottomSLOs, teacherRows } = analyticsData

  const kpiCards = [
    { label: 'Total Students', value: String(kpis?.totalStudents || 0), sub: '+4% this term', icon: Users },
    { label: 'Avg Score', value: kpis?.avgScore || '0%', sub: '+2% vs last term', icon: TrendingUp },
    { label: 'Attendance Rate', value: kpis?.attendanceRate || '0%', sub: '+0.5% vs last term', icon: BookOpen },
    { label: 'Active Teachers', value: String(kpis?.activeTeachers || 0), sub: 'Across 3 branches', icon: BarChart3 },
  ]

  const branchComparisonOpts = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Avg Score', 'Attendance %'], bottom: 0, textStyle: { fontSize: 11 } },
    grid: { top: 10, right: 10, bottom: 36, left: 40 },
    xAxis: { type: 'category', data: ['Main Campus', 'North Campus', 'South Campus'], axisTick: { show: false } },
    yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
    series: [
      { name: 'Avg Score', type: 'bar', data: branchComparison?.scores || [0, 0, 0], itemStyle: { color: '#2A7A30', borderRadius: [4,4,0,0] } },
      { name: 'Attendance %', type: 'bar', data: branchComparison?.attendance || [0, 0, 0], itemStyle: { color: '#2A7A3055', borderRadius: [4,4,0,0] } },
    ],
  }

  const monthlyTrendOpts = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Avg Score', 'Attendance'], bottom: 0, textStyle: { fontSize: 11 } },
    grid: { top: 10, right: 20, bottom: 36, left: 40 },
    xAxis: { type: 'category', data: ['Jan','Feb','Mar','Apr','May'], axisTick: { show: false } },
    yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
    series: [
      { name: 'Avg Score', type: 'line', smooth: true, data: [75, 78, 80, 82, 85], lineStyle: { color: '#2A7A30', width: 2 }, itemStyle: { color: '#2A7A30' }, areaStyle: { color: '#2A7A3015' } },
      { name: 'Attendance', type: 'line', smooth: true, data: [91, 93, 92, 94, 95], lineStyle: { color: '#CC1E1E', width: 2 }, itemStyle: { color: '#CC1E1E' }, areaStyle: { color: '#CC1E1E10' } },
    ],
  }

  const heatmapOpts = {
    tooltip: { formatter: (p: any) => `Score: ${p.data[2]}` },
    grid: { top: 10, bottom: 40, left: 70, right: 10 },
    xAxis: { type: 'category', data: ['English','Math','Science','Soc.Studies','Islamic'], axisTick: { show: false }, axisLabel: { fontSize: 10 } },
    yAxis: { type: 'category', data: ['10-A','10-B','9-A','9-B'], axisLabel: { fontSize: 11 } },
    visualMap: { min: 60, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 12, itemHeight: 80, textStyle: { fontSize: 10 }, inRange: { color: ['#ffebe6','#2A7A30'] } },
    series: [{
      type: 'heatmap',
      data: [
        [0, 0, 78], [1, 0, 82], [2, 0, 85], [3, 0, 74], [4, 0, 90],
        [0, 1, 72], [1, 1, 80], [2, 1, 79], [3, 1, 85], [4, 1, 88],
        [0, 2, 85], [1, 2, 75], [2, 2, 81], [3, 2, 70], [4, 2, 82],
        [0, 3, 79], [1, 3, 88], [2, 3, 77], [3, 3, 80], [4, 3, 86],
      ],
      label: { show: true, fontSize: 10 }
    }],
  }

  const radarOpts = {
    tooltip: {},
    radar: { indicator: [{ name:'English',max:100},{ name:'Math',max:100},{ name:'Science',max:100},{ name:'Soc.Studies',max:100},{ name:'Islamic',max:100}], splitNumber: 4, axisName: { fontSize: 11 } },
    series: [{ type:'radar', data:[{ value: radarData || [0,0,0,0,0], name:'Avg', areaStyle:{ color:'#2A7A3030' }, lineStyle:{ color:'#2A7A30' }, itemStyle:{ color:'#2A7A30' } }] }],
  }

  const weakSkillsOpts = {
    tooltip: { trigger: 'axis' },
    grid: { top: 10, right: 80, bottom: 10, left: 80 },
    xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
    yAxis: { type: 'category', data: bottomSLOs?.map((s: any) => s.sloId).reverse() || ['SLO-007','SLO-003','SLO-005','SLO-002','SLO-008'], axisLabel: { fontSize: 11 } },
    series: [{
      type:'bar',
      data: bottomSLOs?.map((s: any) => s.score).reverse() || [58, 64, 70, 75, 82],
      label:{ show:true, position:'right', formatter:'{c}%', fontSize:11 },
      itemStyle:{ borderRadius:[0,4,4,0], color: (p: any) => p.data < 65 ? '#CC1E1E' : '#F59E0B' }
    }],
  }

  const weeklyAttendanceOpts = {
    tooltip: { trigger: 'axis' },
    legend: { data:['Main','North','South'], bottom:0, textStyle:{ fontSize:11 } },
    grid: { top:10, right:20, bottom:36, left:40 },
    xAxis: { type:'category', data:['Week 1','Week 2','Week 3','Week 4','Week 5'], axisTick:{ show:false } },
    yAxis: { type:'value', min:80, max:100, splitLine:{ lineStyle:{ color:'#f0f0f0' } } },
    series: [
      { name:'Main',  type:'line', smooth:true, data:[94, 95, 93, 96, 95], lineStyle:{ color:'#2A7A30' }, itemStyle:{ color:'#2A7A30' } },
      { name:'North', type:'line', smooth:true, data:[91, 92, 90, 93, 92], lineStyle:{ color:'#F59E0B' }, itemStyle:{ color:'#F59E0B' } },
      { name:'South', type:'line', smooth:true, data:[88, 89, 91, 90, 89], lineStyle:{ color:'#CC1E1E' }, itemStyle:{ color:'#CC1E1E' } },
    ],
  }

  const attHeatOpts = {
    tooltip: { formatter: (p: any) => `${p.data[2]}%` },
    grid: { top:10, bottom:40, left:60, right:10 },
    xAxis: { type:'category', data:['Mon','Tue','Wed','Thu','Fri','Sat'], axisTick:{ show:false }, axisLabel:{ fontSize:11 } },
    yAxis: { type:'category', data:['10-A','10-B','9-A','9-B'], axisLabel:{ fontSize:11 } },
    visualMap: { min:80, max:100, calculable:true, orient:'horizontal', left:'center', bottom:0, itemWidth:12, itemHeight:100, textStyle:{ fontSize:10 }, inRange:{ color:['#ffebe6','#2A7A30'] } },
    series: [{
      type:'heatmap',
      data: [
        [0,0,94],[1,0,96],[2,0,95],[3,0,93],[4,0,96],[5,0,95],
        [0,1,91],[1,1,90],[2,1,93],[3,1,92],[4,1,91],[5,1,92],
        [0,2,88],[1,2,89],[2,2,91],[3,2,90],[4,2,89],[5,2,90],
        [0,3,92],[1,3,93],[2,3,92],[3,3,94],[4,3,95],[5,3,93],
      ],
      label:{ show:true, fontSize:10, formatter:(p:any)=>`${p.data[2]}%` }
    }],
  }

  const teacherBarOpts = {
    tooltip: { trigger:'axis' },
    grid: { top:10, right:10, bottom:50, left:50 },
    xAxis: { type:'category', data: teacherRows?.map((t: any) => t.name) || ['Ms. Sana','Mr. Tariq','Ms. Ayesha'], axisTick:{ show:false }, axisLabel:{ fontSize:10, rotate:10 } },
    yAxis: { type:'value', max:100, splitLine:{ lineStyle:{ color:'#f0f0f0' } } },
    series: [{
      type:'bar',
      data: teacherRows?.map((t: any) => t.approvalRate) || [92, 85, 78],
      itemStyle:{ borderRadius:[4,4,0,0], color:(p:any)=>p.data>=90?'#2A7A30':p.data>=80?'#F59E0B':'#CC1E1E' }
    }],
  }

  const behavioralOpts = {
    tooltip: { trigger:'axis' },
    legend: { data:['Uniform','Interaction','Behavior'], bottom:0, textStyle:{ fontSize:11 } },
    grid: { top:10, right:20, bottom:36, left:40 },
    xAxis: { type:'category', data:['Week 1','Week 2','Week 3','Week 4','Week 5'], axisTick:{ show:false } },
    yAxis: { type:'value', min:70, max:100, splitLine:{ lineStyle:{ color:'#f0f0f0' } } },
    series: [
      { name: 'Uniform',     type:'line', smooth:true, data:[92, 94, 93, 95, 96], lineStyle:{ color:'#2A7A30' }, itemStyle:{ color:'#2A7A30' } },
      { name: 'Interaction', type:'line', smooth:true, data:[85, 87, 86, 88, 89], lineStyle:{ color:'#F59E0B' }, itemStyle:{ color:'#F59E0B' } },
      { name: 'Behavior',    type:'line', smooth:true, data:[90, 91, 93, 92, 94], lineStyle:{ color:'#6366F1' }, itemStyle:{ color:'#6366F1' } },
    ],
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Analytics Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Institution-wide performance and behavioral insights</p>
      </div>

      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={cn('px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors', activeTab===t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map(c => (
              <div key={c.label} className="bg-background border border-border rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                    <p className="text-2xl font-heading font-bold">{c.value}</p>
                    <p className="text-[11px] text-primary mt-1">{c.sub}</p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <c.icon size={18} className="text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-lg p-5">
              <h3 className="font-semibold text-sm mb-4">Branch Comparison</h3>
              <ReactECharts option={branchComparisonOpts} style={{ height: 220 }} />
            </div>
            <div className="bg-background border border-border rounded-lg p-5">
              <h3 className="font-semibold text-sm mb-4">Monthly Trend</h3>
              <ReactECharts option={monthlyTrendOpts} style={{ height: 220 }} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Academic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-lg p-5">
              <h3 className="font-semibold text-sm mb-4">Class × Subject Heatmap</h3>
              <ReactECharts option={heatmapOpts} style={{ height: 240 }} />
            </div>
            <div className="bg-background border border-border rounded-lg p-5">
              <h3 className="font-semibold text-sm mb-4">Subject-wise Radar</h3>
              <ReactECharts option={radarOpts} style={{ height: 240 }} />
            </div>
          </div>
          <div className="bg-background border border-border rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-4">Weak Skill Analysis — Bottom 5 SLOs</h3>
            <ReactECharts option={weakSkillsOpts} style={{ height: 180 }} />
          </div>
        </div>
      )}

      {activeTab === 'Attendance' && (
        <div className="space-y-6">
          <div className="bg-background border border-border rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-4">Weekly Attendance by Branch</h3>
            <ReactECharts option={weeklyAttendanceOpts} style={{ height: 240 }} />
          </div>
          <div className="bg-background border border-border rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-4">Attendance Heatmap — Class × Day</h3>
            <ReactECharts option={attHeatOpts} style={{ height: 220 }} />
          </div>
        </div>
      )}

      {activeTab === 'Teacher Performance' && (
        <div className="space-y-6">
          <div className="bg-background border border-border rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-4">Approval Rate by Teacher</h3>
            <ReactECharts option={teacherBarOpts} style={{ height: 220 }} />
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  {['Teacher','Classes','Submitted','Approval Rate','Avg Score'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(teacherRows || []).map((t: any, i: number) => (
                  <tr key={t.name} className={cn('hover:bg-muted/50', i%2===1&&'bg-muted/20')}>
                    <td className="px-4 py-3 font-medium">{t.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.classes}</td>
                    <td className="px-4 py-3">{t.submitted}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-semibold', t.approvalRate>=90?'text-primary':t.approvalRate>=80?'text-warning':'text-accent')}>
                        {t.approvalRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-border rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-primary" style={{ width:`${t.avgScore}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-primary">{t.avgScore}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Behavioral' && (
        <div className="bg-background border border-border rounded-lg p-5">
          <h3 className="font-semibold text-sm mb-4">Behavioral Trends — Weekly</h3>
          <ReactECharts option={behavioralOpts} style={{ height: 300 }} />
        </div>
      )}
    </div>
  )
}
