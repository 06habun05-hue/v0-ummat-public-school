'use client'

import { useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { cn } from '@/lib/utils'
import { TrendingUp, Users, BookOpen, BarChart3 } from 'lucide-react'

const tabs = ['Overview', 'Academic', 'Attendance', 'Teacher Performance', 'Behavioral'] as const
type Tab = typeof tabs[number]

const branchComparisonOpts = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['Avg Score', 'Attendance %'], bottom: 0, textStyle: { fontSize: 11 } },
  grid: { top: 10, right: 10, bottom: 36, left: 40 },
  xAxis: { type: 'category', data: ['Main Campus', 'North Campus', 'South Campus'], axisTick: { show: false } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
  series: [
    { name: 'Avg Score', type: 'bar', data: [82, 78, 75], itemStyle: { color: '#2A7A30', borderRadius: [4,4,0,0] } },
    { name: 'Attendance %', type: 'bar', data: [94, 91, 88], itemStyle: { color: '#2A7A3055', borderRadius: [4,4,0,0] } },
  ],
}

const monthlyTrendOpts = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['Avg Score', 'Attendance'], bottom: 0, textStyle: { fontSize: 11 } },
  grid: { top: 10, right: 20, bottom: 36, left: 40 },
  xAxis: { type: 'category', data: ['Jan','Feb','Mar','Apr','May'], axisTick: { show: false } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
  series: [
    { name: 'Avg Score', type: 'line', smooth: true, data: [76,79,81,80,83], lineStyle: { color: '#2A7A30', width: 2 }, itemStyle: { color: '#2A7A30' }, areaStyle: { color: '#2A7A3015' } },
    { name: 'Attendance', type: 'line', smooth: true, data: [91,92,90,93,94], lineStyle: { color: '#CC1E1E', width: 2 }, itemStyle: { color: '#CC1E1E' }, areaStyle: { color: '#CC1E1E10' } },
  ],
}

const heatmapOpts = {
  tooltip: { formatter: (p: any) => `Score: ${p.data[2]}` },
  grid: { top: 10, bottom: 40, left: 70, right: 10 },
  xAxis: { type: 'category', data: ['English','Math','Science','Soc.Studies','Islamic'], axisTick: { show: false }, axisLabel: { fontSize: 10 } },
  yAxis: { type: 'category', data: ['10-A','10-B','9-A','9-B'], axisLabel: { fontSize: 11 } },
  visualMap: { min: 60, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 12, itemHeight: 80, textStyle: { fontSize: 10 }, inRange: { color: ['#ffebe6','#2A7A30'] } },
  series: [{ type: 'heatmap', data: [[0,0,85],[0,1,78],[0,2,90],[0,3,82],[0,4,76],[1,0,92],[1,1,88],[1,2,85],[1,3,79],[1,4,91],[2,0,70],[2,1,74],[2,2,68],[2,3,72],[2,4,75],[3,0,88],[3,1,85],[3,2,92],[3,3,87],[3,4,84]], label: { show: true, fontSize: 10 } }],
}

const radarOpts = {
  tooltip: {},
  radar: { indicator: [{ name:'English',max:100},{ name:'Math',max:100},{ name:'Science',max:100},{ name:'Soc.Studies',max:100},{ name:'Islamic',max:100}], splitNumber: 4, axisName: { fontSize: 11 } },
  series: [{ type:'radar', data:[{ value:[82,79,85,72,90], name:'Avg', areaStyle:{ color:'#2A7A3030' }, lineStyle:{ color:'#2A7A30' }, itemStyle:{ color:'#2A7A30' } }] }],
}

const weakSkillsOpts = {
  tooltip: { trigger: 'axis' },
  grid: { top: 10, right: 80, bottom: 10, left: 80 },
  xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
  yAxis: { type: 'category', data: ['SLO-007','SLO-003','SLO-005','SLO-002','SLO-008'], axisLabel: { fontSize: 11 } },
  series: [{ type:'bar', data:[55,61,64,68,70], label:{ show:true, position:'right', formatter:'{c}%', fontSize:11 }, itemStyle:{ borderRadius:[0,4,4,0], color: (p: any) => p.data < 65 ? '#CC1E1E' : '#F59E0B' } }],
}

const weeklyAttendanceOpts = {
  tooltip: { trigger: 'axis' },
  legend: { data:['Main','North','South'], bottom:0, textStyle:{ fontSize:11 } },
  grid: { top:10, right:20, bottom:36, left:40 },
  xAxis: { type:'category', data:['Week 1','Week 2','Week 3','Week 4','Week 5'], axisTick:{ show:false } },
  yAxis: { type:'value', min:80, max:100, splitLine:{ lineStyle:{ color:'#f0f0f0' } } },
  series: [
    { name:'Main',  type:'line', smooth:true, data:[93,94,92,95,94], lineStyle:{ color:'#2A7A30' }, itemStyle:{ color:'#2A7A30' } },
    { name:'North', type:'line', smooth:true, data:[90,91,89,92,91], lineStyle:{ color:'#F59E0B' }, itemStyle:{ color:'#F59E0B' } },
    { name:'South', type:'line', smooth:true, data:[87,88,86,89,88], lineStyle:{ color:'#CC1E1E' }, itemStyle:{ color:'#CC1E1E' } },
  ],
}

const attHeatOpts = {
  tooltip: { formatter: (p: any) => `${p.data[2]}%` },
  grid: { top:10, bottom:40, left:60, right:10 },
  xAxis: { type:'category', data:['Mon','Tue','Wed','Thu','Fri','Sat'], axisTick:{ show:false }, axisLabel:{ fontSize:11 } },
  yAxis: { type:'category', data:['10-A','10-B','9-A','9-B'], axisLabel:{ fontSize:11 } },
  visualMap: { min:80, max:100, calculable:true, orient:'horizontal', left:'center', bottom:0, itemWidth:12, itemHeight:100, textStyle:{ fontSize:10 }, inRange:{ color:['#ffebe6','#2A7A30'] } },
  series: [{ type:'heatmap', data:[[0,0,95],[0,1,93],[0,2,92],[0,3,94],[0,4,91],[0,5,88],[1,0,88],[1,1,90],[1,2,87],[1,3,91],[1,4,89],[1,5,85],[2,0,92],[2,1,94],[2,2,93],[2,3,95],[2,4,92],[2,5,90],[3,0,85],[3,1,87],[3,2,84],[3,3,88],[3,4,86],[3,5,82]], label:{ show:true, fontSize:10, formatter:(p:any)=>`${p.data[2]}%` } }],
}

const teacherBarOpts = {
  tooltip: { trigger:'axis' },
  grid: { top:10, right:10, bottom:50, left:50 },
  xAxis: { type:'category', data:['Ms. Sana','Mr. Tariq','Ms. Ayesha','Mr. Hassan','Ms. Noor'], axisTick:{ show:false }, axisLabel:{ fontSize:10, rotate:10 } },
  yAxis: { type:'value', max:100, splitLine:{ lineStyle:{ color:'#f0f0f0' } } },
  series: [{ type:'bar', data:[92,85,78,88,95], itemStyle:{ borderRadius:[4,4,0,0], color:(p:any)=>p.data>=90?'#2A7A30':p.data>=80?'#F59E0B':'#CC1E1E' } }],
}

const behavioralOpts = {
  tooltip: { trigger:'axis' },
  legend: { data:['Uniform','Interaction','Behavior'], bottom:0, textStyle:{ fontSize:11 } },
  grid: { top:10, right:20, bottom:36, left:40 },
  xAxis: { type:'category', data:['Week 1','Week 2','Week 3','Week 4','Week 5'], axisTick:{ show:false } },
  yAxis: { type:'value', min:70, max:100, splitLine:{ lineStyle:{ color:'#f0f0f0' } } },
  series: [
    { name:'Uniform',     type:'line', smooth:true, data:[88,90,89,91,92], lineStyle:{ color:'#2A7A30' }, itemStyle:{ color:'#2A7A30' } },
    { name:'Interaction', type:'line', smooth:true, data:[82,84,81,85,83], lineStyle:{ color:'#F59E0B' }, itemStyle:{ color:'#F59E0B' } },
    { name:'Behavior',    type:'line', smooth:true, data:[91,92,90,93,94], lineStyle:{ color:'#6366F1' }, itemStyle:{ color:'#6366F1' } },
  ],
}

const kpiCards = [
  { label:'Total Students', value:'2,458', sub:'+12% this term', icon:Users },
  { label:'Avg Score', value:'81.4%', sub:'+3.2% vs last term', icon:TrendingUp },
  { label:'Attendance Rate', value:'92.6%', sub:'+1.8% vs last term', icon:BookOpen },
  { label:'Active Teachers', value:'124', sub:'Across 3 branches', icon:BarChart3 },
]

const teacherRows = [
  { name:'Ms. Sana Malik', classes:4, submitted:18, approvalRate:94, avgScore:88 },
  { name:'Mr. Tariq Ahmed', classes:3, submitted:15, approvalRate:87, avgScore:82 },
  { name:'Ms. Ayesha Noor', classes:4, submitted:14, approvalRate:79, avgScore:79 },
  { name:'Mr. Hassan Raza', classes:3, submitted:17, approvalRate:91, avgScore:85 },
  { name:'Ms. Noor Fatima', classes:5, submitted:20, approvalRate:95, avgScore:91 },
]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  return (
    <div className="p-6 md:p-8 space-y-6">
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
                {teacherRows.map((t, i) => (
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
