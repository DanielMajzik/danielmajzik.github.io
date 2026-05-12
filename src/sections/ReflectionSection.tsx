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

      <div className="reflection-grid">
        <div>
          <h3>Strongest pattern</h3>
          <p>
            Depressive symptoms show the clearest inequality signal: in 2019,
            the first income quintile was {formatGapValue(depressionGap?.end)}
            above the fifth quintile in the country-average view.
          </p>
        </div>
        <div>
          <h3>Health behavior split</h3>
          <p>
            Daily smoking also remains higher in lower-income groups, with a
            2019 gap of {formatGapValue(smokingGap?.end)}. Heavy episodic
            drinking reverses the direction, sitting{' '}
            {formatGapValue(drinkingGap?.end)} higher in the fifth income
            quintile.
          </p>
        </div>
        <div>
          <h3>Why place matters</h3>
          <p>
            The country maps and the Norway-Turkey comparison show that national
            context can weaken, amplify, or reverse the broad income gradient.
            Culture, age structure, health policy, and reporting behavior may
            shape the observed rates.
          </p>
        </div>
        <div>
          <h3>What remains uncertain</h3>
          <p>
            These views are descriptive rather than causal. The data identifies
            associations by country and income group, but it does not isolate the
            mechanisms behind each pattern or prove that income alone causes the
            health differences.
          </p>
        </div>
      </div>
    </section>
  )
}
