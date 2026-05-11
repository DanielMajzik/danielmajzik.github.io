import { getCoverage } from '../appData'

export function HeaderSection() {
  return (
    <header className="app-header">
      <div className="title-copy">
        <p className="eyebrow">Eurostat 2014 and 2019</p>
        <h1>Health Inequality Across Europe</h1>

        <p className="subtitle">
          A data story about how income shapes smoking and mental health, why
          alcohol behaves differently, and where national context breaks the
          pattern.
        </p>

        <div className="title-topic-strip" aria-label="Story topics">
          <span>Income quintiles</span>
          <span>Smoking</span>
          <span>Depressive symptoms</span>
          <span>Heavy drinking</span>
          <span>Country exceptions</span>
        </div>
      </div>

      <div className="title-story-panel" aria-label="Page summary">
        <div className="title-panel-heading">
          <span>{getCoverage()}</span>
          <span>2014 vs 2019</span>
        </div>

        <div className="title-flow">
          <div>
            <strong>Income</strong>
            <span>Quintiles reveal uneven health burden.</span>
          </div>
          <div>
            <strong>Place</strong>
            <span>Countries reshape the pattern.</span>
          </div>
          <div>
            <strong>Time</strong>
            <span>Gaps move in different directions.</span>
          </div>
        </div>

      </div>
    </header>
  )
}
