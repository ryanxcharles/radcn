import type { FixtureScenario } from '../../../scenarios/types.ts'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'radcn'

export function renderCollapsibleFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'open':
      return (
        <Collapsible open>
          <CollapsibleTrigger>Release notes</CollapsibleTrigger>
          <CollapsibleContent>Version 3 includes native disclosure support.</CollapsibleContent>
        </Collapsible>
      )
    case 'disabled':
      return (
        <Collapsible disabled>
          <CollapsibleTrigger disabled>Locked details</CollapsibleTrigger>
          <CollapsibleContent disabled>Disabled content is not exposed.</CollapsibleContent>
        </Collapsible>
      )
    case 'custom-token':
      return (
        <Collapsible class="radcn-fixture-custom-collapsible" open>
          <CollapsibleTrigger>Custom collapsible</CollapsibleTrigger>
          <CollapsibleContent>Custom tokens style this disclosure.</CollapsibleContent>
        </Collapsible>
      )
    default:
      return (
        <Collapsible>
          <CollapsibleTrigger>Release notes</CollapsibleTrigger>
          <CollapsibleContent>Version 3 includes native disclosure support.</CollapsibleContent>
        </Collapsible>
      )
  }
}
