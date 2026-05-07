'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { day: 'Mon', attendance: 94 },
  { day: 'Tue', attendance: 93 },
  { day: 'Wed', attendance: 95 },
  { day: 'Thu', attendance: 92 },
  { day: 'Fri', attendance: 96 },
  { day: 'Sat', attendance: 87 },
  { day: 'Sun', attendance: 0 },
]

export function AttendanceTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        />
        <Line
          type="monotone"
          dataKey="attendance"
          stroke="hsl(var(--success))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--success))', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
