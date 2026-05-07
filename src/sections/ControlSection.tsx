import { METRICS, YEARS, type MetricId, type Year } from '../appData'
import { Dropdown } from './Dropdown'

type ControlSectionProps = {
  selectedYear: Year
  selectedMetric: MetricId
  onYearChange: (year: Year) => void
  onMetricChange: (metric: MetricId) => void
}

export function ControlSection({
  selectedYear,
  selectedMetric,
  onYearChange,
  onMetricChange,
}: ControlSectionProps) {
  return (
    <section className="control-bar" aria-label="Map controls">
      <Dropdown
        id="year-select"
        label="Year"
        onChange={onYearChange}
        options={YEARS.map((year) => ({
          value: year,
          label: year,
        }))}
        value={selectedYear}
      />

      <Dropdown
        id="metric-select"
        label="Color by"
        onChange={onMetricChange}
        options={METRICS.map((metric) => ({
          value: metric.id,
          label: metric.label,
        }))}
        value={selectedMetric}
      />
    </section>
  )
}
