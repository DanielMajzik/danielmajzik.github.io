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
          The data reveals a clear and persistent pattern; lower-income groups 
          carry a disproportionately larger share of the health burden related 
          to smoking and depression. As income increases, both smoking prevalence 
          and depressive symptoms steadily decline. The poorest income quintile 
          consistently shows the highest rates, while the wealthiest groups report 
          the lowest.
        </p>
        <p>
          The relationship is especially strong for depression. Individuals in 
          the lowest income quintile account for more than 30% of the total burden, 
          while the highest income group represents only around 11%. Smoking 
          follows a similar, though less extreme, gradient. These findings suggest 
          that economic inequality is closely connected to both mental health and 
          unhealthy coping behaviors.
        </p>
        <p>
          Heavy episodic drinking, however, tells a very different story. Unlike 
          smoking and depression, alcohol consumption remains remarkably stable 
          across all income groups. The relative share changes only minimally from 
          the poorest to the wealthiest quintile, indicating that drinking behavior 
          may be influenced less by income and more by cultural or social factors 
          shared across economic classes.
        </p>
      </StoryCopy>
      <NotebookRelativeShareDiagram />
    </section>
  )
}
