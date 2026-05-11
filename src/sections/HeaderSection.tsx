import { getCoverage, getGeneratedDate } from '../appData'

export function HeaderSection() {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Eurostat 2014 and 2019</p>
        <h1>Health Inequality Across Europe</h1>

        <p className="subtitle">
          How income shapes smoking and mental health — but not alcohol consumption
        </p>
      </div>
      <div className="source-line">
        <span>{getCoverage()}</span>
        <span>Generated {getGeneratedDate()}</span>
      </div>
    </header>
  )
}
