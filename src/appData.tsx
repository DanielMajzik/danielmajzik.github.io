import type { ReactNode } from 'react'
import euStats from './data/euStats.json'

export type Year = '2014' | '2019'
export type MetricId =
  | 'meanIncome'
  | 'medianIncome'
  | 'smokingLess20'
  | 'smoking20Plus'
  | 'heavyDrinking'
  | 'mentalHealth'

export type CountryCode = keyof typeof euStats.countries
export type IncomeMetricId = Extract<MetricId, 'meanIncome' | 'medianIncome'>

export type IncomeCurrencyStats = Record<
  IncomeMetricId,
  {
    eur: number | null
    nationalCurrency: number | null
    nationalCurrencyCode?: string
    nationalCurrencyName?: string
    nationalCurrencySymbol?: string | null
  }
>

export type CountryStats = Record<MetricId, number | null> & {
  incomeCurrencies?: IncomeCurrencyStats
}

export type GroupDimensionId = 'age' | 'sex' | 'incomeQuintile'
export type GroupSelection = Record<GroupDimensionId, string>

export type DimensionOption = {
  id: string
  label: string
}

export type GroupDimensions = Record<GroupDimensionId, DimensionOption[]>

export type CountryRecord = {
  name: string
  nationalCurrencies?: Record<
    Year,
    {
      code: string
      name: string
      symbol?: string | null
    }
  >
  stats: Record<Year, CountryStats>
  groupedStats?: Record<string, Record<Year, CountryStats>>
}

export type MetricDefinition = {
  id: MetricId
  label: string
  unit: string
  dataset: string
  calculation?: string
}

export type GeographyFeature = {
  rsmKey: string
  properties: {
    CNTR_ID?: CountryCode
    NAME_ENGL?: string
  }
}

export type TooltipState = {
  code: CountryCode | null
  x: number
  y: number
}

export type MetricExtent = {
  min: number | null
  max: number | null
}

export const MAP_URL = `${import.meta.env.BASE_URL}data/eu-countries-2020.topojson.json`
export const YEARS = euStats.years as Year[]
export const METRICS = euStats.metrics as MetricDefinition[]
export const COUNTRIES = euStats.countries as Record<CountryCode, CountryRecord>
export const COLOR_RAMP = ['#fff2de', '#ffd89d', '#ffbe5c', '#5577f0', '#0f2fa2']
export const NO_DATA_COLOR = '#e0e5f5'

const FALLBACK_GROUP_DIMENSIONS: GroupDimensions = {
  age: [{ id: 'Y18-24', label: 'From 18 to 24 years' }],
  sex: [{ id: 'M', label: 'Males' }],
  incomeQuintile: [{ id: 'QU3', label: 'Third quintile' }],
}
const STATS_DATA = euStats as typeof euStats & {
  groupDimensions?: GroupDimensions
  defaultGroup?: GroupSelection
}

export const GROUP_DIMENSIONS =
  STATS_DATA.groupDimensions ?? FALLBACK_GROUP_DIMENSIONS
export const DEFAULT_GROUP = STATS_DATA.defaultGroup ?? {
  age: GROUP_DIMENSIONS.age[0].id,
  sex: GROUP_DIMENSIONS.sex[0].id,
  incomeQuintile: GROUP_DIMENSIONS.incomeQuintile[0].id,
}
export const EMPTY_STATS: CountryStats = {
  meanIncome: null,
  medianIncome: null,
  smokingLess20: null,
  smoking20Plus: null,
  heavyDrinking: null,
  mentalHealth: null,
}

export function getCoverage() {
  return euStats.coverage
}

export function getGeneratedDate() {
  return new Date(euStats.generatedAt).toLocaleDateString()
}

export function getNotes() {
  return euStats.notes
}

export function formatValue(value: number | null, metric: MetricDefinition) {
  if (value === null) {
    return 'No data'
  }

  if (metric.unit === 'PPS') {
    return new Intl.NumberFormat('en', {
      maximumFractionDigits: 0,
    }).format(value)
  }

  return `${new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
  }).format(value)}%`
}

export function formatWholeNumber(value: number | null) {
  if (value === null) {
    return 'No data'
  }

  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 0,
  }).format(value)
}

export function isIncomeMetric(metricId: MetricId): metricId is IncomeMetricId {
  return metricId === 'meanIncome' || metricId === 'medianIncome'
}

export function renderStatValue(
  stats: CountryStats,
  metric: MetricDefinition,
): ReactNode {
  const value = stats[metric.id]

  if (!isIncomeMetric(metric.id)) {
    return formatValue(value, metric)
  }

  const currencies = stats.incomeCurrencies?.[metric.id]
  const localCode = currencies?.nationalCurrencyCode

  return (
    <div className="income-stat-value">
      <strong>{formatValue(value, metric)} PPS</strong>
      <small>EUR {formatWholeNumber(currencies?.eur ?? null)}</small>
      {localCode && localCode !== 'EUR' ? (
        <small>
          {localCode} {formatWholeNumber(currencies?.nationalCurrency ?? null)}
        </small>
      ) : null}
    </div>
  )
}

export function getMetric(metricId: MetricId) {
  return METRICS.find((metric) => metric.id === metricId) ?? METRICS[0]
}

export function buildGroupKey(selection: GroupSelection) {
  return `${selection.age}|${selection.sex}|${selection.incomeQuintile}`
}

export function getCountryStats(
  country: CountryRecord,
  year: Year,
  selection: GroupSelection,
) {
  return (
    country.groupedStats?.[buildGroupKey(selection)]?.[year] ??
    country.stats[year] ??
    EMPTY_STATS
  )
}

export function getMetricExtent(
  year: Year,
  metricId: MetricId,
  selection: GroupSelection,
) {
  const values = Object.values(COUNTRIES)
    .map((country) => getCountryStats(country, year, selection)[metricId])
    .filter((value): value is number => typeof value === 'number')

  if (values.length === 0) {
    return {
      min: null,
      max: null,
    }
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  }
}

export function getCountryColor(
  code: CountryCode | undefined,
  year: Year,
  metricId: MetricId,
  selection: GroupSelection,
  extent: MetricExtent,
) {
  if (!code) {
    return NO_DATA_COLOR
  }

  const value = getCountryStats(COUNTRIES[code], year, selection)[metricId]

  if (typeof value !== 'number') {
    return NO_DATA_COLOR
  }

  if (typeof extent.min !== 'number' || typeof extent.max !== 'number') {
    return NO_DATA_COLOR
  }

  if (extent.max === extent.min) {
    return COLOR_RAMP[COLOR_RAMP.length - 1]
  }

  const position = (value - extent.min) / (extent.max - extent.min)
  const index = Math.min(
    COLOR_RAMP.length - 1,
    Math.max(0, Math.floor(position * COLOR_RAMP.length)),
  )

  return COLOR_RAMP[index]
}

export function getChange(
  country: CountryRecord,
  metricId: MetricId,
  selection: GroupSelection,
) {
  const start = getCountryStats(country, '2014', selection)[metricId]
  const end = getCountryStats(country, '2019', selection)[metricId]

  if (typeof start !== 'number' || typeof end !== 'number') {
    return null
  }

  return end - start
}

export function formatChange(change: number | null, metric: MetricDefinition) {
  if (change === null) {
    return 'No change data'
  }

  const sign = change > 0 ? '+' : ''

  if (metric.unit === 'PPS') {
    return `${sign}${new Intl.NumberFormat('en', {
      maximumFractionDigits: 0,
    }).format(change)}`
  }

  return `${sign}${new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
  }).format(change)} pp`
}
