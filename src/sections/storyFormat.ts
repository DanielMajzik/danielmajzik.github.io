import { formatPercentNumber } from '../charts/healthStoryData'

export function formatGapValue(value: number | null | undefined) {
  return typeof value === 'number' ? `${formatPercentNumber(value)} pp` : 'No data'
}
