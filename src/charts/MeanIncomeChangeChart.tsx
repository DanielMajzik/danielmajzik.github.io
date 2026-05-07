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
      color={COLORS.blue}
      metricId="meanIncome"
      subtitle={`Country lines compare ${START_YEAR} and ${LATEST_YEAR} for ${DEFAULT_INCOME_GROUP_LABEL}; labels show each country's absolute change in PPS.`}
      title="Mean Income Change"
    />
  )
}
