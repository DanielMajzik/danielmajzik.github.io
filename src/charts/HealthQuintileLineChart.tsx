import { ChartShell } from './ChartShell'
import {
  LATEST_YEAR,
  formatPercent,
  getTicks,
  isNumber,
  niceCeil,
} from './chartData'
import {
  OUTCOMES,
  QUINTILES,
  QUINTILE_LABELS,
  formatPercentNumber,
  getEuOutcomeSeries,
} from './healthStoryData'

const WIDTH = 980
const HEIGHT = 430
const MARGIN = {
  top: 30,
  right: 168,
  bottom: 64,
  left: 70,
}

export function HealthQuintileLineChart() {
  const series = OUTCOMES.map((outcome) => ({
    ...outcome,
    points: getEuOutcomeSeries(LATEST_YEAR, outcome.id),
  }))
  const values = series
    .flatMap((outcome) => outcome.points.map((point) => point.value))
    .filter(isNumber)
  const yMax = niceCeil(Math.max(...values), 5)
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right
  const plotTop = MARGIN.top
  const plotBottom = HEIGHT - MARGIN.bottom
  const ticks = getTicks(yMax)

  function xScale(index: number) {
    return MARGIN.left + (index / (QUINTILES.length - 1)) * plotWidth
  }

  function yScale(value: number) {
    return plotBottom - (value / yMax) * (plotBottom - plotTop)
  }

  return (
    <ChartShell
      legend={series.map((outcome) => (
        <span key={outcome.id}>
          <i className="chart-swatch" style={{ background: outcome.color }} />
          {outcome.shortLabel}
        </span>
      ))}
      subtitle={`${LATEST_YEAR} EU-27 country average by income quintile. Smoking combines under-20 and 20-plus daily cigarette smokers.`}
      title="Income Quintile vs. Health Outcome"
    >
      <svg
        aria-label={`${LATEST_YEAR} health outcomes by income quintile`}
        className="quintile-line-chart"
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <title>{`${LATEST_YEAR} health outcomes by income quintile`}</title>
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

        {QUINTILES.map((quintile, index) => {
          const x = xScale(index)

          return (
            <g key={quintile}>
              <line
                className="chart-grid-soft"
                x1={x}
                x2={x}
                y1={plotTop}
                y2={plotBottom}
              />
              <text
                className="chart-year-label"
                textAnchor="middle"
                x={x}
                y={plotBottom + 32}
              >
                {QUINTILE_LABELS[quintile]}
              </text>
            </g>
          )
        })}

        {series.map((outcome) => {
          const pathData = outcome.points
            .map((point, index) =>
              isNumber(point.value)
                ? `${index === 0 ? 'M' : 'L'} ${xScale(index)} ${yScale(
                    point.value,
                  )}`
                : '',
            )
            .filter(Boolean)
            .join(' ')
          const lastValue = outcome.points.at(-1)?.value ?? null

          return (
            <g key={outcome.id}>
              <path
                d={pathData}
                fill="none"
                stroke={outcome.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
              />
              {outcome.points.map((point, index) =>
                isNumber(point.value) ? (
                  <g key={`${outcome.id}-${point.quintile}`}>
                    <circle
                      cx={xScale(index)}
                      cy={yScale(point.value)}
                      fill="var(--ecl-color-white)"
                      r={4.5}
                      stroke={outcome.color}
                      strokeWidth={2}
                    />
                    <title>
                      {`${outcome.label}, ${QUINTILE_LABELS[point.quintile]}: ${formatPercentNumber(
                        point.value,
                      )}%`}
                    </title>
                  </g>
                ) : null,
              )}
              {isNumber(lastValue) ? (
                <text
                  className="chart-line-label chart-outcome-label"
                  dominantBaseline="middle"
                  style={{ fill: outcome.color }}
                  x={WIDTH - MARGIN.right + 16}
                  y={yScale(lastValue)}
                >
                  {`${outcome.shortLabel} ${formatPercentNumber(lastValue)}%`}
                </text>
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
          Share of population
        </text>
      </svg>
    </ChartShell>
  )
}
