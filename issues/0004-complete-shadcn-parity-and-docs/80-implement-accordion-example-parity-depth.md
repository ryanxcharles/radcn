# Experiment 80: Implement accordion example parity depth

## Description

Experiment 79 audited the single active upstream Accordion example,
`accordion-demo`, and found the cluster is partial. RadCN already has
dependency-free Accordion package behavior, fixtures, and Playwright coverage
for generic single, multiple, disabled, keyboard, public-hook, icon-hook, and
custom-token behavior. The missing evidence is named `accordion-demo` parity in
docs, candidate fixtures, and tests.

This experiment should resolve the Accordion example cluster by adding named
docs, candidate fixture, and Playwright coverage for `accordion-demo`.

The implementation should prefer the current RadCN authoring model unless a
real package-level gap appears during implementation:

- root `defaultValue="item-1"` is public metadata via
  `data-default-value="item-1"`;
- root `name` is public metadata via `data-accordion-name`;
- server-rendered open state stays explicit with `AccordionItem open`;
- native single-group behavior stays explicit with matching item `name` props.

That mapping is slightly more explicit than upstream Radix/React state, but it
matches Remix 3's server-first model and current RadCN package behavior. The
experiment should not add React, Radix, lucide-react, Tailwind,
class-variance-authority, `cn`, animation libraries, or vendor dependencies.
If implementation discovers that explicit item `open`/`name` cannot provide
equivalent user-facing behavior or author-facing modifiability, record the
package gap before changing package code.

## Changes

- Update `radcn/apps/docs/app/content/components.tsx`.
  - Promote Accordion from a generated seed doc to a rich docs page if needed.
  - Render a stable docs hook
    `data-radcn-docs-accordion-family="accordion-demo"`.
  - Demonstrate `accordion-demo` with:
    - `type="single"`;
    - `collapsible`;
    - root `defaultValue="item-1"`;
    - full-width styling evidence equivalent to upstream `className="w-full"`;
    - three items with values `item-1`, `item-2`, and `item-3`;
    - trigger text `Product Information`, `Shipping Details`, and
      `Return Policy`;
    - two paragraph blocks under each item with the exact upstream copy;
    - first item open by default;
    - one stable group name passed to root `name` and the same value passed to
      each enabled `AccordionItem name` for native single-group behavior;
    - content layout equivalent to `flex flex-col gap-4 text-balance`;
    - public root/item/trigger/content/icon hooks, `data-state`, and
      `data-value` evidence.
  - Include mapping copy for React client component marker, Radix Accordion,
    lucide `ChevronDownIcon`, `cn`, `data-slot`, `className`, Tailwind
    `w-full`, Tailwind flex/gap/text-balance utilities, accordion animation
    utilities, trigger disabled styling, vendor source, and the RadCN
    root-metadata plus explicit item `open`/`name` decision.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/accordion.tsx`
  Add a named `accordion/demo` fixture route, preserving existing generic
  accordion routes.
- Update fixture Playwright coverage in
  `radcn/fixtures/tests/accordion.spec.ts`.
  - Verify `accordion/demo` exposes the exact upstream trigger labels,
    item values, exact paragraph copy, root `data-type`, root
    `data-collapsible`, root `data-default-value="item-1"`, root
    `data-accordion-name`, item `name` props that exactly match the root
    `data-accordion-name`, first item open by default, native single switching,
    collapsible closing behavior, public hooks, icon hooks, and content layout
    hooks/classes or computed style.
  - Keep existing generic accordion behavior tests passing.
- Update docs Playwright coverage in
  `radcn/apps/docs/tests/coverage.spec.ts`.
  - Assert the `/docs/components/accordion` page renders the named family hook,
    exact triggers/copy, values, first-open state, full-width/content-layout
    evidence, public hooks, root metadata, explicit item mapping copy, and
    dependency-divergence copy.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md`.
  - Change `accordion-demo` to `Covered` only after docs, fixture, and
    Playwright evidence exists.
  - Record the final decision that this example uses current RadCN root
    metadata plus explicit item `open`/`name` mapping, unless implementation
    discovers and fixes a real package-level gap.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Add `accordion` as a resolved example cluster only after the example row
    is `Covered` or intentionally diverged with evidence.
- Regenerate
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md` with
  `node scripts/audit-shadcn-parity.mjs`.
- Update Issue 4 `README.md` learnings with the final Accordion example
  outcome and the next generated recommendation.

Do not change `radcn/packages/radcn` unless implementation proves the explicit
item-level mapping cannot meet the upstream example's user-facing behavior,
accessibility, and author-facing modifiability. If package code changes, add
package-level verification and record why the audit-only assumption changed.

## Verification

Pass criteria:

- Package, docs, and fixture typechecks pass:

  ```text
  pnpm radcn:typecheck
  pnpm --dir radcn/apps/docs typecheck
  pnpm fixtures:candidate:typecheck
  ```
- Fixture accordion coverage passes:

  ```text
  pnpm exec playwright test -c radcn/fixtures/playwright.config.ts accordion.spec.ts
  ```
- Docs Playwright coverage passes:

  ```text
  pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
  ```
- A deterministic Node check proves `accordion-example-inventory.md` has
  exactly one upstream row, `accordion-demo`, and the row is `Covered` or an
  explicitly recorded intentional divergence:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)]
  const row = rows.filter((match) => match[1] === 'accordion-demo')
  console.log(`${row.length} ${row[0]?.[0] ?? ''}`)
  if (
    rows.length !== 1 ||
    row.length !== 1 ||
    (!row[0][0].includes('| Covered |') &&
      !row[0][0].includes('| Intentional divergence |'))
  ) {
    process.exit(1)
  }
  NODE
  ```
- A deterministic Node check proves `resolved-clusters.json` includes an
  `examples` entry with `slug = "accordion"`, `status = "resolved"`, and
  evidence for Experiment 79, Experiment 80, and
  `accordion-example-inventory.md`.
- `node scripts/audit-shadcn-parity.mjs` regenerates
  `parity-inventory.md`; a deterministic check proves:
  - `accordion` is absent from `## Unresolved Example Clusters`;
  - `## First Recommended Cluster` no longer says
    `Example parity for accordion`.
- Fixture tests assert:
  - `accordion/demo` renders root `data-type="single"`,
    `data-collapsible="true"`, `data-default-value="item-1"`, and a stable
    `data-accordion-name`;
  - every enabled item has a `name` attribute equal to the root
    `data-accordion-name`;
  - all three item values are present in order;
  - all three trigger labels and all six paragraphs match upstream copy;
  - the first item starts open and other items start closed;
  - clicking another trigger switches native single-open state;
  - clicking the open trigger closes it for collapsible behavior;
  - public item/trigger/content/icon hooks are present;
  - full-width and flex/gap/text-balance layout evidence is present through
    classes, styles, or computed CSS.
- Docs coverage asserts the Accordion page renders stable evidence for the
  named docs example and source/API text mentions the required mapping copy.
- Dependency and scope checks pass:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const path = require('path')
  const roots = ['radcn/packages/radcn', 'radcn/apps/docs', 'radcn/fixtures/candidate-remix']
  function forbiddenImport(name) {
    return (
      name === 'react' ||
      name === 'react-dom' ||
      name === 'radix-ui' ||
      name.startsWith('@radix-ui/') ||
      name === 'lucide-react' ||
      name === 'tailwindcss' ||
      name === 'class-variance-authority' ||
      name.startsWith('@tailwindcss/') ||
      name.includes('/vendor/') ||
      name.startsWith('../vendor/')
    )
  }
  const files = []
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.[cm]?[tj]sx?$/.test(entry.name)) files.push(full)
    }
  }
  for (const root of roots) walk(root)
  let failed = false
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8')
    for (const match of text.matchAll(/^\s*import(?:\s+type)?[\s\S]*?\sfrom\s+['"]([^'"]+)['"]/gm)) {
      if (forbiddenImport(match[1])) {
        console.log(`${file}: forbidden import ${match[1]}`)
        failed = true
      }
    }
  }
  if (failed) process.exit(1)
  NODE
  ```
- A deterministic manifest check proves no forbidden dependencies exist in the
  current RadCN manifests, and the lockfile remains unchanged unless a
  reviewed package-level gap requires otherwise:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const manifests = [
    'package.json',
    'radcn/package.json',
    'radcn/packages/radcn/package.json',
    'radcn/apps/docs/package.json',
    'radcn/fixtures/candidate-remix/package.json',
  ].filter((file) => fs.existsSync(file))
  const forbidden = [
    'react',
    'react-dom',
    'radix-ui',
    'lucide-react',
    'tailwindcss',
    '@tailwindcss/vite',
    '@tailwindcss/postcss',
    'class-variance-authority',
  ]
  let failed = false
  for (const file of manifests) {
    const json = JSON.parse(fs.readFileSync(file, 'utf8'))
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      const deps = json[field] || {}
      for (const name of Object.keys(deps)) {
        if (
          forbidden.includes(name) ||
          name.startsWith('@radix-ui/') ||
          forbidden.some((prefix) => prefix.endsWith('/') && name.startsWith(prefix))
        ) {
          console.log(`${file}: ${field}.${name}`)
          failed = true
        }
      }
    }
  }
  if (failed) process.exit(1)
  NODE
  git diff --exit-code -- pnpm-lock.yaml
  ```
- `git diff --check`
- `git status --short` shows only expected experiment result changes before
  the result commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- `accordion-demo` remains `Partial` or `Missing` without a recorded
  intentional divergence.
- Docs, fixtures, or tests omit the exact item values, trigger labels, or
  paragraph copy.
- The implementation hides the root metadata plus explicit item `open`/`name`
  mapping instead of documenting and testing it.
- The implementation adds React, Radix, lucide-react, Tailwind,
  class-variance-authority, `cn`, animation libraries, or vendor source as
  package/app dependencies.
- The implementation changes unrelated component clusters or skips the
  regenerated parity inventory.

## Design Review

Reviewer: Newton the 2nd (`019e9d41-238d-7d42-be06-5bff4829b178`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: the plan did not explicitly require enabled item `name` values to
  equal the root `data-accordion-name` metadata value. Fixed by clarifying this
  requirement in Changes and Verification.

Approval: approved. The reviewer confirmed the README links Experiment 80 as
`Designed`, the plan has the required sections, scope is narrow, implementation
has not started before the plan commit, verification and hygiene checks are
concrete, vendor checkouts are not in scope, and the Experiment 79
root-metadata plus explicit item `open`/`name` finding is handled directly.

## Result

**Result:** Pass

Implemented named Accordion example parity for `accordion-demo`.

The docs page now promotes Accordion to a rich component doc and renders
`data-radcn-docs-accordion-family="accordion-demo"` with the exact upstream
trigger labels, values, first-open state, six paragraph bodies, full-width root
evidence, flex/gap/text-balance content evidence, public hooks, and mapping copy
for React, Radix Accordion, lucide `ChevronDownIcon`, `cn`, `data-slot`,
`className`, Tailwind utilities, animation utilities, vendor source, and the
RadCN root-metadata plus explicit item `open`/`name` decision.

The candidate fixture app now exposes `/fixtures/accordion/demo`. The fixture
passes one stable group name to root `name` and the same value to each enabled
`AccordionItem name`, while the first item receives `open` explicitly. This
keeps native details grouping and server-rendered default state dependency-free
without changing `radcn/packages/radcn`.

`accordion-example-inventory.md` now marks `accordion-demo` `Covered`,
`resolved-clusters.json` records `accordion` as a resolved example cluster, and
`node scripts/audit-shadcn-parity.mjs` regenerated `parity-inventory.md`. The
first recommended cluster is now `alert-dialog`, not Accordion.

Verification commands run:

```text
pnpm radcn:typecheck
```

Passed.

```text
pnpm --dir radcn/apps/docs typecheck
```

Passed.

```text
pnpm fixtures:candidate:typecheck
```

Passed.

```text
node scripts/audit-shadcn-parity.mjs
```

Passed and rewrote `parity-inventory.md`.

```text
pnpm exec playwright test -c radcn/fixtures/playwright.config.ts accordion.spec.ts
```

First run failed because the new named-demo test expected closed Shipping and
Return panel copy to be visible. That was a test bug: closed details content is
present but hidden until opened. Fixed the test to assert attached text through
content hooks, while separately testing click-driven visibility/state changes.

Rerun passed: 4 tests. The run printed the existing Node `module.register()`
deprecation warning and `NO_COLOR`/`FORCE_COLOR` web-server warnings.

```text
pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
```

Passed: 5 tests. The run printed the existing Node `module.register()`
deprecation warning and `NO_COLOR`/`FORCE_COLOR` web-server warnings.

```text
node - <<'NODE'
const fs = require('fs')
const file = 'issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md'
const text = fs.readFileSync(file, 'utf8')
const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)]
const row = rows.filter((match) => match[1] === 'accordion-demo')
console.log(`${row.length} ${row[0]?.[0] ?? ''}`)
if (
  rows.length !== 1 ||
  row.length !== 1 ||
  (!row[0][0].includes('| Covered |') &&
    !row[0][0].includes('| Intentional divergence |'))
) {
  process.exit(1)
}
NODE
```

Passed. The one `accordion-demo` row is `Covered`.

```text
node - <<'NODE'
const fs = require('fs')
const data = JSON.parse(fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json', 'utf8'))
const entry = data.examples?.find((item) => item.slug === 'accordion')
const required = [
  'issues/0004-complete-shadcn-parity-and-docs/79-audit-accordion-example-parity.md',
  'issues/0004-complete-shadcn-parity-and-docs/80-implement-accordion-example-parity-depth.md',
  'issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md',
]
if (!entry || entry.status !== 'resolved') {
  console.error('missing resolved accordion entry')
  process.exit(1)
}
for (const file of required) {
  if (!entry.evidence?.includes(file)) {
    console.error(`missing evidence ${file}`)
    process.exit(1)
  }
}
console.log('accordion resolved evidence ok')
NODE
```

Passed.

```text
node - <<'NODE'
const fs = require('fs')
const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md', 'utf8')
const unresolved = text.match(/## Unresolved Example Clusters[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
const first = text.match(/## First Recommended Cluster[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
if (unresolved.includes('`accordion`') || first.includes('Example parity for accordion')) {
  console.error('accordion still appears unresolved or recommended')
  process.exit(1)
}
console.log(first.trim().split('\n').slice(0, 6).join('\n'))
NODE
```

Passed. The first recommended cluster is `alert-dialog`.

```text
node - <<'NODE'
const fs = require('fs')
const path = require('path')
const roots = ['radcn/packages/radcn', 'radcn/apps/docs', 'radcn/fixtures/candidate-remix']
function forbiddenImport(name) {
  return (
    name === 'react' ||
    name === 'react-dom' ||
    name === 'radix-ui' ||
    name.startsWith('@radix-ui/') ||
    name === 'lucide-react' ||
    name === 'tailwindcss' ||
    name === 'class-variance-authority' ||
    name.startsWith('@tailwindcss/') ||
    name.includes('/vendor/') ||
    name.startsWith('../vendor/')
  )
}
const files = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.[cm]?[tj]sx?$/.test(entry.name)) files.push(full)
  }
}
for (const root of roots) walk(root)
let failed = false
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8')
  for (const match of text.matchAll(/^\s*import(?:\s+type)?[\s\S]*?\sfrom\s+['"]([^'"]+)['"]/gm)) {
    if (forbiddenImport(match[1])) {
      console.log(`${file}: forbidden import ${match[1]}`)
      failed = true
    }
  }
}
if (failed) process.exit(1)
console.log('forbidden import check ok')
NODE
```

Passed.

```text
node - <<'NODE'
const fs = require('fs')
const manifests = [
  'package.json',
  'radcn/package.json',
  'radcn/packages/radcn/package.json',
  'radcn/apps/docs/package.json',
  'radcn/fixtures/candidate-remix/package.json',
].filter((file) => fs.existsSync(file))
const forbidden = [
  'react',
  'react-dom',
  'radix-ui',
  'lucide-react',
  'tailwindcss',
  '@tailwindcss/vite',
  '@tailwindcss/postcss',
  'class-variance-authority',
]
let failed = false
for (const file of manifests) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    const deps = json[field] || {}
    for (const name of Object.keys(deps)) {
      if (
        forbidden.includes(name) ||
        name.startsWith('@radix-ui/') ||
        forbidden.some((prefix) => prefix.endsWith('/') && name.startsWith(prefix))
      ) {
        console.log(`${file}: ${field}.${name}`)
        failed = true
      }
    }
  }
}
if (failed) process.exit(1)
console.log('manifest forbidden dependency check ok')
NODE
git diff --exit-code -- pnpm-lock.yaml
```

Passed. The lockfile is unchanged.

```text
git diff --check
```

Passed.

```text
for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done
```

Passed. No vendor checkout output.

Expected changed files before result commit:

```text
issues/0004-complete-shadcn-parity-and-docs/80-implement-accordion-example-parity-depth.md
issues/0004-complete-shadcn-parity-and-docs/README.md
issues/0004-complete-shadcn-parity-and-docs/accordion-example-inventory.md
issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md
issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json
radcn/apps/docs/app/content/components.tsx
radcn/apps/docs/tests/coverage.spec.ts
radcn/fixtures/candidate-remix/app/fixtures/accordion.tsx
radcn/fixtures/scenarios/index.ts
radcn/fixtures/tests/accordion.spec.ts
```

No package source, package metadata, lockfile, or vendor source changes were
needed.

## Conclusion

Accordion example parity is resolved for the active upstream New York v4
example. RadCN should keep Accordion dependency-free and preserve the explicit
server-first mapping: root `defaultValue`/`name` expose metadata, while item
`open` and matching item `name` props own initial state and native grouping.
The regenerated parity inventory recommends auditing `alert-dialog` example
parity next.

## Completion Review

Reviewer: Mendel the 2nd (`019e9d49-148c-7a63-9f2c-aae8492fea4e`),
fresh-context Codex subagent (`fork_context: false`).

Initial findings:

- Blocker: none.
- Major: none.
- Minor: named-demo tests did not explicitly assert
  `[data-radcn-accordion-trigger]` hooks or initial `data-state` values for the
  `accordion-demo` composition. Fixed by adding fixture and docs coverage for
  trigger hook counts and initial item `data-state` values.

Fix verification:

```text
pnpm exec playwright test -c radcn/fixtures/playwright.config.ts accordion.spec.ts
```

Passed: 4 tests. The run printed the existing Node `module.register()`
deprecation warning and `NO_COLOR`/`FORCE_COLOR` web-server warnings.

```text
pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
```

Passed: 5 tests. The run printed the existing Node `module.register()`
deprecation warning and `NO_COLOR`/`FORCE_COLOR` web-server warnings.

Re-review findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval: approved. The reviewer confirmed the prior finding is resolved:
named fixture and docs tests now assert initial item `data-state` values and
`[data-radcn-accordion-trigger]` hook counts, with no new blocker introduced.
