import type { FixtureScenario } from '../../../scenarios/types.ts'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'radcn'

const singleName = 'candidate-accordion-single'
const demoName = 'candidate-accordion-demo'

export function renderAccordionFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'demo':
      return (
        <Accordion
          class="radcn-fixture-accordion-demo w-full"
          collapsible
          defaultValue="item-1"
          name={demoName}
          style="width:100%"
          type="single"
        >
          <AccordionItem name={demoName} open value="item-1">
            <AccordionTrigger>Product Information</AccordionTrigger>
            <AccordionContent class="radcn-fixture-accordion-demo-content flex flex-col gap-4 text-balance" style="display:flex;flex-direction:column;gap:16px;text-wrap:balance">
              <p>Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.</p>
              <p>Key features include advanced processing capabilities, and an intuitive user interface designed for both beginners and experts.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem name={demoName} value="item-2">
            <AccordionTrigger>Shipping Details</AccordionTrigger>
            <AccordionContent class="radcn-fixture-accordion-demo-content flex flex-col gap-4 text-balance" style="display:flex;flex-direction:column;gap:16px;text-wrap:balance">
              <p>We offer worldwide shipping through trusted courier partners. Standard delivery takes 3-5 business days, while express shipping ensures delivery within 1-2 business days.</p>
              <p>All orders are carefully packaged and fully insured. Track your shipment in real-time through our dedicated tracking portal.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem name={demoName} value="item-3">
            <AccordionTrigger>Return Policy</AccordionTrigger>
            <AccordionContent class="radcn-fixture-accordion-demo-content flex flex-col gap-4 text-balance" style="display:flex;flex-direction:column;gap:16px;text-wrap:balance">
              <p>We stand behind our products with a comprehensive 30-day return policy. If you're not completely satisfied, simply return the item in its original condition.</p>
              <p>Our hassle-free return process includes free return shipping and full refunds processed within 48 hours of receiving the returned item.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )
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
