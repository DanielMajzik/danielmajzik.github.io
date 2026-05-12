import {
  COLORS,
  DEFAULT_INCOME_GROUP_LABEL,
  LATEST_YEAR,
  START_YEAR,
} from './chartData'
import { IncomeLineChart } from './IncomeLineChart'

export function MedianIncomeChangeChart() {
  return (
    <IncomeLineChart
      caption="Median income change focuses on the middle of the distribution, making it less sensitive to very high incomes than the mean. Comparing it with health outcomes helps test whether broad income gains translated into narrower health gaps."
      color={COLORS.orange}
      metricId="medianIncome"
      subtitle={`Country lines compare ${START_YEAR} and ${LATEST_YEAR} for ${DEFAULT_INCOME_GROUP_LABEL}; labels show each country's change in PPS.`}
      title="Median Income Change"
    />
  )
}
