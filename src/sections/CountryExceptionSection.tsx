import {
  CountryExceptionHealthDiagram,
  SectionHeader,
  StoryCopy,
} from './storySectionParts'

export function CountryExceptionSection() {
  return (
    <section className="narrative-section" id="country-exception">
      <SectionHeader
        kicker="Outlier"
        title="Turkey breaks the smoking pattern"
      />
      <StoryCopy>
        <p>
          To test the broader pattern, we compared Norway, the country with the
          highest median income in the health datasets, with Turkey, the country
          with the lowest.
        </p>
        <p>
          Turkey stands out because its smoking behavior does not follow the
          same income-related pattern seen in the other European countries in
          the comparison.
        </p>
        <p>
          Lower-income groups tend to smoke more across Europe. In Turkey, the
          relationship is weaker or reversed, suggesting that other social,
          cultural, or policy factors also shape the observed data.
        </p>
        <p>
          This exception highlights why it is important to take context and
          culture into consideration when analyzing data. While broad trends
          across Europe may exist, individual countries may challenge the
          pattern by revealing a more complex social dynamic.
        </p>
      </StoryCopy>
      <CountryExceptionHealthDiagram />
    </section>
  )
}
