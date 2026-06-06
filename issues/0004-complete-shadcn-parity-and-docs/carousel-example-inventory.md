# Carousel Example Inventory

Generated during Experiment 27 on 2026-06-06 and resolved during Experiment
28.

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

Carousel example parity is complete after Experiment 28. RadCN has strong
package, docs, fixture, and Playwright coverage for native region and slide
semantics, selected slide state, current/count data hooks, previous/next
controls, disabled boundaries, keyboard movement, native scroll sync, vertical
orientation, responsive multi-slide sizing, compact spacing, token styling,
visible API status text, and deterministic app-owned autoplay behavior with
hover pause/resume.

No React dependency, Embla dependency, `embla-carousel-autoplay` dependency,
lucide dependency, Tailwind dependency, vendor import, or npm publishing
behavior was needed for Carousel parity.

## Example Map

| Upstream id | User-facing behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `carousel-api` | Carousel with five Card slides, previous/next controls, and status text such as `Slide 1 of 5` that updates from Embla API selection events. Uses React `useState`, `useEffect`, `setApi`, `scrollSnapList`, `selectedScrollSnap`, and `api.on("select")`. | RadCN docs, `/fixtures/carousel/api`, and Playwright prove visible `Slide n of m` status text initialized from public data hooks and updated after control movement through app-owned enhancement that listens to `radcn-carousel-select` and `radcn-carousel-scroll`. | Covered | React state/effects and `setApi` map to public data hooks/events plus app-owned browser state. |
| `carousel-demo` | Default horizontal Carousel with five square Card slides, visible numbers, and previous/next controls. Uses Card/CardContent composition, lucide arrows through controls, and Tailwind max-width/aspect/padding utilities. | RadCN docs, `/fixtures/carousel/demo`, and Playwright prove five Card-like numbered slides, controls, disabled boundary state, selected state, and slide semantics. | Covered | Card composition remains independent; lucide arrows map to package-owned control glyphs or app-owned children. |
| `carousel-orientation` | Vertical Carousel with `orientation="vertical"`, Embla `opts={{ align: "start" }}`, vertical content height, half-height slide basis at medium screens, and previous/next controls repositioned for vertical axis. | RadCN docs, `/fixtures/carousel/orientation`, compatibility route `/fixtures/carousel/vertical`, and Playwright prove vertical orientation, vertical content height, controls, and ArrowDown keyboard movement. | Covered | Embla `opts.align` maps to RadCN orientation, native scroll snap, classes, and CSS variables. |
| `carousel-plugin` | Autoplay Carousel using `embla-carousel-autoplay`, `plugins`, `useRef`, `delay: 2000`, `stopOnInteraction: true`, pause on mouse enter, and reset on mouse leave. | RadCN docs and `/fixtures/carousel/plugin` show plugin-style autoplay as app-owned browser behavior over public Carousel controls; Playwright proves deterministic movement plus hover pause/resume. | Covered | Embla plugins and `embla-carousel-autoplay` map to app-owned browser enhancement, not a package dependency. |
| `carousel-size` | Horizontal Carousel with responsive item basis: one item by default, half-width slides at medium screens, third-width slides at large screens, Card slides, and controls. Uses Embla `opts.align` and Tailwind `md:basis-1/2 lg:basis-1/3`. | RadCN docs, `/fixtures/carousel/size`, compatibility route `/fixtures/carousel/multiple-visible`, and Playwright prove responsive medium and large multi-slide sizing through public classes and CSS variables. | Covered | Tailwind basis utilities map to `--radcn-carousel-item-size` and responsive RadCN classes. |
| `carousel-spacing` | Horizontal Carousel with compact spacing via negative margin/content offset and item padding, responsive multi-slide basis, Card slides, and controls. | RadCN docs, `/fixtures/carousel/spacing`, and Playwright prove compact spacing plus responsive multi-slide sizing through `--radcn-carousel-gap` and public classes. | Covered | Tailwind negative margin and padding utilities map to RadCN gap/class/CSS-variable behavior. |

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

Experiment 28 resolved Carousel example parity depth. The next Issue 4 cluster
should come from the regenerated `parity-inventory.md` first recommended
cluster.
