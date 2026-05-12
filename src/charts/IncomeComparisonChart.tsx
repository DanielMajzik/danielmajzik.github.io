import { ChartShell } from './ChartShell'
import {
  COLORS,
  COUNTRY_DATA,
  DEFAULT_INCOME_GROUP_LABEL,
  LATEST_YEAR,
  formatCompactPps,
  formatPps,
  getTicks,
  isNumber,
  niceCeil,
} from './chartData'

const WIDTH = 980
const MARGIN = {
  top: 30,
  right: 104,
  bottom: 52,
  left: 170,
}
const ROW_HEIGHT = 32
const BAR_HEIGHT = 9

export function IncomeComparisonChart() {
  const rows = COUNTRY_DATA.map((country) => ({
    code: country.code,
    name: country.name,
    mean: country.stats[LATEST_YEAR].meanIncome,
    median: country.stats[LATEST_YEAR].medianIncome,
  })).sort((first, second) => (second.median ?? 0) - (first.median ?? 0))
  const values = rows
    .flatMap((row) => [row.mean, row.median])
    .filter(isNumber)
  const axisMax = niceCeil(Math.max(...values), 5000)
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right
  const plotBottom = MARGIN.top + rows.length * ROW_HEIGHT
  const HEIGHT = plotBottom + MARGIN.bottom
  const ticks = getTicks(axisMax)

  function xScale(value: number) {
    return MARGIN.left + (value / axisMax) * plotWidth
  }

  return (
    <ChartShell
      legend={
        <>
          <span>
            <i
              className="chart-swatch"
              style={{ background: COLORS.blue }}
            />
            Mean
          </span>
          <span>
            <i
              className="chart-swatch"
              style={{ background: COLORS.orange }}
            />
            Median
          </span>
        </>
      }
      caption="Mean and median income are close in many countries, but the ranking still shows a clear material baseline for the rest of the story: health outcomes are being compared across countries with very different purchasing-power-adjusted incomes."
      subtitle={`${LATEST_YEAR} net income in purchasing power standards for ${DEFAULT_INCOME_GROUP_LABEL}. Countries are sorted by median net income.`}
      title="Mean and Median Income"
    >
      <svg
        aria-label={`${LATEST_YEAR} mean and median income by EU country`}
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <title>{`${LATEST_YEAR} mean and median income by EU country`}</title>
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
                {formatCompactPps(tick)}
              </text>
            </g>
          )
        })}

        {rows.map((row, index) => {
          const y = MARGIN.top + index * ROW_HEIGHT
          const labelY = y + ROW_HEIGHT / 2
          const meanWidth = isNumber(row.mean) ? xScale(row.mean) - MARGIN.left : 0
          const medianWidth = isNumber(row.median)
            ? xScale(row.median) - MARGIN.left
            : 0

          return (
            <g key={row.code}>
              <title>
                {`${row.name}: mean ${isNumber(row.mean) ? formatPps(row.mean) : 'No data'} PPS, median ${
                  isNumber(row.median) ? formatPps(row.median) : 'No data'
                } PPS`}
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
              {isNumber(row.mean) ? (
                <>
                  <rect
                    fill={COLORS.blue}
                    height={BAR_HEIGHT}
                    rx={2}
                    width={meanWidth}
                    x={MARGIN.left}
                    y={y + 6}
                  />
                  <text
                    className="chart-value-label"
                    dominantBaseline="middle"
                    x={xScale(row.mean) + 6}
                    y={y + 6 + BAR_HEIGHT / 2}
                  >
                    {formatCompactPps(row.mean)}
                  </text>
                </>
              ) : null}
              {isNumber(row.median) ? (
                <>
                  <rect
                    fill={COLORS.orange}
                    height={BAR_HEIGHT}
                    rx={2}
                    width={medianWidth}
                    x={MARGIN.left}
                    y={y + 18}
                  />
                  <text
                    className="chart-value-label"
                    dominantBaseline="middle"
                    x={xScale(row.median) + 6}
                    y={y + 18 + BAR_HEIGHT / 2}
                  >
                    {formatCompactPps(row.median)}
                  </text>
                </>
              ) : null}
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
