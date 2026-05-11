import {
  COUNTRY_DATA,
  LATEST_YEAR,
  START_YEAR,
  type CountryDatum,
  type CountryStats,
  type Year,
  isNumber,
} from './chartData'

export type OutcomeId = 'smoking' | 'drinking' | 'depression'

export type OutcomeDefinition = {
  id: OutcomeId
  label: string
  shortLabel: string
  color: string
  gapDirection: 'low-minus-high' | 'high-minus-low'
}

export const QUINTILES = ['QU1', 'QU2', 'QU3', 'QU4', 'QU5'] as const
export type QuintileId = (typeof QUINTILES)[number]

export const QUINTILE_LABELS: Record<QuintileId, string> = {
  QU1: 'Q1',
  QU2: 'Q2',
  QU3: 'Q3',
  QU4: 'Q4',
  QU5: 'Q5',
}

export const OUTCOMES: OutcomeDefinition[] = [
  {
    id: 'smoking',
    label: 'Daily smoking',
    shortLabel: 'Smoking',
    color: '#004494',
    gapDirection: 'low-minus-high',
  },
  {
    id: 'drinking',
    label: 'Heavy episodic drinking',
    shortLabel: 'Drinking',
    color: '#8f5600',
    gapDirection: 'high-minus-low',
  },
  {
    id: 'depression',
    label: 'Current depressive symptoms',
    shortLabel: 'Depression',
    color: '#5577f0',
    gapDirection: 'low-minus-high',
  },
]

export const TURKEY_SMOKING = {
  '2014': [25.4, 25.8, 28.5, 31, 26.7],
  '2019': [24.7, 25.8, 26.2, 29.1, 29.7],
} satisfies Record<Year, number[]>

export function getOutcomeDefinition(outcomeId: OutcomeId) {
  return (
    OUTCOMES.find((outcome) => outcome.id === outcomeId) ?? OUTCOMES[0]
  )
}

export function getOutcomeValue(stats: CountryStats | undefined, outcomeId: OutcomeId) {
  if (!stats) {
    return null
  }

  if (outcomeId === 'smoking') {
    return isNumber(stats.smokingLess20) && isNumber(stats.smoking20Plus)
      ? stats.smokingLess20 + stats.smoking20Plus
      : null
  }

  if (outcomeId === 'drinking') {
    return stats.heavyDrinking
  }

  return stats.mentalHealth
}

export function getCountryQuintileStats(
  country: CountryDatum,
  year: Year,
  quintile: QuintileId,
) {
  return country.groupedStats?.[`TOTAL|T|${quintile}`]?.[year]
}

export function getCountryOutcomeValue(
  country: CountryDatum,
  year: Year,
  quintile: QuintileId,
  outcomeId: OutcomeId,
) {
  return getOutcomeValue(getCountryQuintileStats(country, year, quintile), outcomeId)
}

export function getEuAverageOutcome(
  year: Year,
  quintile: QuintileId,
  outcomeId: OutcomeId,
) {
  const values = COUNTRY_DATA.map((country) =>
    getCountryOutcomeValue(country, year, quintile, outcomeId),
  ).filter(isNumber)

  if (values.length === 0) {
    return null
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function getEuOutcomeSeries(year: Year, outcomeId: OutcomeId) {
  return QUINTILES.map((quintile) => ({
    quintile,
    value: getEuAverageOutcome(year, quintile, outcomeId),
  }))
}

export function getGapForOutcome(year: Year, outcomeId: OutcomeId) {
  const outcome = getOutcomeDefinition(outcomeId)
  const low = getEuAverageOutcome(year, 'QU1', outcomeId)
  const high = getEuAverageOutcome(year, 'QU5', outcomeId)

  if (!isNumber(low) || !isNumber(high)) {
    return null
  }

  return outcome.gapDirection === 'low-minus-high' ? low - high : high - low
}

export function getGapRows() {
  return OUTCOMES.map((outcome) => {
    const start = getGapForOutcome(START_YEAR, outcome.id)
    const end = getGapForOutcome(LATEST_YEAR, outcome.id)
    const delta = isNumber(start) && isNumber(end) ? end - start : null

    return {
      ...outcome,
      start,
      end,
      delta,
    }
  })
}

export function formatPercentNumber(value: number) {
  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatSignedPointDelta(value: number) {
  const sign = value > 0 ? '+' : ''

  return `${sign}${formatPercentNumber(value)} pp`
}
