import { ChartShell } from './ChartShell'
import {
  COUNTRY_DATA,
  LATEST_YEAR,
  type MetricId,
  formatMetricValue,
  formatPercent,
  getMetricDefinition,
  getTicks,
  isNumber,
  niceCeil,
} from './chartData'

type MetricBarChartProps = {
  metricId: MetricId
  title: string
  subtitle: string
  caption?: string
  color: string
}

const WIDTH = 980
const MARGIN = {
  top: 30,
  right: 86,
  bottom: 52,
  left: 170,
}
const ROW_HEIGHT = 27
const BAR_HEIGHT = 13

export function MetricBarChart({
  metricId,
  title,
  subtitle,
  caption,
  color,
}: MetricBarChartProps) {
  const metric = getMetricDefinition(metricId)
  const rows = COUNTRY_DATA.map((country) => ({
    code: country.code,
    name: country.name,
    value: country.stats[LATEST_YEAR][metricId],
  })).sort((first, second) => {
    if (!isNumber(first.value)) {
      return 1
    }

    if (!isNumber(second.value)) {
      return -1
    }

    return second.value - first.value
  })
  const values = rows.map((row) => row.value).filter(isNumber)
  const axisMax = niceCeil(Math.max(...values), 5)
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right
  const plotBottom = MARGIN.top + rows.length * ROW_HEIGHT
  const HEIGHT = plotBottom + MARGIN.bottom
  const ticks = getTicks(axisMax)

  function xScale(value: number) {
    return MARGIN.left + (value / axisMax) * plotWidth
  }

  return (
    <ChartShell caption={caption} subtitle={subtitle} title={title}>
      <svg
        aria-label={`${LATEST_YEAR} ${metric.label.toLowerCase()} by EU country`}
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <title>{`${LATEST_YEAR} ${metric.label} by EU country`}</title>
        {ticks.map((tick) => {
          const x = xScale(tick)

          return (
            <g key={tick}>
              <line
                className="chart-grid"
                x1={x}
                x2={x}
                y1={MARGIN.top - 10}
                y2={plotBottom + 4}
              />
              <text
                className="chart-axis-label"
                textAnchor="middle"
                x={x}
                y={plotBottom + 24}
              >
                {formatPercent(tick)}
              </text>
            </g>
          )
        })}

        {rows.map((row, index) => {
          const y = MARGIN.top + index * ROW_HEIGHT
          const barY = y + (ROW_HEIGHT - BAR_HEIGHT) / 2
          const labelY = y + ROW_HEIGHT / 2

          return (
            <g key={row.code}>
              <title>
                {`${row.name}: ${formatMetricValue(row.value, metric.unit)}`}
              </title>
              <text
                className="chart-country-label"
                dominantBaseline="middle"
                textAnchor="end"
                x={MARGIN.left - 12}
                y={labelY}
              >
                {row.name}
              </text>
              {isNumber(row.value) ? (
                <>
                  <rect
                    fill={color}
                    height={BAR_HEIGHT}
                    rx={2}
                    width={xScale(row.value) - MARGIN.left}
                    x={MARGIN.left}
                    y={barY}
                  />
                  <text
                    className="chart-value-label"
                    dominantBaseline="middle"
                    x={xScale(row.value) + 7}
                    y={labelY}
                  >
                    {formatMetricValue(row.value, metric.unit)}
                  </text>
                </>
              ) : (
                <>
                  <line
                    className="chart-grid-soft"
                    x1={MARGIN.left}
                    x2={MARGIN.left + plotWidth}
                    y1={labelY}
                    y2={labelY}
                  />
                  <text
                    className="chart-value-label"
                    dominantBaseline="middle"
                    x={MARGIN.left}
                    y={labelY}
                  >
                    No data
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>
    </ChartShell>
  )
}
