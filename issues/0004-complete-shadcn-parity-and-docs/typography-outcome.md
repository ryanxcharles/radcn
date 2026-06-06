# Typography Outcome

Generated during Experiment 8 on 2026-06-05.

## Sources

- Upstream registry:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
- Upstream examples:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/typography-*.tsx`
- RadCN package:
  `radcn/packages/radcn/src/components/typography.tsx`
- RadCN docs:
  `radcn/apps/docs/app/content/components.tsx`
- RadCN fixtures:
  `radcn/fixtures/candidate-remix/app/fixtures/navigation-collection.tsx`
  `radcn/fixtures/tests/navigation-collection.spec.ts`

## Outcome

`typography` is a RadCN package-backed recipe/API, not an upstream shadcn `ui/`
component port. Upstream shadcn presents typography as examples and utility
class snippets. RadCN turns the same text styles into importable host-element
components with stable package exports and token hooks:

- `TypographyH1`
- `TypographyH2`
- `TypographyH3`
- `TypographyH4`
- `TypographyP`
- `TypographyBlockquote`
- `TypographyList`
- `TypographyListItem`
- `TypographyInlineCode`
- `TypographyLead`
- `TypographyLarge`
- `TypographySmall`
- `TypographyMuted`

The table example is intentionally composed with `radcn/table` primitives
beside Typography prose. It does not require a separate Typography table API.

## Example Map

| Upstream id | User-facing behavior | RadCN outcome |
| --- | --- | --- |
| `typography-demo` | Article composition with heading, lead, paragraph, list, quote, and inline code | Covered by docs preview and `typography/article` fixture. |
| `typography-h1` | Page-level heading | Covered by `TypographyH1`. |
| `typography-h2` | Section heading | Covered by `TypographyH2`. |
| `typography-h3` | Subsection heading | Covered by `TypographyH3`. |
| `typography-h4` | Smaller heading | Covered by `TypographyH4`. |
| `typography-p` | Paragraph copy | Covered by `TypographyP`. |
| `typography-blockquote` | Quoted prose | Covered by `TypographyBlockquote`. |
| `typography-list` | Unordered list and list items | Covered by `TypographyList` and `TypographyListItem`. |
| `typography-inline-code` | Inline monospace code | Covered by `TypographyInlineCode`. |
| `typography-lead` | Lead paragraph | Covered by `TypographyLead`. |
| `typography-large` | Large text label | Covered by `TypographyLarge`. |
| `typography-small` | Small supporting text | Covered by `TypographySmall`. |
| `typography-muted` | Muted supporting text | Covered by `TypographyMuted`. |
| `typography-table` | Prose plus a comparison table | Covered by `typography/table` fixture using `radcn/table` primitives with Typography prose. |

## Divergence

RadCN does not copy upstream utility-class snippets into consuming apps.
Typography styles live in package components and CSS tokens. This keeps
semantic elements explicit, gives docs a package-backed import surface, and
lets apps customize typography through public hooks such as
`data-radcn-typography-h1`, `data-radcn-typography-p`, and
`data-radcn-typography-muted`.

The upstream table typography example is composition, not a new Typography
component. RadCN documents and tests that composition through the Typography
fixture and existing `radcn/table` package API.
