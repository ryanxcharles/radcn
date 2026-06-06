# Data Table Example Inventory

## Summary

Upstream shadcn/ui New York v4 exposes one direct Data Table example through
the examples registry: `data-table-demo`. The registry entry has
`type: "registry:example"`, `registryDependencies: ["data-table"]`, and file
path `examples/data-table-demo.tsx`.

RadCN already ships `radcn/data-table` as a dependency-free composition layer
over semantic table markup and explicit app-owned data operations. Existing
docs, fixtures, and Playwright prove native filter forms, sortable links,
selection checkboxes, pagination, row actions, column controls, responsive
detail panels, row editing, dashboard-style composition, empty state, custom
tokens, package exports, public hooks, and the decision not to depend on
React, TanStack Table, drag/drop engines, Recharts, Zod, or Sonner.

The direct upstream example remains partial because current RadCN docs,
fixtures, and tests do not prove the exact named `data-table-demo` payments
composition: upstream payment IDs, emails, statuses, USD amounts, filter
placeholder, column visibility menu, row action menu, select-all and row
checkbox labels, selected-row state, empty state, Previous/Next pagination
buttons, or the full React/TanStack/lucide/Tailwind mapping for that named
example.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `data-table-demo` | Renders a React client component using `useReactTable`, TanStack `ColumnDef`, sorting state, column filters, column visibility, row selection, core/pagination/sorted/filtered row models, and `flexRender`. It defines five `Payment` rows with ids `m5gr84i9`, `3u1reuv4`, `derv1ws0`, `5kma53ae`, and `bhqecj4p`; statuses `success`, `processing`, and `failed`; emails `ken99@example.com`, `Abe45@example.com`, `Monserrat44@example.com`, `Silas22@example.com`, and `carmella@example.com`; and amounts `316`, `242`, `837`, `874`, and `721`, formatted as `$316.00`, `$242.00`, `$837.00`, `$874.00`, and `$721.00`. The UI includes select-all and row checkboxes with aria labels `Select all` and `Select row`; headers `Status`, sortable `Email` with `ArrowUpDown`, and right-aligned `Amount`; row action menu trigger `Open menu` with `MoreHorizontal`; row menu label `Actions`, item `Copy payment ID` using `navigator.clipboard.writeText(payment.id)`, separator, `View customer`, and `View payment details`; filter input placeholder `Filter emails...`; `Columns` dropdown with `ChevronDown` and checkbox items for hideable columns; a bordered rounded overflow table frame; selected-row `data-state`; empty text `No results.`; footer selection text like `0 of 0 row(s) selected.`; and outline `Previous` / `Next` pagination buttons with disabled state. Upstream composes Button, Checkbox, DropdownMenu, Input, Table, `className`, Tailwind sizing/flex/spacing/text/border/overflow/capitalize/lowercase/right-align/font utilities, and lucide icons. | `radcn/packages/radcn/src/components/data-table.tsx` exports `DataTable`, toolbar, filter, column controls, content, header cell, row, selection summary, pagination, row actions, detail, empty state, and table-part aliases with public `data-radcn-data-table*` hooks, selected row state, empty row colspan, sortable header links, row count and selected count data, and package-owned structural classes. `radcn/packages/radcn/src/components/table.tsx` provides semantic table, caption, header, body, footer, row, head, and cell primitives with `aria-sort`. `tokens.css` styles Data Table and Table wrappers, toolbar, filter, column controls, content, sort link, selected row, selection summary, pagination, row actions, detail, empty state, table container, dense table, rows, cells, and custom data-table tokens. `radcn/packages/radcn/src/index.ts` and `radcn/packages/radcn/package.json` export `radcn/data-table` and `radcn/table`. `radcn/apps/docs/app/content/components.tsx` has a ready Data Table docs page and preview using `Payments`, native form filtering, sortable `Email` link, selection checkboxes, pagination links, row actions, detail panel, and mapping copy that says RadCN ships composition slots instead of a React table engine. `radcn/apps/docs/tests/coverage.spec.ts` verifies the public Data Table docs route renders a RadCN preview hook. `radcn/fixtures/candidate-remix/app/fixtures/data-table.tsx`, `radcn/fixtures/scenarios/index.ts`, and `radcn/fixtures/tests/data-display.spec.ts` cover default, sort-filter, selection, pagination, row-actions, responsive-detail, custom-token, column-controls, empty, row-editing, and dashboard-composition fixtures, including package exports and negative dependency checks for `@tanstack/react-table`, drag/drop engines, Zod, Recharts, and Sonner. Existing evidence does not prove the named upstream `data-table-demo` payment data, exact filter placeholder, `Columns` checkbox dropdown contents, row action menu contents and clipboard mapping, select-all/row checkbox labels, Previous/Next button state, selected/filtered row count text, empty text with upstream colspan behavior, exact status/email/amount formatting, or the full React/TanStack/lucide/Tailwind mapping for this named example. | Partial | Add named docs, candidate fixture, and Playwright coverage for `data-table-demo`. The follow-up should render the exact payment data and visible text, use native forms/links/checkboxes and existing RadCN Button/Checkbox/DropdownMenu/Input/Table/DataTable primitives, prove filter/sort/column visibility/selection/row actions/pagination/empty state in browser tests, verify dependency-free mappings for React/TanStack/lucide/Tailwind/clipboard behavior, and keep block-specific dashboard behavior out of the direct example unless a later block audit brings it in. |

## Related Block

Upstream also includes a dashboard block data-table component at
`vendor/shadcn-ui/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/data-table.tsx`.
That file is related evidence for future block parity, not a direct example
row for this audit. It should stay out of the `## Examples` table and be
handled by a later block-focused issue or experiment if the Issue 4 queue
starts resolving upstream blocks.

## Decisions

- `data-table-demo` is a direct upstream example because `_registry.ts`
  registers it as `type: "registry:example"` with
  `registryDependencies: ["data-table"]`.
- The dashboard block data-table file is related but not a direct example row.
- React client component state maps to explicit server state, query strings,
  submitted form values, native inputs, or small app-owned browser
  enhancement. It should not make React a RadCN dependency.
- TanStack Table remains a non-dependency. RadCN owns composable slots and
  public hooks; apps own row models, sorting/filtering algorithms, pagination
  state, and column visibility state.
- Upstream `ColumnDef`, `useReactTable`, and `flexRender` mechanics map to
  app-owned data rendering over RadCN `DataTable` and `Table` primitives.
- Upstream sorting state maps to sortable links, submitted route state, or
  app-owned enhancement over `DataTableHeaderCell` and
  `data-radcn-data-table-sort`.
- Upstream filter state maps to native forms and `Input` controls; the named
  example still needs exact `Filter emails...` evidence.
- Upstream column visibility maps to `DropdownMenuCheckboxItem` controls and
  app-owned visible-column state, not a package table engine.
- Upstream row selection maps to native `Checkbox` controls, selected row data
  state, and `DataTableSelectionSummary`.
- Upstream row action menus map to existing RadCN `DropdownMenu` primitives;
  clipboard writing remains app-owned browser behavior.
- Upstream Button, Checkbox, DropdownMenu, Input, and Table composition maps to
  existing RadCN package primitives.
- Upstream lucide `ArrowUpDown`, `ChevronDown`, and `MoreHorizontal` icons map
  to app-owned presentation or package-owned static glyph/icon choices; they
  must not introduce `lucide-react`.
- Upstream `className` maps to `class`, explicit class composition, style,
  CSS variables, and package/app CSS.
- Upstream Tailwind sizing, flex, spacing, border, rounded, overflow, text,
  capitalize, lowercase, right-align, and font utilities map to RadCN package
  classes, class/style props, CSS variables, or app CSS.
- Upstream empty state text `No results.` and selected-row `data-state` are
  user-facing/state evidence requirements for the named follow-up.
- Existing generic Data Table docs and fixtures are good substrate evidence,
  but not exact named `data-table-demo` parity.
- Vendor source remains read-only evidence and should not be imported or
  committed into RadCN.
