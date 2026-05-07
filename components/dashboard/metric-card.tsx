import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    percentage: number
    isPositive: boolean
  }
  className?: string
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-2">{label}</p>
          <p className="text-3xl font-heading font-bold text-foreground mb-3">
            {value}
          </p>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                trend.isPositive ? 'text-success' : 'text-danger'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>{trend.percentage}% from last month</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon size={24} className="text-primary" />
        </div>
      </div>
    </div>
  )
}
