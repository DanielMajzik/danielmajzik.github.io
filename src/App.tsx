import { useState } from 'react'
import './App.css'
import {
  COUNTRIES,
  DEFAULT_GROUP,
  type CountryCode,
  type GroupSelection,
  type MetricId,
  type TooltipState,
  type Year,
  getCountryStats,
  getMetric,
  getMetricExtent,
} from './appData'
import { ControlSection } from './sections/ControlSection'
import { DetailsSection } from './sections/DetailsSection'
import { HeaderSection } from './sections/HeaderSection'
import { MapSection } from './sections/MapSection'
import { ReflectionSection, StorySection } from './sections/StorySection'
import { TooltipOverlay } from './sections/TooltipOverlay'

function App() {
  const [selectedYear, setSelectedYear] = useState<Year>('2019')
  const [selectedMetric, setSelectedMetric] = useState<MetricId>('medianIncome')
  const [selectedAge, setSelectedAge] = useState(DEFAULT_GROUP.age)
  const [selectedSex, setSelectedSex] = useState(DEFAULT_GROUP.sex)
  const [selectedIncomeQuintile, setSelectedIncomeQuintile] = useState(
    DEFAULT_GROUP.incomeQuintile,
  )
  const [hoveredCountry, setHoveredCountry] = useState<CountryCode | null>(null)
  const [pinnedCountry, setPinnedCountry] = useState<CountryCode | null>('DE')
  const [tooltip, setTooltip] = useState<TooltipState>({
    code: null,
    x: 0,
    y: 0,
  })

  const selectedGroup: GroupSelection = {
    age: selectedAge,
    sex: selectedSex,
    incomeQuintile: selectedIncomeQuintile,
  }
  const activeCountryCode = hoveredCountry ?? pinnedCountry
  const activeCountry = activeCountryCode ? COUNTRIES[activeCountryCode] : null
  const activeMetric = getMetric(selectedMetric)
  const extent = getMetricExtent(selectedYear, selectedMetric, selectedGroup)
  const metricValues = Object.values(COUNTRIES)
    .map((country) => getCountryStats(country, selectedYear, selectedGroup)[selectedMetric])
    .filter((value): value is number => typeof value === 'number')
  const averageValue =
    metricValues.length > 0
      ? metricValues.reduce((sum, value) => sum + value, 0) / metricValues.length
      : null

  return (
    <main className="dashboard-shell">
      <HeaderSection />

      <StorySection />

      <section className="narrative-section exploration-section" id="exploration">
        <div className="narrative-heading">
          <p className="section-kicker">06 Interactive Exploration</p>
          <h2>Use the map to test the pattern country by country.</h2>
          <p>
            Change the metric, year, age, sex, and income quintile to see where
            the aggregate story holds and where local patterns look different.
          </p>
        </div>

        <ControlSection
          onMetricChange={setSelectedMetric}
          onYearChange={setSelectedYear}
          selectedMetric={selectedMetric}
          selectedYear={selectedYear}
        />

        <section className="workspace">
          <MapSection
            activeCountryCode={activeCountryCode}
            activeMetric={activeMetric}
            averageValue={averageValue}
            extent={extent}
            onHoverCountry={setHoveredCountry}
            onPinCountry={setPinnedCountry}
            onTooltipChange={setTooltip}
            selectedGroup={selectedGroup}
            selectedMetric={selectedMetric}
            selectedYear={selectedYear}
          />

          <DetailsSection
            activeCountry={activeCountry}
            activeCountryCode={activeCountryCode}
            activeMetric={activeMetric}
            onAgeChange={setSelectedAge}
            onIncomeQuintileChange={setSelectedIncomeQuintile}
            onSexChange={setSelectedSex}
            selectedGroup={selectedGroup}
            selectedMetric={selectedMetric}
            selectedYear={selectedYear}
          />
        </section>
      </section>

      <ReflectionSection />

      <TooltipOverlay
        activeMetric={activeMetric}
        selectedGroup={selectedGroup}
        selectedMetric={selectedMetric}
        selectedYear={selectedYear}
        tooltip={tooltip}
      />
    </main>
  )
}

export default App
