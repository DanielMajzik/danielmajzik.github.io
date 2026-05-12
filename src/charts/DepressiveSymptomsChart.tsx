import { MetricBarChart } from './MetricBarChart'
import { COLORS, DEFAULT_GROUP_LABEL, LATEST_YEAR } from './chartData'

export function DepressiveSymptomsChart() {
  return (
    <MetricBarChart
      color={COLORS.orange}
      caption="The depressive-symptom plot identifies where poor mental health is most visible at country level before the income breakdown is applied. It helps separate high national prevalence from inequality within a country."
      metricId="mentalHealth"
      subtitle={`${LATEST_YEAR} population share reporting current depressive symptoms for ${DEFAULT_GROUP_LABEL}.`}
      title="Current Depressive Symptoms"
    />
  )
}
