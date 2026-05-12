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
          Comparing 2014 and 2019 reveals both gradual improvements and 
          persistent inequalities between countries with high and low median 
          incomes. While some indicators improved across nearly all countries, 
          others remained remarkably stable.
        </p>
        <p>
          Smoking rates declined consistently between 2014 and 2019 in almost 
          every country included in the comparison. The reduction was especially 
          visible in wealthier countries such as Norway and Luxembourg, where 
          smoking prevalence fell noticeably over the five-year period. 
          Lower-income countries such as Bulgaria and Romania also experienced 
          decreases, although smoking rates remained substantially higher overall. 
          Türkiye stands out once again as an exception, showing only a minimal 
          decline and maintaining comparatively high smoking levels despite its 
          lower median income.
        </p>
        <p>
          Heavy episodic drinking presents a striking contrast. Across both high-income 
          and low-income countries, drinking rates remained almost unchanged between 2014 
          and 2019. The values stay close to 25% for all countries regardless of income 
          level, reinforcing the broader finding that alcohol consumption appears far 
          less connected to socioeconomic differences than smoking or mental health outcomes.
        </p>
        <p>
          Depressive symptoms show a more complex development. Some countries, such as 
          Bulgaria and Norway, experienced slight decreases, while others — including 
          Denmark and Türkiye — saw increases over time. Unlike smoking, there is no 
          single European trend for mental health. Instead, depressive symptoms appear 
          to evolve differently depending on national and social context.
        </p>
        <p>
          Tracking these changes over time helps to reveal whether European
          countries are moving toward greater equality or deeper social divides.
        </p>
      </StoryCopy>
      <HealthOutcomesComparisonDiagram />
    </section>
  )
}
