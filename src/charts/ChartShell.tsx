import type { ReactNode } from 'react'
import './charts.css'

type ChartShellProps = {
  title: string
  subtitle: string
  caption?: string
  legend?: ReactNode
  children: ReactNode
}

export function ChartShell({
  title,
  subtitle,
  caption,
  legend,
  children,
}: ChartShellProps) {
  return (
    <figure className="story-chart">
      <div className="story-chart-header">
        <div>
          <h3>{title}</h3>
          <p className="chart-caption">{subtitle}</p>
        </div>
        {legend ? <div className="chart-legend">{legend}</div> : null}
      </div>
      <div className="story-chart-scroll">{children}</div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
