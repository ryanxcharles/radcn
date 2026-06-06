# Native Select Example Inventory

This audit maps the active upstream shadcn/ui New York v4 Native Select example
cluster to current RadCN evidence. It covers only the examples named by
`parity-inventory.md` for the `native-select` cluster:

- `native-select-demo`
- `native-select-disabled`
- `native-select-groups`
- `native-select-invalid`

Adjacent upstream references such as `native-select-rtl` and
`native-select-example` are noted as out of the current generated cluster.

## Sources

- Upstream component:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/native-select.tsx`
- Upstream examples:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/native-select-demo.tsx`,
  `native-select-disabled.tsx`, `native-select-groups.tsx`, and
  `native-select-invalid.tsx`
- Upstream public registry JSON:
  `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/native-select-demo.json`,
  `native-select-disabled.json`, `native-select-groups.json`, and
  `native-select-invalid.json`
- RadCN package:
  `radcn/packages/radcn/src/components/native-select.tsx`
- RadCN styles:
  `radcn/packages/radcn/src/styles/tokens.css`
- RadCN docs:
  `radcn/apps/docs/app/content/components.tsx` and
  `radcn/apps/docs/tests/coverage.spec.ts`
- RadCN fixtures:
  `radcn/fixtures/scenarios/index.ts`,
  `radcn/fixtures/candidate-remix/app/fixtures/native-select.tsx`,
  `radcn/fixtures/reference-react-router/app/fixtures/native-select.tsx`, and
  `radcn/fixtures/tests/native-select.spec.ts`

## Mapping Rules

- Upstream `NativeSelect` maps to RadCN `NativeSelect`, which renders a real
  `<select>` inside a `data-radcn-native-select-wrapper` wrapper.
- Upstream `NativeSelectOption` maps to RadCN `NativeSelectOption`, which
  renders a real `<option>`.
- Upstream `NativeSelectOptGroup` maps to RadCN `NativeSelectOptGroup`, which
  renders a real `<optgroup>`.
- Upstream React `className` maps to RadCN `class` on wrapper/option/optgroup
  props.
- Upstream `size="sm"` maps to RadCN `size="sm"` and the default omitted size
  maps to `size="default"`.
- Upstream `aria-invalid="true"` maps to RadCN `ariaInvalid`.
- Upstream `disabled` maps directly to RadCN `disabled`.
- Upstream `data-slot` names map to RadCN public `data-radcn-*` hooks and
  stable class names, not literal DOM equality.
- Upstream `ChevronDownIcon` from `lucide-react` maps to RadCN's decorative
  `aria-hidden` icon span. A future visual pass may replace the glyph, but the
  component must not take a dependency on `lucide-react`.
- Upstream Tailwind utilities map to RadCN CSS variables, stable classes, and
  generated package CSS.
- Upstream option and optgroup Canvas colors map to RadCN
  `.radcn-native-select-option` and `.radcn-native-select-optgroup` styles
  using `Canvas` and `CanvasText`.
- Browser-native popup rendering is intentionally browser-owned; parity is
  measured by native select semantics, value behavior, accessibility hooks, and
  closed-control styling, not by forcing identical option popup chrome.
- Vendor source is reference material only and must not become a runtime or
  package dependency.

## Current RadCN Evidence

- Package exports `NativeSelect`, `NativeSelectOption`, `NativeSelectOptGroup`,
  and their public prop types from `radcn/packages/radcn/src/index.ts`.
- `NativeSelect` supports `id`, `name`, `disabled`, `required`, `ariaInvalid`,
  `ariaDescribedBy`, `size`, `class`, `style`, and children.
- `NativeSelectOption` supports `value`, `selected`, `disabled`, `class`, and
  children.
- `NativeSelectOptGroup` supports `label`, `disabled`, `class`, and children.
- Package markup exposes `data-radcn-native-select-wrapper`,
  `data-radcn-native-select`, `data-radcn-native-select-icon`,
  `data-radcn-native-select-option`, and
  `data-radcn-native-select-optgroup`.
- Source CSS covers wrapper layout, default and small sizes, appearance reset,
  focus-visible ring, disabled opacity/cursor, invalid border/ring, decorative
  icon positioning, option/optgroup Canvas colors, and custom CSS variables.
- Docs registry includes a `native-select` page and preview hook
  `[data-radcn-native-select-wrapper]`.
- Candidate fixtures include default, groups, disabled, invalid, sizes,
  custom-token, form-submit-reset, and required-validation routes.
- Reference React Router fixtures mirror the same scenario family for visual
  and behavior comparisons.
- Playwright coverage verifies wrapper/select hooks, labels, option count,
  optgroup label, disabled state, invalid ARIA/describedby, size classes,
  custom token CSS, native select value changes, form reset, GET submission,
  and required constraint validation.

## Examples

| Example | User-facing behavior | Upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- | --- |
| `native-select-demo` | A default native select offers an empty prompt plus `Todo`, `In Progress`, `Done`, and `Cancelled` status options. | Uses `NativeSelect` with four `NativeSelectOption` values and no React state. | Docs render `data-radcn-docs-native-select-family="native-select-demo"` with the full status option set. Candidate `demo` fixture and Playwright prove the prompt, four options, native value selection, wrapper/select/option hooks, label association, and decorative icon. | Covered | None. |
| `native-select-disabled` | A native select is disabled and offers a priority option set. | Uses `NativeSelect disabled` and priority options. | Docs render `data-radcn-docs-native-select-family="native-select-disabled"` with the full priority option set. Candidate `disabled-upstream` fixture and Playwright prove disabled state plus `Low`, `Medium`, `High`, and `Critical`. | Covered | None. |
| `native-select-groups` | A native select groups department options under Engineering, Sales, and Operations. | Uses `NativeSelectOptGroup` and grouped `NativeSelectOption` children. | Docs render `data-radcn-docs-native-select-family="native-select-groups"` with the complete grouped department composition. Candidate `groups-upstream` fixture and Playwright prove Engineering, Sales, and Operations optgroups plus all upstream option labels. | Covered | None. |
| `native-select-invalid` | A native select has invalid ARIA state for role choices. | Uses `NativeSelect aria-invalid="true"` and role options. | Docs render `data-radcn-docs-native-select-family="native-select-invalid"` with invalid state and the full role option set. Candidate `invalid-upstream` fixture and Playwright prove `aria-invalid`, `aria-describedby`, FieldError composition, and `Admin`, `Editor`, `Viewer`, and `Guest`. | Covered | None. |

## Coverage Notes

- Native Select-owned primitive behavior is already strong. The package uses
  real browser-native select, option, and optgroup elements, so keyboard,
  pointer, popup, value, form, reset, and constraint-validation behavior remain
  browser-owned.
- Named example parity depth is now covered by docs examples, candidate
  fixtures, and Playwright assertions for all four upstream example ids.
- The decorative icon is intentionally dependency-free today. Exact
  `ChevronDownIcon` path parity is not required for Native Select behavior, but
  visual parity can be revisited when the icon strategy is audited broadly.
- `native-select-rtl` is not in the active generated cluster. Direction/RTL
  behavior should be handled only if a later inventory recommends it or a
  broader direction issue requires it.

## Decision

`native-select` is resolved for the active four-example cluster. The package API
did not need to change; the solution was named docs, fixture, and Playwright
evidence for complete upstream option sets and state examples.
