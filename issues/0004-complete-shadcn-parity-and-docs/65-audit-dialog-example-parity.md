# Experiment 65: Audit dialog example parity

## Description

The regenerated Issue 4 parity inventory now recommends example parity for
`dialog`. Upstream shadcn/ui New York v4 has two Dialog examples in the current
inferred cluster:

- `dialog-demo`
- `dialog-close-button`

Current RadCN already ships `radcn/dialog`, docs coverage, candidate fixture
routes, and Playwright coverage for modal semantics, trigger opening, default
open state, focus trap, focus restoration, Escape dismissal, outside dismissal,
scroll lock, close controls, custom tokens, and public Dialog hooks. This
experiment audits whether that evidence fully covers the two upstream Dialog
examples before implementation. It should separate Dialog-owned behavior from
app-owned Button, Input, Label, native form, read-only input, copy/share-link,
React state, Radix, `asChild`, `lucide-react`, `className`, `data-slot`,
Tailwind utilities, `cn`, and vendor source.

This is an audit-only experiment. It must not change RadCN package APIs, docs
pages, fixture routes, tests, generated parity state, or resolved-cluster state.

## Changes

- Create
  `issues/0004-complete-shadcn-parity-and-docs/dialog-example-inventory.md`.
  - List both active upstream Dialog example ids: `dialog-demo` and
    `dialog-close-button`.
  - For each example, record user-facing behavior, upstream mechanics, current
    RadCN evidence, outcome, and follow-up.
  - Use outcomes `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - Explicitly record whether RadCN already supports Dialog root, trigger,
    portal, overlay, content, header, footer, title, description, close action,
    default close button, `showCloseButton`, modal role, `aria-modal`,
    `aria-labelledby`, `aria-describedby`, focus movement, focus restoration,
    focus trap, Escape dismissal, outside dismissal, scroll lock, default open,
    custom classes/styles/tokens, docs evidence, candidate fixture evidence,
    reference fixture evidence if present, and Playwright evidence.
  - Record mapping decisions for shadcn React props, Radix `DialogPrimitive`,
    `asChild`, controlled `open`/`onOpenChange` if relevant, `className`,
    `data-slot`, Tailwind utilities, `cn`, `DialogContent showCloseButton`,
    `DialogFooter showCloseButton`, default `XIcon` close button,
    `lucide-react`, Button composition, Input composition, Label composition,
    native form submission, `sr-only` labels, read-only inputs, share-link
    copying boundaries, vendor source, and RadCN package/docs/fixture/test
    evidence.
- Inspect upstream references:
  - `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/dialog.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/dialog-demo.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/dialog-close-button.tsx`
  - `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/dialog.json`
  - `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/dialog-demo.json`
  - `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/dialog-close-button.json`
  - note Alert Dialog, Dropdown Menu, Command, Drawer, Sheet, Button, Input,
    Label, and Form references only where they clarify out-of-cluster
    composition.
- Inspect current RadCN evidence:
  - `radcn/packages/radcn/src/components/dialog.tsx`
  - `radcn/packages/radcn/src/styles/index.ts`
  - `radcn/apps/docs/app/content/components.tsx`
  - `radcn/apps/docs/tests/coverage.spec.ts`
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/dialog.tsx`
  - `radcn/fixtures/tests/dialog.spec.ts`
  - relevant Button, Input, Label, Form, Alert Dialog, Command, Dropdown Menu,
    Drawer, and Sheet evidence only where it clarifies Dialog composition
    boundaries.
- Update Issue 4 `README.md` learnings with the audit result and the next
  recommended experiment.
- Do not change `radcn/packages/radcn`, docs app source, fixture app source,
  tests, `resolved-clusters.json`, or generated `parity-inventory.md` in this
  experiment except for issue documentation.

## Verification

Pass criteria:

- `dialog-example-inventory.md` exists and contains exactly one table row for
  each active upstream Dialog example id.
- A deterministic Node check proves both active upstream Dialog example ids
  appear exactly once and no extra example rows exist:
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/dialog-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const ids = [
    'dialog-demo',
    'dialog-close-button',
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
  not mark `dialog` resolved unless every active upstream Dialog example is
  `Covered` or `Intentional divergence`.
- The inventory explicitly addresses:
  - Dialog root, trigger, portal, overlay, content, header, footer, title,
    description, close action, default close button, `showCloseButton`, modal
    role, `aria-modal`, `aria-labelledby`, `aria-describedby`, focus movement,
    focus restoration, focus trap, Escape dismissal, outside dismissal, scroll
    lock, default open, custom classes/styles/tokens, and
    docs/fixture/Playwright evidence;
  - React props, Radix `DialogPrimitive`, `asChild`, controlled open state,
    `onOpenChange`, `className`, `data-slot`, Tailwind utilities, `cn`,
    `XIcon`, `lucide-react`, Button composition, Input composition, Label
    composition, native forms, `sr-only` labels, read-only inputs, share-link
    behavior, and vendor source as mappings, existing evidence, separate
    resolved clusters, non-dependencies, possible intentional divergences, or
    possible follow-up work rather than mandatory new dependencies.
- `issues/0004-complete-shadcn-parity-and-docs/README.md` records the audit
  conclusion and the next recommended experiment.
- `rg -n "dialog-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md`
  finds the new learning.
- `git diff --check`
- `git status --short` shows only expected issue documentation changes before
  the plan/result commits.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any active upstream Dialog example id from the inventory.
- The audit treats React, Radix, `asChild`, `lucide-react`, Tailwind, `cn`,
  upstream `data-slot`, form-state libraries, clipboard behavior, or vendor
  source as mandatory RadCN Dialog dependencies.
- The audit marks `dialog` resolved without package/docs/fixture/test evidence
  for both active upstream Dialog examples or a recorded intentional divergence.
- The audit conflates Dialog-owned modal behavior with app-owned Button, Input,
  Label, Form, Alert Dialog, Command, Dropdown Menu, Drawer, Sheet, share-link,
  copy-to-clipboard, or custom-class styling decisions.
- The experiment changes package, docs app, fixture, test, resolved-cluster, or
  generated parity source instead of staying an audit.

## Design Review

Reviewer: Laplace the 2nd (`019e9c90-c95e-73a0-a401-5bb8afa1c594`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: the experiment did not yet contain a recorded `## Design Review`
  section. This was expected before recording the review and is now addressed.

Approval: approved. The reviewer confirmed that the plan satisfies the
workflow for an audit-only Dialog example parity experiment: it has the
required Description, Changes, and Verification sections, is linked from the
Issue 4 README with status `Designed`, has not started implementation,
preserves audit-only scope, includes deterministic row verification, checks
vendor cleanliness, and separates user-facing parity from React, Radix,
Tailwind, and related upstream implementation details.

## Result

**Result:** Partial

Created `dialog-example-inventory.md` and audited the two active upstream
Dialog examples: `dialog-demo` and `dialog-close-button`.

RadCN already covers the core Dialog primitive behavior: root, trigger, portal,
overlay, content, header, footer, title, description, explicit close actions,
default close-button control, modal role, ARIA relationships, focus movement,
focus trap, focus restoration, Escape dismissal, outside dismissal, scroll
lock, default open state, custom classes/styles/tokens, public hooks, and
composition with Button, Input, Label, and native form controls.

The active upstream examples are still only partially covered because current
docs, candidate fixtures, and Playwright tests prove generic Dialog behavior
rather than the named upstream `Edit profile` and `Share link` compositions.
The audit did not identify a required package API change. The likely next
experiment should add named docs examples, candidate fixture routes, and
Playwright coverage for `dialog-demo` and `dialog-close-button`, while keeping
React, Radix, `asChild`, Tailwind, `cn`, `lucide-react`, clipboard behavior,
form-state libraries, and vendor source out of RadCN dependencies.

Verification run:

- `node - <<'NODE' ... NODE` deterministic row-count check:
  `dialog-demo: 1`, `dialog-close-button: 1`.
- `rg -n "dialog-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md`
- `git diff --check`
- `git status --short`
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`

All verification passed. The only changed files are Issue 4 documentation
files.

## Conclusion

Dialog example parity needs one implementation-depth experiment. The package
already owns the modal behavior; the remaining work is named example evidence:
`dialog-demo` should prove the edit-profile form composition, and
`dialog-close-button` should prove the share-link/read-only-input composition
with an explicit secondary close action.

## Completion Review

Reviewer: Hooke the 2nd (`019e9c93-bfe4-70c2-8cb1-ba8b85e6b206`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval: approved. The reviewer confirmed that Experiment 65 includes
`## Result` and `## Conclusion`, records the result as `Partial`, updates the
Issue 4 README index to `Partial`, limits changes to Issue 4 documentation,
keeps vendor checkouts clean, contains exactly the active `dialog-demo` and
`dialog-close-button` rows, does not overclaim completion, and correctly
recommends a later implementation-depth experiment for named docs, fixture
routes, and Playwright coverage.
