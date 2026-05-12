import { CountryExceptionSection } from './CountryExceptionSection'
import { GeographicPatternSection } from './GeographicPatternSection'
import { HookSection } from './HookSection'
import { MainFindingSection } from './MainFindingSection'
import { TimeEvolutionSection } from './TimeEvolutionSection'

export { CountryExceptionSection } from './CountryExceptionSection'
export { DatasetSection } from './DatasetSection'
export { GeographicPatternSection } from './GeographicPatternSection'
export { HookSection } from './HookSection'
export { MainFindingSection } from './MainFindingSection'
export { ReflectionSection } from './ReflectionSection'
export { TimeEvolutionSection } from './TimeEvolutionSection'

export function StorySection() {
  return (
    <>
      <HookSection />
      <MainFindingSection />
      <GeographicPatternSection />
      <TimeEvolutionSection />
      <CountryExceptionSection />
    </>
  )
}
