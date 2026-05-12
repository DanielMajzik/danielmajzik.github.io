import type { ReactNode } from 'react'

const NOTEBOOK_DIAGRAM_BASE = `${import.meta.env.BASE_URL}notebook-diagrams/`

export function SectionHeader({
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

export function StoryCopy({ children }: { children: ReactNode }) {
  return <div className="story-copy">{children}</div>
}

export function NotebookLayerMap() {
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

export function CountryExceptionHealthDiagram() {
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

export function NotebookRelativeShareDiagram() {
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

export function HealthOutcomesComparisonDiagram() {
  return (
    <figure className="notebook-diagram">
      <div>
        <h3>Comparison of Health Outcomes (2014 vs 2019)</h3>
        <p>
          Notebook comparison of smoking, heavy drinking, and depressive symptoms
          for the top three highest and lowest median income countries.
        </p>
      </div>
      <img
        alt="Comparison of Health Outcomes from 2014 to 2019 for the top three highest and lowest median income countries"
        loading="eager"
        src={`${NOTEBOOK_DIAGRAM_BASE}health-comparison-2014-2019.png`}
      />
    </figure>
  )
}
