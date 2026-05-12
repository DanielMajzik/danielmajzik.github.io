export function HeaderSection() {
  return (
    <header className="app-header">
      <div className="title-copy">
        <p className="eyebrow">Eurostat 2014 and 2019</p>
        <h1>Europe's Health Divide</h1>

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
    </header>
  )
}
