'use client'

import { useRef, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'

interface ChartWrapperProps {
  option: any
  style?: React.CSSProperties
  className?: string
  theme?: string
  notMerge?: boolean
  lazyUpdate?: boolean
}

export function ChartWrapper({
  option,
  style,
  className,
  theme,
  notMerge = false,
  lazyUpdate = false,
}: ChartWrapperProps) {
  const chartRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const handleResize = () => {
      if (chartRef.current) {
        try {
          const echartsInstance = chartRef.current.getEchartsInstance()
          if (echartsInstance) {
            echartsInstance.resize()
          }
        } catch (e) {
          // Guard against cases where ECharts instance might not be initialized yet
          console.warn('ECharts resize failed:', e)
        }
      }
    }

    const observer = new ResizeObserver(() => {
      // Use requestAnimationFrame to avoid "ResizeObserver loop limit exceeded" errors in browser logs
      window.requestAnimationFrame(() => {
        handleResize()
      })
    })

    observer.observe(containerRef.current)

    // Fallback resize listener for extra safety
    window.addEventListener('resize', handleResize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ width: '100%', height: '100%', ...style }}
        theme={theme}
        notMerge={notMerge}
        lazyUpdate={lazyUpdate}
      />
    </div>
  )
}
