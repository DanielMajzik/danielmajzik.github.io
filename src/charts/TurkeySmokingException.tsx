import { ChartShell } from './ChartShell'
import {
  LATEST_YEAR,
  formatPercent,
  getTicks,
  isNumber,
  niceCeil,
} from './chartData'
import {
  QUINTILES,
  QUINTILE_LABELS,
  TURKEY_SMOKING,
  formatPercentNumber,
  formatSignedPointDelta,
  getEuOutcomeSeries,
} from './healthStoryData'

const WIDTH = 980
const HEIGHT = 410
const MARGIN = {
  top: 34,
  right: 170,
  bottom: 64,
  left: 70,
}
const EU_COLOR = '#004494'
const TURKEY_COLOR = '#8f5600'

export function TurkeySmokingException() {
  const euValues = getEuOutcomeSeries(LATEST_YEAR, 'smoking').map(
    (point) => point.value,
  )
  const turkeyValues = TURKEY_SMOKING[LATEST_YEAR]
  const values = [...euValues, ...turkeyValues].filter(isNumber)
  const yMax = niceCeil(Math.max(...values), 5)
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right
  const plotTop = MARGIN.top
  const plotBottom = HEIGHT - MARGIN.bottom
  const ticks = getTicks(yMax)
  const euGap =
    isNumber(euValues[0]) && isNumber(euValues[4])
      ? euValues[4] - euValues[0]
      : null
  const turkeyGap = turkeyValues[4] - turkeyValues[0]

  function xScale(index: number) {
    return MARGIN.left + (index / (QUINTILES.length - 1)) * plotWidth
  }

  function yScale(value: number) {
    return plotBottom - (value / yMax) * (plotBottom - plotTop)
  }

  function buildPath(points: Array<number | null>) {
    return points
      .map((value, index) =>
        isNumber(value)
          ? `${index === 0 ? 'M' : 'L'} ${xScale(index)} ${yScale(value)}`
          : '',
      )
      .filter(Boolean)
      .join(' ')
  }

  return (
    <div className="exception-layout">
      <ChartShell
        legend={
          <>
            <span>
              <i className="chart-swatch" style={{ background: EU_COLOR }} />
              EU-27 average
            </span>
            <span>
              <i
                className="chart-swatch"
                style={{ background: TURKEY_COLOR }}
              />
              Turkey
            </span>
          </>
        }
        subtitle={`${LATEST_YEAR} daily smoking rate by income quintile. Turkey is shown from the Eurostat smoking extract; the interactive map covers the EU-27.`}
        title="Turkey Breaks the Smoking Pattern"
      >
        <svg
          aria-label={`${LATEST_YEAR} smoking rates for EU average and Turkey by income quintile`}
          className="quintile-line-chart"
          role="img"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        >
          <title>{`${LATEST_YEAR} smoking rates for EU average and Turkey by income quintile`}</title>
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

          {[
            { id: 'eu', label: 'EU-27 average', color: EU_COLOR, values: euValues },
            {
              id: 'turkey',
              label: 'Turkey',
              color: TURKEY_COLOR,
              values: turkeyValues,
            },
          ].map((series) => {
            const lastValue = series.values.at(-1) ?? null

            return (
              <g key={series.id}>
                <path
                  d={buildPath(series.values)}
                  fill="none"
                  stroke={series.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                />
                {series.values.map((value, index) =>
                  isNumber(value) ? (
                    <circle
                      cx={xScale(index)}
                      cy={yScale(value)}
                      fill="var(--ecl-color-white)"
                      key={`${series.id}-${QUINTILES[index]}`}
                      r={4.5}
                      stroke={series.color}
                      strokeWidth={2}
                    />
                  ) : null,
                )}
                {isNumber(lastValue) ? (
                  <text
                    className="chart-line-label"
                    dominantBaseline="middle"
                    style={{ fill: series.color }}
                    x={WIDTH - MARGIN.right + 16}
                    y={yScale(lastValue)}
                  >
                    {`${series.label} ${formatPercentNumber(lastValue)}%`}
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>
      </ChartShell>

      <div className="exception-stat-grid">
        <div>
          <span>EU-27 gradient</span>
          <strong>{isNumber(euGap) ? formatSignedPointDelta(euGap) : 'No data'}</strong>
          <p>Daily smoking falls from the first to fifth income quintile.</p>
        </div>
        <div>
          <span>Turkey gradient</span>
          <strong>{formatSignedPointDelta(turkeyGap)}</strong>
          <p>Daily smoking rises from the first to fifth income quintile.</p>
        </div>
      </div>
    </div>
  )
}
