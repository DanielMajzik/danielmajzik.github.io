import { useState } from 'react'
import type { ReactNode } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import './App.css'
import euStats from './data/euStats.json'
import storyMarkdown from './data/story.md?raw'

type Year = '2014' | '2019'
type MetricId =
  | 'meanIncome'
  | 'medianIncome'
  | 'smokingLess20'
  | 'smoking20Plus'
  | 'heavyDrinking'
  | 'mentalHealth'

type CountryCode = keyof typeof euStats.countries

type CountryStats = Record<MetricId, number | null>

type CountryRecord = {
  name: string
  stats: Record<Year, CountryStats>
}

type MetricDefinition = {
  id: MetricId
  label: string
  unit: string
  dataset: string
  calculation?: string
}

type GeographyFeature = {
  rsmKey: string
  properties: {
    CNTR_ID?: CountryCode
    NAME_ENGL?: string
  }
}

type TooltipState = {
  code: CountryCode | null
  x: number
  y: number
}

type DropdownOption<T extends string> = {
  value: T
  label: string
}

type DropdownProps<T extends string> = {
  id: string
  label: string
  options: DropdownOption<T>[]
  value: T
  onChange: (value: T) => void
}

type MarkdownBlock =
  | {
      type: 'heading'
      level: 1 | 2
      content: string
    }
  | {
      type: 'paragraph'
      content: string
    }
  | {
      type: 'list'
      items: string[]
    }

const MAP_URL = `${import.meta.env.BASE_URL}data/eu-countries-2020.topojson.json`
const YEARS = euStats.years as Year[]
const METRICS = euStats.metrics as MetricDefinition[]
const COUNTRIES = euStats.countries as Record<CountryCode, CountryRecord>
const COLOR_RAMP = ['#fff2de', '#ffd89d', '#ffbe5c', '#5577f0', '#0f2fa2']
const NO_DATA_COLOR = '#e0e5f5'

function formatValue(value: number | null, metric: MetricDefinition) {
  if (value === null) {
    return 'No data'
  }

  if (metric.unit === 'PPS') {
    return new Intl.NumberFormat('en', {
      maximumFractionDigits: 0,
    }).format(value)
  }

  return `${new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
  }).format(value)}%`
}

function getMetric(metricId: MetricId) {
  return METRICS.find((metric) => metric.id === metricId) ?? METRICS[0]
}

function getMetricExtent(year: Year, metricId: MetricId) {
  const values = Object.values(COUNTRIES)
    .map((country) => country.stats[year][metricId])
    .filter((value): value is number => typeof value === 'number')

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  }
}

function getCountryColor(
  code: CountryCode | undefined,
  year: Year,
  metricId: MetricId,
  extent: { min: number; max: number },
) {
  if (!code) {
    return NO_DATA_COLOR
  }

  const value = COUNTRIES[code]?.stats[year]?.[metricId]

  if (typeof value !== 'number') {
    return NO_DATA_COLOR
  }

  if (extent.max === extent.min) {
    return COLOR_RAMP[COLOR_RAMP.length - 1]
  }

  const position = (value - extent.min) / (extent.max - extent.min)
  const index = Math.min(
    COLOR_RAMP.length - 1,
    Math.max(0, Math.floor(position * COLOR_RAMP.length)),
  )

  return COLOR_RAMP[index]
}

function getChange(country: CountryRecord, metricId: MetricId) {
  const start = country.stats['2014'][metricId]
  const end = country.stats['2019'][metricId]

  if (typeof start !== 'number' || typeof end !== 'number') {
    return null
  }

  return end - start
}

function formatChange(change: number | null, metric: MetricDefinition) {
  if (change === null) {
    return 'No change data'
  }

  const sign = change > 0 ? '+' : ''

  if (metric.unit === 'PPS') {
    return `${sign}${new Intl.NumberFormat('en', {
      maximumFractionDigits: 0,
    }).format(change)}`
  }

  return `${sign}${new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
  }).format(change)} pp`
}

function renderInlineMarkdown(text: string) {
  const parts: ReactNode[] = []
  const tokenPattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0

  text.replace(tokenPattern, (match, _token, offset: number) => {
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset))
    }

    if (match.startsWith('**')) {
      parts.push(<strong key={`${match}-${offset}`}>{match.slice(2, -2)}</strong>)
    } else if (match.startsWith('*')) {
      parts.push(<em key={`${match}-${offset}`}>{match.slice(1, -1)}</em>)
    } else {
      const linkMatch = match.match(/^\[([^\]]+)\]\(([^)]+)\)$/)

      if (linkMatch) {
        parts.push(
          <a href={linkMatch[2]} key={`${match}-${offset}`}>
            {linkMatch[1]}
          </a>,
        )
      }
    }

    lastIndex = offset + match.length
    return match
  })

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

function parseMarkdown(markdown: string) {
  const blocks: MarkdownBlock[] = []
  const lines = markdown.split(/\r?\n/)
  let paragraph: string[] = []
  let listItems: string[] = []

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: paragraph.join(' '),
      })
      paragraph = []
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({
        type: 'list',
        items: listItems,
      })
      listItems = []
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push({
        type: 'heading',
        level: 2,
        content: trimmed.slice(3),
      })
      return
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph()
      flushList()
      blocks.push({
        type: 'heading',
        level: 1,
        content: trimmed.slice(2),
      })
      return
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph()
      listItems.push(trimmed.slice(2))
      return
    }

    flushList()
    paragraph.push(trimmed)
  })

  flushParagraph()
  flushList()

  return blocks
}

function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <>
      {parseMarkdown(markdown).map((block, index) => {
        if (block.type === 'heading' && block.level === 1) {
          return <h2 key={`${block.content}-${index}`}>{block.content}</h2>
        }

        if (block.type === 'heading') {
          return <h3 key={`${block.content}-${index}`}>{block.content}</h3>
        }

        if (block.type === 'list') {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={`${block.content}-${index}`}>
            {renderInlineMarkdown(block.content)}
          </p>
        )
      })}
    </>
  )
}

function Dropdown<T extends string>({
  id,
  label,
  options,
  value,
  onChange,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0]

  function chooseOption(nextValue: T) {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <div
      className="dropdown-field"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false)
        }
      }}
    >
      <span className="control-label" id={`${id}-label`}>
        {label}
      </span>
      <div className={`dropdown-shell ${isOpen ? 'open' : ''}`}>
        <button
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={`${id}-label ${id}-button`}
          className="dropdown-trigger"
          id={`${id}-button`}
          onClick={() => setIsOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsOpen(false)
            }

            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              setIsOpen(true)
            }
          }}
          type="button"
        >
          <span>{selectedOption.label}</span>
        </button>

        {isOpen ? (
          <div
            aria-labelledby={`${id}-label`}
            className="dropdown-list"
            role="listbox"
          >
            {options.map((option) => (
              <button
                aria-selected={option.value === value}
                className={option.value === value ? 'selected' : ''}
                key={option.value}
                onClick={() => chooseOption(option.value)}
                role="option"
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function App() {
  const [selectedYear, setSelectedYear] = useState<Year>('2019')
  const [selectedMetric, setSelectedMetric] = useState<MetricId>('medianIncome')
  const [hoveredCountry, setHoveredCountry] = useState<CountryCode | null>(null)
  const [pinnedCountry, setPinnedCountry] = useState<CountryCode | null>('DE')
  const [tooltip, setTooltip] = useState<TooltipState>({
    code: null,
    x: 0,
    y: 0,
  })

  const activeCountryCode = hoveredCountry ?? pinnedCountry
  const activeCountry = activeCountryCode ? COUNTRIES[activeCountryCode] : null
  const activeMetric = getMetric(selectedMetric)

  const extent = getMetricExtent(selectedYear, selectedMetric)

  const metricValues = Object.values(COUNTRIES)
    .map((country) => country.stats[selectedYear][selectedMetric])
    .filter((value): value is number => typeof value === 'number')

  const averageValue =
    metricValues.reduce((sum, value) => sum + value, 0) / metricValues.length

  function setActiveFromFeature(
    geo: GeographyFeature,
    event?: React.MouseEvent<SVGPathElement>,
  ) {
    const code = geo.properties.CNTR_ID

    if (!code || !COUNTRIES[code]) {
      return
    }

    setHoveredCountry(code)

    if (event) {
      setTooltip({
        code,
        x: event.clientX,
        y: event.clientY,
      })
    }
  }

  function clearHover() {
    setHoveredCountry(null)
    setTooltip((current) => ({ ...current, code: null }))
  }

  return (
    <main className="dashboard-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Eurostat 2014 and 2019</p>
          <h1>EU Health and Income Map</h1>
        </div>
        <div className="source-line">
          <span>{euStats.coverage}</span>
          <span>Generated {new Date(euStats.generatedAt).toLocaleDateString()}</span>
        </div>
      </header>

      <section className="control-bar" aria-label="Map controls">
        <Dropdown
          id="year-select"
          label="Year"
          onChange={setSelectedYear}
          options={YEARS.map((year) => ({
            value: year,
            label: year,
          }))}
          value={selectedYear}
        />

        <Dropdown
          id="metric-select"
          label="Color by"
          onChange={setSelectedMetric}
          options={METRICS.map((metric) => ({
            value: metric.id,
            label: metric.label,
          }))}
          value={selectedMetric}
        />
      </section>

      <section className="workspace">
        <div className="map-panel">
          <div className="map-summary" aria-label="Selected metric summary">
            <div>
              <span>Lowest</span>
              <strong>{formatValue(extent.min, activeMetric)}</strong>
            </div>
            <div>
              <span>EU-27 average</span>
              <strong>{formatValue(averageValue, activeMetric)}</strong>
            </div>
            <div>
              <span>Highest</span>
              <strong>{formatValue(extent.max, activeMetric)}</strong>
            </div>
          </div>

          <div className="map-frame">
            <ComposableMap
              aria-label="Interactive map of EU countries"
              height={640}
              projection="geoAzimuthalEqualArea"
              projectionConfig={{
                rotate: [-12, -53, 0],
                scale: 820,
              }}
              width={920}
            >
              <Geographies geography={MAP_URL}>
                {({ geographies }) =>
                  (geographies as GeographyFeature[]).map((geo) => {
                    const code = geo.properties.CNTR_ID
                    const isActive = code === activeCountryCode
                    const fill = getCountryColor(
                      code,
                      selectedYear,
                      selectedMetric,
                      extent,
                    )

                    return (
                      <Geography
                        aria-label={`${geo.properties.NAME_ENGL ?? 'Country'} ${
                          code ? formatValue(COUNTRIES[code].stats[selectedYear][selectedMetric], activeMetric) : ''
                        }`}
                        geography={geo}
                        key={geo.rsmKey}
                        onBlur={clearHover}
                        onClick={() => {
                          if (code) {
                            setPinnedCountry(code)
                          }
                        }}
                        onFocus={() => setActiveFromFeature(geo)}
                        onMouseEnter={(event) => setActiveFromFeature(geo, event)}
                        onMouseLeave={clearHover}
                        onMouseMove={(event) => {
                          if (code) {
                            setTooltip({
                              code,
                              x: event.clientX,
                              y: event.clientY,
                            })
                          }
                        }}
                        role="button"
                        stroke={isActive ? '#051036' : '#ffffff'}
                        strokeWidth={isActive ? 1.6 : 0.7}
                        style={{
                          default: {
                            fill,
                            outline: 'none',
                          },
                          hover: {
                            fill,
                            outline: 'none',
                          },
                          pressed: {
                            fill,
                            outline: 'none',
                          },
                        }}
                        tabIndex={0}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>

          <div className="legend" aria-label={`${activeMetric.label} legend`}>
            <span>{formatValue(extent.min, activeMetric)}</span>
            <div className="legend-ramp">
              {COLOR_RAMP.map((color) => (
                <span key={color} style={{ background: color }} />
              ))}
            </div>
            <span>{formatValue(extent.max, activeMetric)}</span>
          </div>
        </div>

        <aside className="details-panel" aria-live="polite">
          <div className="details-heading">
            <span>{activeCountryCode ?? 'EU'}</span>
            <h2>{activeCountry?.name ?? 'Country details'}</h2>
          </div>

          {activeCountry ? (
            <>
              <div className="selected-stat">
                <span>{selectedYear}</span>
                <strong>
                  {formatValue(
                    activeCountry.stats[selectedYear][selectedMetric],
                    activeMetric,
                  )}
                </strong>
                <small>{activeMetric.label}</small>
              </div>

              <div className="stats-table" role="table" aria-label="Country statistics">
                <div className="stats-row stats-header" role="row">
                  <span role="columnheader">Metric</span>
                  <span role="columnheader">2014</span>
                  <span role="columnheader">2019</span>
                  <span role="columnheader">Change</span>
                </div>
                {METRICS.map((metric) => {
                  const change = getChange(activeCountry, metric.id)

                  return (
                    <div className="stats-row" key={metric.id} role="row">
                      <span role="cell">{metric.label}</span>
                      <span role="cell">
                        {formatValue(activeCountry.stats['2014'][metric.id], metric)}
                      </span>
                      <span role="cell">
                        {formatValue(activeCountry.stats['2019'][metric.id], metric)}
                      </span>
                      <span
                        className={
                          typeof change === 'number' && change > 0
                            ? 'change-positive'
                            : typeof change === 'number' && change < 0
                              ? 'change-negative'
                              : ''
                        }
                        role="cell"
                      >
                        {formatChange(change, metric)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="empty-panel">
              <strong>{Object.keys(COUNTRIES).length}</strong>
              <span>countries available</span>
            </div>
          )}

          <div className="notes">
            {euStats.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </aside>
      </section>

      <section className="story-panel" aria-label="Country comparison story">
        <MarkdownContent markdown={storyMarkdown} />
      </section>

      {tooltip.code ? (
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
              COUNTRIES[tooltip.code].stats[selectedYear][selectedMetric],
              activeMetric,
            )}
          </strong>
          <small>{activeMetric.label}</small>
        </div>
      ) : null}
    </main>
  )
}

export default App
