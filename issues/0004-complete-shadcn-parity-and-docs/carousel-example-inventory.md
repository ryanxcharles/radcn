# Carousel Example Inventory

Generated during Experiment 27 on 2026-06-06.

## Sources

- Upstream registry:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
- Upstream examples:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/carousel-*.tsx`
- Upstream package:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/carousel.tsx`
- RadCN packages:
  `radcn/packages/radcn/src/components/carousel.tsx`
  `radcn/packages/radcn/src/components/card.tsx`
  `radcn/packages/radcn/src/styles/tokens.css`
- RadCN docs:
  `radcn/apps/docs/app/content/components.tsx`
- RadCN fixtures:
  `radcn/fixtures/scenarios/index.ts`
  `radcn/fixtures/candidate-remix/app/fixtures/carousel.tsx`
  `radcn/fixtures/candidate-remix/app/assets/entry.ts`
  `radcn/fixtures/tests/carousel.spec.ts`

## Summary

Carousel example parity is not complete yet. RadCN has strong package and
fixture coverage for core carousel behavior: native region and slide semantics,
selected slide state, current/count data hooks, previous/next controls,
disabled boundaries, keyboard movement, native scroll sync, vertical
orientation, multiple visible slides, compact spacing, and token styling.

The upstream shadcn example surface is broader and named differently. Carousel
still needs docs, fixture, and Playwright depth for shadcn's six named
examples, especially the API status text example and the Autoplay plugin
example. The implementation experiment should decide whether API/plugin parity
requires narrow package hooks or can stay app-owned browser enhancement over
existing `radcn-carousel-select` and scroll events.

No React dependency, Embla dependency, `embla-carousel-autoplay` dependency,
lucide dependency, Tailwind dependency, vendor import, or npm publishing
behavior is needed for Carousel parity unless a later reviewed experiment
records a concrete package-level need.

## Example Map

| Upstream id | User-facing behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `carousel-api` | Carousel with five Card slides, previous/next controls, and status text such as `Slide 1 of 5` that updates from Embla API selection events. Uses React `useState`, `useEffect`, `setApi`, `scrollSnapList`, `selectedScrollSnap`, and `api.on("select")`. | RadCN package exposes `data-current`, `data-count`, `data-index`, `radcn-carousel-select`, and `radcn-carousel-scroll` events, and fixtures assert current/count data hooks. There is no named API status docs/fixture example or Playwright assertion for visible `Slide n of m` text updating from events. | Partial | Add docs/fixture/test coverage for visible current/count status text driven by RadCN data hooks or browser enhancement events. Decide whether package API changes are needed or whether app-owned enhancement is enough. |
| `carousel-demo` | Default horizontal Carousel with five square Card slides, visible numbers, and previous/next controls. Uses Card/CardContent composition, lucide arrows through controls, and Tailwind max-width/aspect/padding utilities. | RadCN `/fixtures/carousel/default` and Playwright prove five slides, controls, disabled boundary state, selected state, and slide semantics. Docs only have a seed-level Carousel snippet and do not show shadcn-style Card slide example parity. | Partial | Promote default Card slide composition into docs and named fixture coverage with visible numbered slides. |
| `carousel-orientation` | Vertical Carousel with `orientation="vertical"`, Embla `opts={{ align: "start" }}`, vertical content height, half-height slide basis at medium screens, and previous/next controls repositioned for vertical axis. | RadCN `/fixtures/carousel/vertical` and Playwright prove vertical orientation and ArrowDown keyboard behavior. Current docs do not cover the vertical named example, and the audit has not proven shadcn-style content height or responsive half-slide sizing. | Partial | Add named docs/fixture coverage for vertical orientation, height, axis controls, and sizing hooks. Treat Embla `opts.align` as a behavior mapping rather than a required dependency unless a gap is proven. |
| `carousel-plugin` | Autoplay Carousel using `embla-carousel-autoplay`, `plugins`, `useRef`, `delay: 2000`, `stopOnInteraction: true`, pause on mouse enter, and reset on mouse leave. | RadCN has browser enhancement and movement events, but no autoplay package API, no plugin option, no hover pause/resume fixture, and no Playwright coverage for timed or event-driven autoplay behavior. | Missing | Decide whether plugin parity should be app-owned enhancement or a narrow RadCN package option/event pattern. Add deterministic docs/fixture/test coverage without depending on Embla or `embla-carousel-autoplay`. |
| `carousel-size` | Horizontal Carousel with responsive item basis: one item by default, half-width slides at medium screens, third-width slides at large screens, Card slides, and controls. Uses Embla `opts.align` and Tailwind `md:basis-1/2 lg:basis-1/3`. | RadCN `/fixtures/carousel/multiple-visible` and Playwright prove multiple visible item sizing through public CSS variables. It does not yet prove named responsive medium/large sizing or docs example parity. | Partial | Add docs/fixture/test coverage for responsive multi-slide sizing and map Tailwind basis utilities to RadCN classes, styles, or CSS variables. |
| `carousel-spacing` | Horizontal Carousel with compact spacing via negative margin/content offset and item padding, responsive multi-slide basis, Card slides, and controls. | RadCN `/fixtures/carousel/spacing` and Playwright prove compact track gap through `--radcn-carousel-gap`. Docs do not yet show named spacing example parity with Card slides and responsive multi-slide sizing. | Partial | Add docs/fixture/test coverage for compact spacing plus responsive sizing. Keep spacing as RadCN gap/class/CSS-variable behavior rather than Tailwind negative margin utility behavior. |

## Mapping Decisions

- React state, effects, context, refs, and `setApi` should not become RadCN
  package dependencies. Current/count UI can map to RadCN public data hooks,
  `radcn-carousel-select`, `radcn-carousel-scroll`, and app-owned browser
  enhancement.
- Embla and `useEmblaCarousel` are upstream implementation details. RadCN
  already owns native scroll, index sync, keyboard movement, and control state
  through `enhanceCarousel`.
- Embla `opts` should map to explicit RadCN props, classes, styles, CSS
  variables, or intentional divergences. `opts.align = "start"` needs
  implementation evidence only if shadcn's visible behavior is not already
  matched.
- Embla `plugins` and `embla-carousel-autoplay` should map to app-owned browser
  enhancement or a deliberately narrow RadCN option only if the implementation
  experiment proves package ownership is justified.
- Card/CardContent composition is not Carousel-owned. Carousel examples should
  prove that Card slides compose cleanly, but Carousel should not depend on
  Card.
- Lucide arrow icons are presentation choices. Carousel controls can use
  package-owned glyphs or app-owned icon children while preserving button
  labels and disabled state.
- Tailwind width, max-width, aspect-square, padding, negative margin, basis,
  height, and responsive utilities map to RadCN public classes, styles, or CSS
  variables.
- The audit should not assume DOM equivalence. The implementation target is
  equivalent carousel visuals, accessibility, behavior, composition affordances,
  and author-facing customization.

## Resolution

Carousel example parity remains unresolved after Experiment 27. The next Issue
4 experiment should implement Carousel example parity depth across docs,
candidate fixtures, Playwright coverage, and any narrowly justified package or
browser-enhancement hooks.
