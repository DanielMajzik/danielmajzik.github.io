import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
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
import {
  CountryExceptionSection,
  DatasetSection,
  GeographicPatternSection,
  HookSection,
  MainFindingSection,
  ReflectionSection,
  TimeEvolutionSection,
} from './sections/StorySection'
import { TooltipOverlay } from './sections/TooltipOverlay'

type Slide = {
  id: string
  label: string
  teaser: string
  content: ReactNode
}

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
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
  const slideViewportRef = useRef<HTMLDivElement | null>(null)

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

  const slides: Slide[] = [
    {
      id: 'heading',
      label: 'Heading',
      teaser: 'Start with the project title and data scope.',
      content: (
        <section className="title-slide" aria-label="Presentation title">
          <HeaderSection />
        </section>
      ),
    },
    {
      id: 'hook',
      label: 'Hook',
      teaser: 'See the headline health gaps before choosing a country.',
      content: <HookSection />,
    },
    {
      id: 'main-finding',
      label: 'Finding',
      teaser: 'Compare how income quintiles reshape each outcome.',
      content: <MainFindingSection />,
    },
    {
      id: 'geographic-pattern',
      label: 'Map',
      teaser: 'Move from income groups to the geography of the pattern.',
      content: <GeographicPatternSection />,
    },
    {
      id: 'time-evolution',
      label: 'Change',
      teaser: 'Check whether the gaps changed between 2014 and 2019.',
      content: <TimeEvolutionSection />,
    },
    {
      id: 'country-exception',
      label: 'Exception',
      teaser: 'Look at Turkey as a country-level exception.',
      content: <CountryExceptionSection />,
    },
    {
      id: 'exploration',
      label: 'Explore',
      teaser: 'Use the interactive map to test the story yourself.',
      content: (
        <section className="narrative-section exploration-section" id="exploration">
          <div className="narrative-heading">
            <p className="section-kicker">06 Interactive Exploration</p>
            <h2>Use the map to test the pattern country by country.</h2>
            <p>
              Change the metric, year, age, sex, and income quintile to see
              where the aggregate story holds and where local patterns look
              different.
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
      ),
    },
    {
      id: 'reflection',
      label: 'Reflect',
      teaser: 'Close with what the charts support and what remains uncertain.',
      content: <ReflectionSection />,
    },
    {
      id: 'dataset',
      label: 'Dataset',
      teaser: 'Describe the source data, measures, and aggregation choices.',
      content: <DatasetSection />,
    },
  ]
  const slideCount = slides.length
  const currentSlideData = slides[currentSlide] ?? slides[0]
  const previousSlideData = currentSlide > 0 ? slides[currentSlide - 1] : null
  const nextSlideData = currentSlide < slideCount - 1 ? slides[currentSlide + 1] : null
  const isFirstSlide = currentSlide === 0
  const isLastSlide = currentSlide === slideCount - 1

  const goToSlide = useCallback((nextSlide: number) => {
    setCurrentSlide(Math.min(Math.max(nextSlide, 0), slideCount - 1))
  }, [slideCount])

  useEffect(() => {
    slideViewportRef.current?.scrollTo({ left: 0, top: 0 })
  }, [currentSlide])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return
      }

      if (
        event.target instanceof HTMLElement &&
        event.target.closest('input, select, textarea, [contenteditable="true"]')
      ) {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToSlide(currentSlide - 1)
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToSlide(currentSlide + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentSlide, goToSlide])

  return (
    <main className="dashboard-shell slideshow-shell">
      <div
        aria-live="polite"
        className="slide-viewport"
        ref={slideViewportRef}
      >
        <div className="slide-stage" key={currentSlideData.id}>
          {currentSlideData.content}
        </div>
      </div>

      <nav className="slide-cue-nav" aria-label="Slide navigation">
        <button
          className="slide-cue previous"
          disabled={isFirstSlide}
          onClick={() => goToSlide(currentSlide - 1)}
          type="button"
        >
          <span className="cue-direction">Back</span>
          <span className="cue-title">
            {previousSlideData ? previousSlideData.label : 'Start'}
          </span>
          <span className="cue-text">
            {previousSlideData
              ? previousSlideData.teaser
              : 'You are at the opening title.'}
          </span>
        </button>

        <span className="slide-count" aria-label="Current slide">
          {String(currentSlide + 1).padStart(2, '0')} /{' '}
          {String(slideCount).padStart(2, '0')}
        </span>

        <button
          className="slide-cue next"
          disabled={isLastSlide}
          onClick={() => goToSlide(currentSlide + 1)}
          type="button"
        >
          <span className="cue-direction">Forward</span>
          <span className="cue-title">
            {nextSlideData ? nextSlideData.label : 'End'}
          </span>
          <span className="cue-text">
            {nextSlideData ? nextSlideData.teaser : 'This is the final slide.'}
          </span>
        </button>
      </nav>

      {currentSlideData.id === 'exploration' ? (
        <TooltipOverlay
          activeMetric={activeMetric}
          selectedGroup={selectedGroup}
          selectedMetric={selectedMetric}
          selectedYear={selectedYear}
          tooltip={tooltip}
        />
      ) : null}
    </main>
  )
}

export default App
