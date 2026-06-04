import type { FixtureScenario } from '../../../scenarios/types.ts'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'radcn'

const singleName = 'candidate-accordion-single'

export function renderAccordionFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'multiple':
      return (
        <Accordion type="multiple">
          <AccordionItem open value="one">
            <AccordionTrigger>First item</AccordionTrigger>
            <AccordionContent>First item content for visual comparison.</AccordionContent>
          </AccordionItem>
          <AccordionItem open value="two">
            <AccordionTrigger>Second item</AccordionTrigger>
            <AccordionContent>Second item content for visual comparison.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    case 'disabled-item':
      return (
        <Accordion collapsible name={singleName} type="single">
          <AccordionItem name={singleName} open value="one">
            <AccordionTrigger>Enabled item</AccordionTrigger>
            <AccordionContent>Enabled item content.</AccordionContent>
          </AccordionItem>
          <AccordionItem disabled name={singleName} value="two">
            <AccordionTrigger disabled>Disabled item</AccordionTrigger>
            <AccordionContent disabled>Disabled item content.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    case 'custom-token':
      return (
        <Accordion class="radcn-fixture-custom-accordion" name="candidate-accordion-custom" type="single">
          <AccordionItem name="candidate-accordion-custom" open value="one">
            <AccordionTrigger>Custom accordion</AccordionTrigger>
            <AccordionContent>Accordion colors use documented RadCN tokens.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    default:
      return (
        <Accordion collapsible name={singleName} type="single">
          <AccordionItem name={singleName} open value="one">
            <AccordionTrigger>Is this accessible?</AccordionTrigger>
            <AccordionContent>Yes. It uses native disclosure semantics in Remix 3.</AccordionContent>
          </AccordionItem>
          <AccordionItem name={singleName} value="two">
            <AccordionTrigger>Can it collapse?</AccordionTrigger>
            <AccordionContent>The fixture starts with only the first item open.</AccordionContent>
          </AccordionItem>
        </Accordion>
      )
  }
}
