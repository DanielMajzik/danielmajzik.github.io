import { ChartShell } from './ChartShell'
import {
  COLORS,
  COUNTRY_DATA,
  LATEST_YEAR,
  formatPercent,
  getTicks,
  isNumber,
  niceCeil,
} from './chartData'

const WIDTH = 980
const MARGIN = {
  top: 30,
  right: 88,
  bottom: 52,
  left: 170,
}
const ROW_HEIGHT = 28
const BAR_HEIGHT = 13

export function SmokingStackedChart() {
  const rows = COUNTRY_DATA.map((country) => {
    const less20 = country.stats[LATEST_YEAR].smokingLess20
    const plus20 = country.stats[LATEST_YEAR].smoking20Plus
    const total = isNumber(less20) && isNumber(plus20) ? less20 + plus20 : null

    return {
      code: country.code,
      name: country.name,
      less20,
      plus20,
      total,
    }
  }).sort((first, second) => (second.total ?? -1) - (first.total ?? -1))
  const totals = rows.map((row) => row.total).filter(isNumber)
  const axisMax = niceCeil(Math.max(...totals), 5)
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
              style={{ background: COLORS.orange }}
            />
            Under 20 cigarettes
          </span>
          <span>
            <i
              className="chart-swatch"
              style={{ background: COLORS.branding }}
            />
            20+ cigarettes
          </span>
        </>
      }
      subtitle={`${LATEST_YEAR} daily smokers, stacked by reported cigarettes per day. Totals are percentages of the population.`}
      title="Daily Smokers by Country"
    >
      <svg
        aria-label={`${LATEST_YEAR} stacked daily smoking rates by EU country`}
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <title>{`${LATEST_YEAR} stacked daily smoking rates by EU country`}</title>
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
                {`${row.name}: under 20 ${
                  isNumber(row.less20) ? formatPercent(row.less20) : 'No data'
                }, 20+ ${
                  isNumber(row.plus20) ? formatPercent(row.plus20) : 'No data'
                }, total ${
                  isNumber(row.total) ? formatPercent(row.total) : 'No data'
                }`}
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
              {isNumber(row.total) &&
              isNumber(row.less20) &&
              isNumber(row.plus20) ? (
                <>
                  <rect
                    fill={COLORS.orange}
                    height={BAR_HEIGHT}
                    rx={2}
                    width={xScale(row.less20) - MARGIN.left}
                    x={MARGIN.left}
                    y={barY}
                  />
                  <rect
                    fill={COLORS.branding}
                    height={BAR_HEIGHT}
                    rx={2}
                    width={xScale(row.total) - xScale(row.less20)}
                    x={xScale(row.less20)}
                    y={barY}
                  />
                  {xScale(row.less20) - MARGIN.left > 42 ? (
                    <text
                      className="chart-segment-label chart-segment-label-dark"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      x={MARGIN.left + (xScale(row.less20) - MARGIN.left) / 2}
                      y={labelY}
                    >
                      {formatPercent(row.less20)}
                    </text>
                  ) : null}
                  {xScale(row.total) - xScale(row.less20) > 42 ? (
                    <text
                      className="chart-segment-label chart-segment-label-light"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      x={xScale(row.less20) + (xScale(row.total) - xScale(row.less20)) / 2}
                      y={labelY}
                    >
                      {formatPercent(row.plus20)}
                    </text>
                  ) : null}
                  <text
                    className="chart-value-label"
                    dominantBaseline="middle"
                    x={xScale(row.total) + 7}
                    y={labelY}
                  >
                    {formatPercent(row.total)}
                  </text>
                </>
              ) : (
                <text
                  className="chart-value-label"
                  dominantBaseline="middle"
                  x={MARGIN.left}
                  y={labelY}
                >
                  No data
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </ChartShell>
  )
}
