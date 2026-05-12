import { SectionHeader, StoryCopy } from './storySectionParts'

export function HookSection() {
  return (
    <section className="narrative-section hook-section" id="hook">
      <div className="story-intro">
        <SectionHeader
          kicker="Introduction"
          title="Income leaves a health trace"
        />
        <StoryCopy>
          <p>
            Economic inequality may affect more than financial opportunity.
            This story is about whether income is also linked to mental and physical
            health across Europe. Income can shape habits such as smoking and
            alcohol consumption, while lower-income groups often report worse
            mental health outcomes and higher rates of unhealthy coping
            behaviors.
          </p>
          <p>
            Eurofound identifies lower socioeconomic groups as facing
            higher risk of poor mental health, while OECD and European
            Commission reporting shows that lifestyle risk factors such as
            smoking and harmful alcohol consumption remain prevalent across the
            EU. See{' '}
            <a
              href="https://www.eurofound.europa.eu/en/publications/all/mental-health-risk-groups-trends-services-and-policies"
              rel="noreferrer"
              target="_blank"
            >
              Eurofound (2025)
            </a>{' '}
            and{' '}
            <a
              href="https://www.oecd.org/en/publications/health-at-a-glance-europe-2024_b3704e14-en.html"
              rel="noreferrer"
              target="_blank"
            >
              Health at a Glance: Europe 2024
            </a>
            .
          </p>
          <p>
            This project explores the relationship between income inequality,
            depression, smoking, and drinking across European countries. By
            combining datasets about these factors, and visualizing various patterns, 
            the analysis investigates whether lower income is associated with negative health
            outcomes and how these patterns vary geographically and over time.
          </p>
        </StoryCopy>
      </div>
    </section>
  )
}
