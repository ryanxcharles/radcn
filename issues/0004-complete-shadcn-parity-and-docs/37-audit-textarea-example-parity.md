# Experiment 37: Audit textarea example parity

## Description

The regenerated Issue 4 parity inventory now recommends example parity for
`textarea`. RadCN already exports `Textarea`, and current fixtures prove default
and disabled native textarea behavior. Prior Form, Field, and InputGroup
experiments also cover several textarea compositions, but those outcomes need
to be mapped against the upstream shadcn/ui New York v4 textarea-related
example set before implementation.

Upstream shadcn/ui has 10 New York v4 textarea-related examples:

- `textarea-demo`
- `textarea-disabled`
- `textarea-with-button`
- `textarea-with-label`
- `textarea-with-text`
- `field-textarea`
- `input-group-textarea`
- `form-rhf-textarea`
- `form-tanstack-textarea`
- `form-formisch-textarea`

This experiment audits those 10 examples before implementation. It should
separate what the `Textarea` package itself must support from composition owned
by Button, Label, Field, InputGroup, Form, Card, validation libraries, toast,
app-owned icons, docs examples, fixture routes, and Playwright proof. It must
not implement new package APIs, docs examples, fixture routes, or tests.

## Changes

- Create
  `issues/0004-complete-shadcn-parity-and-docs/textarea-example-inventory.md`.
  - List all 10 upstream textarea-related example ids:
    `textarea-demo`, `textarea-disabled`, `textarea-with-button`,
    `textarea-with-label`, `textarea-with-text`, `field-textarea`,
    `input-group-textarea`, `form-rhf-textarea`, `form-tanstack-textarea`, and
    `form-formisch-textarea`.
  - For each example, record user-facing behavior, upstream mechanics, current
    RadCN evidence, outcome, and follow-up.
  - Use outcomes `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - Explicitly record whether RadCN already supports native textarea output,
    placeholder text, disabled state, rows/min-height styling, labels,
    helper text, Button composition, Field composition, InputGroupTextarea
    toolbar composition, Form composition, validation/error state, reset/submit
    behavior, and app-owned icon presentation.
  - Record mapping decisions for shadcn `data-slot`, Tailwind layout/style
    utilities, React prop spreading, React Hook Form, TanStack Form, Formisch,
    Zod, Valibot, toast side effects, Tabler icons, Button composition, Label
    composition, Field composition, InputGroup composition, and current RadCN
    package/docs/fixture/Playwright evidence.
- Inspect these upstream references:
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/textarea.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/textarea-demo.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/textarea-disabled.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/textarea-with-button.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/textarea-with-label.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/textarea-with-text.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/field-textarea.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/input-group-textarea.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/form-rhf-textarea.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/form-tanstack-textarea.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/form-formisch-textarea.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
- Inspect current RadCN evidence:
  - `radcn/packages/radcn/src/components/textarea.tsx`
  - `radcn/packages/radcn/src/components/input-group.tsx`
  - `radcn/packages/radcn/src/components/field.tsx`
  - `radcn/packages/radcn/src/components/form.tsx`
  - `radcn/packages/radcn/src/styles/tokens.css`
  - `radcn/apps/docs/app/content/components.tsx`
  - `radcn/apps/docs/tests/coverage.spec.ts`
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/textarea.tsx`
  - `radcn/fixtures/candidate-remix/app/fixtures/field.tsx`
  - `radcn/fixtures/candidate-remix/app/fixtures/form.tsx`
  - `radcn/fixtures/candidate-remix/app/fixtures/input-group.tsx`
  - `radcn/fixtures/tests/native-controls.spec.ts`
  - `radcn/fixtures/tests/form-input-cluster.spec.ts`
  - relevant docs/fixture tests for Button, Label, Field, Form, and InputGroup
    composition if they contain existing textarea evidence.
- Update Issue 4 `README.md` learnings with the audit result and the next
  recommended implementation cluster.
- Do not change `radcn/packages/radcn`, docs app source, fixture app source, or
  tests in this experiment except for issue documentation.

## Verification

Pass criteria:

- `textarea-example-inventory.md` exists and contains exactly one table row for
  each upstream textarea-related example id.
- A deterministic Node check proves all 10 upstream textarea-related example
  ids appear exactly once:
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/textarea-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const ids = [
    'textarea-demo',
    'textarea-disabled',
    'textarea-with-button',
    'textarea-with-label',
    'textarea-with-text',
    'field-textarea',
    'input-group-textarea',
    'form-rhf-textarea',
    'form-tanstack-textarea',
    'form-formisch-textarea',
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
- The inventory distinguishes current evidence from follow-up work and does not
  mark `textarea` resolved unless every upstream textarea-related example is
  `Covered` or `Intentional divergence`.
- The inventory explicitly addresses:
  - default textarea placeholder behavior;
  - disabled textarea behavior;
  - Button composition with textarea;
  - Label and helper text composition;
  - Field and FieldDescription composition;
  - InputGroupTextarea toolbar composition with block-start and block-end
    addons;
  - Form textarea validation, invalid state, reset, submit, Card layout, and
    toast/result behavior mappings;
  - whether React Hook Form, TanStack Form, Formisch, Zod, Valibot, Sonner
    toast, Tabler icons, and React event handlers are app-owned mappings rather
    than Textarea package dependencies;
  - Tailwind utility and `data-slot` mapping to RadCN classes, styles, data
    hooks, or CSS variables;
  - current RadCN package/docs/fixture/Playwright evidence.
- `issues/0004-complete-shadcn-parity-and-docs/README.md` records the audit
  conclusion and the next recommended experiment.
- `rg -n "textarea-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md`
  finds the new learning.
- `git diff --check`
- `git status --short` shows only expected issue documentation changes before
  the plan/result commits.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any upstream textarea-related example id.
- The audit treats React, React Hook Form, TanStack Form, Formisch, Zod,
  Valibot, Sonner toast, Tabler icons, Tailwind utility classes, or vendor
  source as mandatory `Textarea` package dependencies.
- The audit marks `textarea` resolved without package/docs/fixture/test
  evidence for all 10 upstream textarea-related examples.
- The experiment changes package, docs app, fixture, or test source instead of
  staying an audit.

## Design Review

Reviewer: Lovelace (`019e9b70-c7ca-7723-a5d4-ffa6a30c0e96`)

Fresh context: yes (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: the initial deterministic row check proved each required id appeared
  once but did not reject extra inventory rows. Fixed by updating the planned
  Node check to require exactly 10 example rows and reject unexpected ids.

Approval result: approved. Lovelace confirmed that the issue README links
Experiment 37 as `Designed`, the experiment has the required Description,
Changes, Verification, and Design Review sections, the scope is audit-only,
the plan excludes package/docs/fixture/test implementation, verification has
concrete pass/fail and hygiene criteria, vendor checkouts are clean, the design
accounts for the 10 requested textarea-related examples, and React/form/schema/
toast/icon/Tailwind/vendor concerns are treated as mapping decisions rather
than required `Textarea` package dependencies.

## Result

**Result:** Pass

Created
`issues/0004-complete-shadcn-parity-and-docs/textarea-example-inventory.md` as
an audit-only inventory for all 10 upstream New York v4 textarea-related
examples:

- `textarea-demo`
- `textarea-disabled`
- `textarea-with-button`
- `textarea-with-label`
- `textarea-with-text`
- `field-textarea`
- `input-group-textarea`
- `form-rhf-textarea`
- `form-tanstack-textarea`
- `form-formisch-textarea`

The audit does not mark `textarea` resolved. Prior clusters already cover
`field-textarea`, `input-group-textarea`, `form-rhf-textarea`,
`form-tanstack-textarea`, and `form-formisch-textarea`, including the
intentional dependency mappings for React Hook Form, TanStack Form, Formisch,
Zod, Valibot, Sonner toast, Tabler icons, and app-owned presentation/state.
The remaining follow-up is named docs, fixture, and Playwright proof for the 5
plain Textarea examples: demo, disabled, with Button, with Label, and with
helper text.

The initial deterministic row-count check from the plan counted backticked file
paths in the current-evidence table. The check was tightened to inspect only
the `## Examples` section before verification was recorded.

Verification run:

```text
node - <<'NODE'
const fs = require('fs')
const file = 'issues/0004-complete-shadcn-parity-and-docs/textarea-example-inventory.md'
const text = fs.readFileSync(file, 'utf8')
const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
const ids = [
  'textarea-demo',
  'textarea-disabled',
  'textarea-with-button',
  'textarea-with-label',
  'textarea-with-text',
  'field-textarea',
  'input-group-textarea',
  'form-rhf-textarea',
  'form-tanstack-textarea',
  'form-formisch-textarea',
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

Output:

```text
textarea-demo: 1
textarea-disabled: 1
textarea-with-button: 1
textarea-with-label: 1
textarea-with-text: 1
field-textarea: 1
input-group-textarea: 1
form-rhf-textarea: 1
form-tanstack-textarea: 1
form-formisch-textarea: 1
```

```text
rg -n 'default textarea|disabled textarea|Button|Label|helper|FieldDescription|InputGroupTextarea|block-start|block-end|React Hook Form|TanStack Form|Formisch|Zod|Valibot|Sonner|Tabler|React event|Tailwind|data-slot|Playwright|fixture|docs|textarea-example-inventory' issues/0004-complete-shadcn-parity-and-docs/textarea-example-inventory.md issues/0004-complete-shadcn-parity-and-docs/README.md
```

Confirmed that the inventory addresses the required examples and mapping
topics: default placeholder, disabled state, Button composition, Label/helper
text composition, FieldDescription composition, InputGroupTextarea block-start
and block-end addons, Form validation/error/reset/submit/Card/toast mappings,
React Hook Form, TanStack Form, Formisch, Zod, Valibot, Sonner, Tabler icons,
React event handlers, Tailwind, `data-slot`, current docs, fixture, and
Playwright evidence.

Additional verification:

```text
rg -n "textarea-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
git diff --check
for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done
```

The README search found the new learning. `git diff --check` and vendor status
produced no output.

## Completion Review

Reviewer: Euclid (`019e9b74-dcbb-7082-95b3-3967bbb60454`)

Fresh context: yes (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval result: approved. Euclid verified that the audit-only scope holds,
the experiment has Result and Conclusion, the README marks Experiment 37
`Pass` and records the follow-up implementation depth, the inventory contains
exactly the 10 requested textarea-related example rows and no extras, the
inventory does not mark `textarea` resolved and recommends docs/fixtures/
Playwright depth for the 5 plain examples, upstream registry evidence supports
the 10 ids, `git diff --check` passed, vendor cleanliness produced no output,
and the result commit had not been made before completion review.

## Conclusion

Textarea example parity is not complete. The next experiment should implement
Textarea example parity depth for `textarea-demo`, `textarea-disabled`,
`textarea-with-button`, `textarea-with-label`, and `textarea-with-text`.
