# Experiment 41: Audit badge example parity

## Description

The regenerated Issue 4 parity inventory now recommends example parity for
`badge`. Upstream shadcn/ui New York v4 has four Badge examples:

- `badge-demo`
- `badge-destructive`
- `badge-outline`
- `badge-secondary`

Current RadCN already ships `radcn/badge`, basic Badge docs, candidate fixture
routes for variant and custom-class coverage, and Playwright assertions for
destructive, link, and custom styling hooks. This experiment audits whether
that evidence fully covers the upstream Badge examples before implementation.
It should separate primitive Badge variants from richer `badge-demo`
composition such as icon badges, custom class color overrides, pill/count
badges, link behavior, and app-owned icon presentation.

This is an audit-only experiment. It must not change RadCN package APIs, docs
pages, fixture routes, tests, generated parity state, or resolved-cluster state.

## Changes

- Create
  `issues/0004-complete-shadcn-parity-and-docs/badge-example-inventory.md`.
  - List all four upstream Badge example ids:
    `badge-demo`, `badge-destructive`, `badge-outline`, and
    `badge-secondary`.
  - For each example, record user-facing behavior, upstream mechanics, current
    RadCN evidence, outcome, and follow-up.
  - Use outcomes `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - Explicitly record whether RadCN already supports default, secondary,
    destructive, outline, ghost, and link variants; custom classes/styles;
    icon children; count/pill badge styling; href rendering; public hooks; and
    docs/fixture/Playwright evidence.
  - Record mapping decisions for shadcn `className`, Tailwind utilities,
    `lucide-react` icons, `data-slot`, React prop spreading, link behavior,
    custom pill dimensions, numeric/count content, vendor source, and RadCN
    package/docs/fixture/test evidence.
- Inspect upstream references:
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
  - `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/badge-demo.json`
  - `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/badge-destructive.json`
  - `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/badge-outline.json`
  - `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/badge-secondary.json`
- Inspect current RadCN evidence:
  - `radcn/packages/radcn/src/components/badge.tsx`
  - `radcn/packages/radcn/src/styles/tokens.css`
  - `radcn/apps/docs/app/content/components.tsx`
  - `radcn/apps/docs/tests/coverage.spec.ts`
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/static-display.tsx`
  - `radcn/fixtures/tests/static-display.spec.ts`
  - relevant package exports and dependency checks for `radcn/badge`.
- Update Issue 4 `README.md` learnings with the audit result and the next
  recommended implementation cluster.
- Do not change `radcn/packages/radcn`, docs app source, fixture app source,
  tests, `resolved-clusters.json`, or generated `parity-inventory.md` in this
  experiment except for issue documentation.

## Verification

Pass criteria:

- `badge-example-inventory.md` exists and contains exactly one table row for
  each upstream Badge example id.
- A deterministic Node check proves all four upstream Badge example ids appear
  exactly once and no extra example rows exist:
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/badge-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const ids = [
    'badge-demo',
    'badge-destructive',
    'badge-outline',
    'badge-secondary',
  ]
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1])
  let failed = rows.length !== ids.length
  if (rows.length !== ids.length) {
    console.log(`row-count: ${rows.length}`)
  }
  for (const id of ids) {
    const pattern = new RegExp('\\| `'+id+'` \\|', 'g')
    const count = (examples.match(pattern) || []).length
    console.log(`${id}: ${count}`)
    if (count !== 1) failed = true
  }
  for (const row of rows) {
    if (!ids.includes(row)) {
      console.log(`unexpected: ${row}`)
      failed = true
    }
  }
  if (failed) process.exit(1)
  NODE
  ```
- The inventory distinguishes current evidence from follow-up work and does
  not mark `badge` resolved unless every upstream Badge example is `Covered`
  or `Intentional divergence`.
- The inventory explicitly addresses:
  - default, secondary, destructive, outline, ghost, and link variants;
  - icon children and whether lucide icons are app-owned presentation;
  - count/pill badge styling and numeric content;
  - custom class/style mapping from Tailwind utilities to RadCN classes/styles
    and CSS variables;
  - `className` to `class`, `data-slot` to public hooks/classes, and React prop
    spreading to explicit Remix UI props;
  - current RadCN package/docs/fixture/Playwright evidence.
- `issues/0004-complete-shadcn-parity-and-docs/README.md` records the audit
  conclusion and the next recommended experiment.
- `rg -n "badge-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md`
  finds the new learning.
- `git diff --check`
- `git status --short` shows only expected issue documentation changes before
  the plan/result commits.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any upstream Badge example id.
- The audit treats `lucide-react`, Tailwind, React, or vendor source as a
  mandatory RadCN Badge dependency.
- The audit marks `badge` resolved without package/docs/fixture/test evidence
  for all four upstream Badge examples.
- The audit conflates Badge-owned behavior with app-owned icon, layout, href,
  count formatting, or custom-class styling decisions.
- The experiment changes package, docs app, fixture, test, resolved-cluster, or
  generated parity source instead of staying an audit.

## Design Review

Reviewer: Goodall the 2nd (`019e9b99-77bb-7782-ba01-f493223eb013`)

Fresh context: yes (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval result: approved. Goodall the 2nd confirmed that the issue README
links Experiment 41 as `Designed`, the experiment has Description, Changes,
Verification, and Design Review sections, the scope is audit-only with
source/test changes explicitly excluded, verification has concrete inventory
row checks, pass/fail criteria, README learning checks, `git diff --check`,
expected working tree scope, and vendor cleanliness checks, and the technical
plan matches the upstream Badge examples including the richer `badge-demo`
icon, custom class, and count/pill cases.
