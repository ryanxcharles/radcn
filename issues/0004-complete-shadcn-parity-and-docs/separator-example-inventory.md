# Separator Example Inventory

## Summary

Upstream shadcn/ui New York v4 has one direct Separator example,
`separator-demo`. RadCN has the package API and styling substrate for
horizontal and vertical separators, including decorative and semantic modes,
and now has named docs, candidate fixture, and Playwright evidence for the
exact upstream demo composition.

The current outcome is `Covered`. Separator is ready to mark resolved for Issue
4 once `resolved-clusters.json` and the generated parity inventory record the
cluster.

Current RadCN evidence compared in this audit:

- `radcn/packages/radcn/src/components/separator.tsx` exports the package
  component, props, default orientation/decorative behavior, role mapping,
  `aria-orientation`, `data-radcn-separator`, and `data-orientation`.
- `radcn/packages/radcn/src/styles/tokens.css` defines `.radcn-separator`,
  `.radcn-separator--horizontal`, `.radcn-separator--vertical`, and
  `--radcn-border` token styling.
- `radcn/packages/radcn/src/index.ts` re-exports `Separator`,
  `SeparatorOrientation`, and `SeparatorProps`.
- `radcn/packages/radcn/package.json` exposes the `./separator` package
  subpath.
- `radcn/apps/docs/app/content/components.tsx` includes named
  `separator-demo` docs with exact upstream text, one horizontal separator,
  two vertical separators, row layout evidence, source snippet, and mapping
  copy.
- `radcn/apps/docs/tests/coverage.spec.ts` checks the named docs demo, exact
  text, public hooks, orientations, decorative defaults, row layout, source
  snippet, and dependency-divergence copy.
- `radcn/fixtures/scenarios/index.ts` lists `separator/demo` and
  `separator/orientations` scenarios.
- `radcn/fixtures/candidate-remix/app/fixtures/index.tsx` routes Separator
  scenarios through `renderSeparatorFixture(fixture)`.
- `radcn/fixtures/candidate-remix/app/fixtures/static-display.tsx` renders
  named `separator-demo` parity and preserves `separator/orientations`
  semantic behavior.
- `radcn/fixtures/tests/native-state.spec.ts` asserts the named fixture demo,
  decorative default behavior, row layout, horizontal and vertical
  orientations, and semantic `decorative={false}` behavior.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `separator-demo` | Renders a text block with heading `Radix Primitives` and description `An open-source UI component library.`, then a horizontal separator with `className="my-4"`, then an inline row with `Blog`, `Docs`, and `Source` separated by two vertical separators. The row uses `flex h-5 items-center space-x-4 text-sm`. Upstream package mechanics include `"use client"`, React component props, Radix Separator primitive, `SeparatorPrimitive.Root`, default `orientation="horizontal"`, default `decorative={true}`, `className`, Tailwind utilities, `cn`, `data-slot="separator"`, `data-orientation`, horizontal sizing, vertical sizing, decorative separator behavior, semantic separator behavior, browser accessibility behavior, custom tokens through border color, and vendor source. | RadCN exports `Separator` from `radcn/separator` and the package manifest exposes `./separator`. The named docs demo and `separator/demo` fixture preserve exact text, one horizontal separator, two vertical separators, `Blog`/`Docs`/`Source`, and row layout class/style evidence. Docs and fixture Playwright assert three public separator hooks, `data-orientation`, decorative default `role="none"`, horizontal/vertical sizing, source snippet, and mapping copy. `separator/orientations` fixture coverage asserts semantic `decorative={false}` behavior with `role="separator"` and `aria-orientation`. | Covered | No follow-up. |

## Decisions

- React non-dependency: RadCN should not import React or implement React
  component props. The author-facing equivalent is Remix UI handles and plain
  web markup.
- Radix non-dependency: RadCN should not import `radix-ui` or
  `SeparatorPrimitive.Root`. The package owns the minimal separator markup
  directly.
- `orientation="horizontal"` maps to RadCN's default `orientation =
  'horizontal'`, `data-orientation="horizontal"`, and
  `.radcn-separator--horizontal`.
- Upstream vertical separators map to `orientation="vertical"`,
  `data-orientation="vertical"`, and `.radcn-separator--vertical`.
- Upstream `decorative={true}` maps to RadCN's default `decorative = true` and
  `role="none"`. Semantic separator behavior remains available through
  `decorative={false}`, which emits `role="separator"` and `aria-orientation`.
- Upstream `className="my-4"` and row classes
  `flex h-5 items-center space-x-4 text-sm` should be represented through
  RadCN docs/fixture class and style evidence, not through Tailwind as a
  runtime dependency.
- `className` maps to the RadCN `class` prop. `cn` maps to RadCN's `classes`
  helper internally.
- Upstream `data-slot="separator"` maps to RadCN public hooks:
  `data-radcn-separator` and `data-orientation`.
- The heading `Radix Primitives`, description
  `An open-source UI component library.`, and row labels `Blog`, `Docs`, and
  `Source` are user-facing demo content and should be preserved in the named
  example.
- Custom tokens map through `--radcn-border` and component styles in
  `radcn/packages/radcn/src/styles/tokens.css`.
- Browser accessibility behavior is behavior-level parity, not DOM equality:
  decorative separators may be hidden from assistive separator semantics, while
  semantic separators must expose separator role and orientation.
- Vendor source remains a reference only. The next implementation should not
  commit vendored shadcn source or add runtime dependencies on React, Radix, or
  Tailwind.
