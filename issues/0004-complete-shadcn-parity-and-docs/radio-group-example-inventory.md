# Radio Group Example Inventory

## Summary

Upstream shadcn/ui New York v4 has one direct Radio Group example:
`radio-group-demo`.

RadCN ships strong Radio Group substrate and named `radio-group-demo` parity
evidence: dependency-free native radio inputs, a radiogroup wrapper, checked
and unchecked state hooks, disabled and invalid state support, form submission/
reset behavior, custom-token fixtures, named docs, candidate fixture, and
Playwright coverage.

The direct upstream example is covered. The named docs and candidate fixture
render the exact `Default`, `Comfortable`, and `Compact` rows with ids `r1`,
`r2`, and `r3`, values `default`, `comfortable`, and `compact`, `comfortable`
checked by default, associated labels, row layout evidence, and native
selection behavior. Existing fixtures continue to prove disabled, invalid,
form, and custom-token modifiability evidence.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `radio-group-demo` | Renders `RadioGroup defaultValue="comfortable"` with three rows using `className="flex items-center gap-3"`. The rows contain `RadioGroupItem value="default" id="r1"` with `Label htmlFor="r1"` text `Default`, `RadioGroupItem value="comfortable" id="r2"` with `Label htmlFor="r2"` text `Comfortable`, and `RadioGroupItem value="compact" id="r3"` with `Label htmlFor="r3"` text `Compact`. Upstream package mechanics include `"use client"`, React component props, Radix Radio Group primitive, `RadioGroupPrimitive.Root`, `RadioGroupPrimitive.Item`, `RadioGroupPrimitive.Indicator`, lucide `CircleIcon`, `className`, Tailwind utilities, `cn`, `data-slot`, checked/default state, disabled/invalid styling, browser radio behavior, custom tokens, Label composition, and vendor source. | `radcn/packages/radcn/src/components/radio-group.tsx` exports dependency-free `RadioGroup` and `RadioGroupItem`. It renders a `role="radiogroup"` wrapper with public group hooks and native radio inputs inside item wrappers with checked/unchecked data-state, disabled, invalid, required, name, value, id, indicator, and native browser selection behavior. `radcn/packages/radcn/src/index.ts` exports the API and `radcn/packages/radcn/package.json` has no React, Radix, lucide, Tailwind, or `class-variance-authority` dependency. Package CSS in `radcn/packages/radcn/src/styles/tokens.css` provides radio group, item, input, indicator, checked, disabled, invalid, and custom-token hooks. `radcn/apps/docs/app/content/components.tsx` now ships a named `radio-group-demo` rich example, exact source snippet, ids `r1`/`r2`/`r3`, values `default`/`comfortable`/`compact`, checked `comfortable` item, associated Label composition, row layout evidence, and mapping copy for React/Radix/lucide/Tailwind/`cn`/`className`/`data-slot` divergences. `radcn/apps/docs/tests/coverage.spec.ts` verifies the named docs family hook, radiogroup role, group/item/input/indicator hooks, labels, ids, values, checked default, row layout, native selection behavior, source snippet, and mapping copy. `radcn/fixtures/scenarios/index.ts` lists a named `demo` Radio Group scenario plus existing default, disabled, invalid, custom-token, and form-submit-reset scenarios. `radcn/fixtures/candidate-remix/app/fixtures/native-state.tsx` renders `radio-group/demo` with the exact upstream three-option composition. `radcn/fixtures/tests/native-state.spec.ts` verifies the named route, radiogroup role, public hooks, exact labels, ids, values, checked `comfortable` item, label associations, row layout, native selection behavior, and preserves existing disabled, invalid, form, and custom-token coverage. | Covered | No follow-up for this direct example. |

## Decisions

- `"use client"`: not required. RadCN Radio Group renders native radio markup
  that works without React.
- React component props: map to explicit Remix UI props on `RadioGroup` and
  `RadioGroupItem`.
- Radix Radio Group primitive: not a dependency. Radix root, item, and
  indicator behavior maps to RadCN wrapper, native inputs, item wrappers, and
  public data hooks.
- `RadioGroupPrimitive.Root`: maps to `data-radcn-radio-group` with
  `role="radiogroup"`, shared `name`, and native input children.
- `RadioGroupPrimitive.Item`: maps to `RadioGroupItem`, which renders a native
  radio input inside a styled item wrapper.
- `RadioGroupPrimitive.Indicator`: maps to `data-radcn-radio-indicator`.
- lucide `CircleIcon`: maps to CSS indicator presentation; lucide is not a
  RadCN dependency.
- `defaultValue="comfortable"`: maps to the `comfortable` radio item being
  checked in server-rendered markup.
- ids `r1`, `r2`, and `r3`: are preserved in named docs and fixture demos with
  exact label associations.
- values `default`, `comfortable`, and `compact`: are preserved in named docs
  and fixture demos.
- Labels `Default`, `Comfortable`, and `Compact`: are preserved exactly.
- Row layout: upstream `flex items-center gap-3` maps to class/style/CSS
  evidence in the named docs and fixture demos.
- `className`: maps to `class`.
- Tailwind utilities: map to package CSS, classes, CSS variables, inline
  styles, and app-owned styles rather than a Tailwind dependency.
- `cn`: not needed as a package dependency; class composition is explicit.
- `data-slot`: maps to RadCN public `data-radcn-radio*` hooks.
- Checked/default state: current package uses native checked radio inputs and
  wrapper data-state hooks.
- Disabled/invalid behavior: existing fixtures cover disabled and invalid
  radio states and should remain intact.
- Browser radio behavior: existing tests cover native checking and unchecking
  across a group; named demo should add exact upstream option coverage.
- Custom tokens: existing custom-token fixture and CSS evidence should remain
  intact when the named demo is added.
- Label composition: upstream `Label htmlFor` maps to RadCN `Label for` or
  equivalent native label associations.
- Vendor source: the upstream references are
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/radio-group-demo.tsx`
  and `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/radio-group.tsx`.
