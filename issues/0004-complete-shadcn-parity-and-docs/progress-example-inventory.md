# Progress Example Inventory

## Summary

Upstream shadcn/ui New York v4 has one direct Progress example:
`progress-demo`.

RadCN ships strong Progress substrate and named `progress-demo` parity
evidence: a dependency-free `Progress` export, native `<progress>` semantics,
determinate and indeterminate states, wrapper, track, and indicator hooks,
indicator width styling, scoped browser behavior, named docs, candidate
fixtures, custom-token evidence, and Playwright coverage.

The direct upstream example is covered. The named docs and candidate fixture
render value `13` with `class="w-[60%]"` and explicit 60% width, then scoped
browser enhancement updates the native progress value and visual indicator to
`66` after 500ms. Existing fixtures continue to prove default determinate,
indeterminate, and custom-token modifiability evidence.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `progress-demo` | Renders `Progress value={progress} className="w-[60%]"`. The upstream demo is `"use client"` and uses React `useState(13)`, `useEffect`, and a 500ms timeout that updates the value to `66`. Upstream package mechanics include React component props, Radix Progress primitive, `ProgressPrimitive.Root`, `ProgressPrimitive.Indicator`, `className`, Tailwind utilities, `cn`, `data-slot`, `bg-primary/20`, `bg-primary`, `transition-all`, determinate progress state, indicator `transform: translateX(-${100 - value}%)`, browser behavior, custom tokens, and vendor source. | `radcn/packages/radcn/src/components/progress.tsx` exports dependency-free `Progress` with `ariaLabel`, `class`, `max`, `style`, and `value` props. It renders a wrapper with `data-radcn-progress-wrapper`, a native `<progress data-radcn-progress>`, track and indicator hooks, `data-state="determinate"` or `indeterminate`, and indicator `width:${percent}%`. `radcn/packages/radcn/src/index.ts` exports the API and `radcn/packages/radcn/package.json` has no React, Radix, Tailwind, or `class-variance-authority` dependency. Package CSS in `radcn/packages/radcn/src/styles/tokens.css` provides wrapper, native progress, track, indicator, transition, indeterminate animation, and custom-token hooks. `radcn/apps/docs/app/content/components.tsx` now ships a named `progress-demo` rich example, exact source snippet, value `13`, class `w-[60%]`, explicit 60% width, and mapping copy for React/Radix/state/timer/Tailwind/`cn`/`className`/`data-slot`/transform divergences. `radcn/apps/docs/app/assets/entry.ts` enhances the named docs demo from `13` to `66` after 500ms. `radcn/apps/docs/tests/coverage.spec.ts` verifies the named docs family hook, native progress attributes, wrapper/track/indicator hooks, initial value/indicator width, delayed value/indicator width, 60% width mapping, source snippet, and mapping copy. `radcn/fixtures/scenarios/index.ts` lists a named `demo` Progress scenario plus existing default, indeterminate, and custom-token scenarios. `radcn/fixtures/candidate-remix/app/fixtures/native-state.tsx` renders `progress/demo` with the exact upstream timed composition. `radcn/fixtures/candidate-remix/app/assets/entry.ts` enhances the named candidate demo from `13` to `66` after 500ms. `radcn/fixtures/tests/native-state.spec.ts` verifies the named route, accessible label, native `max`/`value`, determinate state, wrapper/track/indicator hooks, 60% width, initial 13% indicator width, delayed 66% indicator width, and preserves existing default, indeterminate, and custom-token coverage. | Covered | No follow-up for this direct example. |

## Decisions

- `"use client"`: not required as a package mechanic. RadCN should preserve the
  user-facing timed browser behavior with app-owned or docs-owned enhancement
  rather than React.
- React `useState` and React `useEffect`: not dependencies. The upstream
  initial state `13`, 500ms timer, and final state `66` are user-facing
  behavior that should be represented in the named docs and fixture demos.
- React component props: map to explicit Remix UI props on `Progress`.
- Radix Progress primitive: not a dependency. Radix root/indicator behavior
  maps to RadCN wrapper, native `<progress>`, track, indicator, and data hooks.
- `ProgressPrimitive.Root`: maps to the RadCN wrapper plus native progress
  element; literal Radix DOM is not required.
- `ProgressPrimitive.Indicator`: maps to `data-radcn-progress-indicator`.
- `className`: maps to `class`.
- `w-[60%]`: maps to explicit 60% wrapper width through class/style evidence
  in the named docs and fixture demos.
- Tailwind utilities: map to package CSS, classes, CSS variables, inline
  styles, and app-owned styles rather than a Tailwind dependency.
- `cn`: not needed as a package dependency; class composition is explicit.
- `data-slot`: maps to RadCN public `data-radcn-progress*` hooks.
- `bg-primary/20` and `bg-primary`: map to `--radcn-progress-bg`,
  `--radcn-progress-fg`, and package token defaults.
- `transition-all`: maps to package indicator transition. Exact Tailwind class
  parity is not required.
- Indicator transform: upstream translates a full-width indicator from
  `-87%` to `-34%`. RadCN uses indicator width `13%` to `66%`, preserving
  visible progress percentage parity and public hooks without literal transform
  style equivalence.
- Native `<progress>` mapping: RadCN should retain native progress semantics
  with `max`, `value`, and accessible labeling.
- Browser behavior: the exact timed value change is covered in docs and
  candidate fixture enhancement without React.
- Custom tokens: existing custom-token fixture and CSS evidence should remain
  intact when the named demo is added.
- Vendor source: the upstream references are
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/progress-demo.tsx`
  and `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/progress.tsx`.
