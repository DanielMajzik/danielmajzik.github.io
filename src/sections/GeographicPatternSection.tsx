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
          While income inequality exists across Europe, its impacts of the social
          well-being of countries vary greatly. The heatmap reveals regional
          patterns in smoking, alcohol consumption, and depression rates.
        </p>
        <p>
          Northern and Eastern European countries show different behavioral
          trends compared to Southern Europe, suggesting that cultural norms,
          healthcare systems, and social policies may influence how people
          respond to economic stress.
        </p>
        <p>
          Darker colors show higher rates, while lighter colors show lower rates.
          By switching between smoking, drinking, and depression tabs, you can
          explore how these issues overlap geographically and identify countries
          where certain behaviors are especially pronounced.
        </p>
      </StoryCopy>
      <NotebookLayerMap />
    </section>
  )
}
