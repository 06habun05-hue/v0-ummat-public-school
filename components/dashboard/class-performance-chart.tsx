'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const data = [
  { name: '10-A', gpa: 3.8 },
  { name: '10-B', gpa: 3.6 },
  { name: '9-A', gpa: 3.7 },
  { name: '9-B', gpa: 3.5 },
  { name: '8-A', gpa: 3.4 },
  { name: '8-B', gpa: 3.3 },
  { name: '8-C', gpa: 3.2 },
  { name: '7-A', gpa: 3.1 },
  { name: '7-B', gpa: 3.0 },
  { name: '6-A', gpa: 2.9 },
]

export function ClassPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        />
        <Bar dataKey="gpa" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--success))'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
