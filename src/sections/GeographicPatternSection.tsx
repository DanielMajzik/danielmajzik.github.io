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
          Looking across Europe, health inequality does not appear randomly distributed.
          Clear geographic patterns emerge when comparing smoking, depressive symptoms,
          and heavy drinking across countries and income groups. Regional clusters become
          visible across the continent, revealing how socioeconomic conditions, public
          health policies, and cultural norms shape different health outcomes in different
          ways.
        </p>

        <p>
          Smoking shows one of the clearest geographic and socioeconomic gradients.
          Higher smoking prevalence is concentrated particularly in parts of Eastern and
          Southeastern Europe, where lower-income populations often carry a substantially
          larger share of the burden. In contrast, many Northern and Western European
          countries display lower overall smoking rates and smaller differences between
          income groups, suggesting that economic prosperity and stronger welfare systems
          may contribute to healthier lifestyle patterns.
        </p>

        <p>
          Heavy episodic drinking follows a noticeably different pattern. Unlike smoking,
          alcohol consumption appears relatively stable across both countries and income
          quintiles. While some regional differences remain visible, the overall
          distribution is far more even across Europe. This indicates that drinking
          behavior may be influenced less by economic inequality and more by broader
          cultural and social practices shared across socioeconomic groups.
        </p>

        <p>
          Depressive symptoms reveal a more complex and less uniform picture. Some
          wealthier countries report unexpectedly high rates of depressive symptoms,
          while certain lower-income countries show comparatively lower levels than
          anticipated. These differences suggest that mental health is shaped not only
          by economic conditions, but also by factors such as social support systems,
          reporting culture, healthcare accessibility, and national attitudes toward
          mental well-being.
        </p>

        <p>
          Together, these patterns demonstrate that health inequality in Europe cannot
          be explained by income alone. While socioeconomic status strongly influences
          smoking and mental health outcomes, national context and cultural factors can
          significantly alter how these inequalities manifest across the continent.
        </p>
      </StoryCopy>
      <NotebookLayerMap />
    </section>
  )
}
