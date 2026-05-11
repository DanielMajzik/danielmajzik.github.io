import type { ReactNode } from 'react'
import { GapEvolutionChart } from '../charts/GapEvolutionChart'
import {
  formatPercentNumber,
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
  copy?: string
}) {
  return (
    <div className="narrative-heading">
      <p className="section-kicker">{kicker}</p>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  )
}

function StoryCopy({ children }: { children: ReactNode }) {
  return <div className="story-copy">{children}</div>
}

function formatGapValue(value: number | null | undefined) {
  return typeof value === 'number' ? `${formatPercentNumber(value)} pp` : 'No data'
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

function CountryExceptionHealthDiagram() {
  return (
    <figure className="notebook-diagram">
      <div>
        <h3>Health Behaviours & Mental Health by Income Quintile</h3>
        <p>
          Norway and Türkiye are compared as the highest- and lowest-median
          income countries in the health datasets, highlighting Turkey's
          different smoking pattern alongside drinking and depressive symptoms.
        </p>
      </div>
      <img
        alt="Health Behaviours and Mental Health by Income Quintile for Norway and Türkiye"
        loading="eager"
        src={`${NOTEBOOK_DIAGRAM_BASE}country-exception-health-behaviours.png`}
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
        <div className="story-intro">
          <SectionHeader
            kicker="01 Hook"
            title="Health inequality is visible before you pick a country."
          />
          <StoryCopy>
            <p>
              It can be wondered whether economic inequality affects more than
              just financial opportunities. Is there potentially a link between
              average income and overall well-being? It can be asked whether it
              also influences people’s mental and physical health. Income may
              shape habits such as smoking and alcohol consumption, while
              lower-income groups across Europe often report worse mental health
              outcomes and higher rates of unhealthy coping behaviors.
            </p>
            <p>
              This project explores the relationship between income inequality,
              depression, smoking, and drinking across European countries. By
              combining multiple datasets and visualizations, the analysis
              investigates whether lower income is associated with negative health
              outcomes and how these patterns vary geographically and over time.
            </p>
          </StoryCopy>
        </div>

        <div className="hook-stat-grid" aria-label="Key findings">
          <div>
            <span>Smoking gap</span>
            <strong>{formatGapValue(smokingGap?.end)}</strong>
            <p>Higher rate in the first income quintile than in the fifth.</p>
          </div>
          <div>
            <span>Drinking gap</span>
            <strong>{formatGapValue(drinkingGap?.end)}</strong>
            <p>Higher rate in the fifth income quintile than in the first.</p>
          </div>
          <div>
            <span>Depression gap</span>
            <strong>{formatGapValue(depressionGap?.end)}</strong>
            <p>Higher rate in the first income quintile than in the fifth.</p>
          </div>
        </div>
      </section>

      <section className="narrative-section" id="main-finding">
        <SectionHeader
          kicker="02 Main Finding"
          title="Income quintile changes the shape of each health outcome."
        />
        <StoryCopy>
          <p>
            Our first visualization compares income quintiles with mental health
            outcomes across Europe. Looking at the data, a clear social
            difference is shown; individuals in lower income groups consistently
            report higher levels of depression and poorer overall well-being
            compared to higher income groups.
          </p>
          <p>
            The multi-line chart shows that health inequality is not evenly
            distributed. As income increases, negative health outcomes generally
            decrease, suggesting a strong correlation between economic status and
            mental health.
          </p>
          <p>
            This data supports the idea that financial insecurity may contribute
            to stress and thus, unhealthy coping mechanisms such as heavy alcohol
            consumption and smoking.
          </p>
        </StoryCopy>
        <NotebookRelativeShareDiagram />
      </section>

      <section className="narrative-section" id="geographic-pattern">
        <SectionHeader
          kicker="03 Geographic Pattern"
          title="Countries do not share one inequality profile."
        />
        <StoryCopy>
          <p>
            While income inequality exists across Europe, its impacts of the
            social well-being of countries vary greatly. The heatmap reveals
            regional patterns in smoking, alcohol consumption, and depression
            rates.
          </p>
          <p>
            Northern and Eastern European countries show different behavioral
            trends compared to Southern Europe, suggesting that cultural norms,
            healthcare systems, and social policies may influence how people
            respond to economic stress.
          </p>
          <p>
            Darker colors show higher rates, while lighter colors show lower
            rates. By switching between smoking, drinking, and depression tabs,
            you can explore how these issues overlap geographically and identify
            countries where certain behaviors are especially pronounced.
          </p>
        </StoryCopy>
        <NotebookLayerMap />
      </section>

      <section className="narrative-section" id="time-evolution">
        <SectionHeader
          kicker="04 Time Evolution"
          title="The gaps did not all move in the same direction."
        />
        <StoryCopy>
          <p>
            To understand whether these inequalities are changing over time, we
            compare data from 2014 and 2019. The visualizations show that in
            several countries, the gap between income groups either increased or
            remained stable.
          </p>
          <p>
            This change or lack of change in economic growth implies that
            economic growth alone does not necessarily reduce health inequality.
            In certain cases, improvements in overall living standards may
            benefit higher-income groups more than lower-income populations.
          </p>
          <p>
            Tracking these changes over time helps reveal whether European
            countries are moving toward greater equality or deeper social divides.
          </p>
        </StoryCopy>
        <GapEvolutionChart />
      </section>

      <section className="narrative-section" id="country-exception">
        <SectionHeader
          kicker="05 Country Exception"
          title="Turkey reverses the smoking gradient."
        />
        <StoryCopy>
          <p>
            Furthermore, we compared the highest median income country, Norway,
            with the lowest median income country, Turkey, to further explore the
            health and income disparity.
          </p>
          <p>
            Turkey stands out as an interesting exception, as unlike the other
            European countries mapped, smoking behavior does not follow the same
            income-related pattern.
          </p>
          <p>
            Lower income groups tend to smoke more across Europe, however, in
            Turkey a weaker or reversed relationship is shown. This suggests that
            there are other factors that contribute to the results of the data.
          </p>
          <p>
            This exception highlights why it is important to take context and
            culture into consideration when analyzing data. While broad trends
            across Europe may exist, individual countries may challenge the
            consensus by revealing a more complex social dynamic.
          </p>
        </StoryCopy>
        <CountryExceptionHealthDiagram />
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
