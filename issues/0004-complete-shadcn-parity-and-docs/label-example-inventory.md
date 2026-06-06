# Label Example Inventory

## Summary

Upstream shadcn/ui New York v4 exposes one direct Label example through the
examples registry by filename/inferred-cluster ownership: `label-demo`. The registry entry has
`type: "registry:example"`, `registryDependencies: ["label"]`, and file path
`examples/label-demo.tsx`.

Several other upstream examples include `label` in `registryDependencies`, but
their primary example clusters are `input`, `textarea`, `dropdown-menu`,
`card`, `kbd`, or `input-group`. They are not direct rows for this Label
example inventory.

RadCN ships `radcn/label` as a dependency-free native label primitive with
package exports, `for` wiring, disabled state, package classes, public hooks,
and broad composition evidence through forms, inputs, checkboxes, dialogs,
drawers, sheets, and input groups. Experiment 96 added named `label-demo`
coverage on the Label docs page and candidate fixture route, proving the exact
Checkbox/Label composition, layout evidence, public hooks, native click
activation, and React/Radix/Tailwind mapping copy.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `label-demo` | Renders a React client component using shadcn `Checkbox` and `Label`. The example has a wrapper `div`, an inner `div className="flex items-center space-x-2"`, `Checkbox id="terms"`, `Label htmlFor="terms"`, and visible text `Accept terms and conditions`. The upstream Label package is a `"use client"` wrapper around Radix LabelPrimitive Root, emits `data-slot="label"`, and maps `className` through `cn` over Tailwind classes `flex`, `items-center`, `gap-2`, `text-sm`, `leading-none`, `font-medium`, `select-none`, `group-data-[disabled=true]:pointer-events-none`, `group-data-[disabled=true]:opacity-50`, `peer-disabled:cursor-not-allowed`, and `peer-disabled:opacity-50`. | `radcn/packages/radcn/src/components/label.tsx` exports `Label` as native `<label>` markup with `for`, `disabled`, `class`, `style`, `data-disabled`, and `data-radcn-label`. `radcn/packages/radcn/src/components/checkbox.tsx` provides the native checkbox primitive needed for the upstream composition. `radcn/apps/docs/app/content/components.tsx` now renders a named `label-demo` rich docs example with `Checkbox id="terms"`, `Label for="terms"`, exact visible text, flex/center/8px spacing evidence, public Label and Checkbox hooks, source snippet, and required React/Radix/`htmlFor`/`className`/Tailwind/`cn`/`data-slot`/disabled-state/vendor mapping copy. `radcn/apps/docs/tests/coverage.spec.ts` verifies the named Label page demo, layout, hooks, id/for association, text, native label click activation, and mapping copy. `radcn/fixtures/scenarios/index.ts`, `radcn/fixtures/candidate-remix/app/fixtures/native-state.tsx`, and `radcn/fixtures/tests/native-state.spec.ts` add and verify `/fixtures/label/demo` with the exact upstream composition and native activation. Package code did not need changes. | Covered | None. |

## Decisions

- `label-demo` is a direct upstream example because `_registry.ts` registers it
  as `type: "registry:example"` with name prefix `label-` and
  `registryDependencies: ["label"]`.
- Other examples that depend on `label` are handled by their own primary
  filename/inferred clusters and are intentionally not counted as direct Label
  rows here.
- React client component mechanics map to server-rendered native label and
  checkbox markup. No React dependency is needed.
- Radix Label remains a non-dependency. Native `<label for>` semantics provide
  the user-facing association and click activation.
- Upstream `htmlFor` maps to RadCN's `for` prop because Remix UI emits native
  attributes rather than React DOM prop names.
- Upstream `Checkbox id="terms"` maps to the existing RadCN Checkbox primitive
  with a stable id and native input semantics.
- Upstream `Label htmlFor="terms"` maps to `Label for="terms"` and native
  label activation.
- Upstream wrapper `flex items-center space-x-2` maps to app-owned class/style
  layout around RadCN primitives.
- Upstream Label's package-owned `flex`, `items-center`, `gap-2`, `text-sm`,
  `leading-none`, `font-medium`, and `select-none` styling maps to RadCN
  package typography/disabled CSS plus explicit app-owned row layout. No
  package styling change was needed for `label-demo`.
- Upstream `group-data-[disabled=true]` and `peer-disabled` behavior maps to
  RadCN's explicit `disabled` prop, `data-disabled`, native disabled controls,
  and app-owned composition. The Label docs now record this divergence.
- Upstream `className`, Tailwind utilities, `cn`, and `data-slot` map to
  RadCN `class`, style, CSS variables, package classes, and public
  `data-radcn-label` / `data-radcn-checkbox-*` hooks.
- Exact named `label-demo` parity is covered by named Label docs, a candidate
  fixture route, and Playwright evidence.
- vendor source remains read-only evidence and should not be imported or
  committed into RadCN.
