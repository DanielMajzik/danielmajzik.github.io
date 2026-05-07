import { MetricBarChart } from './MetricBarChart'
import { COLORS, LATEST_YEAR } from './chartData'

export function DepressiveSymptomsChart() {
  return (
    <MetricBarChart
      color={COLORS.orange}
      metricId="mentalHealth"
      subtitle={`${LATEST_YEAR} population share reporting current depressive symptoms.`}
      title="Current Depressive Symptoms"
    />
  )
}
