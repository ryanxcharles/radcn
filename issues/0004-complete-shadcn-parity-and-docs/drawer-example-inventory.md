# Drawer Example Inventory

## Summary

Upstream shadcn/ui New York v4 has two active Drawer examples:
`drawer-demo` and `drawer-dialog`. RadCN already ships `radcn/drawer` with the
core modal edge-panel behavior needed for both examples, but current docs,
fixtures, and Playwright tests do not yet prove the named upstream example
compositions.

**Audit outcome:** Partial.

The next experiment should add named docs, candidate fixture routes, and
Playwright coverage for `drawer-demo` and `drawer-dialog`. The audit found no
mandatory Drawer package API change yet. React state, Vaul, `asChild`,
Recharts, `lucide-react`, Tailwind, `cn`, media-query hooks, chart engines,
form-state libraries, and vendor source remain non-dependencies unless a later
implementation pass discovers and records a concrete RadCN package gap.

## Examples

| Example | Upstream behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `drawer-demo` | Trigger styled as outline Button with text `Open Drawer`; bottom Drawer with handle; title `Move Goal`; description `Set your daily activity goal.`; centered max-width content; app-owned goal value initialized to `350`; minus/plus outline icon buttons with sr-only labels `Decrease`/`Increase`, min/max disabled states at 200/400, and 10-point increments; label `Calories/day`; Recharts bar chart with goal data; footer with `Submit` button and outline `Cancel` close action. | `radcn/drawer` supports root, trigger, portal, overlay, content, handle, header, footer, title, description, close action, modal ARIA, focus movement/trap/restoration, Escape/outside dismissal, scroll lock, default open, bottom direction, drag dismissal, public hooks, classes/styles/tokens, and app-owned Button composition. Existing fixtures use similar generic `Move goal` copy and Submit/Cancel actions, but do not render the named upstream trigger copy, daily-activity description, goal value/increment controls, min/max disabled policy, sr-only icon labels, Calories/day label, or chart visualization. | Partial | Add named docs and candidate fixture evidence for `drawer-demo`; cover trigger/title/description copy, handle, centered content width, goal display, decrement/increment controls, disabled min/max behavior or documented app-owned state mapping, chart visualization or intentional non-Recharts substitute, footer actions, close/focus behavior, public hooks, and mapping copy. |
| `drawer-dialog` | Responsive component that uses a Dialog branch on desktop and a Drawer branch on mobile; shared trigger text `Edit Profile`; shared title `Edit profile`; shared description `Make changes to your profile here. Click save when you're done.`; shared form with labelled email/username fields, defaults `shadcn@example.com` and `@shadcn`, and submit `Save changes`; mobile Drawer branch uses left-aligned header, padded form, footer with outline `Cancel` close action; desktop Dialog branch uses max-width content. | `radcn/drawer`, `radcn/dialog`, `radcn/input`, `radcn/label`, and `radcn/button` can compose this behavior. Existing Drawer tests prove generic Drawer behavior and prior Dialog experiments prove named Dialog form behavior, but there is no named `drawer-dialog` docs/fixture/test evidence for responsive branch selection, shared form content, mobile Drawer footer cancel, or desktop Dialog branch. | Partial | Add named docs and candidate fixture evidence for `drawer-dialog`; cover mobile Drawer branch, desktop Dialog branch or documented responsive test strategy, shared trigger/copy/form/default values, footer cancel close behavior, app-owned viewport branching, public hooks, and mapping copy. |

## Capability Mapping

| Surface | Decision |
| --- | --- |
| Drawer root, trigger, portal, overlay, content | Supported by `radcn/packages/radcn/src/components/drawer.tsx` with public `data-radcn-drawer*` hooks, package classes, `class`, and `style`. Existing candidate tests prove opening and portal movement. |
| Handle | Supported through `showHandle` and `data-radcn-drawer-handle`; existing candidate tests prove visibility and custom-token styling. |
| Header, footer, title, description | Supported. Current docs and fixtures use the parts generically; named upstream copy still needs docs/fixture/test proof. |
| Close action | Supported. `DrawerClose` renders a native close button, and `DrawerContent showCloseButton` controls generated close controls. Existing tests prove explicit close and generated close behavior generically. |
| Modal role and ARIA relationships | Supported. Drawer composes `setupModal` and assigns `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, trigger `aria-expanded`, and trigger `aria-controls`; candidate tests cover these generic relationships. |
| Focus movement, focus trap, restoration, Escape dismissal, outside dismissal, scroll lock | Supported by Drawer enhancement through shared modal setup and covered by generic candidate Playwright tests. Named examples still need coverage that these behaviors hold in the upstream compositions. |
| Directions and edge placement | Supported for bottom, right, top, and left; existing candidate tests cover placement and data hooks. The active upstream `drawer-demo` and mobile `drawer-dialog` use bottom drawer behavior. |
| Drag dismissal | Supported and covered generically. Active upstream examples rely on Vaul-style drawer behavior but do not require a literal Vaul dependency. |
| Scrollable content | Supported and covered generically. The active upstream examples need content layout proof rather than a separate scroll scenario. |
| Custom classes, styles, and tokens | Supported by `class`, `style`, part classes, and CSS variables. Existing generic custom-token fixture proves token styling; named examples need max-width, padding, alignment, chart, and control layout evidence. |
| Button composition | App-owned/package composition. Upstream `DrawerTrigger asChild` and `DrawerClose asChild` avoid nested buttons while styling with shadcn Button. RadCN trigger/close parts are native buttons and can take Button classes or equivalent author styling without an `asChild` dependency. |
| Input and Label composition | Separate package surfaces. `drawer-dialog` should compose RadCN Input and Label, but Drawer should not own field semantics. |
| Native form submission | App-owned composition. `drawer-dialog` uses a native form shell and submit button; Drawer should not own validation or submission state. |
| Goal value and increment/decrement state | App-owned state. RadCN Drawer may demonstrate static or dependency-free enhanced controls, but the package should not own goal state. |
| Disabled min/max buttons | App-owned control state. Named examples should prove equivalent user-facing disabled behavior or record an intentional Remix-native state mapping. |
| `Minus`/`Plus` icons | App-owned presentation. RadCN should use existing project icon strategy or plain accessible text/icons, not `lucide-react`. |
| Recharts chart | App-owned visualization. RadCN should not depend on Recharts for Drawer; named example parity can use existing RadCN Chart, static SVG/CSS bars, or a documented chart-composition mapping if visually equivalent enough for this row. |
| Responsive Dialog/Drawer branch | App-owned responsive composition. RadCN should document and test branch behavior without adding package-owned media-query hooks. |
| React props, Vaul `DrawerPrimitive`, controlled `open`, `onOpenChange`, `useState`, `useMediaQuery`, `asChild`, `className`, `data-slot`, `cn`, Tailwind utilities | Implementation details or React/Tailwind mechanics from shadcn/ui. RadCN maps these to Remix UI props, browser enhancement, `class`, public `data-radcn-*` hooks, package CSS, and app-owned state/enhancement. They are not RadCN dependencies. |
| Vendor source | Reference only. No RadCN package, docs, fixture, or test code should depend on `vendor/`. |

## Evidence Reviewed

- Issue inventory:
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`.
- Upstream package source:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/drawer.tsx`.
- Upstream example source:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/drawer-demo.tsx`
  and
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/drawer-dialog.tsx`.
- Upstream registry metadata:
  `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/drawer.json`,
  `drawer-demo.json`, and `drawer-dialog.json`.
- Current RadCN package source:
  `radcn/packages/radcn/src/components/drawer.tsx` and
  `radcn/packages/radcn/src/components/dialog.tsx`.
- Current RadCN styles:
  `radcn/packages/radcn/src/styles/index.ts`.
- Current docs evidence:
  `radcn/apps/docs/app/content/components.tsx` has a generic Drawer registry
  preview and Drawer composition examples inside other resolved components,
  but no named `drawer-demo` or `drawer-dialog` docs examples.
- Current fixture evidence:
  `radcn/fixtures/candidate-remix/app/fixtures/drawer.tsx` covers generic
  default, default-open, directions, close-actions, scrollable-content,
  gesture-dismiss, and custom-token scenarios, but not named upstream Drawer
  examples.
- Current Playwright evidence:
  `radcn/fixtures/tests/drawer.spec.ts` covers generic modal semantics,
  relationships, trigger expanded/controls state, focus trap, focus
  restoration, scroll lock, Escape close, explicit/generated close, outside
  dismissal, default open, directions, handle visibility, custom tokens,
  scrollable content, and drag threshold behavior. `radcn/apps/docs/tests/coverage.spec.ts`
  only asserts generic Drawer docs visibility.

## Decision

The Drawer example cluster is not resolved yet. RadCN has the core package
behavior needed for both upstream examples, and no mandatory React, Vaul,
`asChild`, Tailwind, `cn`, `lucide-react`, Recharts, media-query hook,
form-state, charting-library, or vendor dependency was identified. The missing
proof is named parity depth: docs, candidate fixtures, and Playwright should
render and test `drawer-demo` and `drawer-dialog` with exact copy, goal-control
composition, chart or chart-mapping evidence, responsive Dialog/Drawer
composition, form/input/label composition, footer actions, public hooks, custom
layout evidence, and modal behavior in those compositions.
