import { NotebookLayerMap, SectionHeader, StoryCopy } from './storySectionParts'

export function GeographicPatternSection() {
  return (
    <section className="narrative-section" id="geographic-pattern">
      <SectionHeader
        kicker="Across Europe"
        title="Place changes the pattern"
      />
      <StoryCopy>
        <p>
          While income inequality exists across Europe, its impact on social
          well-being varies greatly by country. The heatmap reveals regional
          patterns in smoking, alcohol consumption, and depressive symptom rates.
        </p>
        <p>
          Northern and Eastern European countries show different behavioral
          trends compared to Southern Europe, suggesting that cultural norms,
          healthcare systems, and social policies may influence how people
          respond to economic stress.
        </p>
        <p>
          Darker colors show higher rates, while lighter colors show lower rates.
          By switching between smoking, drinking, and depressive symptom layers,
          you can explore how these issues overlap geographically and identify
          countries where certain behaviors are especially pronounced.
        </p>
        <p>
          Read this map as the transition from the aggregate income pattern to
          country context. The burden-share plot shows who is most affected
          within the income distribution; the map shows where those burdens are
          concentrated. That geographic view is what makes the later interactive
          map useful: it lets you test whether a pattern is European-wide,
          regional, or specific to a small set of countries.
        </p>
      </StoryCopy>
      <NotebookLayerMap />
    </section>
  )
}
