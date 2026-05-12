import type {
  CountryCode,
  CountryRecord,
  GroupSelection,
  MetricDefinition,
  MetricExtent,
  MetricId,
  TooltipState,
  Year,
} from '../appData'
import { ControlSection } from './ControlSection'
import { DetailsSection } from './DetailsSection'
import { MapSection } from './MapSection'

type ExplorationSectionProps = {
  activeCountry: CountryRecord | null
  activeCountryCode: CountryCode | null
  activeMetric: MetricDefinition
  averageValue: number | null
  extent: MetricExtent
  onAgeChange: (value: string) => void
  onHoverCountry: (country: CountryCode | null) => void
  onIncomeQuintileChange: (value: string) => void
  onMetricChange: (metric: MetricId) => void
  onPinCountry: (country: CountryCode) => void
  onSexChange: (value: string) => void
  onTooltipChange: (tooltip: TooltipState) => void
  onYearChange: (year: Year) => void
  selectedGroup: GroupSelection
  selectedMetric: MetricId
  selectedYear: Year
}

export function ExplorationSection({
  activeCountry,
  activeCountryCode,
  activeMetric,
  averageValue,
  extent,
  onAgeChange,
  onHoverCountry,
  onIncomeQuintileChange,
  onMetricChange,
  onPinCountry,
  onSexChange,
  onTooltipChange,
  onYearChange,
  selectedGroup,
  selectedMetric,
  selectedYear,
}: ExplorationSectionProps) {
  return (
    <section className="narrative-section exploration-section" id="exploration">
      <div className="narrative-heading">
        <p className="section-kicker">Explore</p>
        <h2>Test the pattern yourself</h2>
        <p>
          After seeing broad patterns for selected countries like Norway and Turkey, 
          you may be wondering how it plays out in
          different places. The story map above shows the
          broad geography; the interactive map in this section lets you interrogate it. 
          Change the metric, year, age, sex, and income
          quintile to see where the aggregate story holds and where local
          patterns look different.

          You can simply select a specific country to see its statistcs by clicking on 
          the map or hovering over it to get a quick preview.
        </p>
      </div>

      <ControlSection
        onMetricChange={onMetricChange}
        onYearChange={onYearChange}
        selectedMetric={selectedMetric}
        selectedYear={selectedYear}
      />

      <section className="workspace">
        <MapSection
          activeCountryCode={activeCountryCode}
          activeMetric={activeMetric}
          averageValue={averageValue}
          extent={extent}
          onHoverCountry={onHoverCountry}
          onPinCountry={onPinCountry}
          onTooltipChange={onTooltipChange}
          selectedGroup={selectedGroup}
          selectedMetric={selectedMetric}
          selectedYear={selectedYear}
        />

        <DetailsSection
          activeCountry={activeCountry}
          activeCountryCode={activeCountryCode}
          activeMetric={activeMetric}
          onAgeChange={onAgeChange}
          onIncomeQuintileChange={onIncomeQuintileChange}
          onSexChange={onSexChange}
          selectedGroup={selectedGroup}
          selectedMetric={selectedMetric}
          selectedYear={selectedYear}
        />
      </section>
    </section>
  )
}
