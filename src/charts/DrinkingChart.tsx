import { MetricBarChart } from './MetricBarChart'
import { COLORS, DEFAULT_GROUP_LABEL, LATEST_YEAR } from './chartData'

export function DrinkingChart() {
  return (
    <MetricBarChart
      color={COLORS.branding}
      caption="Heavy episodic drinking does not mirror the smoking or depressive-symptom gradient. Use this plot as the counterpoint: higher national rates do not automatically mean the burden falls most heavily on lower-income groups."
      metricId="heavyDrinking"
      subtitle={`${LATEST_YEAR} population share reporting heavy episodic drinking at least monthly for ${DEFAULT_GROUP_LABEL}.`}
      title="Heavy Episodic Drinking"
    />
  )
}
