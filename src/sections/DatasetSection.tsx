import { getCoverage } from '../appData'
import { SectionHeader } from './storySectionParts'

export function DatasetSection() {
  return (
    <section className="narrative-section reflection-section dataset-section" id="dataset">
      <SectionHeader
        copy="The analysis combines Eurostat income data with European Health Interview Survey health indicators, then compares countries, income quintiles, and changes between two survey years."
        kicker="Data"
        title="What powers the analysis?"
      />

      <div className="reflection-grid">
        <div>
          <h3>Coverage</h3>
          <p>
            The interactive map covers {getCoverage()} for 2014 and 2019. The
            country-exception section also uses Eurostat health observations for
            Norway and Turkey.
          </p>
        </div>
        <div>
          <h3>Income measures</h3>
          <p>
            Mean and median net income come from Eurostat dataset ilc_di03 and
            are shown in purchasing power standards, making country values more
            comparable.
          </p>
        </div>
        <div>
          <h3>Health indicators</h3>
          <p>
            Smoking comes from hlth_ehis_sk3i, heavy episodic drinking from
            hlth_ehis_al3i, and current depressive symptoms from
            hlth_ehis_mh1i.
          </p>
        </div>
        <div>
          <h3>Aggregation</h3>
          <p>
            Health indicators are percentages by age, sex, and income quintile.
            Total groups and country averages are descriptive, unweighted
            averages of available observations.
          </p>
        </div>
      </div>
    </section>
  )
}
