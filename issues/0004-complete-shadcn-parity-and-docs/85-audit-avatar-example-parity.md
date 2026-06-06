# Experiment 85: Audit avatar example parity

## Description

The regenerated parity inventory after Experiment 84 recommends Avatar as the
next unresolved example cluster. Upstream shadcn/ui New York v4 has one direct
Avatar example, `avatar-demo`, plus avatar-related examples under other
clusters such as `item-avatar`, `empty-avatar`, and `empty-avatar-group`.
RadCN already exports `radcn/avatar`, has candidate fixtures for image,
fallback, badge, group, and custom-token behavior, and has Playwright coverage
for image alt text, hidden and visible fallback behavior, badge hooks, group
count hooks, custom token styling, and avatar composition inside Item and Empty
examples.

This experiment should audit the upstream direct Avatar example against current
RadCN evidence and produce a focused inventory that determines whether the
cluster is already covered or which exact named-example gaps remain. It should
not implement the named example yet.

The likely remaining gap is named docs/fixture/test evidence for the exact
upstream `avatar-demo` composition:

- wrapper `div` with flex row, wrapping, centered items, and `gap-12`;
- default circular Avatar with GitHub image
  `https://github.com/shadcn.png`, alt text `@shadcn`, and fallback `CN`;
- rounded-square Avatar via `className="rounded-lg"` with image
  `https://github.com/evilrabbit.png`, alt text `@evilrabbit`, and fallback
  `ER`;
- stacked avatar group using negative spacing, ring styling, and grayscale
  image treatment;
- stacked group avatars for `@shadcn`/`CN`, `@maxleiter`/`LR`, and
  `@evilrabbit`/`ER`;
- upstream React client component marker, Radix Avatar primitive,
  `data-slot`, `data-size`, `className`, `cn`, Tailwind size/shape/ring/group
  selectors, remote GitHub avatar image mechanics, and fallback behavior mapped
  to RadCN's dependency-free markup, public hooks, explicit image/fallback
  parts, classes, styles, CSS variables, and app-owned remote image handling.

## Changes

- Add
  `issues/0004-complete-shadcn-parity-and-docs/avatar-example-inventory.md`.
  - List direct upstream avatar example rows found under
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/avatar*.tsx`.
  - Explicitly note that `item-avatar`, `empty-avatar`, and
    `empty-avatar-group` are related examples owned by the Item and Empty
    clusters, not direct Avatar example rows.
  - Summarize the upstream UI implementation from
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/avatar.tsx`.
  - Compare upstream behavior and mechanics with current RadCN package, docs,
    fixture, and Playwright evidence.
  - Mark `avatar-demo` as `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - If partial, record the exact follow-up requirements for the next
    implementation experiment.
  - Record decisions for remote GitHub image strategy, alt text, fallback
    visibility, circular and rounded-square shapes, size mapping, group
    negative spacing, ring styling, grayscale treatment, AvatarBadge scope,
    AvatarGroup/AvatarGroupCount scope, Radix non-dependency, React
    non-dependency, `data-slot`, `data-size`, `className`, `cn`, Tailwind
    utility mapping, public hooks, custom tokens, and vendor source.
- Update Issue 4 `README.md`.
  - Add Experiment 85 to the experiments index as `Designed`.
  - Do not add final learnings until the experiment result is recorded.

No package, docs app, fixture, test, inventory-regeneration, or
`resolved-clusters.json` changes should be made in this audit experiment unless
the audit itself exposes an already-covered result that can be proven entirely
from existing evidence. If that happens, record the evidence and keep the
change limited to issue documentation.

## Verification

Pass criteria:

- `avatar-example-inventory.md` exists and has:
  - `# Avatar Example Inventory`;
  - `## Summary`;
  - `## Examples`;
  - a table with exactly one direct upstream row, `avatar-demo`, using this
    header:
    `Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up`;
  - `## Related Examples`;
  - `## Decisions`.
- A deterministic check proves the direct upstream vendor avatar example count
  is exactly one and the inventory table contains exactly one matching row:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const vendor = fs.readdirSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples')
    .filter((file) => /^avatar.*\.tsx$/.test(file))
    .map((file) => file.replace(/\.tsx$/, ''))
    .sort()
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/avatar-example-inventory.md', 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)].map((match) => match[1]).sort()
  console.log(`vendor: ${vendor.join(', ')}`)
  console.log(`inventory: ${rows.join(', ')}`)
  if (vendor.length !== 1 || vendor[0] !== 'avatar-demo') process.exit(1)
  if (rows.length !== 1 || rows[0] !== 'avatar-demo') process.exit(1)
  NODE
  ```
- A deterministic check proves related avatar examples are recorded outside
  the direct table:

  ```text
  rg -n "item-avatar|empty-avatar|empty-avatar-group" issues/0004-complete-shadcn-parity-and-docs/avatar-example-inventory.md
  ```
- A deterministic check proves the row outcome is one of `Covered`, `Partial`,
  `Missing`, or `Intentional divergence` and that any non-covered row has a
  non-empty follow-up:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/avatar-example-inventory.md', 'utf8')
  const row = text.match(/^\| `avatar-demo` \|([^\n]+)$/m)?.[0]
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
  React client component marker, Radix Avatar primitive, `data-slot`,
  `data-size`, `className`, `cn`, default Avatar shape/size, rounded-square
  Avatar class, image URLs and alt texts, fallback texts, stacked group
  negative spacing, ring styling, grayscale treatment, Tailwind group/has
  selectors, remote GitHub image handling, and vendor source.
- The audit explicitly compares current RadCN evidence from:
  - `radcn/packages/radcn/src/components/avatar.tsx`;
  - `radcn/packages/radcn/src/styles/tokens.css`;
  - `radcn/apps/docs/app/content/components.tsx`;
  - `radcn/fixtures/candidate-remix/app/fixtures/avatar.tsx`;
  - `radcn/fixtures/tests/avatar-scroll-area.spec.ts`;
  - `radcn/apps/docs/tests/coverage.spec.ts`;
  - Item and Empty inventory/results only for related-example ownership.
- The Issue 4 README `## Learnings` section records the Avatar audit result
  and the next recommended experiment after the audit result is known. A
  deterministic check finds both the experiment and inventory references:

  ```text
  rg -n "Experiment 85|avatar-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
  ```
- `git diff --check`
- `git status --short` shows only the new experiment file,
  `avatar-example-inventory.md`, and the Issue 4 README before the result
  commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit incorrectly treats `item-avatar`, `empty-avatar`, or
  `empty-avatar-group` as direct Avatar cluster rows instead of related
  examples.
- The audit omits any exact upstream image URL, alt text, or fallback text from
  `avatar-demo`.
- The audit marks `avatar-demo` covered without docs, fixture, and Playwright
  evidence for the named example, unless it records a precise intentional
  divergence with enough existing evidence.
- The audit changes package, docs app, fixture, or Playwright implementation
  files before the follow-up implementation experiment is designed and
  approved.
- The audit mutates vendor source or adds forbidden dependencies such as React,
  Radix, Tailwind, lucide-react, or class-variance-authority.

## Design Review

Reviewer: Faraday the 2nd (`019e9d74-ff6a-7b70-af58-2bc15a18d411`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: added this `## Design Review` section before the plan commit.

Approval: approved. The reviewer confirmed the Issue 4 README links
Experiment 85 as `Designed`, scope is narrow and audit-only, direct
`avatar-demo` is separated from Item/Empty-owned related examples, verification
has concrete pass/fail criteria and hygiene checks, upstream confirms one
direct `avatar-demo`, related examples are not direct Avatar rows, and vendor
checkouts are clean.

## Result

**Result:** Partial

Created `avatar-example-inventory.md` for the single direct upstream New York
v4 Avatar example, `avatar-demo`. The audit confirms RadCN already covers
dependency-free Avatar markup, native image alt/src/loading props, visible and
hidden fallback behavior, badge hooks, group hooks, group count hooks, size
variants, custom token styling, and Avatar composition inside Item and Empty
examples.

The direct Avatar cluster remains partial because current docs, fixtures, and
tests do not prove the exact named upstream `avatar-demo` composition: GitHub
remote image URLs for `@shadcn`, `@evilrabbit`, and `@maxleiter`; fallback text
`CN`, `ER`, and `LR`; a rounded-square Avatar; a flex/wrapped `gap-12` wrapper;
and a stacked negative-space group with ring and grayscale image treatment.

Related `item-avatar`, `empty-avatar`, and `empty-avatar-group` examples were
recorded outside the direct Avatar table because they are owned by the already
resolved Item and Empty clusters.

Verification commands run:

```text
node - <<'NODE'
const fs = require('fs')
const vendor = fs.readdirSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples')
  .filter((file) => /^avatar.*\.tsx$/.test(file))
  .map((file) => file.replace(/\.tsx$/, ''))
  .sort()
const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/avatar-example-inventory.md', 'utf8')
const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)].map((match) => match[1]).sort()
console.log(`vendor: ${vendor.join(', ')}`)
console.log(`inventory: ${rows.join(', ')}`)
if (vendor.length !== 1 || vendor[0] !== 'avatar-demo') process.exit(1)
if (rows.length !== 1 || rows[0] !== 'avatar-demo') process.exit(1)
NODE
```

Passed with `vendor: avatar-demo` and `inventory: avatar-demo`.

```text
rg -n "item-avatar|empty-avatar|empty-avatar-group" issues/0004-complete-shadcn-parity-and-docs/avatar-example-inventory.md
```

Passed with all three related example IDs recorded in `## Related Examples`.

```text
node - <<'NODE'
const fs = require('fs')
const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/avatar-example-inventory.md', 'utf8')
const row = text.match(/^\| `avatar-demo` \|([^\n]+)$/m)?.[0]
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

Passed with `outcome: Partial` and a non-empty follow-up.

```text
rg -n "Experiment 85|avatar-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
git diff --check
for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done
git status --short
```

The README check found the Experiment 85 learning and index entry,
`git diff --check` passed, the vendor cleanliness check printed no output, and
`git status --short` showed only this experiment file, the new inventory file,
and Issue 4 README modified before result review.

## Completion Review

Reviewer: Zeno the 2nd (`019e9d78-b74d-7d22-a703-9c51426f960b`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: corrected the recorded `git status --short` summary to include this
  experiment result file alongside the README and new inventory file.

Approval: approved. The reviewer confirmed the audit-only scope held, upstream
has exactly one direct `avatar*.tsx` example (`avatar-demo`), related
`item-avatar`, `empty-avatar`, and `empty-avatar-group` are recorded outside
the direct Avatar table, README status is `Partial`, result and conclusion are
present, `git diff --check` passes, vendor nested checkouts are clean, ignored
vendor sources are not committed, and the result commit had not been made
before review.

## Conclusion

Direct Avatar example parity remains partial. The package primitive is strong
enough for the upstream behavior, but named docs, fixture, and Playwright
evidence still need to prove the exact remote image, fallback, shape, stacked
group, ring, and grayscale details.

The next Issue 4 experiment should implement named `avatar-demo` parity without
adding React, Radix, Tailwind, `cn`, or vendor dependencies.
