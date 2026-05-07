import { MetricBarChart } from './MetricBarChart'
import { COLORS, LATEST_YEAR } from './chartData'

export function DrinkingChart() {
  return (
    <MetricBarChart
      color={COLORS.branding}
      metricId="heavyDrinking"
      subtitle={`${LATEST_YEAR} population share reporting heavy episodic drinking at least monthly.`}
      title="Heavy Episodic Drinking"
    />
  )
}
