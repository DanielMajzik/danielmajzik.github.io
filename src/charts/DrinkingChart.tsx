import { MetricBarChart } from './MetricBarChart'
import { COLORS, DEFAULT_GROUP_LABEL, LATEST_YEAR } from './chartData'

export function DrinkingChart() {
  return (
    <MetricBarChart
      color={COLORS.branding}
      metricId="heavyDrinking"
      subtitle={`${LATEST_YEAR} population share reporting heavy episodic drinking at least monthly for ${DEFAULT_GROUP_LABEL}.`}
      title="Heavy Episodic Drinking"
    />
  )
}
