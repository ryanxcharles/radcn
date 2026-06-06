# Select Example Inventory

## Summary

Upstream shadcn/ui New York v4 has two active Select examples: `select-demo`
and `select-scrollable`. RadCN already ships `radcn/select` with the core
selection, overlay, keyboard, typeahead, grouping, scrolling, and form behavior
needed for both examples, but current docs, fixtures, and Playwright tests do
not yet prove the named upstream example compositions.

**Audit outcome:** Partial.

The next experiment should add named docs, candidate fixture routes, and
Playwright coverage for `select-demo` and `select-scrollable`. The audit found
no mandatory Select package API change yet. React, Radix Select primitives,
`className`, `data-slot`, Tailwind, `cn`, lucide icons, and vendor source
remain non-dependencies unless a later implementation pass discovers and
records a concrete RadCN package gap.

## Examples

| Example | Upstream behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `select-demo` | Basic Select with trigger width `w-[180px]`, placeholder `Select a fruit`, one group labelled `Fruits`, and five fruit options: Apple, Banana, Blueberry, Grapes, Pineapple. Uses Radix Select primitives, React props, `className`, Tailwind width utility, `SelectValue`, `SelectContent`, `SelectGroup`, `SelectLabel`, and `SelectItem`. | `radcn/select` supports root, trigger, value placeholder/display, portal/content/viewport, groups, labels, items, item indicators, hidden input, opening/closing, keyboard selection, typeahead, selected state, disabled skip behavior, custom classes/styles/tokens, and docs/fixture coverage generically. Current fixtures render framework option sets and grouped examples, but no docs/fixture/test evidence renders the named fruit option set, exact `Select a fruit` placeholder, `Fruits` label, `w-[180px]`-equivalent trigger width, or named upstream example id. | Partial | Add named docs and candidate fixture evidence for `select-demo`; cover exact placeholder, fruit group label, five option labels/values, trigger width evidence, opening/selection behavior, selected item indicator, hidden input value if a name is used, public hooks, and mapping copy. |
| `select-scrollable` | Select with trigger width `w-[280px]`, placeholder `Select a timezone`, five labelled groups: North America, Europe & Africa, Asia, Australia & Pacific, and South America. Contains 27 timezone options, scrollable content, and scroll up/down affordances from upstream Select. | `radcn/select` supports grouped items, labels, scroll up/down buttons, scrollable viewport, keyboard navigation, typeahead, selected indicators, portal/content hooks, and generic scrollable fixture coverage. Current scrollable fixture uses 18 generic `Option N` items rather than the named timezone groups and options, so it does not prove the upstream example composition. | Partial | Add named docs and candidate fixture evidence for `select-scrollable`; cover exact placeholder, trigger width evidence, five group labels, all 27 timezone options and values, scroll up/down buttons, scrollable viewport mutation, keyboard/typeahead behavior within the timezone list, public hooks, and mapping copy. |

## Capability Mapping

| Surface | Decision |
| --- | --- |
| Select root | Supported by `radcn/packages/radcn/src/components/select.tsx` with `data-radcn-select`, package class, hidden input when `name` is provided, `defaultValue`, `value`, `defaultOpen`, `disabled`, `invalid`, `required`, `class`, and `style`. |
| Trigger and value | Supported through `SelectTrigger` and `SelectValue` with public hooks, placeholder state, trigger `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, sizes, accessible labels, and selected text display. Existing tests cover placeholder and selected display generically. |
| Portal, content, viewport | Supported through `SelectPortal`, `SelectContent`, and `SelectViewport`; existing tests prove portal movement, listbox semantics, opening/closing, outside pointer close, tab close, popper placement, side, and align. |
| Groups and labels | Supported through `SelectGroup` and `SelectLabel`; existing tests prove generic groups and labels, but named fruit/timezone group copy still needs proof. |
| Items, selected state, and indicators | Supported through `SelectItem` and `SelectItemIndicator`; existing tests prove selected item state, hidden input updates, disabled skip behavior, and item indicator hooks generically. |
| Scroll buttons and scrollable content | Supported through `SelectScrollUpButton`, `SelectScrollDownButton`, and scrollable viewport behavior; existing tests prove generic scroll buttons and viewport scroll mutation, but named timezone option content still needs proof. |
| Keyboard navigation and typeahead | Supported by `enhanceSelect`; existing tests prove Enter, Space, Arrow keys, Home, End, disabled skip behavior, wrapping, and typeahead generically. Named timezone list typeahead still needs example-specific proof if the next experiment resolves the row. |
| Hidden form value and reset | Supported and covered generically. The active upstream examples do not name fields, but docs/fixtures may add a deterministic name for value evidence if useful. |
| Trigger widths `w-[180px]` and `w-[280px]` | Styling concerns. RadCN supports width through `class`, `style`, and CSS variables; named examples need docs/fixture/test evidence for equivalent trigger width. |
| Lucide `CheckIcon`, `ChevronDownIcon`, `ChevronUpIcon` | Presentation details. RadCN uses dependency-free package glyphs/indicators and public hooks rather than depending on `lucide-react`. |
| React props, Radix `SelectPrimitive`, `className`, `data-slot`, Tailwind utilities, and `cn` | Implementation details or React/Tailwind mechanics from shadcn/ui. RadCN maps these to Remix UI props, `class`, public `data-radcn-*` hooks, package CSS, inline style, CSS variables, and browser enhancement. They are not RadCN dependencies. |
| Vendor source | Reference only. No RadCN package, docs, fixture, or test code should depend on `vendor/`. |

## Evidence Reviewed

- Issue inventory:
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`.
- Upstream package source:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/select.tsx`.
- Upstream example source:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/select-demo.tsx`
  and
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/select-scrollable.tsx`.
- Upstream registry metadata:
  `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/select.json`,
  `select-demo.json`, and `select-scrollable.json`.
- Current RadCN package source:
  `radcn/packages/radcn/src/components/select.tsx`.
- Current RadCN styles:
  `radcn/packages/radcn/src/styles/index.ts` and
  `radcn/packages/radcn/src/styles/tokens.css`.
- Current docs evidence:
  `radcn/apps/docs/app/content/components.tsx` has generic Select examples and
  many Select compositions inside other resolved pages, but no named
  `select-demo` or `select-scrollable` docs examples.
- Current fixture evidence:
  `radcn/fixtures/candidate-remix/app/fixtures/select.tsx` covers generic
  default, placeholder, grouped, disabled/invalid, keyboard/typeahead,
  scrollable, popper-placement, form-submit-reset, and custom-token scenarios,
  but not named upstream Select examples.
- Current Playwright evidence:
  `radcn/fixtures/tests/select.spec.ts` covers portal/listbox semantics,
  deterministic highlight, placeholder, click selection, keyboard opening,
  keyboard selection, roving focus, wrapping, disabled skip behavior, typeahead,
  outside/tab close, grouped hooks, scroll buttons, scroll mutation, popper
  placement, custom tokens, hidden form value, and reset behavior.

## Decision

The Select example cluster is not resolved yet. RadCN has the core package
behavior needed for both upstream examples, and no mandatory React, Radix,
`lucide-react`, Tailwind, `cn`, or vendor dependency was identified. The
missing proof is named parity depth: docs, candidate fixtures, and Playwright
should render and test `select-demo` and `select-scrollable` with exact
placeholder copy, fruit/timezone option sets, group labels, trigger width
evidence, scrollable timezone behavior, selection behavior, public hooks, and
mapping copy.
