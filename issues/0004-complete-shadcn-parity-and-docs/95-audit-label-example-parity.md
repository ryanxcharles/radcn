# Experiment 95: Audit label example parity

## Description

The regenerated parity inventory after Experiment 94 recommends Label as the
next unresolved direct example cluster. Upstream shadcn/ui New York v4 has one
direct example, `label-demo`, registered as an example dependency on `label`.

RadCN already ships `radcn/label` with package exports, native `label` markup,
`for` wiring, disabled state evidence, package classes, public hooks, and
generic docs coverage. Other completed example clusters also compose Label
with inputs, checkboxes, dialogs, drawers, sheets, input groups, and forms.
This experiment should audit whether that evidence covers the exact direct
upstream `label-demo`, or whether a named implementation experiment is needed.

The likely remaining gap is named docs/fixture/test evidence for the upstream
checkbox-label composition:

- `"use client"` and Radix Label mechanics;
- `Label` wrapping Radix LabelPrimitive Root;
- `Checkbox id="terms"`;
- `Label htmlFor="terms"`;
- visible text `Accept terms and conditions`;
- layout equivalent to `flex items-center space-x-2`;
- Label package styling for `flex`, `items-center`, `gap-2`, `text-sm`,
  `leading-none`, `font-medium`, `select-none`, group disabled state, and peer
  disabled state;
- mappings for Checkbox, Label, Radix primitives, `htmlFor`, `className`,
  Tailwind utilities, `cn`, `data-slot`, native label activation, docs
  evidence, fixture evidence, Playwright evidence, and vendor source.

The audit should not implement named parity yet.

## Changes

- Add
  `issues/0004-complete-shadcn-parity-and-docs/label-example-inventory.md`.
  - List direct upstream Label example rows found under
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
    with `type: "registry:example"` and
    `registryDependencies: ["label"]`, and cross-check those entries against
    `examples/label*.tsx` files.
  - Summarize upstream mechanics from
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/label-demo.tsx`
    and upstream package mechanics from
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/label.tsx`.
  - Compare upstream behavior and mechanics with current RadCN package, docs,
    fixture, and Playwright evidence.
  - Mark `label-demo` as `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - If partial, record the exact follow-up requirements for the next
    implementation experiment.
  - Record decisions for React client components, Radix Label non-dependency,
    native label semantics, Checkbox composition, `for`/`htmlFor` mapping,
    click-to-toggle behavior, disabled and peer-disabled behavior, layout,
    `className`, Tailwind utility mapping, `cn`, `data-slot`, docs evidence,
    fixture evidence, Playwright evidence, custom tokens, and vendor source.
- Update Issue 4 `README.md`.
  - Add Experiment 95 to the experiments index as `Designed`.
  - Do not add final learnings until the experiment result is recorded.

No package, docs app, fixture, Playwright implementation,
`resolved-clusters.json`, or generated parity inventory changes should be made
in this audit experiment unless the audit itself proves the direct example is
already covered entirely from existing evidence. If that happens, keep the
change limited to issue documentation and required resolved-cluster/generated
inventory updates.

## Verification

Pass criteria:

- `label-example-inventory.md` exists and has:
  - `# Label Example Inventory`;
  - `## Summary`;
  - `## Examples`;
  - a table with exactly one direct upstream row, `label-demo`, using this
    header:
    `Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up`;
  - `## Decisions`.
- A deterministic check proves the direct upstream vendor Label example
  registry entry count is exactly one, the matching file-glob count is exactly
  one, and the inventory table contains exactly one matching row:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const registry = fs.readFileSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts', 'utf8')
  const registryEntries = [...registry.matchAll(/\{\s*name: "([^"]+)",\s*type: "registry:example",\s*registryDependencies: \[([^\]]*)\],[\s\S]*?path: "examples\/([^"]+)"/g)]
    .filter((match) => match[2].includes('"label"'))
    .map((match) => match[1])
    .sort()
  const files = fs.readdirSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples')
    .filter((file) => /^label.*\.tsx$/.test(file))
    .map((file) => file.replace(/\.tsx$/, ''))
    .sort()
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/label-example-inventory.md', 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)].map((match) => match[1]).sort()
  console.log(`registry: ${registryEntries.join(', ')}`)
  console.log(`files: ${files.join(', ')}`)
  console.log(`inventory: ${rows.join(', ')}`)
  if (registryEntries.length !== 1 || registryEntries[0] !== 'label-demo') process.exit(1)
  if (files.length !== 1 || files[0] !== 'label-demo') process.exit(1)
  if (rows.length !== 1 || rows[0] !== 'label-demo') process.exit(1)
  NODE
  ```

- A deterministic check proves the row outcome is one of `Covered`,
  `Partial`, `Missing`, or `Intentional divergence` and that any non-covered
  row has a non-empty follow-up:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/label-example-inventory.md', 'utf8')
  const row = text.match(/^\| `label-demo` \|([^\n]+)$/m)?.[0]
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
  `"use client"`, Radix Label, LabelPrimitive Root, `Label`, `Checkbox`,
  `id="terms"`, `htmlFor="terms"`, `flex`, `items-center`, `space-x-2`,
  `gap-2`, `text-sm`, `leading-none`, `font-medium`, `select-none`,
  `group-data-[disabled=true]`, `peer-disabled`, `className`, Tailwind
  utilities, `cn`, `data-slot`, native label activation, and vendor source.
- The audit explicitly mentions exact upstream user-facing text:
  `Accept terms and conditions`.
- The audit explicitly compares current RadCN evidence from:
  - `radcn/packages/radcn/src/components/label.tsx`;
  - `radcn/packages/radcn/src/components/checkbox.tsx`;
  - `radcn/packages/radcn/src/styles/tokens.css`;
  - `radcn/packages/radcn/src/index.ts`;
  - `radcn/packages/radcn/package.json`;
  - `radcn/apps/docs/app/content/components.tsx`;
  - `radcn/apps/docs/tests/coverage.spec.ts`;
  - `radcn/fixtures/scenarios/index.ts`;
  - relevant fixture files and tests that currently exercise Label with
    Checkbox or form controls.
- The Issue 4 README `## Experiments` section links Experiment 95 with status
  `Designed`.
- After the audit result is recorded, the Issue 4 README `## Learnings`
  section records the Label audit outcome and next-step decision. A
  deterministic check finds both the experiment and inventory references:

  ```text
  rg -n "Experiment 95|label-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
  ```

- `git diff --check`
- `git status --short` shows only the new experiment file and the Issue 4
  README before the plan commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any exact upstream user-facing text or mechanics listed
  above.
- The audit marks `label-demo` covered without docs, fixture, and Playwright
  evidence for the exact upstream composition and native label activation.
- The audit treats Radix/React DOM equivalence as required instead of
  user-facing behavior, accessibility, and author-facing modifiability.
- The audit modifies package, docs, fixture, Playwright, vendor, or lockfile
  implementation files without proving that the row is already covered and
  only issue documentation/bookkeeping is needed.

## Design Review

Reviewer: Parfit the 3rd
(`019e9df6-d81e-7b63-8310-9acabacaf0b5`), fresh-context Codex subagent
(`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approved. The reviewer confirmed the issue README links Experiment 95 with
status `Designed`, the plan has the required sections, scope is narrow and
audit-only, implementation has not started before the plan commit,
verification includes concrete pass/fail criteria and repo hygiene checks,
vendor checkouts are clean, and the vendor source supports the one-example
premise.
