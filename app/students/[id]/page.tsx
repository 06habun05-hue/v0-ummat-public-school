'use client'

import { use } from 'react'
import { Mail, Phone, MapPin, BookOpen, DollarSign, BarChart3, TrendingUp, AlertCircle } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

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
  
  // Academic Performance
  academicOverview: [
    { category: 'Listening', value: 85 },
    { category: 'Reading', value: 90 },
    { category: 'Speaking', value: 80 },
    { category: 'Understanding', value: 88 },
    { category: 'Behavior', value: 92 },
  ],
  
  performanceTrend: [
    { term: 'Term 1', gpa: 3.6 },
    { term: 'Term 2', gpa: 3.7 },
    { term: 'Term 3', gpa: 3.8 },
  ],
  
  sloProgress: [
    { name: 'SLO-001', mastery: 85 },
    { name: 'SLO-002', mastery: 78 },
    { name: 'SLO-003', mastery: 92 },
    { name: 'SLO-004', mastery: 88 },
  ],
  
  behavioral: {
    presentRate: 95,
    uniformRate: 98,
    interactionScore: 85,
  },
  
  fees: {
    outstanding: 0,
    lastPayment: '2025-05-01',
    status: 'Paid',
  },
  
  recentAssessments: [
    { date: '2025-05-05', subject: 'English', score: 92 },
    { date: '2025-05-03', subject: 'Mathematics', score: 88 },
    { date: '2025-05-01', subject: 'Science', score: 85 },
  ],
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function StudentProfilePage({ params }: PageProps) {
  const { id } = use(params)

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Student Profile
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            360-degree view of academic performance and engagement
          </p>
        </div>
      </div>

      {/* Profile Grid - Bento Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {/* Profile Card - spans 1 column */}
        <div className="bg-background border border-border rounded-lg p-6 lg:row-span-2">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-heading font-bold text-2xl mb-4">
              {studentData.avatar}
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-1">
              {studentData.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">ID: {studentData.id}</p>
            
            <div className="w-full space-y-3 text-left mt-4 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <BookOpen size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="font-medium text-sm">{studentData.class}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Branch</p>
                  <p className="font-medium text-sm">{studentData.branch}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm text-primary break-all">{studentData.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm">{studentData.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Overview - Radar Chart */}
        <div className="bg-background border border-border rounded-lg p-6 sm:col-span-1 lg:col-span-1">
          <h4 className="font-heading font-semibold text-foreground mb-4">Academic Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={studentData.academicOverview}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Score"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend - Line Chart */}
        <div className="bg-background border border-border rounded-lg p-6 sm:col-span-1 lg:col-span-1">
          <h4 className="font-heading font-semibold text-foreground mb-4">Performance Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={studentData.performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="term" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SLO Progress - Horizontal Bars */}
        <div className="bg-background border border-border rounded-lg p-6 sm:col-span-2 lg:col-span-1">
          <h4 className="font-heading font-semibold text-foreground mb-4">SLO Progress</h4>
          <div className="space-y-4">
            {studentData.sloProgress.map((slo) => (
              <div key={slo.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{slo.name}</span>
                  <span className="text-xs text-muted-foreground">{slo.mastery}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${slo.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Summary */}
        <div className="bg-background border border-border rounded-lg p-6 sm:col-span-2 lg:col-span-1">
          <h4 className="font-heading font-semibold text-foreground mb-4">Behavioral Summary</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
              <span className="text-sm font-medium">Present Rate</span>
              <span className="text-lg font-bold text-success">{studentData.behavioral.presentRate}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <span className="text-sm font-medium">Uniform Rate</span>
              <span className="text-lg font-bold text-primary">{studentData.behavioral.uniformRate}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <span className="text-sm font-medium">Interaction Score</span>
              <span className="text-lg font-bold text-warning">{studentData.behavioral.interactionScore}</span>
            </div>
          </div>
        </div>

        {/* Fee Status */}
        <div className="bg-background border border-border rounded-lg p-6 sm:col-span-2 lg:col-span-1">
          <h4 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign size={18} />
            Fee Status
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Outstanding Balance</span>
              <span className={`font-bold text-lg ${studentData.fees.outstanding > 0 ? 'text-danger' : 'text-success'}`}>
                ${studentData.fees.outstanding}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Payment</span>
              <span className="font-medium text-sm">{new Date(studentData.fees.lastPayment).toLocaleDateString()}</span>
            </div>
            <div className="pt-3 border-t border-border">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                studentData.fees.status === 'Paid'
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
              }`}>
                {studentData.fees.status}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-background border border-border rounded-lg p-6 sm:col-span-2 lg:col-span-2">
          <h4 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 size={18} />
            Recent Assessments
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Subject</th>
                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">Score</th>
                </tr>
              </thead>
              <tbody>
                {studentData.recentAssessments.map((assessment, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-muted/30' : ''}>
                    <td className="py-3 px-3">{new Date(assessment.date).toLocaleDateString()}</td>
                    <td className="py-3 px-3 font-medium">{assessment.subject}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded font-semibold">
                        {assessment.score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
