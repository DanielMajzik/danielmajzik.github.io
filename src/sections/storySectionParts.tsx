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
        This Heatmap represents spatial patterns of smoking, heavy episodic 
        drinking, and depressive symptoms across European regions. Each 
        layer corresponds to one of the three health outcomes, allowing 
        users to explore how these behaviors and conditions are distributed 
        geographically. Darker colors show higher rates, while lighter colors show lower rates.
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
        Relative share of smoking, 
        depressive symptoms, and heavy episodic drinking across income quintiles 
        in Europe. Smoking and depression show a strong socioeconomic gradient, 
        with lower-income groups carrying a substantially larger share of the 
        total burden. In contrast, heavy drinking remains nearly constant across 
        all income levels, suggesting that alcohol consumption is less strongly 
        associated with income inequality than other health outcomes.
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
        Comparison of smoking, heavy drinking, and depressive symptom rates between 
        2014 and 2019 for the three European countries with the highest and lowest 
        median incomes. Smoking rates declined across nearly all countries over time, 
        while heavy drinking remained largely unchanged regardless of national income 
        level. Trends in depressive symptoms were more mixed, with some countries 
        showing slight improvements and others experiencing increases, highlighting 
        that mental health developments vary more strongly across national contexts.
      </figcaption>
    </figure>
  )
}
