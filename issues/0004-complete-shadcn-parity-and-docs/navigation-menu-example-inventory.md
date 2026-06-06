# Navigation Menu Example Inventory

## Summary

Upstream shadcn/ui New York v4 has one direct Navigation Menu example:
`navigation-menu-demo`.

RadCN already ships strong Navigation Menu substrate: package exports for the
root, list, item, trigger, content, link, viewport, indicator, and
`enhanceNavigationMenu`; server-rendered role/ARIA-adjacent markup; browser
enhancement for roving focus, open state, viewport sizing, indicator
positioning, pointer/focus behavior, Escape close, horizontal and vertical
keyboard movement; disabled state; custom token hooks; generic docs; candidate
and reference fixtures; and Playwright coverage.

The direct upstream example remains partial because current docs and fixtures
do not prove the named upstream `navigation-menu-demo` composition, copy,
responsive sections, icon links, `useIsMobile`/viewport decision, or
`navigationMenuTriggerStyle` mapping.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `navigation-menu-demo` | Renders a responsive shadcn docs-style navigation menu with top-level `Home`, `Components`, `Docs`, `List`, `Simple`, and `With Icon` controls. `Home` opens a two-column panel with a feature card headed `shadcn/ui`, copy `Beautifully designed components built with Tailwind CSS.`, and links `Introduction`, `Installation`, and `Typography` with their upstream descriptions. `Components` opens six linked entries: `Alert Dialog`, `Hover Card`, `Progress`, `Scroll-area`, `Tabs`, and `Tooltip` with exact descriptions. `Docs` is a plain link styled by `navigationMenuTriggerStyle()`. `List`, `Simple`, and `With Icon` are responsive `hidden md:block` sections. `List` contains `Components`, `Documentation`, and `Blog` with descriptions. `Simple` contains `Components`, `Documentation`, and `Blocks`. `With Icon` contains icon links `Backlog`, `To Do`, and `Done`. Upstream mechanics include `"use client"`, React, Next `Link`, `useIsMobile`, Radix Navigation Menu, `cva`, lucide `ChevronDownIcon`, `CircleHelpIcon`, `CircleIcon`, `CircleCheckIcon`, `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `navigationMenuTriggerStyle`, `viewport={isMobile}`, root-rendered `NavigationMenuViewport` package behavior, optional `NavigationMenuIndicator` package capability, `asChild`, `className`, Tailwind utilities, `cn`, `data-slot`, active/open/motion state, keyboard behavior, pointer/focus behavior, responsive behavior, and vendor source. | `radcn/packages/radcn/src/components/navigation-menu.tsx` exports dependency-free `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport`, and `enhanceNavigationMenu`. `radcn/packages/radcn/src/index.ts` re-exports those APIs, and `radcn/packages/radcn/package.json` depends only on Remix. Package CSS in `radcn/packages/radcn/src/styles/tokens.css` provides trigger, link, viewport, indicator, disabled, orientation, and custom-token hooks. `radcn/apps/docs/app/content/components.tsx` has a generic Navigation Menu docs route and short source snippet, but not the named upstream demo. `radcn/apps/docs/tests/coverage.spec.ts` checks that the docs route renders a Navigation Menu root. `radcn/fixtures/scenarios/index.ts`, `radcn/fixtures/candidate-remix/app/fixtures/navigation-menu.tsx`, and `radcn/fixtures/reference-react-router/app/fixtures/navigation-menu.tsx` provide generic default, links, viewport, indicator, vertical, disabled, and custom-token scenarios. `radcn/fixtures/tests/menubar-navigation.spec.ts` verifies generic candidate behavior: aria label, list, open trigger/content, viewport open/hidden state, indicator visible state, links, horizontal and vertical keyboard movement, Escape close, focusout close, disabled state, and custom tokens. | Partial | Add a named implementation experiment for `navigation-menu-demo`: docs example, source snippet, candidate fixture route, scenario entry, browser enhancement if needed, and Playwright coverage for exact upstream copy, six top-level controls, Home/Components/List/Simple/With Icon panels, icon-link affordances, responsive hidden sections or documented responsive mapping, `Docs` link styling, viewport behavior, trigger/link/content public hooks, React/Radix/Next/useIsMobile/cva/lucide/Tailwind/cn/data-slot mappings, and custom-token/modifiability evidence. Decide whether RadCN needs a public `navigationMenuTriggerStyle` helper or a documented class/token equivalent. |

## Decisions

- `"use client"`: intentionally not required. RadCN renders server markup and
  adds browser behavior through `enhanceNavigationMenu`.
- React: not required. RadCN Navigation Menu state is explicit DOM state and
  browser event handling.
- Next `Link`: maps to plain anchors or Remix links supplied by the app.
- `useIsMobile`: not a package dependency. The named implementation should
  decide whether viewport behavior is always rendered, app-controlled, or
  documented as a responsive app concern.
- Radix Navigation Menu: not a dependency. RadCN owns the root, trigger,
  content, viewport, indicator, keyboard, and pointer behavior.
- `cva`: not a dependency. Variant/style composition should map to exported
  classes, data attributes, tokens, or a deliberate helper if needed.
- lucide icons: `ChevronDownIcon`, `CircleHelpIcon`, `CircleIcon`, and
  `CircleCheckIcon` are app presentation. RadCN should not add
  `lucide-react`; docs may use text glyphs, inline SVG, or `lucide-static`
  where appropriate.
- Demo-rendered Navigation Menu parts: current RadCN has package equivalents
  for `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`,
  `NavigationMenuTrigger`, `NavigationMenuContent`, and `NavigationMenuLink`.
- `navigationMenuTriggerStyle`: current RadCN does not export a direct helper.
  The next experiment must decide whether to add one or document the equivalent
  trigger/link class and token mapping.
- Root/list/content layout: generic substrate exists, but the exact upstream
  panel widths, grids, feature card, and grouped links are not represented in
  docs or fixtures.
- Root-rendered viewport behavior: RadCN exposes explicit
  `NavigationMenuViewport`; the upstream `viewport={isMobile}` root behavior
  needs a named mapping decision.
- Indicator package capability: RadCN exposes `NavigationMenuIndicator` and
  generic tests cover visible state, but the direct upstream demo does not
  render an indicator explicitly.
- Responsive `hidden md:block`: current generic fixtures do not prove the
  upstream responsive hiding of `List`, `Simple`, and `With Icon`.
- Icon links: current generic fixtures do not prove the upstream `Backlog`,
  `To Do`, and `Done` icon-link pattern.
- Active/open state: package evidence exists through data attributes and tests,
  but named demo state coverage is missing.
- Keyboard behavior: generic horizontal and vertical keyboard coverage exists;
  the named demo still needs exact-composition coverage.
- Pointer/focus behavior: package enhancement supports pointer and focus open
  behavior; named demo evidence is missing.
- `asChild`: maps to passing anchors/links as children or direct
  `NavigationMenuLink` usage. The named implementation must document the
  difference from React Slot mechanics.
- `className`: maps to `class`, public classes, and app-authored styles.
- Tailwind utilities: map to package CSS, docs-owned styles, CSS variables, and
  data attributes rather than a Tailwind dependency.
- `cn`: not needed as a package dependency; class composition remains
  app-authored.
- `data-slot`: maps to RadCN public `data-radcn-navigation-menu-*` hooks.
- Docs evidence: current docs prove the route exists, but not the upstream
  demo composition.
- Fixture evidence: current candidate/reference fixtures prove generic
  substrate, but not the exact upstream demo.
- Playwright evidence: current tests prove generic behavior, but not the exact
  upstream copy, responsive sections, icon links, or trigger-style mapping.
- Custom tokens: generic custom-token fixture proves token modifiability; the
  named demo should preserve that ability.
- Vendor source: the upstream references are
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/navigation-menu-demo.tsx`
  and
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/navigation-menu.tsx`.
