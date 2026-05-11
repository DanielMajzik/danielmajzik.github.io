import { ChartShell } from './ChartShell'
import {
  LATEST_YEAR,
  START_YEAR,
  type Year,
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
  right: 178,
  bottom: 64,
  left: 70,
}
const YEARS: Year[] = [START_YEAR, LATEST_YEAR]
const YEAR_STYLES = {
  '2014': {
    dash: '7 6',
    opacity: 0.72,
    strokeWidth: 2.4,
  },
  '2019': {
    dash: undefined,
    opacity: 1,
    strokeWidth: 3,
  },
} satisfies Record<
  Year,
  {
    dash?: string
    opacity: number
    strokeWidth: number
  }
>
const END_LABEL_OFFSETS: Record<string, number> = {
  'smoking-2014': -8,
  'smoking-2019': 8,
  'drinking-2014': -12,
  'drinking-2019': 10,
  'depression-2014': -10,
  'depression-2019': 10,
}

export function HealthQuintileLineChart() {
  const series = OUTCOMES.flatMap((outcome) =>
    YEARS.map((year) => ({
      ...outcome,
      year,
      points: getEuOutcomeSeries(year, outcome.id),
    })),
  )
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
      legend={
        <>
          {OUTCOMES.map((outcome) => (
            <span key={outcome.id}>
              <i
                className="chart-swatch"
                style={{ background: outcome.color }}
              />
              {outcome.shortLabel}
            </span>
          ))}
          <span>
            <i className="chart-line-swatch chart-line-swatch-dashed" />
            {START_YEAR}
          </span>
          <span>
            <i className="chart-line-swatch" />
            {LATEST_YEAR}
          </span>
        </>
      }
      subtitle={`${START_YEAR} and ${LATEST_YEAR} EU-27 country averages by income quintile. Smoking combines under-20 and 20-plus daily cigarette smokers.`}
      title="Income Quintile vs. Health Outcome"
    >
      <svg
        aria-label={`${START_YEAR} and ${LATEST_YEAR} health outcomes by income quintile`}
        className="quintile-line-chart"
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <title>{`${START_YEAR} and ${LATEST_YEAR} health outcomes by income quintile`}</title>
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
          const yearStyle = YEAR_STYLES[outcome.year]
          const labelY =
            isNumber(lastValue)
              ? yScale(lastValue) +
                END_LABEL_OFFSETS[`${outcome.id}-${outcome.year}`]
              : null

          return (
            <g key={`${outcome.id}-${outcome.year}`}>
              <path
                d={pathData}
                fill="none"
                stroke={outcome.color}
                strokeDasharray={yearStyle.dash}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={yearStyle.opacity}
                strokeWidth={yearStyle.strokeWidth}
              />
              {outcome.points.map((point, index) =>
                isNumber(point.value) ? (
                  <g key={`${outcome.id}-${outcome.year}-${point.quintile}`}>
                    <circle
                      cx={xScale(index)}
                      cy={yScale(point.value)}
                      fill="var(--ecl-color-white)"
                      r={outcome.year === LATEST_YEAR ? 4.5 : 3.8}
                      stroke={outcome.color}
                      strokeOpacity={yearStyle.opacity}
                      strokeWidth={2}
                    />
                    <title>
                      {`${outcome.label}, ${outcome.year}, ${QUINTILE_LABELS[point.quintile]}: ${formatPercentNumber(
                        point.value,
                      )}%`}
                    </title>
                  </g>
                ) : null,
              )}
              {isNumber(lastValue) && isNumber(labelY) ? (
                <text
                  className="chart-line-label chart-outcome-label"
                  dominantBaseline="middle"
                  style={{ fill: outcome.color }}
                  x={WIDTH - MARGIN.right + 16}
                  y={labelY}
                >
                  {`${outcome.shortLabel} ${outcome.year}: ${formatPercentNumber(
                    lastValue,
                  )}%`}
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
