import { COLORS, LATEST_YEAR, START_YEAR } from './chartData'
import { IncomeLineChart } from './IncomeLineChart'

export function MedianIncomeChangeChart() {
  return (
    <IncomeLineChart
      color={COLORS.orange}
      metricId="medianIncome"
      subtitle={`Country lines compare ${START_YEAR} and ${LATEST_YEAR}; labels show each country's absolute change in PPS.`}
      title="Median Income Change"
    />
  )
}
