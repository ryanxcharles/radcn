# Experiment 79: Audit accordion example parity

## Description

The regenerated parity inventory after Experiment 78 recommends accordion as
the next unresolved example cluster. Upstream shadcn/ui New York v4 currently
has one accordion example, `accordion-demo`, plus the upstream Accordion UI
implementation. RadCN already exports `radcn/accordion`, has candidate fixtures
for single, multiple, disabled, and custom-token behavior, and has Playwright
coverage for native details/summary hooks, single behavior, multiple behavior,
keyboard toggling, disabled state, and customization hooks.

This experiment should audit the upstream accordion example against current
RadCN evidence and produce a focused inventory that determines whether the
cluster is already covered or which exact named-example gaps remain. It should
not implement the named example yet. The likely risk is not package API parity:
RadCN already provides Accordion, AccordionItem, AccordionTrigger, and
AccordionContent with native disclosure semantics. The likely remaining gap is
named docs/fixture/test evidence for the exact upstream `accordion-demo`
composition:

- `type="single"`;
- `collapsible`;
- `className="w-full"`;
- `defaultValue="item-1"`;
- three items with values `item-1`, `item-2`, and `item-3`;
- trigger text `Product Information`, `Shipping Details`, and `Return Policy`;
- two paragraph content blocks per item with the exact upstream copy;
- content class behavior equivalent to `flex flex-col gap-4 text-balance`;
- upstream Radix Accordion, React, lucide `ChevronDownIcon`, `cn`,
  `data-slot`, Tailwind classes, and animation utilities mapped to RadCN's
  dependency-free native details/summary model, public hooks, CSS tokens, and
  app/docs composition.

## Changes

- Add
  `issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md`.
  - List the upstream accordion example rows found under
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/accordion*.tsx`.
  - Summarize the upstream UI implementation from
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/accordion.tsx`.
  - Compare upstream behavior and mechanics with current RadCN package, docs,
    fixture, and Playwright evidence.
  - Mark `accordion-demo` as `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - If partial, record the exact follow-up requirements for the next
    implementation experiment.
  - Record decisions for native details/summary semantics, single/collapsible
    behavior, default item state, chevron/icon mapping, content layout,
    animation mapping, styling hooks, disabled behavior, Radix non-dependency,
    React non-dependency, lucide non-dependency, Tailwind/className/data-slot/
    cn mapping, and vendor source.
- Update Issue 4 `README.md`.
  - Add Experiment 79 to the experiments index as `Designed`.
  - Do not add final learnings until the experiment result is recorded.

No package, docs app, fixture, test, inventory-regeneration, or
`resolved-clusters.json` changes should be made in this audit experiment unless
the audit itself exposes an already-covered result that can be proven entirely
from existing evidence. If that happens, record the evidence and keep the
change limited to issue documentation.

## Verification

Pass criteria:

- `accordion-example-inventory.md` exists and has:
  - `# Accordion Example Inventory`;
  - `## Summary`;
  - `## Examples`;
  - a table with exactly one upstream row, `accordion-demo`;
  - `## Decisions`.
- A deterministic check proves the upstream vendor example count is exactly
  one and the inventory table contains exactly one matching row:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const vendor = fs.readdirSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples')
    .filter((file) => /^accordion.*\.tsx$/.test(file))
    .map((file) => file.replace(/\.tsx$/, ''))
    .sort()
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md', 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)].map((match) => match[1]).sort()
  console.log(`vendor: ${vendor.join(', ')}`)
  console.log(`inventory: ${rows.join(', ')}`)
  if (vendor.length !== 1 || vendor[0] !== 'accordion-demo') process.exit(1)
  if (rows.length !== 1 || rows[0] !== 'accordion-demo') process.exit(1)
  NODE
  ```
- A deterministic check proves the row outcome is one of `Covered`, `Partial`,
  `Missing`, or `Intentional divergence` and that any non-covered row has a
  non-empty follow-up:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md', 'utf8')
  const row = text.match(/^\| `accordion-demo` \|([^\n]+)$/m)?.[0]
  if (!row) process.exit(1)
  const cells = row.split('|').map((cell) => cell.trim())
  const outcome = cells[4]
  const followUp = cells[5]
  console.log(`outcome: ${outcome}`)
  console.log(`follow-up: ${followUp}`)
  if (!['Covered', 'Partial', 'Missing', 'Intentional divergence'].includes(outcome)) process.exit(1)
  if (outcome !== 'Covered' && (!followUp || followUp === 'No follow-up.')) process.exit(1)
  NODE
  ```
- The audit explicitly mentions and classifies these upstream mechanics:
  React client component marker, Radix Accordion primitive, lucide
  `ChevronDownIcon`, `cn`, `data-slot`, Tailwind `w-full`, Tailwind flex/gap/
  text-balance content classes, accordion animation utilities, trigger
  disabled styling, `className`, default value, type, collapsible behavior,
  item values, exact trigger text, and exact paragraph copy.
- The audit explicitly compares current RadCN evidence from:
  - `radcn/packages/radcn/src/components/accordion.tsx`;
  - `radcn/apps/docs/app/content/components.tsx`;
  - `radcn/fixtures/candidate-remix/app/fixtures/accordion.tsx`;
  - `radcn/fixtures/tests/accordion.spec.ts`;
  - `radcn/apps/docs/tests/coverage.spec.ts`.
- The Issue 4 README `## Learnings` section records the accordion audit
  result and the next recommended experiment after the audit result is known.
  A deterministic check finds both the experiment and inventory references:

  ```text
  rg -n "Experiment 79|accordion-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
  ```
- `git diff --check`
- `git status --short` shows only the new experiment file,
  `accordion-example-inventory.md`, and the Issue 4 README before the result
  commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits the exact upstream `accordion-demo` item values, trigger
  text, or paragraph copy.
- The audit marks `accordion-demo` covered without docs, fixture, and
  Playwright evidence for the named example, unless it records a precise
  intentional divergence with enough existing evidence.
- The audit changes package, docs app, fixture, or Playwright implementation
  files before the follow-up implementation experiment is designed and
  approved.
- The audit mutates vendor source or adds forbidden dependencies such as React,
  Radix, lucide-react, Tailwind, or class-variance-authority.

## Design Review

Reviewer: Nash the 2nd (`019e9d36-dfd6-74b1-b151-0cfe845e6e88`),
fresh-context Codex subagent (`fork_context: false`).

Initial findings:

- Blocker: the experiment file did not yet have a `## Design Review` section.
  Fixed by adding this section before the plan commit.
- Major: the verification criteria did not require Issue 4 README learnings to
  record the accordion audit result and next experiment recommendation. Fixed
  by adding that pass criterion and a deterministic `rg` check.
- Minor: none.

Re-review findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval: approved. The reviewer confirmed the issue README links
Experiment 79 as `Designed`, scope is narrow and audit-only, the upstream
`accordion-demo` surface is captured accurately, current RadCN evidence is
relevant enough to decide the next implementation experiment, the `## Design
Review` section is recorded, and verification now requires README learnings for
the audit result and next recommendation.

## Result

**Result:** Partial

Created `accordion-example-inventory.md` for the single upstream New York v4
Accordion example, `accordion-demo`. The audit confirms RadCN already covers
the Accordion package API, native details/summary disclosure semantics, single
and multiple modes, collapsible behavior, disabled items, keyboard toggling,
public data hooks, icon hooks, and custom token styling without React, Radix,
or lucide dependencies.

The cluster remains partial because current docs, fixtures, and tests do not
prove the exact named upstream `accordion-demo` composition:
`defaultValue="item-1"`, values `item-1`/`item-2`/`item-3`, the exact
`Product Information`, `Shipping Details`, and `Return Policy` triggers, two
exact paragraphs under each item, full-width styling, or the `flex flex-col
gap-4 text-balance` content layout mapping.

The audit also found a current RadCN Accordion limitation that the next
implementation experiment must handle deliberately: root `defaultValue` and
`name` are metadata hooks today. They emit `data-default-value` and
`data-accordion-name`, but they do not derive child item `open` or `name`
values. Current working fixtures pass `AccordionItem open` and matching item
`name` props explicitly.

Verification commands run:

```text
node - <<'NODE'
const fs = require('fs')
const vendor = fs.readdirSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples')
  .filter((file) => /^accordion.*\.tsx$/.test(file))
  .map((file) => file.replace(/\.tsx$/, ''))
  .sort()
const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md', 'utf8')
const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)].map((match) => match[1]).sort()
console.log(`vendor: ${vendor.join(', ')}`)
console.log(`inventory: ${rows.join(', ')}`)
if (vendor.length !== 1 || vendor[0] !== 'accordion-demo') process.exit(1)
if (rows.length !== 1 || rows[0] !== 'accordion-demo') process.exit(1)
NODE
```

Passed with `vendor: accordion-demo` and `inventory: accordion-demo`.

```text
node - <<'NODE'
const fs = require('fs')
const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md', 'utf8')
const row = text.match(/^\| `accordion-demo` \|([^\n]+)$/m)?.[0]
if (!row) process.exit(1)
const cells = row.split('|').map((cell) => cell.trim())
const outcome = cells[4]
const followUp = cells[5]
console.log(`outcome: ${outcome}`)
console.log(`follow-up: ${followUp}`)
if (!['Covered', 'Partial', 'Missing', 'Intentional divergence'].includes(outcome)) process.exit(1)
if (outcome !== 'Covered' && (!followUp || followUp === 'No follow-up.')) process.exit(1)
NODE
```

Passed with `outcome: Partial` and a non-empty implementation follow-up.

```text
rg -n "Experiment 79|accordion-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
```

Passed.

```text
git diff --check
```

Passed.

```text
git status --short
```

Passed with the expected issue-only output before the result commit:

```text
 M issues/0004-complete-shadcn-parity-and-docs/79-audit-accordion-example-parity.md
 M issues/0004-complete-shadcn-parity-and-docs/README.md
?? issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md
```

```text
for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done
```

Passed. No vendor checkout output.

Expected changed files before result commit:

```text
issues/0004-complete-shadcn-parity-and-docs/79-audit-accordion-example-parity.md
issues/0004-complete-shadcn-parity-and-docs/README.md
issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md
```

No package, docs app, fixture, Playwright implementation, generated parity
inventory, resolved-cluster, package metadata, lockfile, or vendor source
changes were made.

## Conclusion

Accordion example parity is partially complete. The next experiment should
implement named `accordion-demo` docs, candidate fixture, and Playwright
coverage with the exact upstream values, trigger text, paragraph copy,
first-open state, full-width styling evidence, content layout mapping, and
dependency-divergence copy. It must also decide whether RadCN should keep the
current explicit item-level mapping for `defaultValue` and single-group names,
or enhance the Accordion package so root props derive item state/grouping.

## Completion Review

Reviewer: Planck the 2nd (`019e9d3a-ab32-7493-b11f-4e8362e6e843`),
fresh-context Codex subagent (`fork_context: false`).

Initial findings:

- Blocker: the audit missed a material RadCN Accordion limitation. Root
  `defaultValue` and `name` emit metadata only today; child item `open` and
  `name` must still be passed explicitly. Fixed by updating
  `accordion-example-inventory.md`, the Issue 4 README learning, and the
  experiment result/conclusion to record this limitation and make the next
  experiment decide between documenting the current explicit item-level mapping
  or evaluating a package enhancement.
- Major: the result record omitted the required `git status --short`
  verification command and output. Fixed by recording the command and expected
  three-file output.
- Minor: none.

Re-review findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval: approved. The reviewer confirmed both findings are resolved, no new
blocker was introduced, the result commit has not been made, vendor checkouts
are clean, only issue documentation changed, and the audit now gives the next
experiment the necessary Accordion default-state and grouping limitation.
