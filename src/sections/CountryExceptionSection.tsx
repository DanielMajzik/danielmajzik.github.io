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
          Furthermore, we compared the highest median income country, Norway,
          with the lowest median income country, Turkey, to further explore the
          health and income disparity.
        </p>
        <p>
          Turkey stands out as an interesting exception, as unlike the other
          European countries mapped, smoking behavior does not follow the same
          income-related pattern.
        </p>
        <p>
          Lower income groups tend to smoke more across Europe, however, in
          Turkey a weaker or reversed relationship is shown. This suggests that
          there are other factors that contribute to the results of the data.
        </p>
        <p>
          This exception highlights why it is important to take context and
          culture into consideration when analyzing data. While broad trends
          across Europe may exist, individual countries may challenge the
          consensus by revealing a more complex social dynamic.
        </p>
      </StoryCopy>
      <CountryExceptionHealthDiagram />
    </section>
  )
}
