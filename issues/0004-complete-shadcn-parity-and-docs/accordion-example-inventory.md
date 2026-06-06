# Accordion Example Inventory

## Summary

Upstream shadcn/ui New York v4 exposes one active Accordion example:
`accordion-demo`.

RadCN already ships `radcn/accordion` with Accordion, AccordionItem,
AccordionTrigger, and AccordionContent exports. The package uses browser-native
details/summary disclosure markup instead of React state or Radix Accordion
primitives, and current fixtures/tests prove single accordions, collapsible
single groups, multiple open panels, keyboard toggling, disabled items, public
hooks, chevron/icon hooks, and custom token styling.

Experiment 80 adds named docs, candidate fixture, and Playwright coverage for
the exact `accordion-demo` composition: `type="single"`, `collapsible`,
`defaultValue="item-1"`, `className="w-full"`, three exact item values, exact
product/shipping/return trigger text, and the two exact paragraph blocks under
each item.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `accordion-demo` | Single collapsible accordion with `defaultValue="item-1"` and `className="w-full"`. It renders three items with values `item-1`, `item-2`, and `item-3`; triggers labelled `Product Information`, `Shipping Details`, and `Return Policy`; and two paragraph blocks under each item. Product copy starts `Our flagship product combines cutting-edge technology with sleek design.` and includes `Key features include advanced processing capabilities`. Shipping copy starts `We offer worldwide shipping through trusted courier partners.` and includes `All orders are carefully packaged and fully insured.` Return copy starts `We stand behind our products with a comprehensive 30-day return policy.` and includes `Our hassle-free return process includes free return shipping`. Content uses `flex flex-col gap-4 text-balance`. The upstream UI uses a React client component marker, Radix Accordion primitive, lucide `ChevronDownIcon`, `cn`, `data-slot`, `className`, Tailwind `w-full`, trigger disabled styling, accordion open/closed animation utilities, and a rotating chevron. | Docs render `data-radcn-docs-accordion-family="accordion-demo"` with exact trigger labels, exact copy, full-width root evidence, content layout evidence, public hooks, root `data-default-value="item-1"`, root `data-accordion-name`, first item open, and explicit item names matching the root metadata. Candidate fixture route `/fixtures/accordion/demo` renders the same named composition and Playwright verifies values, labels, copy, first-open state, native single switching, collapsible closing, public hooks, icon hooks, class/style layout evidence, and the explicit root-metadata plus item `open`/`name` mapping. | Covered | No follow-up. The current RadCN mapping is intentional for this example: root `defaultValue` and `name` are public metadata hooks, while server-rendered open state and native single grouping are explicit item `open` and matching item `name` props. React, Radix, lucide, `cn`, `data-slot`, `className`, Tailwind utilities, animation utilities, disabled styling, and vendor source remain dependency-free mappings. |

## Decisions

- RadCN should keep Accordion as a dependency-free native details/summary
  component. The Radix Accordion primitive is not needed for this example.
- `type="single"` maps to details elements sharing a `name` attribute; this
  preserves single-open browser behavior without React state.
- `collapsible` maps to RadCN's `data-collapsible="true"` public hook and the
  native ability to close the currently open details item.
- Today, root `defaultValue="item-1"` maps only to root
  `data-default-value="item-1"` metadata. The item with value `item-1` must
  still receive `open` explicitly to render open on the server.
- Today, root `name` maps only to root `data-accordion-name` metadata. Single
  group behavior still requires each non-disabled AccordionItem to receive the
  same explicit `name` prop so native details grouping works.
- The implementation follow-up must decide whether that explicit item
  `open`/`name` mapping is the intended RadCN authoring model for
  `accordion-demo`, or whether a package enhancement should derive item state
  and names from root context.
- Experiment 80 keeps the explicit item `open`/`name` mapping as the intended
  RadCN authoring model for this example because it preserves server-rendered
  state and native grouping without adding React, context, or Radix behavior.
- Upstream item values must be preserved as `data-value` values because authors
  use them as state/styling hooks.
- The upstream lucide `ChevronDownIcon` remains a non-dependency. RadCN exposes
  `data-radcn-accordion-icon` and package CSS controls rotation/transition
  affordance.
- Upstream `className`, `cn`, `data-slot`, Tailwind `w-full`, flex/gap/
  text-balance content classes, trigger disabled styling, and accordion
  animation utilities map to RadCN public classes, `class`, `style`, CSS
  variables, public `data-radcn-*` hooks, and docs/fixture composition.
- Disabled behavior is already covered generically by the candidate fixture,
  but the upstream `accordion-demo` itself has no disabled item.
- Exact upstream paragraph copy should be included in the named fixture/docs
  because the example is content-heavy and visual parity depends on text flow.
- Vendor source remains read-only evidence and should not be imported or
  committed into RadCN.
