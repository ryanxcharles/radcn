# Progress Example Inventory

## Summary

Upstream shadcn/ui New York v4 has one direct Progress example:
`progress-demo`.

RadCN ships strong Progress substrate: a dependency-free `Progress` export,
native `<progress>` semantics, determinate and indeterminate states, wrapper,
track, and indicator hooks, indicator width styling, generic docs coverage,
candidate fixtures, custom-token evidence, and Playwright coverage.

The direct upstream example is partial. Current evidence proves general
Progress behavior and modifiability, but it does not prove a named
`progress-demo` docs/fixture/test surface for the upstream timed value change
from `13` to `66` after 500ms or the `className="w-[60%]"` width mapping.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `progress-demo` | Renders `Progress value={progress} className="w-[60%]"`. The upstream demo is `"use client"` and uses React `useState(13)`, `useEffect`, and a 500ms timeout that updates the value to `66`. Upstream package mechanics include React component props, Radix Progress primitive, `ProgressPrimitive.Root`, `ProgressPrimitive.Indicator`, `className`, Tailwind utilities, `cn`, `data-slot`, `bg-primary/20`, `bg-primary`, `transition-all`, determinate progress state, indicator `transform: translateX(-${100 - value}%)`, browser behavior, custom tokens, and vendor source. | `radcn/packages/radcn/src/components/progress.tsx` exports dependency-free `Progress` with `ariaLabel`, `class`, `max`, `style`, and `value` props. It renders a wrapper with `data-radcn-progress-wrapper`, a native `<progress data-radcn-progress>`, track and indicator hooks, `data-state="determinate"` or `indeterminate`, and indicator `width:${percent}%`. `radcn/packages/radcn/src/index.ts` exports the API and `radcn/packages/radcn/package.json` has no React, Radix, Tailwind, or `class-variance-authority` dependency. Package CSS in `radcn/packages/radcn/src/styles/tokens.css` provides wrapper, native progress, track, indicator, transition, indeterminate animation, and custom-token hooks. `radcn/apps/docs/app/content/components.tsx` currently renders generic Progress docs with `ariaLabel="Docs completion"` and value `72`, plus a source snippet, but no named `progress-demo`, no value `13`, no timed update to `66`, and no 60% width mapping. `radcn/apps/docs/tests/coverage.spec.ts` verifies general docs route coverage but not the exact upstream timed demo. `radcn/fixtures/scenarios/index.ts` lists `default`, `indeterminate`, and `custom-token` Progress scenarios. `radcn/fixtures/candidate-remix/app/fixtures/native-state.tsx` renders default value `48`, indeterminate state, and custom-token value `72`. `radcn/fixtures/tests/native-state.spec.ts` verifies native progress attributes, `data-state`, indicator width, indeterminate state, and custom-token colors, but not a named `progress/demo` route, initial `13`, delayed `66`, or 60% width. | Partial | Add named `progress-demo` docs and candidate fixture evidence. The next experiment should render value `13` initially, update to `66` after roughly 500ms with dependency-free browser behavior, map upstream `w-[60%]` to 60% wrapper width, verify native progress attributes, wrapper/track/indicator hooks, indicator width at 13% and 66%, source snippet, mapping copy, and preserve existing default, indeterminate, and custom-token coverage. |

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
- `w-[60%]`: should map to an explicit 60% wrapper width through class/style
  evidence in the named demo.
- Tailwind utilities: map to package CSS, classes, CSS variables, inline
  styles, and app-owned styles rather than a Tailwind dependency.
- `cn`: not needed as a package dependency; class composition is explicit.
- `data-slot`: maps to RadCN public `data-radcn-progress*` hooks.
- `bg-primary/20` and `bg-primary`: map to `--radcn-progress-bg`,
  `--radcn-progress-fg`, and package token defaults.
- `transition-all`: maps to package indicator transition. Exact Tailwind class
  parity is not required.
- Indicator transform: upstream translates a full-width indicator from
  `-87%` to `-34%`. RadCN uses indicator width `13%` to `66%`. The next
  experiment should verify visible progress percentage parity and public hooks,
  not literal transform style equivalence.
- Native `<progress>` mapping: RadCN should retain native progress semantics
  with `max`, `value`, and accessible labeling.
- Browser behavior: the exact timed value change is not yet covered and should
  be added without React.
- Custom tokens: existing custom-token fixture and CSS evidence should remain
  intact when the named demo is added.
- Vendor source: the upstream references are
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/progress-demo.tsx`
  and `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/progress.tsx`.
