import { useEffect, useState } from 'react'
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
import { CountryExceptionSection } from './sections/CountryExceptionSection'
import { ExplorationSection } from './sections/ExplorationSection'
import { GeographicPatternSection } from './sections/GeographicPatternSection'
import { HeaderSection } from './sections/HeaderSection'
import { HookSection } from './sections/HookSection'
import { MainFindingSection } from './sections/MainFindingSection'
import { NotebookCtaSection } from './sections/NotebookCtaSection'
import { ReflectionSection } from './sections/ReflectionSection'
import { TimeEvolutionSection } from './sections/TimeEvolutionSection'
import { TooltipOverlay } from './sections/TooltipOverlay'

const progressSections = [
  { id: 'hook', label: 'Introduction' },
  { id: 'main-finding', label: 'Core Pattern' },
  { id: 'geographic-pattern', label: 'Across Europe' },
  { id: 'time-evolution', label: 'Over Time' },
  { id: 'country-exception', label: 'Outlier' },
  { id: 'exploration', label: 'Explore' },
  { id: 'reflection', label: 'Conclusion' },
]

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
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState(progressSections[0].id)

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

  useEffect(() => {
    function handleScroll() {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const nextProgress =
        scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
      const viewportAnchor = window.scrollY + window.innerHeight * 0.38
      const currentSection = progressSections.findLast((section) => {
        const element = document.getElementById(section.id)

        return element ? element.offsetTop <= viewportAnchor : false
      })

      setScrollProgress(Math.min(Math.max(nextProgress, 0), 1))
      setActiveSectionId(currentSection?.id ?? progressSections[0].id)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <>
      <nav className="page-progress" aria-label="Page progress">
        <div className="progress-track" aria-hidden="true">
          <span
            className="progress-fill"
            style={{ transform: `scaleY(${scrollProgress})` }}
          />
        </div>

        <ol className="progress-links">
          {progressSections.map((section) => (
            <li key={section.id}>
              <a
                aria-current={
                  section.id === activeSectionId ? 'location' : undefined
                }
                className={section.id === activeSectionId ? 'active' : undefined}
                href={`#${section.id}`}
              >
                <strong>{section.label}</strong>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <main className="dashboard-shell single-page-shell">
        <HeaderSection />
        <HookSection />
        <MainFindingSection />
        <GeographicPatternSection />
        <TimeEvolutionSection />
        <CountryExceptionSection />

        <ExplorationSection
          activeCountry={activeCountry}
          activeCountryCode={activeCountryCode}
          activeMetric={activeMetric}
          averageValue={averageValue}
          extent={extent}
          onAgeChange={setSelectedAge}
          onHoverCountry={setHoveredCountry}
          onIncomeQuintileChange={setSelectedIncomeQuintile}
          onMetricChange={setSelectedMetric}
          onPinCountry={setPinnedCountry}
          onSexChange={setSelectedSex}
          onTooltipChange={setTooltip}
          onYearChange={setSelectedYear}
          selectedGroup={selectedGroup}
          selectedMetric={selectedMetric}
          selectedYear={selectedYear}
        />

        <ReflectionSection />
        <NotebookCtaSection />

        <TooltipOverlay
          activeMetric={activeMetric}
          selectedGroup={selectedGroup}
          selectedMetric={selectedMetric}
          selectedYear={selectedYear}
          tooltip={tooltip}
        />
      </main>
    </>
  )
}

export default App
