import { getGapRows } from '../charts/healthStoryData'
import { formatGapValue } from './storyFormat'
import { SectionHeader } from './storySectionParts'

export function ReflectionSection() {
  const gaps = getGapRows()
  const smokingGap = gaps.find((gap) => gap.id === 'smoking')
  const drinkingGap = gaps.find((gap) => gap.id === 'drinking')
  const depressionGap = gaps.find((gap) => gap.id === 'depression')

  return (
    <section className="narrative-section reflection-section" id="reflection">
      <SectionHeader
        copy="The analysis shows a clear income gradient for depressive symptoms and daily smoking, but heavy episodic drinking moves in the opposite direction. Income helps reveal unequal outcomes, while geography and national context explain why the pattern is not uniform."
        kicker="Conclusion"
        title="Income is a clue, not the cause"
      />
      <p>
        Across Europe, income inequality leaves a visible imprint on health. 
        The analysis consistently shows that lower-income groups experience 
        higher rates of smoking and depressive symptoms, while wealthier 
        populations generally report lower burdens of these outcomes.
      </p>
      <p>
        At the same time, the project also reveals that not every health 
        behavior follows the same socioeconomic logic. Heavy episodic drinking 
        remains surprisingly stable across income levels, suggesting that some 
        behaviors are shaped more strongly by cultural and national context than 
        by economic position alone.
      </p>
      <p>
        The comparison between countries further demonstrates that health inequality 
        is not universal in its expression. While many nations follow similar gradients, 
        exceptions such as Türkiye illustrate how social norms, policy environments, 
        and cultural factors can alter expected relationships between wealth and health.
      </p>
      <p>
        Rather than presenting inequality as a purely economic issue, the findings 
        highlight how deeply socioeconomic conditions are connected to everyday 
        well-being, mental health, and lifestyle behaviors.
      </p>
      <h2>Limitations</h2>
      <p>
        These views are descriptive rather than causal. The data identifies
            associations by country and income group, but it does not isolate the
            mechanisms behind each pattern or prove that income alone causes the
            health differences.
      </p>
    </section>
  )
}
