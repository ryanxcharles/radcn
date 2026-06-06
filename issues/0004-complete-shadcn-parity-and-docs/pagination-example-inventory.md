# Pagination Example Inventory

## Summary

Upstream shadcn/ui New York v4 has one direct Pagination example:
`pagination-demo`.

RadCN already ships strong Pagination substrate: package exports for the root,
content list, item, link, previous, next, and ellipsis parts; semantic
navigation/list/link markup; active page state; accessible previous/next
labels; ellipsis screen-reader text; custom label support; generic docs;
candidate/reference fixtures; and Playwright coverage.

The direct upstream example remains partial because current docs and tests do
not prove a named `pagination-demo` surface. The candidate `default` fixture
already renders the same user-facing sequence with active page `2`, but the
docs preview is generic and current Playwright coverage verifies active page
`3` and custom labels rather than the exact upstream `Previous`, `1`, active
`2`, `3`, ellipsis, and `Next` sequence.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `pagination-demo` | Renders a pagination navigation with `Pagination`, `PaginationContent`, six `PaginationItem` rows, `PaginationPrevious href="#"`, `PaginationLink href="#">1</PaginationLink>`, active `PaginationLink` for `2`, `PaginationLink` for `3`, `PaginationEllipsis`, and `PaginationNext href="#"`. The previous link has accessible label `Go to previous page`, visible text `Previous`, and a lucide `ChevronLeftIcon`. The next link has accessible label `Go to next page`, visible text `Next`, and a lucide `ChevronRightIcon`. The ellipsis renders a `MoreHorizontalIcon`, is `aria-hidden`, and includes screen-reader text `More pages`. Upstream package mechanics include React component props, `buttonVariants`, `Button` size typing, `className`, Tailwind utilities, `cn`, `data-slot`, button variant/size mapping, lucide `ChevronLeftIcon`, `ChevronRightIcon`, and `MoreHorizontalIcon`, and vendor source. | `radcn/packages/radcn/src/components/pagination.tsx` exports dependency-free `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, and `PaginationEllipsis`. It renders `nav role="navigation"` with `aria-label="pagination"`, list markup, link hooks, `aria-current="page"` for active links, previous/next accessible labels, text labels, icon hooks using text affordances, and ellipsis `More pages` screen-reader text. `radcn/packages/radcn/src/index.ts` exports the API and `radcn/packages/radcn/package.json` has no React, lucide, Tailwind, or `class-variance-authority` dependency. Package CSS in `radcn/packages/radcn/src/styles/tokens.css` provides pagination layout, link, active, previous/next, ellipsis, and token hooks. `radcn/apps/docs/app/content/components.tsx` has a generic Pagination route and preview, but it does not render the exact upstream `1`, active `2`, `3` sequence as a named demo. `radcn/apps/docs/tests/coverage.spec.ts` only checks that the Pagination docs route renders a root hook through general registry coverage. `radcn/fixtures/candidate-remix/app/fixtures/navigation-collection.tsx` renders `default`, `active`, and `custom-labels` Pagination fixtures; `default` matches the upstream sequence with active `2`, while `active` uses active `3` and `custom-labels` changes the previous/next visible text. `radcn/fixtures/reference-react-router/app/fixtures/navigation-collection.tsx` mirrors that fixture surface. `radcn/fixtures/tests/navigation-collection.spec.ts` verifies active page semantics, ellipsis existence, custom label hooks, and previous accessible label, but not a named upstream demo route or exact default sequence. | Partial | Add a named implementation experiment for `pagination-demo`: docs rich example, source snippet, candidate fixture route or explicit named scenario, and Playwright coverage for exact `Previous`, `1`, active `2`, `3`, ellipsis/`More pages`, `Next`, previous/next accessible labels, root/list/item/link/ellipsis hooks, active state, icon affordance hooks, React/lucide/`buttonVariants`/Button size/Tailwind/`cn`/`data-slot` mappings, and custom-token/modifiability evidence. |

## Decisions

- React component props: not required. RadCN Pagination is server-rendered
  Remix UI markup with explicit props.
- `buttonVariants`: not a dependency. Button-like pagination link styling maps
  to package classes and tokenized link/active classes.
- `Button` size typing: not required. RadCN exposes explicit Pagination link
  props and previous/next text props rather than importing Button types.
- `ChevronLeftIcon`, `ChevronRightIcon`, and `MoreHorizontalIcon`: map to
  package-owned text icon affordance hooks today. A future named demo may keep
  these text affordances or use app-owned SVG without adding `lucide-react`.
- `Pagination`: current root covers role, accessible label, public class, and
  `data-radcn-pagination`.
- `PaginationContent`: current list part covers the upstream flex list
  semantics through a real `ul`.
- `PaginationItem`: current item part covers the upstream `li` wrapper.
- `PaginationLink`: current link part covers href, active state,
  `aria-current="page"`, classes, and public hooks.
- `PaginationPrevious`: current previous part covers `Go to previous page`,
  visible text, previous icon hook, custom labels, and link behavior.
- `PaginationNext`: current next part covers `Go to next page`, visible text,
  next icon hook, custom labels, and link behavior.
- `PaginationEllipsis`: current ellipsis part covers visible ellipsis,
  `aria-hidden`, public hook, and screen-reader text `More pages`.
- Active page state: current package supports it and generic tests cover active
  page `3`; named upstream coverage for active `2` is missing.
- Previous/next labels: current package and tests cover accessible labels and
  custom visible labels.
- Ellipsis screen-reader text: current package includes `More pages`; named
  upstream coverage is missing.
- `className`: maps to `class`.
- Tailwind utilities: map to package CSS, classes, CSS variables, and app-owned
  styles rather than a Tailwind dependency.
- `cn`: not needed as a package dependency; class composition is explicit.
- `data-slot`: maps to RadCN public `data-radcn-pagination*` hooks.
- Button variant/size mapping: maps to `radcn-pagination-link` and
  `radcn-pagination-link--active` package classes rather than shadcn Button
  variants.
- Docs evidence: current docs prove the route exists and renders a Pagination
  root, but not the exact upstream demo.
- Fixture evidence: current generic candidate/reference fixtures prove the
  substrate and include the upstream sequence in `default`, but not as a named
  upstream parity route.
- Playwright evidence: current tests prove active state, ellipsis presence,
  custom labels, and accessible previous label, but not exact upstream demo
  coverage.
- Custom labels: already supported by `PaginationPrevious` and
  `PaginationNext` text props.
- Custom tokens: package classes and CSS variables are available; a future
  named demo should keep modifiability evidence if implementation work is
  needed.
- Vendor source: the upstream references are
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/pagination-demo.tsx`
  and `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/pagination.tsx`.
