import { SectionHeader } from './storySectionParts'

export function ReflectionSection() {

  return (
    <section className="narrative-section reflection-section" id="reflection">
      <SectionHeader
        copy="The analysis shows a clear income gradient for depressive symptoms and daily smoking, but heavy episodic drinking moves in the opposite direction. Income helps reveal unequal outcomes, while geography and national context explain why the pattern is not uniform."
        kicker="Conclusion"
        title="Income is a clue, not the cause"
      />
      <p>
        Across Europe, income inequality leaves a visible imprint on health. 
        The analysis consistently shows that lower-income groups experience 
        higher rates of smoking and depressive symptoms, while wealthier 
        populations generally report lower rates.
      </p>
      <p>
        At the same time, the project also reveals that not every health 
        behavior follows the same socioeconomic logic. As mentioned earlier, heavy episodic drinking 
        remains surprisingly stable across income levels, suggesting that some 
        behaviors are shaped more strongly by cultural and national context than 
        by economic position alone.
      </p>
      <p>
      </p>
      <p>
        Rather than presenting inequality as a purely economic issue, the findings 
        highlight that socioeconomic conditions are connected to everyday 
        well-being, mental health, and lifestyle behaviors. It is also connected to things on the national scale, such as national policies and the country's overall structural ability to provide adequate health care. 
      </p>
      <h2>Limitations</h2>
      <p>
        These findings are not final, as it is mainly based on data that has been collected by country and income group, but it does not include information based on the
            mechanisms behind each pattern, and therefore, it cannot prove that income alone causes the
            health differences.
      </p>
    </section>
  )
}
