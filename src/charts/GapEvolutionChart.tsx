import { ChartShell } from './ChartShell'
import {
  LATEST_YEAR,
  START_YEAR,
  formatPercent,
  getTicks,
  isNumber,
  niceCeil,
} from './chartData'
import {
  formatPercentNumber,
  formatSignedPointDelta,
  getGapRows,
} from './healthStoryData'

const WIDTH = 980
const HEIGHT = 410
const MARGIN = {
  top: 34,
  right: 210,
  bottom: 60,
  left: 70,
}
const LABEL_OFFSETS = {
  smoking: -18,
  drinking: 22,
  depression: 0,
}

function describeDelta(delta: number | null) {
  if (!isNumber(delta)) {
    return 'No data'
  }

  if (Math.abs(delta) < 0.5) {
    return 'Stable'
  }

  return delta > 0 ? 'Widened' : 'Narrowed'
}

export function GapEvolutionChart() {
  const rows = getGapRows()
  const values = rows.flatMap((row) => [row.start, row.end]).filter(isNumber)
  const yMax = niceCeil(Math.max(...values), 2)
  const plotTop = MARGIN.top
  const plotBottom = HEIGHT - MARGIN.bottom
  const xStart = MARGIN.left + 80
  const xEnd = WIDTH - MARGIN.right - 54
  const ticks = getTicks(yMax)

  function yScale(value: number) {
    return plotBottom - (value / yMax) * (plotBottom - plotTop)
  }

  return (
    <ChartShell
      legend={rows.map((row) => (
        <span key={row.id}>
          <i className="chart-swatch" style={{ background: row.color }} />
          {row.shortLabel}
        </span>
      ))}
      caption="A wider gap means the distance between income groups grew between the two survey years. The comparison shows that inequality can move differently by outcome, even when the same countries and income quintiles are being compared."
      subtitle="Gap size compares the higher-prevalence end of the income distribution with the lower-prevalence end, in percentage points."
      title="Did Health Gaps Widen?"
    >
      <svg
        aria-label={`Health outcome gap comparison, ${START_YEAR} and ${LATEST_YEAR}`}
        className="quintile-line-chart"
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <title>{`Health outcome gap comparison, ${START_YEAR} and ${LATEST_YEAR}`}</title>
        {ticks.map((tick) => {
          const y = yScale(tick)

          return (
            <g key={tick}>
              <line
                className="chart-grid"
                x1={MARGIN.left}
                x2={WIDTH - MARGIN.right}
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
                {formatPercent(tick)}
              </text>
            </g>
          )
        })}

        {[START_YEAR, LATEST_YEAR].map((year, index) => (
          <g key={year}>
            <line
              className="chart-axis-line"
              x1={index === 0 ? xStart : xEnd}
              x2={index === 0 ? xStart : xEnd}
              y1={plotTop}
              y2={plotBottom}
            />
            <text
              className="chart-year-label"
              textAnchor="middle"
              x={index === 0 ? xStart : xEnd}
              y={plotBottom + 32}
            >
              {year}
            </text>
          </g>
        ))}

        {rows.map((row) => {
          if (!isNumber(row.start) || !isNumber(row.end)) {
            return null
          }

          const startY = yScale(row.start)
          const endY = yScale(row.end)
          const labelY = endY + LABEL_OFFSETS[row.id]

          return (
            <g key={row.id}>
              <title>
                {`${row.label}: ${START_YEAR} ${formatPercentNumber(
                  row.start,
                )} pp, ${LATEST_YEAR} ${formatPercentNumber(
                  row.end,
                )} pp, ${describeDelta(row.delta).toLowerCase()}`}
              </title>
              <line
                stroke={row.color}
                strokeLinecap="round"
                strokeWidth={3}
                x1={xStart}
                x2={xEnd}
                y1={startY}
                y2={endY}
              />
              <circle
                cx={xStart}
                cy={startY}
                fill="var(--ecl-color-white)"
                r={4.5}
                stroke={row.color}
                strokeWidth={2}
              />
              <circle
                cx={xEnd}
                cy={endY}
                fill="var(--ecl-color-white)"
                r={4.5}
                stroke={row.color}
                strokeWidth={2}
              />
              <line
                className="chart-label-leader"
                x1={xEnd + 6}
                x2={xEnd + 12}
                y1={endY}
                y2={labelY}
              />
              <text
                className="chart-line-label"
                dominantBaseline="middle"
                style={{ fill: row.color }}
                x={xEnd + 14}
                y={labelY}
              >
                {`${row.shortLabel}: ${formatPercentNumber(row.end)} pp`}
              </text>
              <text
                className="chart-gap-delta"
                dominantBaseline="middle"
                x={xEnd + 14}
                y={labelY + 15}
              >
                {`${describeDelta(row.delta)} ${
                  isNumber(row.delta) ? formatSignedPointDelta(row.delta) : ''
                }`}
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
          Gap, percentage points
        </text>
      </svg>
    </ChartShell>
  )
}
