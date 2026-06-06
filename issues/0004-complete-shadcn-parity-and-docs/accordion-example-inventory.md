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

The named upstream example is still partial because current docs, fixtures, and
tests do not prove the exact `accordion-demo` composition: `type="single"`,
`collapsible`, `defaultValue="item-1"`, `className="w-full"`, three exact item
values, exact product/shipping/return trigger text, and the two exact paragraph
blocks under each item.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `accordion-demo` | Single collapsible accordion with `defaultValue="item-1"` and `className="w-full"`. It renders three items with values `item-1`, `item-2`, and `item-3`; triggers labelled `Product Information`, `Shipping Details`, and `Return Policy`; and two paragraph blocks under each item. Product copy starts `Our flagship product combines cutting-edge technology with sleek design.` and includes `Key features include advanced processing capabilities`. Shipping copy starts `We offer worldwide shipping through trusted courier partners.` and includes `All orders are carefully packaged and fully insured.` Return copy starts `We stand behind our products with a comprehensive 30-day return policy.` and includes `Our hassle-free return process includes free return shipping`. Content uses `flex flex-col gap-4 text-balance`. The upstream UI uses a React client component marker, Radix Accordion primitive, lucide `ChevronDownIcon`, `cn`, `data-slot`, `className`, Tailwind `w-full`, trigger disabled styling, accordion open/closed animation utilities, and a rotating chevron. | `radcn/packages/radcn/src/components/accordion.tsx` exports the required parts and maps single/collapsible behavior to native details groups with explicit shared item `name` props, explicit item `open` props, root `data-type`, root `data-collapsible`, root metadata `data-default-value`, root metadata `data-accordion-name`, item `data-value`, item `data-state`, `data-disabled`, trigger text/icon hooks, and content hooks. The root `defaultValue` and `name` props are metadata today; they do not derive child item `open` or `name` values automatically. `radcn/fixtures/candidate-remix/app/fixtures/accordion.tsx` covers generic single, multiple, disabled-item, and custom-token routes by manually passing both root/item `name` and `AccordionItem open`. `radcn/fixtures/tests/accordion.spec.ts` verifies native details/summary hooks, single group behavior, collapsible toggling, multiple open panels, keyboard Enter toggling, disabled item rendering, and custom token styling. `radcn/apps/docs/app/content/components.tsx` and `radcn/apps/docs/tests/coverage.spec.ts` prove a generic docs preview route for Accordion. No current docs/fixture/test proves the named upstream `accordion-demo` trigger labels, item values, exact copy, `defaultValue="item-1"` mapping in that composition, `w-full`/full-width styling, or `flex flex-col gap-4 text-balance` content layout mapping. | Partial | Add named docs, candidate fixture, and Playwright coverage for `accordion-demo` with values `item-1`/`item-2`/`item-3`, the exact three trigger labels, two exact paragraphs per item, first item open by default, single collapsible behavior, full-width styling evidence, content layout/text-balance mapping, public hooks, status/data-state evidence, and mapping copy for React, Radix, lucide, `cn`, `data-slot`, `className`, Tailwind, animation utilities, disabled styling, and vendor source. The follow-up must explicitly decide whether to keep the current RadCN mapping of root `defaultValue`/`name` as metadata plus explicit item `open`/`name`, or enhance the package so root props can derive item state/grouping. |

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
