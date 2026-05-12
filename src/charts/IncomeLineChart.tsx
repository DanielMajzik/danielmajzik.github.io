import { ChartShell } from './ChartShell'
import {
  COLORS,
  COUNTRY_DATA,
  LATEST_YEAR,
  START_YEAR,
  type MetricId,
  formatCompactPps,
  formatDeltaPps,
  formatPps,
  getTicks,
  isNumber,
  niceCeil,
} from './chartData'

type IncomeLineChartProps = {
  metricId: Extract<MetricId, 'meanIncome' | 'medianIncome'>
  title: string
  subtitle: string
  caption?: string
  color: string
}

type LabelPosition = {
  code: string
  y: number
}

const WIDTH = 980
const HEIGHT = 540
const MARGIN = {
  top: 34,
  right: 150,
  bottom: 58,
  left: 78,
}
const LABEL_GAP = 14

function adjustLabelPositions(
  labels: LabelPosition[],
  minY: number,
  maxY: number,
) {
  const sorted = [...labels].sort((first, second) => first.y - second.y)

  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index].y < sorted[index - 1].y + LABEL_GAP) {
      sorted[index].y = sorted[index - 1].y + LABEL_GAP
    }
  }

  const overflow = sorted[sorted.length - 1]?.y - maxY

  if (overflow > 0) {
    sorted[sorted.length - 1].y -= overflow

    for (let index = sorted.length - 2; index >= 0; index -= 1) {
      if (sorted[index].y > sorted[index + 1].y - LABEL_GAP) {
        sorted[index].y = sorted[index + 1].y - LABEL_GAP
      }
    }
  }

  if (sorted[0]?.y < minY) {
    const underflow = minY - sorted[0].y

    sorted.forEach((label) => {
      label.y += underflow
    })
  }

  return new Map(sorted.map((label) => [label.code, label.y]))
}

export function IncomeLineChart({
  metricId,
  title,
  subtitle,
  caption,
  color,
}: IncomeLineChartProps) {
  const rows = COUNTRY_DATA.map((country) => {
    const start = country.stats[START_YEAR][metricId]
    const end = country.stats[LATEST_YEAR][metricId]

    return {
      code: country.code,
      name: country.name,
      start,
      end,
      delta: isNumber(start) && isNumber(end) ? end - start : null,
    }
  }).filter((row) => isNumber(row.start) && isNumber(row.end))
  const allValues = rows.flatMap((row) => [row.start, row.end]).filter(isNumber)
  const yMax = niceCeil(Math.max(...allValues), 10000)
  const plotTop = MARGIN.top
  const plotBottom = HEIGHT - MARGIN.bottom
  const xStart = MARGIN.left + 44
  const xEnd = WIDTH - MARGIN.right - 44
  const labelX = WIDTH - MARGIN.right + 12
  const ticks = getTicks(yMax)

  function yScale(value: number) {
    return plotBottom - (value / yMax) * (plotBottom - plotTop)
  }

  const labelPositions = adjustLabelPositions(
    rows.map((row) => ({
      code: row.code,
      y: isNumber(row.end) ? yScale(row.end) : plotBottom,
    })),
    plotTop,
    plotBottom,
  )

  return (
    <ChartShell caption={caption} subtitle={subtitle} title={title}>
      <svg
        aria-label={`${title}, ${START_YEAR} to ${LATEST_YEAR}`}
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <title>{`${title}, ${START_YEAR} to ${LATEST_YEAR}`}</title>
        {ticks.map((tick) => {
          const y = yScale(tick)

          return (
            <g key={tick}>
              <line
                className="chart-grid"
                x1={MARGIN.left}
                x2={xEnd}
                y1={y}
                y2={y}
              />
              <text
                className="chart-axis-label"
                dominantBaseline="middle"
                textAnchor="end"
                x={MARGIN.left - 10}
                y={y}
              >
                {formatCompactPps(tick)}
              </text>
            </g>
          )
        })}

        <line
          className="chart-axis-line"
          x1={xStart}
          x2={xStart}
          y1={plotTop}
          y2={plotBottom}
        />
        <line
          className="chart-axis-line"
          x1={xEnd}
          x2={xEnd}
          y1={plotTop}
          y2={plotBottom}
        />

        {[START_YEAR, LATEST_YEAR].map((year, index) => (
          <text
            className="chart-year-label"
            key={year}
            textAnchor="middle"
            x={index === 0 ? xStart : xEnd}
            y={plotBottom + 28}
          >
            {year}
          </text>
        ))}

        {rows
          .slice()
          .sort((first, second) => (first.end ?? 0) - (second.end ?? 0))
          .map((row) => {
            const start = row.start
            const end = row.end

            if (!isNumber(start) || !isNumber(end) || !isNumber(row.delta)) {
              return null
            }

            const startY = yScale(start)
            const endY = yScale(end)
            const labelY = labelPositions.get(row.code) ?? endY

            return (
              <g key={row.code}>
                <title>
                  {`${row.name}: ${START_YEAR} ${formatPps(start)} PPS, ${LATEST_YEAR} ${formatPps(end)} PPS, change ${formatDeltaPps(row.delta)} PPS`}
                </title>
                <line
                  stroke={color}
                  strokeLinecap="round"
                  strokeOpacity={0.58}
                  strokeWidth={2}
                  x1={xStart}
                  x2={xEnd}
                  y1={startY}
                  y2={endY}
                />
                <circle
                  cx={xStart}
                  cy={startY}
                  fill={COLORS.noData}
                  r={3}
                  stroke={color}
                  strokeWidth={1.5}
                />
                <circle
                  cx={xEnd}
                  cy={endY}
                  fill={COLORS.noData}
                  r={3}
                  stroke={color}
                  strokeWidth={1.5}
                />
                <line
                  className="chart-label-leader"
                  x1={xEnd + 5}
                  x2={labelX - 5}
                  y1={endY}
                  y2={labelY}
                />
                <text
                  className="chart-line-label"
                  dominantBaseline="middle"
                  x={labelX}
                  y={labelY}
                >
                  {`${row.code} ${formatDeltaPps(row.delta)}`}
                </text>
              </g>
            )
          })}

        <text
          className="chart-axis-title"
          textAnchor="end"
          x={WIDTH - 8}
          y={HEIGHT - 10}
        >
          PPS
        </text>
      </svg>
    </ChartShell>
  )
}
