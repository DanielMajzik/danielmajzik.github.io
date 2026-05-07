import euStats from '../data/euStats.json'

export type Year = '2014' | '2019'
export type MetricId =
  | 'meanIncome'
  | 'medianIncome'
  | 'smokingLess20'
  | 'smoking20Plus'
  | 'heavyDrinking'
  | 'mentalHealth'

export type CountryStats = Record<MetricId, number | null>

export type GroupDimensionId = 'age' | 'sex' | 'incomeQuintile'

export type GroupSelection = Record<GroupDimensionId, string>

export type DimensionOption = {
  id: string
  label: string
}

export type GroupDimensions = Record<GroupDimensionId, DimensionOption[]>

export type CountryRecord = {
  name: string
  stats: Record<Year, CountryStats>
  groupedStats?: Record<string, Record<Year, CountryStats>>
}

export type CountryDatum = CountryRecord & {
  code: string
}

export type MetricDefinition = {
  id: MetricId
  label: string
  unit: 'PPS' | '%'
  dataset: string
  calculation?: string
}

export const START_YEAR: Year = '2014'
export const LATEST_YEAR: Year = '2019'
const STATS_DATA = euStats as typeof euStats & {
  groupDimensions: GroupDimensions
  defaultGroup: GroupSelection
}
export const METRICS = euStats.metrics as MetricDefinition[]
export const GROUP_DIMENSIONS = STATS_DATA.groupDimensions
export const DEFAULT_GROUP = STATS_DATA.defaultGroup
export const COUNTRIES = euStats.countries as unknown as Record<
  string,
  CountryRecord
>
export const COUNTRY_DATA: CountryDatum[] = Object.entries(COUNTRIES).map(
  ([code, country]) => ({
    code,
    ...country,
  }),
)

export const COLORS = {
  navy: '#051036',
  branding: '#004494',
  blue: '#5577f0',
  paleBlue: '#d8e0fb',
  orange: '#ffbe5c',
  paleOrange: '#ffd89d',
  amber: '#8f5600',
  text: '#26324b',
  muted: '#546fa6',
  grid: '#cdd5ef',
  noData: '#e0e5f5',
} as const

function getDimensionLabel(
  dimension: GroupDimensionId,
  value: string,
  fallback: string,
) {
  return (
    GROUP_DIMENSIONS[dimension].find((option) => option.id === value)?.label ??
    fallback
  )
}

export const DEFAULT_INCOME_GROUP_LABEL = `${getDimensionLabel(
  'age',
  DEFAULT_GROUP.age,
  DEFAULT_GROUP.age,
)}, ${getDimensionLabel('sex', DEFAULT_GROUP.sex, DEFAULT_GROUP.sex).toLowerCase()}`
export const DEFAULT_GROUP_LABEL = `${DEFAULT_INCOME_GROUP_LABEL}, ${getDimensionLabel(
  'incomeQuintile',
  DEFAULT_GROUP.incomeQuintile,
  DEFAULT_GROUP.incomeQuintile,
).toLowerCase()}`

export function getMetricDefinition(metricId: MetricId) {
  return METRICS.find((metric) => metric.id === metricId) ?? METRICS[0]
}

export function isNumber(value: number | null): value is number {
  return typeof value === 'number'
}

export function formatPps(value: number) {
  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactPps(value: number) {
  if (Math.abs(value) < 1000) {
    return formatPps(value)
  }

  return `${new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
  }).format(value / 1000)}k`
}

export function formatPercent(value: number) {
  return `${new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
  }).format(value)}%`
}

export function formatMetricValue(
  value: number | null,
  unit: MetricDefinition['unit'],
) {
  if (value === null) {
    return 'No data'
  }

  return unit === 'PPS' ? formatPps(value) : formatPercent(value)
}

export function formatDeltaPps(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${formatCompactPps(value)}`
}

export function niceCeil(value: number, step: number) {
  return Math.ceil(value / step) * step
}

export function getTicks(max: number, count = 4) {
  return Array.from({ length: count + 1 }, (_entry, index) =>
    (max * index) / count,
  )
}
