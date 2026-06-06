# Experiment 33: Audit toggle example parity

## Description

The regenerated Issue 4 parity inventory now recommends example parity for
`toggle`. RadCN already exports a native `Toggle` package component with
pressed state, disabled state, variants, sizes, enhancement, docs seed coverage,
fixture routes, and Playwright tests. The current proof is general Toggle
behavior, not a named audit of the 6 upstream shadcn/ui Toggle examples.

Upstream shadcn/ui has 6 plain Toggle component examples:

- `toggle-demo`
- `toggle-disabled`
- `toggle-lg`
- `toggle-outline`
- `toggle-sm`
- `toggle-with-text`

This experiment audits those 6 examples before implementation. It should
separate what the `Toggle` package itself must support from presentation owned
by app icons, text labels, docs examples, fixture routes, and Playwright proof.
It must not implement new package APIs, docs examples, fixture routes, or tests.
It must not drift into `toggle-group`, which was resolved by Experiments 23 and
24.

## Changes

- Create
  `issues/0004-complete-shadcn-parity-and-docs/toggle-example-inventory.md`.
  - List all 6 upstream Toggle example ids: `toggle-demo`,
    `toggle-disabled`, `toggle-lg`, `toggle-outline`, `toggle-sm`, and
    `toggle-with-text`.
  - For each example, record user-facing behavior, upstream mechanics, current
    RadCN evidence, outcome, and follow-up.
  - Use outcomes `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - Explicitly record whether RadCN already supports `size="sm"`,
    `size="lg"`, `variant="outline"`, disabled state, accessible names through
    `ariaLabel`, pressed state through `aria-pressed`/`data-state`, text
    children, icon-only children, icon plus text children, and app-authored
    selected-state icon styling.
  - Record mapping decisions for lucide icons, Radix Toggle, `asChild`/slot
    absence if relevant, Tailwind utility classes, stateful `data-state`
    styling, `aria-label`, icon-only accessible names, text children, size and
    variant classes, current docs coverage, current fixture coverage, and
    current Playwright evidence.
- Inspect these upstream references:
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/toggle.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/toggle-demo.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/toggle-disabled.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/toggle-lg.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/toggle-outline.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/toggle-sm.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/toggle-with-text.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
- Inspect current RadCN evidence:
  - `radcn/packages/radcn/src/components/toggle.tsx`
  - `radcn/packages/radcn/src/styles/tokens.css`
  - `radcn/apps/docs/app/content/components.tsx`
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/toggle.tsx`
  - `radcn/fixtures/tests/toggle.spec.ts`
  - `issues/0004-complete-shadcn-parity-and-docs/toggle-group-example-inventory.md`
- Update Issue 4 `README.md` learnings with the audit result and the next
  recommended implementation cluster.
- Do not change `radcn/packages/radcn`, docs app source, fixture app source, or
  tests in this experiment except for issue documentation.

## Verification

Pass criteria:

- `toggle-example-inventory.md` exists and contains exactly one table row for
  each upstream Toggle example id.
- A deterministic Node check proves all 6 upstream Toggle example ids appear
  exactly once:
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/toggle-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const ids = [
    'toggle-demo',
    'toggle-disabled',
    'toggle-lg',
    'toggle-outline',
    'toggle-sm',
    'toggle-with-text',
  ]
  let failed = false
  for (const id of ids) {
    const pattern = new RegExp('\\| `'+id+'` \\|', 'g')
    const count = (text.match(pattern) || []).length
    console.log(`${id}: ${count}`)
    if (count !== 1) failed = true
  }
  if (failed) process.exit(1)
  NODE
  ```
- The inventory distinguishes current evidence from follow-up work and does not
  mark `toggle` resolved unless every upstream Toggle example is `Covered` or
  `Intentional divergence`.
- The inventory explicitly addresses:
  - default demo bookmark toggle with outline/small size, text, icon, and
    selected-state icon styling;
  - disabled icon-only toggle behavior;
  - large toggle size;
  - outline toggle variant;
  - small toggle size;
  - icon plus text toggle composition;
  - whether lucide icons are app presentation rather than package
    dependencies;
  - whether Radix Toggle maps to RadCN's dependency-free native button plus
    enhancement;
  - Tailwind utility mapping to RadCN classes, styles, or CSS variables;
  - current RadCN package/docs/fixture/Playwright evidence.
- `issues/0004-complete-shadcn-parity-and-docs/README.md` records the audit
  conclusion and the next recommended experiment.
- `rg -n "toggle-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md`
  finds the new learning.
- `git diff --check`
- `git status --short` shows only expected issue documentation changes before
  the plan/result commits.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any upstream Toggle example id.
- The audit drifts into `toggle-group` examples.
- The audit treats lucide, Radix Toggle, Tailwind utility classes, or vendor
  source as mandatory `Toggle` package dependencies.
- The audit marks `toggle` resolved without package/docs/fixture/test evidence
  for all 6 upstream examples.
- The experiment changes package, docs app, fixture, or test source instead of
  staying an audit.

## Design Review

Reviewer: Tesla (`019e9b4c-ed66-7801-9c2b-2d6289015839`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval result: approved. Tesla confirmed the Issue 4 README links Experiment
33 as `Designed`, the experiment has the required Description, Changes,
Verification, and Design Review sections, the scope is audit-only for exactly
the 6 plain Toggle examples, `toggle-group` drift is explicitly forbidden, no
implementation has started, verification has concrete pass/fail and hygiene
checks, vendor checkouts are clean, lucide/Radix/Tailwind are treated as
mappings rather than dependencies, and current evidence must be separated from
follow-up work.
