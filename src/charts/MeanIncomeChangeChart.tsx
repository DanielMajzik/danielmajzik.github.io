import {
  COLORS,
  DEFAULT_INCOME_GROUP_LABEL,
  LATEST_YEAR,
  START_YEAR,
} from './chartData'
import { IncomeLineChart } from './IncomeLineChart'

export function MeanIncomeChangeChart() {
  return (
    <IncomeLineChart
      caption="Most country lines move upward, but the slope differs substantially. That uneven income growth matters because health gaps may persist even when the average material position improves."
      color={COLORS.blue}
      metricId="meanIncome"
      subtitle={`Country lines compare ${START_YEAR} and ${LATEST_YEAR} for ${DEFAULT_INCOME_GROUP_LABEL}; labels show each country's change in PPS.`}
      title="Mean Income Change"
    />
  )
}
