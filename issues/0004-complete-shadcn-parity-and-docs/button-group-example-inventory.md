# ButtonGroup Example Inventory

Generated during Experiment 13 on 2026-06-05.

## Sources

- Upstream registry:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
- Upstream examples:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/button-group-*.tsx`
- Upstream package:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/button-group.tsx`
- RadCN packages:
  `radcn/packages/radcn/src/components/button-group.tsx`
  `radcn/packages/radcn/src/components/button.tsx`
  `radcn/packages/radcn/src/components/input.tsx`
  `radcn/packages/radcn/src/components/input-group.tsx`
  `radcn/packages/radcn/src/components/select.tsx`
  `radcn/packages/radcn/src/components/dropdown-menu.tsx`
  `radcn/packages/radcn/src/components/popover.tsx`
- RadCN docs:
  `radcn/apps/docs/app/content/components.tsx`
- RadCN fixtures:
  `radcn/fixtures/scenarios/index.ts`
  `radcn/fixtures/candidate-remix/app/fixtures/navigation-collection.tsx`
  `radcn/fixtures/tests/navigation-collection.spec.ts`

## Summary

ButtonGroup example parity is not complete yet. RadCN currently exports
`ButtonGroup`, `ButtonGroupText`, and `ButtonGroupSeparator`, and the current
fixtures prove horizontal orientation, vertical orientation, and separator/text
hooks. That covers the base package API but not the full upstream example
surface.

The missing ButtonGroup parity depth is:

- nested ButtonGroups that preserve spacing between grouped clusters;
- split button composition with separator and icon-sized secondary actions;
- size examples across small, default, large, and icon sizes;
- input composition inside ButtonGroup;
- InputGroup composition nested inside ButtonGroup;
- Select composition with a submitted value and grouped action button;
- DropdownMenu and Popover compositions using explicit RadCN trigger props
  instead of shadcn's React-only `asChild`;
- a larger toolbar/demo composition that combines nested groups, dropdown
  menus, destructive actions, and app-owned selected state;
- documented mappings for upstream React `useState` examples to Remix 3
  server/default state or dependency-free browser enhancement.

Do not mark the `button-group` example cluster resolved yet. The next
experiment should implement ButtonGroup example parity depth.

## Example Map

| Upstream id | User-facing behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `button-group-demo` | Mail-style toolbar with nested ButtonGroups, icon-only back action, archive/report/snooze actions, dropdown menu, radio label selection, submenu, and destructive action. | RadCN has ButtonGroup, Button, DropdownMenu, and radio-menu primitives, but docs/fixtures do not prove a multi-cluster toolbar or app-owned selected label behavior. | Partial | Add toolbar docs/fixture proof using nested groups, dropdown menu, radio items, destructive action, and explicit Remix state/default mapping. |
| `button-group-dropdown` | Split follow button with adjacent dropdown trigger and menu actions. | RadCN has ButtonGroup and DropdownMenu package APIs, but current ButtonGroup fixture does not cover dropdown composition or explicit trigger mapping. | Partial | Add dropdown split-button fixture/docs proof with a RadCN trigger button and menu actions. |
| `button-group-input` | Search input grouped with an icon action button. | RadCN has Input and ButtonGroup, but current ButtonGroup fixtures do not place an Input inside the group or prove input flex/rounded behavior. | Missing | Add input-in-group fixture/docs proof and any needed style adjustment for input stretching and shared borders. |
| `button-group-input-group` | Rounded ButtonGroup containing a plus icon group and an InputGroup with voice-mode toggle, tooltip, active state, disabled input, and React state. | RadCN has ButtonGroup, InputGroup, Tooltip, and Button primitives, but no ButtonGroup fixture/docs proof for nested InputGroup or app-owned active state. | Partial | Map React `useState` voice mode to server/default state or dependency-free enhancement; add nested InputGroup proof. |
| `button-group-nested` | Pagination-style nested ButtonGroups: numbered buttons plus previous/next icon buttons with spacing between child groups. | RadCN supports nested ButtonGroup markup, but no docs/fixture/test prove nested group spacing or icon-sized navigation actions. | Partial | Add nested groups fixture/docs proof and verify nested groups keep visible spacing while inner buttons remain joined. |
| `button-group-orientation` | Vertical icon button group with accessible group label and plus/minus controls. | Current fixture `button-group/vertical` proves `orientation="vertical"` and class hooks, but it does not prove group labeling or icon-only controls. | Partial | Add accessible vertical icon-group proof or expand existing fixture/test. |
| `button-group-popover` | Split Copilot button with popover trigger, popover content, separator, textarea, and explanatory copy. | RadCN has Popover, Separator, Textarea, Button, and ButtonGroup, but no ButtonGroup proof composes them together. | Partial | Add popover split-button fixture/docs proof using explicit `PopoverTrigger` behavior instead of `asChild`. |
| `button-group-select` | Currency select, numeric input, and send icon button arranged as grouped controls; selected currency is React state. | RadCN has Select, Input, Button, and ButtonGroup, but current ButtonGroup fixtures do not prove select composition or selected-value mapping. | Partial | Map React controlled select state to RadCN default/hidden-input value and add select/input/action proof. |
| `button-group-separator` | Secondary Copy/Paste buttons separated by ButtonGroupSeparator. | Current fixture `button-group/with-separator` proves `ButtonGroupSeparator` and `ButtonGroupText`, but not the exact two-button separator-only pattern. | Partial | Add separator-only copy/paste proof or treat as covered after testing exact public behavior. |
| `button-group-size` | Three groups showing small/default/large button and icon size combinations. | Button sizes were completed in Experiment 10, but ButtonGroup docs/fixtures do not prove grouped small/default/large sizing. | Partial | Add size matrix fixture/docs proof using `sm`, default, `lg`, `icon-sm`, `icon`, and `icon-lg`. |
| `button-group-split` | Secondary split button with main action, separator, and icon secondary action. | Current separator fixture has a text slot and publish action, not a split button with icon secondary action. | Partial | Add split-button proof with secondary variant, separator, icon-sized action, and accessible label. |

## Mapping Decisions

- RadCN should not port shadcn's `asChild` trigger pattern. ButtonGroup examples
  should use explicit RadCN trigger parts and Button props, matching earlier
  `href` and trigger mapping decisions.
- React `useState` in the upstream demo, input-group, and select examples is
  not a ButtonGroup package requirement. RadCN should map those examples to
  server-provided defaults, native submitted values, route state, or a small
  dependency-free browser enhancement when live interaction is the user-facing
  behavior.
- Icon packages are presentation details. ButtonGroup parity should verify
  accessible icon-only controls and visible icon/text composition without making
  a specific upstream icon package a dependency.
- ButtonGroup should remain a layout primitive. It should compose existing
  Button, Input, InputGroup, Select, DropdownMenu, Popover, Separator, Textarea,
  and Tooltip APIs rather than owning their state.
- Nested ButtonGroups are an important package styling behavior: outer groups
  should provide spacing between child groups while inner groups keep joined
  controls.
- The audit should not assume DOM equivalence. The implementation target is
  equivalent visual grouping, accessibility, and author-facing modifiability.

## Next Recommendation

Implement ButtonGroup example parity depth:

- add docs and candidate fixtures for all 11 upstream ButtonGroup examples;
- add focused Playwright coverage for nested groups, split buttons, separators,
  orientation labels, size matrix, input/select/input-group composition,
  dropdown composition, and popover composition;
- update ButtonGroup styles if composition gaps appear;
- record intentional divergences for React state and `asChild`;
- then mark `button-group` resolved in `resolved-clusters.json` and regenerate
  `parity-inventory.md`.
