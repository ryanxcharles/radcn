# Hover Card Example Inventory

## Summary

Upstream shadcn/ui New York v4 exposes one direct Hover Card example through
the examples registry: `hover-card-demo`. The registry entry has
`type: "registry:example"`, `registryDependencies: ["hover-card"]`, and file
path `examples/hover-card-demo.tsx`.

RadCN already ships `radcn/hover-card` as a dependency-free positioned overlay
primitive with hover/focus browser enhancement, portal/content hooks, default
and configured open/close delays, side/align placement, non-modal behavior,
custom token coverage, package exports, and general docs/fixture evidence.
Current evidence does not yet cover the exact upstream `@nextjs` profile card
composition.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `hover-card-demo` | Renders a `"use client"` React client component using Radix Hover Card primitives through shadcn `HoverCard`, `HoverCardTrigger`, and `HoverCardContent`. The trigger uses `HoverCardTrigger asChild` around a Button with `variant="link"` and visible text `@nextjs`. The content uses `className="w-80"` for 20rem width and contains a `flex justify-between gap-4` profile layout with `space-y-1`, `text-sm`, `font-semibold`, `text-xs`, and `text-muted-foreground` text styling. It composes Avatar, AvatarImage, and AvatarFallback with image URL `https://github.com/vercel.png` and fallback `VC`; heading `@nextjs`; description text `The React Framework – created and maintained by @vercel.`; and muted metadata `Joined December 2021`. The upstream UI primitive wraps Radix Hover Card, emits `data-slot` attributes, ports content, defaults `align="center"` and `sideOffset={4}`, and maps Tailwind classes through `cn`. The example imports lucide `CalendarIcon` but does not render it. | `radcn/packages/radcn/src/components/hover-card.tsx` exports `HoverCard`, `HoverCardTrigger`, `HoverCardPortal`, `HoverCardContent`, and `enhanceHoverCard`. It maps Radix behavior to dependency-free `setupPositionedOverlay` with hover mode, `openDelay`/`closeDelay`, focus and hover handling through browser enhancement, portal/content hooks, side/align/sideOffset props, `data-state`, and public `data-radcn-hover-card*` hooks. `radcn/packages/radcn/src/components/avatar.tsx` and `button.tsx` provide package primitives needed for the upstream composition, including Button `link` variant from prior parity work. `radcn/packages/radcn/src/styles/tokens.css` styles Hover Card triggers/content, default 20rem hover-card width, avatar/body helpers, custom tokens, overlay z-index, border, background, padding, shadow, and reduced-motion behavior. `radcn/packages/radcn/src/index.ts` and `radcn/packages/radcn/package.json` export `radcn/hover-card`. `radcn/apps/docs/app/content/components.tsx` currently shows a generic `Hover RadCN` docs preview and generic source snippet, not the exact `@nextjs` profile. `radcn/apps/docs/tests/coverage.spec.ts` only verifies that a Hover Card docs preview renders. `radcn/fixtures/candidate-remix/app/fixtures/positioned-overlays.tsx`, `radcn/fixtures/scenarios/index.ts`, and `radcn/fixtures/tests/positioned-overlays.spec.ts` verify generic hover card behavior: default content, content-hover timer cancellation, focus opening, Escape closing, delay, side/align placement, non-modal behavior, and custom tokens. They do not verify `@nextjs`, `VC`, the vercel image URL, `Joined December 2021`, Button link trigger mapping, `w-80`/20rem named example width, or exact upstream profile copy. | Partial | Implement named `hover-card-demo` docs, candidate fixture, and Playwright coverage for the exact upstream `@nextjs` profile composition. Verify Button link trigger/asChild mapping, Avatar image/fallback behavior, 20rem content width, profile layout, exact copy, RadCN public hooks, hover/focus behavior, and mapping copy for Radix, `asChild`, `className`, Tailwind utilities, `data-slot`, `cn`, unused `CalendarIcon`, and vendor source. |

## Decisions

- `hover-card-demo` is a direct upstream example because `_registry.ts`
  registers it as `type: "registry:example"` with
  `registryDependencies: ["hover-card"]`.
- React client component mechanics map to server-rendered markup plus
  dependency-free browser enhancement through `enhanceHoverCard`.
- Radix Hover Card remains a non-dependency. RadCN owns positioned overlay
  hooks and behavior through `setupPositionedOverlay`.
- Upstream `HoverCardTrigger asChild` maps to explicit RadCN trigger
  composition. For this named example, the follow-up should decide whether a
  `Button` with `variant="link"` can be used directly as the trigger style, or
  whether `HoverCardTrigger` should accept a class/style mapping that produces
  equivalent link-button presentation.
- Upstream Button `variant="link"` maps to the existing RadCN Button link
  variant from Button parity work.
- Upstream Avatar, AvatarImage, and AvatarFallback map to existing RadCN Avatar
  primitives. The follow-up should verify the vercel image URL and fallback
  `VC` evidence rather than relying on the generic `RC` hover-card fixture.
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
- Existing docs and fixtures are good package-behavior substrate evidence, but
  exact named `hover-card-demo` parity requires named profile data and copy in
  docs, fixtures, and Playwright.
- Vendor source remains read-only evidence and should not be imported or
  committed into RadCN.
