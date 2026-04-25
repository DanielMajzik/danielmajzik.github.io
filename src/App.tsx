import './App.css'

function App() {
  return (
    <main className="page-shell">
      <section className="intro">
        <p className="eyebrow">GitHub Pages</p>
        <h1>Daniel Majzik</h1>
        <p className="lede">
          A React and TypeScript site built with Vite, deployed automatically
          from GitHub Actions.
        </p>
        <div className="actions" aria-label="Primary links">
          <a href="https://vite.dev/" target="_blank" rel="noreferrer">
            Vite Docs
          </a>
          <a href="https://react.dev/" target="_blank" rel="noreferrer">
            React Docs
          </a>
        </div>
      </section>

      <section className="status-panel" aria-label="Project status">
        <div>
          <span>Stack</span>
          <strong>React 19 + TypeScript</strong>
        </div>
        <div>
          <span>Build</span>
          <strong>Vite 8</strong>
        </div>
        <div>
          <span>Hosting</span>
          <strong>GitHub Pages</strong>
        </div>
      </section>
    </main>
  )
}

export default App
