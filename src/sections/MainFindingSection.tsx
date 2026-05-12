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
          Our first visualization compares income quintiles with mental health
          outcomes across Europe. Looking at the data, a clear social difference
          is shown; individuals in lower income groups consistently report higher
          levels of depression and poorer overall well-being compared to higher
          income groups.
        </p>
        <p>
          The multi-line chart shows that health inequality is not evenly
          distributed. As income increases, negative health outcomes generally
          decrease, suggesting a strong correlation between economic status and
          mental health.
        </p>
        <p>
          This data supports the idea that financial insecurity may contribute to
          stress and thus, unhealthy coping mechanisms such as heavy alcohol
          consumption and smoking.
        </p>
      </StoryCopy>
      <NotebookRelativeShareDiagram />
    </section>
  )
}
