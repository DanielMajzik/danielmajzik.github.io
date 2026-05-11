import { useState } from 'react'
import {
  COUNTRY_DATA,
  LATEST_YEAR,
  formatPercent,
  isNumber,
} from './chartData'
import {
  OUTCOMES,
  QUINTILES,
  QUINTILE_LABELS,
  type OutcomeId,
  formatPercentNumber,
  getCountryOutcomeValue,
  getOutcomeDefinition,
} from './healthStoryData'

const HEATMAP_COLORS = ['#fff2de', '#ffd89d', '#ffbe5c', '#5577f0', '#0f2fa2']

function getCellColor(value: number | null, min: number, max: number) {
  if (!isNumber(value)) {
    return 'var(--ecl-color-neutral-60)'
  }

  if (max === min) {
    return HEATMAP_COLORS[HEATMAP_COLORS.length - 1]
  }

  const position = (value - min) / (max - min)
  const index = Math.min(
    HEATMAP_COLORS.length - 1,
    Math.max(0, Math.floor(position * HEATMAP_COLORS.length)),
  )

  return HEATMAP_COLORS[index]
}

export function GeographicHeatmap() {
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<OutcomeId>('smoking')
  const selectedOutcome = getOutcomeDefinition(selectedOutcomeId)
  const rows = COUNTRY_DATA.map((country) => {
    const values = QUINTILES.map((quintile) =>
      getCountryOutcomeValue(
        country,
        LATEST_YEAR,
        quintile,
        selectedOutcomeId,
      ),
    )
    const numericValues = values.filter(isNumber)

    return {
      code: country.code,
      name: country.name,
      values,
      average:
        numericValues.length > 0
          ? numericValues.reduce((sum, value) => sum + value, 0) /
            numericValues.length
          : null,
    }
  }).sort((first, second) => (second.average ?? -1) - (first.average ?? -1))
  const allValues = rows.flatMap((row) => row.values).filter(isNumber)
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)

  return (
    <figure className="story-chart heatmap-chart">
      <div className="story-chart-header">
        <div>
          <h3>Geographic Pattern</h3>
          <p className="chart-caption">
            {`${LATEST_YEAR} country heatmap by income quintile. Rows are sorted by each country's average ${selectedOutcome.label.toLowerCase()} rate.`}
          </p>
        </div>
        <div className="metric-tabs" role="tablist" aria-label="Heatmap metric">
          {OUTCOMES.map((outcome) => (
            <button
              aria-selected={selectedOutcomeId === outcome.id}
              className={selectedOutcomeId === outcome.id ? 'active' : ''}
              key={outcome.id}
              onClick={() => setSelectedOutcomeId(outcome.id)}
              role="tab"
              type="button"
            >
              {outcome.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="heatmap-scroll" role="region" aria-label="Country heatmap">
        <div className="heatmap-grid">
          <span className="heatmap-heading">Country</span>
          {QUINTILES.map((quintile) => (
            <span className="heatmap-heading" key={quintile}>
              {QUINTILE_LABELS[quintile]}
            </span>
          ))}

          {rows.map((row) => (
            <div className="heatmap-row" key={row.code}>
              <span className="heatmap-country">{row.name}</span>
              {row.values.map((value, index) => (
                <span
                  aria-label={`${row.name}, ${QUINTILE_LABELS[QUINTILES[index]]}: ${
                    isNumber(value) ? formatPercent(value) : 'No data'
                  }`}
                  className="heatmap-cell"
                  key={`${row.code}-${QUINTILES[index]}`}
                  style={{
                    background: getCellColor(value, minValue, maxValue),
                    color:
                      isNumber(value) && value > minValue + (maxValue - minValue) * 0.62
                        ? 'var(--ecl-color-white)'
                        : 'var(--ecl-color-primary-180)',
                  }}
                  title={`${row.name}, ${QUINTILE_LABELS[QUINTILES[index]]}: ${
                    isNumber(value)
                      ? `${formatPercentNumber(value)}%`
                      : 'No data'
                  }`}
                >
                  {isNumber(value) ? formatPercentNumber(value) : '-'}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-legend">
        <span>{formatPercent(minValue)}</span>
        <div className="legend-ramp">
          {HEATMAP_COLORS.map((color) => (
            <span key={color} style={{ background: color }} />
          ))}
        </div>
        <span>{formatPercent(maxValue)}</span>
      </div>
    </figure>
  )
}
