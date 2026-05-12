import { getGapRows } from '../charts/healthStoryData'
import { formatGapValue } from './storyFormat'
import { SectionHeader, StoryCopy } from './storySectionParts'

export function HookSection() {
  const gaps = getGapRows()
  const smokingGap = gaps.find((gap) => gap.id === 'smoking')
  const drinkingGap = gaps.find((gap) => gap.id === 'drinking')
  const depressionGap = gaps.find((gap) => gap.id === 'depression')

  return (
    <section className="narrative-section hook-section" id="hook">
      <div className="story-intro">
        <SectionHeader
          kicker="Start Here"
          title="Income leaves a health trace"
        />
        <StoryCopy>
          <p>
            It can be wondered whether economic inequality affects more than
            just financial opportunities. Is there potentially a link between
            average income and overall well-being? It can be asked whether it
            also influences people’s mental and physical health. Income may
            shape habits such as smoking and alcohol consumption, while
            lower-income groups across Europe often report worse mental health
            outcomes and higher rates of unhealthy coping behaviors.
          </p>
          <p>
            This project explores the relationship between income inequality,
            depression, smoking, and drinking across European countries. By
            combining multiple datasets and visualizations, the analysis
            investigates whether lower income is associated with negative health
            outcomes and how these patterns vary geographically and over time.
          </p>
        </StoryCopy>
      </div>

      <div className="hook-stat-grid" aria-label="Key findings">
        <div>
          <span>Smoking gap</span>
          <strong>{formatGapValue(smokingGap?.end)}</strong>
          <p>Higher rate in the first income quintile than in the fifth.</p>
        </div>
        <div>
          <span>Drinking gap</span>
          <strong>{formatGapValue(drinkingGap?.end)}</strong>
          <p>Higher rate in the fifth income quintile than in the first.</p>
        </div>
        <div>
          <span>Depression gap</span>
          <strong>{formatGapValue(depressionGap?.end)}</strong>
          <p>Higher rate in the first income quintile than in the fifth.</p>
        </div>
      </div>
    </section>
  )
}
