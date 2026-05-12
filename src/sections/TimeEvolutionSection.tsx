import {
  HealthOutcomesComparisonDiagram,
  SectionHeader,
  StoryCopy,
} from './storySectionParts'

export function TimeEvolutionSection() {
  return (
    <section className="narrative-section" id="time-evolution">
      <SectionHeader
        kicker="Over Time"
        title="Gaps move in different directions"
      />
      <StoryCopy>
        <p>
          To understand whether these inequalities are changing over time, we
          compare data from 2014 and 2019. The visualizations show that in
          several countries, the gap between income groups either widened or
          stayed stable.
        </p>
        <p>
          The persistence of these gaps suggests that economic growth alone does
          not necessarily reduce health inequality. In certain
          cases, improvements in overall living standards may benefit
          higher-income groups more than lower-income populations.
        </p>
        <p>
          Tracking these changes over time helps reveal whether European
          countries are moving toward greater equality or deeper social divides.
        </p>
      </StoryCopy>
      <HealthOutcomesComparisonDiagram />
    </section>
  )
}
