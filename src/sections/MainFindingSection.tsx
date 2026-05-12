import {
  NotebookRelativeShareDiagram,
  SectionHeader,
  StoryCopy,
} from './storySectionParts'

export function MainFindingSection() {
  return (
    <section className="narrative-section" id="main-finding">
      <SectionHeader
        kicker="Core Pattern"
        title="Lower income, heavier burden"
      />
      <StoryCopy>
        <p>
          The first visualization compares health outcomes across income
          quintiles. It shows a clear social gradient: lower-income groups report
          higher levels of depressive symptoms and poorer overall well-being than
          higher-income groups.
        </p>
        <p>
          The multi-line chart shows that health inequality is not evenly
          distributed. As income increases, negative health outcomes generally
          decrease, suggesting a strong correlation between economic status and
          mental health.
        </p>
        <p>
          These patterns suggest that financial insecurity may contribute to
          stress and some unhealthy coping mechanisms, although alcohol does not
          follow the same income gradient.
        </p>
      </StoryCopy>
      <NotebookRelativeShareDiagram />
    </section>
  )
}
