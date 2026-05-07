import {
  COUNTRIES,
  type GroupSelection,
  type MetricDefinition,
  type MetricId,
  type TooltipState,
  type Year,
  formatValue,
  getCountryStats,
} from '../appData'

type TooltipOverlayProps = {
  tooltip: TooltipState
  selectedYear: Year
  selectedMetric: MetricId
  selectedGroup: GroupSelection
  activeMetric: MetricDefinition
}

export function TooltipOverlay({
  tooltip,
  selectedYear,
  selectedMetric,
  selectedGroup,
  activeMetric,
}: TooltipOverlayProps) {
  if (!tooltip.code) {
    return null
  }

  return (
    <div
      className="tooltip"
      style={{
        left: tooltip.x,
        top: tooltip.y,
      }}
    >
      <span>{COUNTRIES[tooltip.code].name}</span>
      <strong>
        {formatValue(
          getCountryStats(COUNTRIES[tooltip.code], selectedYear, selectedGroup)[
            selectedMetric
          ],
          activeMetric,
        )}
      </strong>
      <small>{activeMetric.label}</small>
    </div>
  )
}
