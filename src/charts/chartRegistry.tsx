import type { ComponentType } from 'react'
import { DepressiveSymptomsChart } from './DepressiveSymptomsChart'
import { DrinkingChart } from './DrinkingChart'
import { IncomeComparisonChart } from './IncomeComparisonChart'
import { MeanIncomeChangeChart } from './MeanIncomeChangeChart'
import { MedianIncomeChangeChart } from './MedianIncomeChangeChart'
import { SmokingStackedChart } from './SmokingStackedChart'

export type StoryChartComponent = ComponentType

const chartRegistry: Record<string, StoryChartComponent> = {
  income: IncomeComparisonChart,
  'income-comparison': IncomeComparisonChart,
  'income-bars': IncomeComparisonChart,
  smoking: SmokingStackedChart,
  'smoking-stacked': SmokingStackedChart,
  drinking: DrinkingChart,
  'heavy-drinking': DrinkingChart,
  depression: DepressiveSymptomsChart,
  'depressive-symptoms': DepressiveSymptomsChart,
  'mean-income-change': MeanIncomeChangeChart,
  'median-income-change': MedianIncomeChangeChart,
}

export function getChartComponent(name: string) {
  return chartRegistry[name]
}

export const chartNames = Object.keys(chartRegistry)
