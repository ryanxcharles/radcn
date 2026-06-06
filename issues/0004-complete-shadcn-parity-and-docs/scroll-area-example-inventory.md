# Scroll Area Example Inventory

## Summary

Upstream shadcn/ui New York v4 has two active Scroll Area examples:
`scroll-area-demo` and `scroll-area-horizontal-demo`. RadCN already ships
`radcn/scroll-area` with the core native scroll-container behavior needed for
both examples. Experiment 70 added docs, fixtures, and Playwright tests that
prove the named upstream example compositions.

**Audit outcome:** Covered.

Experiment 70 added named docs, candidate fixture routes, and Playwright
coverage for `scroll-area-demo` and `scroll-area-horizontal-demo`. No Scroll
Area package API change was needed. React, Radix ScrollArea primitives,
`className`, `data-slot`, Tailwind, `cn`, `next/image`, image optimization,
remote image loading, and vendor source remain non-dependencies.

## Examples

| Example | Upstream behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `scroll-area-demo` | Scroll Area with `h-72 w-48 rounded-md border`; vertical scrolling of 50 generated tags from `v1.2.0-beta.50` down to `v1.2.0-beta.1`; inner `p-4` content; heading `Tags`; each tag rendered as text-sm content separated by a horizontal Separator with `my-2`; default vertical scrollbar and corner from the Scroll Area component. | Docs, candidate fixtures, and Playwright now render the named `scroll-area-demo` composition. Evidence covers exact `Tags` heading, 50 tag rows, first/last tag ordering, Separator composition, vertical scrollbar/thumb hooks, viewport focusability, native vertical scrolling, shadcn-equivalent dimensions, public hooks, and mapping copy. | Covered | No follow-up for this row. Repeated tag generation and React fragments/keys remain app-owned rendering details. |
| `scroll-area-horizontal-demo` | Scroll Area with `w-96 rounded-md border whitespace-nowrap`; horizontal strip with `flex w-max space-x-4 p-4`; three `figure` items for Ornella Binni, Tom Byrom, and Vladimir Malyavko; each has rounded overflow image wrapper, Next Image remote image with `alt="Photo by {artist}"`, `width=300`, `height=400`, `aspect-[3/4]`, object-cover presentation, and figcaption `Photo by {artist}` with emphasized artist text; explicit horizontal `ScrollBar orientation="horizontal"`. | Docs, candidate fixtures, and Playwright now render the named `scroll-area-horizontal-demo` composition. Evidence covers three artwork figures, artist copy, image accessible names, width/height/aspect evidence, figcaption text, horizontal max-content strip layout, `white-space: nowrap`, horizontal scrollbar/thumb/corner hooks, native horizontal scrolling, public hooks, deterministic non-network artwork data, and mapping copy. | Covered | No follow-up for this row. Next Image, remote Unsplash URLs, and image optimization remain app-owned presentation choices; RadCN examples use deterministic data images so tests never depend on network loading. |

## Capability Mapping

| Surface | Decision |
| --- | --- |
| Scroll Area root | Supported by `radcn/packages/radcn/src/components/scroll-area.tsx` with `data-radcn-scroll-area`, package class, `class`, and `style`. Existing fixtures prove root rendering and custom-token styling. |
| Viewport | Supported through `ScrollAreaViewport` with `data-radcn-scroll-area-viewport`, `ariaLabel`, `id`, `tabIndex`, `class`, and `style`. Existing tests prove focusability and native scroll mutation. |
| Native vertical scrolling | Supported. Existing candidate tests set `scrollTop` on the viewport and verify it moves. Named `scroll-area-demo` still needs 50-tag content proof. |
| Native horizontal scrolling | Supported. Existing candidate tests set `scrollLeft` and verify it moves. Named `scroll-area-horizontal-demo` still needs artwork-strip proof. |
| Vertical scrollbar and thumb | Supported through `ScrollBar` default `orientation="vertical"` and `ScrollAreaThumb`. Existing tests prove vertical scrollbar hooks and custom thumb color. |
| Horizontal scrollbar and thumb | Supported through `ScrollBar orientation="horizontal"` and `ScrollAreaThumb`. Existing tests prove horizontal scrollbar hooks. |
| Corner | Supported through `ScrollAreaCorner`; existing tests prove it in horizontal/bidirectional scenarios. Upstream Scroll Area component always renders a Radix corner, while RadCN makes the part explicit so authors can include it when both axes or corner styling matters. |
| Focus-visible treatment | Supported by viewport focus CSS and covered by candidate Playwright. |
| Width, height, rounded border, padding, whitespace, and horizontal strip layout | Supported through `class`, `style`, CSS variables, and app markup. Named examples need docs/fixture/test proof for shadcn-style dimensions and layouts. |
| Custom classes, styles, and tokens | Supported by `class`, `style`, package part classes, data hooks, and CSS variables such as `--radcn-scroll-area-height`, `--radcn-scroll-area-border`, `--radcn-scroll-area-bg`, `--radcn-scroll-area-thumb-bg`, and `--radcn-scroll-area-corner-bg`. |
| Separator composition | Separate package surface. `scroll-area-demo` should compose `radcn/separator`, but Scroll Area should not own separator semantics. |
| Repeated tag content and React fragments/keys | App-owned content generation. RadCN can render equivalent repeated markup without React fragments or keys becoming package concerns. |
| Image rendering and `next/image` | App-owned presentation. RadCN should not depend on Next Image, image optimization, or remote Unsplash loading for Scroll Area parity. Named examples can use plain `img`, local stable assets, CSS placeholders with alt-text evidence, or a documented intentional substitute if network image loading is not appropriate for tests. |
| Figure and figcaption markup | App-owned semantic content inside the Scroll Area viewport. Named examples should prove this composition because it affects user-facing artwork labels, but the Scroll Area package should not own it. |
| React props, Radix `ScrollAreaPrimitive`, `className`, `data-slot`, Tailwind utilities, and `cn` | Implementation details or React/Tailwind mechanics from shadcn/ui. RadCN maps these to Remix UI props, `class`, public `data-radcn-*` hooks, package CSS, inline style, CSS variables, and app-owned markup. They are not RadCN dependencies. |
| Vendor source | Reference only. No RadCN package, docs, fixture, or test code should depend on `vendor/`. |

## Evidence Reviewed

- Issue inventory:
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`.
- Upstream package source:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/scroll-area.tsx`.
- Upstream example source:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/scroll-area-demo.tsx`
  and
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/scroll-area-horizontal-demo.tsx`.
- Upstream registry metadata:
  `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/scroll-area.json`,
  `scroll-area-demo.json`, `scroll-area-horizontal-demo.json`, and
  `separator.json`.
- Current RadCN package source:
  `radcn/packages/radcn/src/components/scroll-area.tsx` and
  `radcn/packages/radcn/src/components/separator.tsx`.
- Current RadCN styles:
  `radcn/packages/radcn/src/styles/index.ts` and
  `radcn/packages/radcn/src/styles/tokens.css`.
- Current docs evidence:
  `radcn/apps/docs/app/content/components.tsx` has a generic Scroll Area
  registry preview, and `radcn/apps/docs/tests/coverage.spec.ts` only asserts
  generic Scroll Area docs visibility.
- Current fixture evidence:
  `radcn/fixtures/candidate-remix/app/fixtures/scroll-area.tsx` covers generic
  vertical, horizontal, bidirectional, focus, and custom-token scenarios, but
  not named upstream Scroll Area examples.
- Current Playwright evidence:
  `radcn/fixtures/tests/avatar-scroll-area.spec.ts` covers native vertical and
  horizontal scrolling, viewport focus styling, vertical/horizontal scrollbar
  hooks, corner hooks, and custom token styling.

## Decision

The Scroll Area example cluster is resolved. RadCN has the core package
behavior needed for both upstream examples, and Experiment 70 added the missing
named docs, candidate fixtures, and Playwright evidence for
`scroll-area-demo` and `scroll-area-horizontal-demo`. No mandatory React,
Radix, `next/image`, Tailwind, `cn`, image optimization, remote-image, or
vendor dependency was identified.
