# Hover Card Example Inventory

## Summary

Upstream shadcn/ui New York v4 exposes one direct Hover Card example through
the examples registry: `hover-card-demo`. The registry entry has
`type: "registry:example"`, `registryDependencies: ["hover-card"]`, and file
path `examples/hover-card-demo.tsx`.

RadCN ships `radcn/hover-card` as a dependency-free positioned overlay
primitive with hover/focus browser enhancement, portal/content hooks, default
and configured open/close delays, side/align placement, non-modal behavior,
custom token coverage, package exports, and docs/fixture evidence. Experiment
94 covers the exact upstream `@nextjs` profile card composition in docs,
candidate fixtures, and Playwright.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `hover-card-demo` | Renders a `"use client"` React client component using Radix Hover Card primitives through shadcn `HoverCard`, `HoverCardTrigger`, and `HoverCardContent`. The trigger uses `HoverCardTrigger asChild` around a Button with `variant="link"` and visible text `@nextjs`. The content uses `className="w-80"` for 20rem width and contains a `flex justify-between gap-4` profile layout with `space-y-1`, `text-sm`, `font-semibold`, `text-xs`, and `text-muted-foreground` text styling. It composes Avatar, AvatarImage, and AvatarFallback with image URL `https://github.com/vercel.png` and fallback `VC`; heading `@nextjs`; description text `The React Framework – created and maintained by @vercel.`; and muted metadata `Joined December 2021`. The upstream UI primitive wraps Radix Hover Card, emits `data-slot` attributes, ports content, defaults `align="center"` and `sideOffset={4}`, and maps Tailwind classes through `cn`. The example imports lucide `CalendarIcon` but does not render it. | `radcn/apps/docs/app/content/components.tsx` renders a named `hover-card-demo` docs example with stable `data-radcn-docs-hover-card-family="hover-card-demo"`, trigger text `@nextjs`, link-button trigger classes, Avatar image URL `https://github.com/vercel.png`, fallback `VC`, heading `@nextjs`, exact description and metadata copy, 20rem width evidence through `--radcn-hover-card-width:20rem`, profile layout hook, public Hover Card and Avatar hooks, and mapping copy for React/Radix/`asChild`/Button/Avatar/`className`/Tailwind/`cn`/`data-slot`/unused `CalendarIcon`/vendor mechanics. `radcn/apps/docs/app/assets/entry.ts` scopes `enhanceHoverCard` to the named docs Hover Card demo. `radcn/apps/docs/tests/coverage.spec.ts` verifies the named docs route evidence, hover/focus/Escape behavior, non-modal behavior, exact copy, image/fallback, width, and mapping copy. `radcn/fixtures/scenarios/index.ts` registers `hover-card/demo`. `radcn/fixtures/candidate-remix/app/fixtures/positioned-overlays.tsx` renders the named fixture with the same profile composition. `radcn/fixtures/tests/positioned-overlays.spec.ts` verifies public Hover Card/Avatar hooks, exact profile data/copy, link trigger evidence, 20rem width, hover/focus/Escape behavior, non-modal behavior, and default side/align/offset evidence. Package code did not need changes; existing `radcn/hover-card`, `radcn/avatar`, and Button link classes were sufficient. | Covered | None. |

## Decisions

- `hover-card-demo` is a direct upstream example because `_registry.ts`
  registers it as `type: "registry:example"` with
  `registryDependencies: ["hover-card"]`.
- React client component mechanics map to server-rendered markup plus
  dependency-free browser enhancement through `enhanceHoverCard`.
- Radix Hover Card remains a non-dependency. RadCN owns positioned overlay
  hooks and behavior through `setupPositionedOverlay`.
- Upstream `HoverCardTrigger asChild` maps to explicit RadCN trigger
  composition. For this named example, RadCN applies button link classes and
  style directly to `HoverCardTrigger`, producing equivalent link-button
  presentation without adding Slot or a new package API.
- Upstream Button `variant="link"` maps to the existing RadCN Button link
  variant from Button parity work.
- Upstream Avatar, AvatarImage, and AvatarFallback map to existing RadCN Avatar
  primitives. The named docs and fixture coverage verify the vercel image URL
  and fallback `VC` evidence instead of relying on the generic `RC` hover-card
  fixture.
- Upstream content portal behavior maps to `HoverCardPortal` and
  `HoverCardContent` with public hooks. Literal Radix DOM equivalence is not
  required.
- Upstream `align="center"` and `sideOffset={4}` defaults match RadCN's
  content defaults and enhancement defaults. Current fixtures already prove
  configurable side/align placement and delay behavior.
- Upstream `className="w-80"` maps to a 20rem width via style, CSS variable, or
  class evidence in the named follow-up. Generic RadCN hover-card width already
  defaults to 20rem, but the direct example still needs named evidence.
- Upstream `className`, Tailwind utilities, `cn`, and `data-slot` map to
  RadCN `class`, style, CSS variables, package classes, and public
  `data-radcn-*` hooks.
- The upstream `CalendarIcon` import is unused in `hover-card-demo`; RadCN
  should document it as non-user-facing source noise rather than introducing an
  icon dependency.
- Named `hover-card-demo` parity is covered by docs, fixtures, and Playwright
  evidence for the exact profile data and copy.
- Vendor source remains read-only evidence and should not be imported or
  committed into RadCN.
