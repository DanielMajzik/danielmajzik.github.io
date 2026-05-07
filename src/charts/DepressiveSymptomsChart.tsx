import { MetricBarChart } from './MetricBarChart'
import { COLORS, DEFAULT_GROUP_LABEL, LATEST_YEAR } from './chartData'

export function DepressiveSymptomsChart() {
  return (
    <MetricBarChart
      color={COLORS.orange}
      metricId="mentalHealth"
      subtitle={`${LATEST_YEAR} population share reporting current depressive symptoms for ${DEFAULT_GROUP_LABEL}.`}
      title="Current Depressive Symptoms"
    />
  )
}
