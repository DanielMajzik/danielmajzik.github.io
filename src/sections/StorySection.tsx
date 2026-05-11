import { GapEvolutionChart } from '../charts/GapEvolutionChart'
import { TurkeySmokingException } from '../charts/TurkeySmokingException'
import {
  formatPercentNumber,
  formatSignedPointDelta,
  getGapRows,
} from '../charts/healthStoryData'

const NOTEBOOK_DIAGRAM_BASE = `${import.meta.env.BASE_URL}notebook-diagrams/`

function SectionHeader({
  kicker,
  title,
  copy,
}: {
  kicker: string
  title: string
  copy: string
}) {
  return (
    <div className="narrative-heading">
      <p className="section-kicker">{kicker}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  )
}

function NotebookLayerMap() {
  return (
    <figure className="notebook-map-card">
      <div>
        <h3>Notebook: Three-Layer OpenStreetMap</h3>
        <p>
          Folium map from the explainer notebook with separate layers for
          smoking, heavy drinking, and depressive symptoms. Use the map layer
          control to switch between outcomes.
        </p>
      </div>
      <iframe
        loading="eager"
        src={`${NOTEBOOK_DIAGRAM_BASE}geographic-pattern-map.html`}
        title="Three-layer OpenStreetMap from explainer notebook"
      />
    </figure>
  )
}

function NotebookRelativeShareDiagram() {
  return (
    <figure className="notebook-diagram">
      <div>
        <h3>Relative Share of Health Burden by Income Quintile</h3>
        <p>
          Notebook burden-share view showing how each income quintile
          contributes to the total observed burden for smoking, depression, and
          heavy drinking across European countries.
        </p>
      </div>
      <img
        alt="Relative Share of Health Burden by Income Quintile Across European Countries"
        loading="eager"
        src={`${NOTEBOOK_DIAGRAM_BASE}notebook-figure-05.png`}
      />
    </figure>
  )
}

export function StorySection() {
  const gaps = getGapRows()
  const smokingGap = gaps.find((gap) => gap.id === 'smoking')
  const drinkingGap = gaps.find((gap) => gap.id === 'drinking')
  const depressionGap = gaps.find((gap) => gap.id === 'depression')

  return (
    <>
      <section className="narrative-section hook-section" id="hook">
        <SectionHeader
          copy="Across Europe, income and health move together in some places and split apart in others. The pattern is clearest when the population is grouped by income quintile: smoking and depressive symptoms are higher in lower-income groups, while heavy episodic drinking tilts toward higher-income groups."
          kicker="01 Hook"
          title="Health inequality is visible before you pick a country."
        />

        <div className="hook-stat-grid" aria-label="Key findings">
          <div>
            <span>Smoking gap</span>
            <strong>
              {smokingGap?.end
                ? `${formatPercentNumber(smokingGap.end)} pp`
                : 'No data'}
            </strong>
            <p>Higher rate in the first income quintile than in the fifth.</p>
          </div>
          <div>
            <span>Drinking gap</span>
            <strong>
              {drinkingGap?.end
                ? `${formatPercentNumber(drinkingGap.end)} pp`
                : 'No data'}
            </strong>
            <p>Higher rate in the fifth income quintile than in the first.</p>
          </div>
          <div>
            <span>Depression gap</span>
            <strong>
              {depressionGap?.end
                ? `${formatPercentNumber(depressionGap.end)} pp`
                : 'No data'}
            </strong>
            <p>Higher rate in the first income quintile than in the fifth.</p>
          </div>
        </div>
      </section>

      <section className="narrative-section" id="main-finding">
        <SectionHeader
          copy="The main finding is not a single income-health ladder. Mental health and smoking improve toward richer quintiles, but heavy episodic drinking rises in the opposite direction."
          kicker="02 Main Finding"
          title="Income quintile changes the shape of each health outcome."
        />
        <NotebookRelativeShareDiagram />
      </section>

      <section className="narrative-section" id="geographic-pattern">
        <SectionHeader
          copy="The notebook map keeps the same geographic question and overlays three health layers on OpenStreetMap. Switch the layer control to compare whether the same countries stand out for smoking, drinking, and depressive symptoms."
          kicker="03 Geographic Pattern"
          title="Countries do not share one inequality profile."
        />
        <NotebookLayerMap />
      </section>

      <section className="narrative-section" id="time-evolution">
        <SectionHeader
          copy={`Between 2014 and 2019, the smoking gap moved by ${
            smokingGap?.delta
              ? formatSignedPointDelta(smokingGap.delta)
              : 'no available change'
          }, while the drinking gap moved by ${
            drinkingGap?.delta
              ? formatSignedPointDelta(drinkingGap.delta)
              : 'no available change'
          }. The comparison below shows whether each gap widened, narrowed, or stayed roughly stable.`}
          kicker="04 Time Evolution"
          title="The gaps did not all move in the same direction."
        />
        <GapEvolutionChart />
      </section>

      <section className="narrative-section" id="country-exception">
        <SectionHeader
          copy="Turkey is useful as a stress test for the smoking story. In the EU-27 average, daily smoking declines as income rises. In Turkey, the 2019 gradient points upward instead."
          kicker="05 Country Exception"
          title="Turkey reverses the smoking gradient."
        />
        <TurkeySmokingException />
      </section>
    </>
  )
}

export function ReflectionSection() {
  return (
    <section className="narrative-section reflection-section" id="reflection">
      <SectionHeader
        copy="The income gradient is strongest for depressive symptoms, visible but smaller for smoking, and reversed for heavy episodic drinking. That makes the story less about income alone and more about how behavior, reporting, age structure, and national context interact."
        kicker="07 Discussion / Reflection"
        title="The map is an entry point, not the explanation."
      />

      <div className="reflection-grid">
        <div>
          <h3>What the charts support</h3>
          <p>
            Income quintile is a useful lens for identifying unequal health
            outcomes, especially for depressive symptoms and daily smoking.
          </p>
        </div>
        <div>
          <h3>What remains uncertain</h3>
          <p>
            These views are descriptive. They do not isolate causality, survey
            design effects, or the policy and cultural drivers behind each
            national pattern.
          </p>
        </div>
      </div>
    </section>
  )
}
