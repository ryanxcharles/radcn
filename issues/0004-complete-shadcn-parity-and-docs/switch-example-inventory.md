# Switch Example Inventory

## Summary

Upstream shadcn/ui New York v4 has one direct Switch example, `switch-demo`.
RadCN already has strong native checkbox-backed switch substrate and fixture
coverage for role switch semantics, checked/unchecked state, disabled state,
form submit/reset behavior, small/default sizing, custom tokens, wrapper/input/
thumb hooks, and label wiring through related generic fixtures.

The current outcome is `Partial`. The next experiment should add named
`switch-demo` parity across the docs page, candidate fixture route, and
Playwright coverage before marking Switch resolved.

Current RadCN evidence compared in this audit:

- `radcn/packages/radcn/src/components/switch.tsx` exports the package
  component and props, renders a native checkbox input with `role="switch"`,
  exposes wrapper/input/thumb hooks, records `data-state`, `data-size`,
  `data-disabled`, and `data-invalid`, and supports `checked`, `disabled`,
  `id`, `name`, `required`, `size`, `class`, `style`, and `value`.
- `radcn/packages/radcn/src/components/label.tsx` exports Label and native
  `for` wiring used to map upstream `Label htmlFor`.
- `radcn/packages/radcn/src/styles/tokens.css` defines
  `.radcn-switch-wrapper`, `.radcn-switch-input`, `.radcn-switch-thumb`,
  focus-visible, checked, unchecked, disabled, invalid, size, thumb transform,
  and custom switch token styling.
- `radcn/packages/radcn/src/index.ts` re-exports Switch and Switch types.
- `radcn/packages/radcn/package.json` exposes the `./switch` package subpath.
- `radcn/apps/docs/app/content/components.tsx` includes the generic Switch
  docs route and preview seed, but not a named `switch-demo`.
- `radcn/apps/docs/tests/coverage.spec.ts` checks only generic docs hook
  presence for `[data-radcn-switch-wrapper]`, not named `switch-demo` parity.
- `radcn/fixtures/scenarios/index.ts` lists generic Switch scenarios for
  default, checked, disabled, custom-token, and form-submit-reset.
- `radcn/fixtures/candidate-remix/app/fixtures/native-state.tsx` renders those
  generic Switch fixture scenarios through `renderSwitchFixture`, but not a
  named `demo` route.
- `radcn/fixtures/tests/native-state.spec.ts` asserts Switch role checkbox
  semantics, label association for generic `Available` examples, unchecked and
  checked state, disabled state, form submit/reset behavior, and custom-token
  behavior.
- `radcn/fixtures/tests/native-controls.spec.ts` has related Field Switch
  composition evidence for a labelled switch inside Field, but not direct
  `switch-demo` evidence.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `switch-demo` | Renders a row `<div className="flex items-center space-x-2">` with `<Switch id="airplane-mode" />` followed by `<Label htmlFor="airplane-mode">Airplane Mode</Label>`. Upstream package mechanics include `"use client"`, React props, `React.ComponentProps<typeof SwitchPrimitive.Root>`, Radix Switch primitive, `SwitchPrimitive.Root`, `SwitchPrimitive.Thumb`, default `size = "default"`, `data-slot="switch"`, `data-slot="switch-thumb"`, `data-size`, `className`, Tailwind utilities, `cn`, checked/unchecked `data-state`, disabled styling, focus styling, thumb translation, `Label htmlFor`, native switch accessibility through Radix, custom tokens, and vendor source. | RadCN exports a dependency-free `Switch` backed by a native checkbox input with `role="switch"`. It accepts explicit props for checked, disabled, id, name, required, size, class, style, and value; emits wrapper/input/thumb hooks; records checked/unchecked state and size metadata; maps Label `htmlFor` to Label `for`; and uses package CSS for focus, disabled, checked, unchecked, and thumb transform behavior. Current fixture tests prove generic label association, unchecked/checked state, browser check behavior, disabled behavior, form submit/reset behavior, size `sm`, and custom tokens. Current docs have only generic Switch route/preview evidence, `renderSwitchFixture` has no named `demo` route, and no current docs or Playwright evidence proves the exact upstream `airplane-mode` id, `Airplane Mode` label text, row layout, source snippet, or React/Radix/Tailwind divergence copy. | Partial | Add named `switch-demo` docs, candidate fixture, and Playwright evidence. The implementation should preserve id `airplane-mode`, label text `Airplane Mode`, default unchecked state, default size, row layout mapping for `flex items-center space-x-2`, public wrapper/input/thumb hooks, role switch accessibility, browser check behavior, checked/unchecked state metadata, source snippet, and mapping copy for React props, `React.ComponentProps`, Radix Switch primitives, `size`, className/Tailwind/cn/data-slot divergences, Label htmlFor to for, custom tokens, and vendor source. |

## Decisions

- React non-dependency: RadCN should not import React or
  `React.ComponentProps<typeof SwitchPrimitive.Root>`. The equivalent
  author-facing surface is explicit Remix UI props and browser-native checkbox
  switch behavior.
- Radix non-dependency: RadCN should not import `radix-ui` or
  `SwitchPrimitive.*`. Radix Root maps to the RadCN switch wrapper plus native
  input; Radix Thumb maps to `data-radcn-switch-thumb`.
- Upstream `<Switch id="airplane-mode" />` maps to RadCN `Switch` with the
  same id and default unchecked state. The native checkbox input is the
  accessible switch control.
- Upstream `<Label htmlFor="airplane-mode">Airplane Mode</Label>` maps to
  RadCN `Label for="airplane-mode">Airplane Mode</Label>` while preserving
  browser label activation and accessible naming.
- Upstream `flex items-center space-x-2` row layout should map to explicit
  class and style evidence on a wrapper: display flex, align-items center, and
  0.5rem gap.
- Upstream default `size = "default"` maps to RadCN `size="default"`,
  `data-size="default"`, and default wrapper/thumb dimensions.
- Upstream `data-slot` maps to public `data-radcn-switch-wrapper`,
  `data-radcn-switch-input`, and `data-radcn-switch-thumb` hooks.
- Upstream checked/unchecked `data-state` maps to RadCN wrapper and input
  `data-state` plus native checkbox checked state.
- Tailwind peer, group, inline-flex, shrink, item alignment, rounded, border,
  shadow, transition, outline, focus-visible, disabled, size, checked/
  unchecked background, and thumb translation utilities map to package CSS,
  classes, style, CSS variables, and app-owned CSS.
- Browser switch behavior is behavior-level parity, not literal Radix DOM
  equality: the native input owns checked state, keyboard activation, form
  submission, disabled behavior, reset behavior, and label activation.
- Custom tokens map through Switch CSS variables and are already covered by
  `radcn-fixture-custom-switch`.
- Vendor source remains a reference only. The next implementation should not
  commit vendored shadcn source or add runtime dependencies on React, Radix, or
  Tailwind.
