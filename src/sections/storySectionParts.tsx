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
      <figcaption>
        This exploratory map turns the country-by-country tables into a spatial
        reading of the story. Switching layers shows that the income gradient is
        not the only structure in the data: smoking, heavy drinking, and
        depressive symptoms each form different regional clusters, so the same
        income group can face different risks depending on national context.
      </figcaption>
    </figure>
  )
}

export function CountryExceptionHealthDiagram() {
  return (
    <figure className="notebook-diagram">
      <div>
        <h3>Health Behaviors and Depressive Symptoms by Income Quintile</h3>
        <p>
          Norway and Turkey are compared as the countries with the highest and
          lowest median income in the health datasets, highlighting Turkey's
          different smoking pattern alongside heavy episodic drinking and
          depressive symptoms.
        </p>
      </div>
      <img
        alt="Health behaviors and depressive symptoms by income quintile for Norway and Turkey"
        loading="eager"
        src={`${NOTEBOOK_DIAGRAM_BASE}country-exception-health-behaviours.png`}
      />
      <figcaption>
        The plot compares the same income quintiles in a high-income and
        lower-income country case. Norway broadly fits the expected pattern of
        higher smoking and depressive symptoms among lower-income groups, while
        Turkey shows why the relationship cannot be treated as automatic:
        smoking is weaker or reversed across the income scale, even as other
        health indicators still vary by quintile.
      </figcaption>
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
          contributes to the total observed burden for smoking, depressive
          symptoms, and heavy drinking across European countries.
        </p>
      </div>
      <img
        alt="Relative Share of Health Burden by Income Quintile Across European Countries"
        loading="eager"
        src={`${NOTEBOOK_DIAGRAM_BASE}notebook-figure-05.png`}
      />
      <figcaption>
        Each line shows the share of the observed burden carried by each income
        quintile, rather than the raw rate alone. The downward slope for smoking
        and depressive symptoms means lower-income groups account for a larger
        share of those burdens; heavy drinking is flatter and tilts toward
        higher-income groups, making it the main exception to the simple
        deprivation story.
      </figcaption>
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
      <figcaption>
        This plot compares the top and bottom median-income countries in 2014
        and 2019 to show whether the story changes over time. The main lesson is
        uneven movement: some countries improve on one outcome while stagnating
        on another, so income rank alone does not explain whether health gaps
        narrow, persist, or shift between behaviors.
      </figcaption>
    </figure>
  )
}
