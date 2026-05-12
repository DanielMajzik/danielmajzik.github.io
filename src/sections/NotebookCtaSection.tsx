export function NotebookCtaSection() {
  const notebookUrl = `${import.meta.env.BASE_URL}explainer-notebook.html`

  return (
    <section className="notebook-cta-section" aria-label="Explainer notebook">
      <div>
        <p className="section-kicker">Notebook</p>
        <h2>See the full workflow</h2>
        <p>
          Open the static notebook page to inspect the data preparation,
          intermediate outputs, and supporting analysis behind the story.
        </p>
      </div>

      <a className="notebook-link-button" href={notebookUrl}>
        Open explainer notebook
      </a>
    </section>
  )
}
