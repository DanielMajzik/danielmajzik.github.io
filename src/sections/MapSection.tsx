import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import {
  COLOR_RAMP,
  COUNTRIES,
  MAP_URL,
  type CountryCode,
  type GeographyFeature,
  type GroupSelection,
  type MetricDefinition,
  type MetricExtent,
  type MetricId,
  type TooltipState,
  type Year,
  formatValue,
  getCountryColor,
  getCountryStats,
} from '../appData'

type MapSectionProps = {
  selectedYear: Year
  selectedMetric: MetricId
  selectedGroup: GroupSelection
  activeMetric: MetricDefinition
  activeCountryCode: CountryCode | null
  extent: MetricExtent
  averageValue: number | null
  onHoverCountry: (code: CountryCode | null) => void
  onPinCountry: (code: CountryCode) => void
  onTooltipChange: (tooltip: TooltipState) => void
}

export function MapSection({
  selectedYear,
  selectedMetric,
  selectedGroup,
  activeMetric,
  activeCountryCode,
  extent,
  averageValue,
  onHoverCountry,
  onPinCountry,
  onTooltipChange,
}: MapSectionProps) {
  function setActiveFromFeature(
    geo: GeographyFeature,
    event?: React.MouseEvent<SVGPathElement>,
  ) {
    const code = geo.properties.CNTR_ID

    if (!code || !COUNTRIES[code]) {
      return
    }

    onHoverCountry(code)

    if (event) {
      onTooltipChange({
        code,
        x: event.clientX,
        y: event.clientY,
      })
    }
  }

  function clearHover() {
    onHoverCountry(null)
    onTooltipChange({
      code: null,
      x: 0,
      y: 0,
    })
  }

  return (
    <div className="map-panel">
      <div className="map-summary" aria-label="Selected metric summary">
        <div>
          <span>Lowest</span>
          <strong>{formatValue(extent.min, activeMetric)}</strong>
        </div>
        <div>
          <span>EU-27 country average</span>
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
                  selectedGroup,
                  extent,
                )

                return (
                  <Geography
                    aria-label={`${geo.properties.NAME_ENGL ?? 'Country'} ${
                      code
                        ? formatValue(
                            getCountryStats(
                              COUNTRIES[code],
                              selectedYear,
                              selectedGroup,
                            )[selectedMetric],
                            activeMetric,
                          )
                        : ''
                    }`}
                    geography={geo}
                    key={geo.rsmKey}
                    onBlur={clearHover}
                    onClick={() => {
                      if (code) {
                        onPinCountry(code)
                      }
                    }}
                    onFocus={() => setActiveFromFeature(geo)}
                    onMouseEnter={(event) => setActiveFromFeature(geo, event)}
                    onMouseLeave={clearHover}
                    onMouseMove={(event) => {
                      if (code) {
                        onTooltipChange({
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
  )
}
