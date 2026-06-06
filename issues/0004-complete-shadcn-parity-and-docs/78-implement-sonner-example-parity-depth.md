# Experiment 78: Implement sonner example parity depth

## Description

Experiment 77 audited the two active upstream Sonner examples and found the
cluster is partial because RadCN has generic Toaster, toast event, fixture, and
Playwright evidence but no named proof for:

- `sonner-demo`
- `sonner-types`

This experiment should resolve the Sonner example cluster by adding named docs,
candidate fixture routes, and Playwright coverage for both examples. The audit
did not identify a required package API change: RadCN already owns reusable
Toaster rendering and browser-dispatched toast events, while Button triggers,
promise orchestration, callback behavior, React click handlers, Sonner library
APIs, next-themes, lucide icons, Tailwind utilities, `className`, `data-slot`,
`cn`, and vendor source are app/docs composition or mapping details.

RadCN should not add React, Sonner, next-themes, lucide-react, Tailwind, `cn`,
layout dependencies, promise libraries, or vendor dependencies for Sonner
parity. DOM equivalence is not required; the examples need equivalent
user-facing notification behavior, accessibility, visual modifiability, public
hooks, and author-facing customization.

## Changes

- Update `radcn/apps/docs/app/content/components.tsx`.
  - Expand the existing authored Sonner docs page if needed.
  - Render stable docs hooks for both upstream Sonner example ids using
    `data-radcn-docs-sonner-family`.
  - Demonstrate `sonner-demo` with:
    - an outline Button labelled `Show Toast`;
    - an event-dispatched or static Toaster proof for title
      `Event has been created`;
    - description `Sunday, December 03, 2023 at 9:00 AM`;
    - action label `Undo`;
    - public Toaster/toast/action hooks, status role, and mapping copy.
  - Demonstrate `sonner-types` with:
    - six outline Buttons labelled `Default`, `Success`, `Info`, `Warning`,
      `Error`, and `Promise`;
    - exact messages `Event has been created`, `Be at the area 10 minutes
      before the event time`, `Event start time cannot be earlier than 8am`,
      `Event has not been created`, `Loading...`, `Event has been created`,
      and `Error` where relevant;
    - public hooks and status/alert role evidence for default, success, info,
      warning, error, and loading/promise states;
    - an explicit mapping that `toast.promise` is app-owned orchestration
      dispatching loading then success/error notifications unless a real RadCN
      helper need is discovered.
  - Include mapping copy for React click handlers, Sonner `toast`,
    `toast.success`, `toast.info`, `toast.warning`, `toast.error`,
    `toast.promise`, Sonner `Toaster`, `sonner` package dependency,
    next-themes, lucide icons, Button composition, action callbacks,
    promise/loading/success/error flow, console logging, Tailwind utilities,
    `className`, `data-slot`, `cn`, custom classes/styles/tokens, and vendor
    source.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/sonner.tsx`
  Add named Sonner fixture routes for `demo` and `types`, preserving existing
  generic Sonner routes.
- Update fixture Playwright coverage in
  `radcn/fixtures/tests/notifications.spec.ts`.
  - Verify `sonner/demo` exposes the `Show Toast` Button trigger, dispatches
    or renders the exact title/description/action label, exposes public hooks,
    and uses status role semantics.
  - Verify `sonner/types` exposes six Buttons labelled `Default`, `Success`,
    `Info`, `Warning`, `Error`, and `Promise`; proves exact upstream messages,
    roles/data-type values, loading/promise state mapping, and public hooks.
  - Keep existing generic Sonner and deprecated Toast behavior tests passing.
- Update docs Playwright coverage in
  `radcn/apps/docs/tests/coverage.spec.ts`.
  - Assert stable docs hooks for `sonner-demo` and `sonner-types`.
  - Assert rendered Button triggers, Toaster/toast/action hooks, exact copy,
    role/type evidence, promise-flow mapping copy, dependency divergence copy,
    and public API text.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/sonner-example-inventory.md`.
  - Change `sonner-demo` to `Covered` only after docs, fixture, and
    Playwright evidence exists.
  - Change `sonner-types` to `Covered` only after docs, fixture, and
    Playwright evidence exists, or record a precise intentional divergence for
    any promise behavior that remains app-owned.
  - Record final decisions for Button trigger mapping, exact messages, action
    callbacks, promise flow, public hooks, custom style/class evidence, and
    upstream non-dependencies.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Add `sonner` as a resolved example cluster only after both example rows
    are `Covered` or intentionally diverged with evidence.
- Regenerate
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md` with
  `node scripts/audit-shadcn-parity.mjs`.
- Update Issue 4 `README.md` learnings with the final Sonner example outcome
  and the next generated recommendation.
- Do not change `radcn/packages/radcn` unless implementation discovers a real
  package-level gap that is necessary for the two named examples. If such a gap
  appears, record it in the result before changing package code.

## Verification

Pass criteria:

- Package, docs, and fixture typechecks pass:
  ```text
  pnpm radcn:typecheck
  pnpm --dir radcn/apps/docs typecheck
  pnpm fixtures:candidate:typecheck
  ```
- Fixture notification coverage passes:
  ```text
  pnpm exec playwright test -c radcn/fixtures/playwright.config.ts notifications.spec.ts
  ```
- Docs Playwright coverage passes:
  ```text
  pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
  ```
- A deterministic Node check proves both upstream Sonner example ids appear
  exactly once in `sonner-example-inventory.md`, and both are `Covered` or an
  explicitly recorded intentional divergence:
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/sonner-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const expected = ['sonner-demo', 'sonner-types']
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)]
  let failed = rows.length !== expected.length
  for (const id of expected) {
    const row = rows.filter((match) => match[1] === id)
    console.log(`${id}: ${row.length} ${row[0]?.[0] ?? ''}`)
    if (
      row.length !== 1 ||
      (!row[0][0].includes('| Covered |') &&
        !row[0][0].includes('| Intentional divergence |'))
    ) {
      failed = true
    }
  }
  for (const row of rows) {
    if (!expected.includes(row[1])) {
      console.log(`unexpected: ${row[1]}`)
      failed = true
    }
  }
  if (failed) process.exit(1)
  NODE
  ```
- A deterministic Node check proves `resolved-clusters.json` includes an
  `examples` entry with `slug = "sonner"`, `status = "resolved"`, and evidence
  for Experiment 77, Experiment 78, and `sonner-example-inventory.md`.
- `node scripts/audit-shadcn-parity.mjs` regenerates
  `parity-inventory.md`; a deterministic check proves:
  - `sonner` is absent from `## Unresolved Example Clusters`;
  - `## First Recommended Cluster` no longer says `Example parity for sonner`.
- Fixture tests assert:
  - named Sonner routes expose public RadCN hooks;
  - `sonner/demo` proves exact `Show Toast` trigger, title, date description,
    `Undo` action label, role semantics, and public hooks;
  - `sonner/types` proves all six trigger labels, exact default/success/info/
    warning/error/promise messages, data-type values, status/alert role
    mapping, and promise-flow behavior or documented intentional divergence;
  - existing generic Sonner and deprecated Toast behavior tests still pass.
- Docs coverage asserts the Sonner page renders stable evidence for both named
  docs examples and source/API text mentions the required mapping copy.
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
      name === 'sonner' ||
      name === 'next-themes' ||
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
  current RadCN manifests, and the lockfile remains unchanged because this
  experiment should not add dependencies:
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
    'sonner',
    'next-themes',
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

- Either upstream Sonner example remains `Partial` or `Missing` without a
  recorded intentional divergence.
- Docs, fixtures, or tests omit the named demo or types compositions.
- The implementation adds React, Sonner, next-themes, lucide-react, Tailwind,
  `cn`, `class-variance-authority`, promise libraries, layout dependencies, or
  vendor source as package/app dependencies.
- The implementation marks `sonner` resolved without docs, fixture, and
  Playwright evidence for both named examples.
- The experiment changes unrelated component clusters or skips the regenerated
  parity inventory.

## Design Review

Reviewer: Herschel the 2nd (`019e9d29-597a-7d03-821e-01a5d70c450c`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: the experiment did not yet contain a recorded `## Design Review`
  section. This was expected before recording the review and is now addressed.

Approval: approved. The reviewer confirmed the Issue 4 README links
Experiment 78 as `Designed`, the plan has Description, Changes, and
Verification sections, scope is narrow and follows the Sonner audit, the
technical plan matches the remaining named-example gaps, promise-flow
requirements are specific enough to test without pulling in Sonner, dependency
guardrails are explicit, `git diff --check` passed, vendor checkouts are clean,
only expected issue-doc changes exist, and no blockers remain.

## Result

**Result:** Pass

Implemented named Sonner parity depth for `sonner-demo` and `sonner-types`.
The docs page now renders stable `data-radcn-docs-sonner-family` hooks for both
upstream examples, exact Button labels, exact upstream messages, Toaster/toast/
action hooks, status/alert role evidence, and mapping copy for React handlers,
Sonner APIs, action callbacks, `toast.promise`, dependency divergence,
Tailwind/className/data-slot/cn styling, custom tokens, and vendor source.

The candidate Remix fixture app now exposes `/fixtures/sonner/demo` and
`/fixtures/sonner/types`. The demo route dispatches the exact
`Event has been created` payload with the date description and `Undo` action.
The types route exposes the six upstream Button labels and dispatches default,
success, info, warning, error, and loading payloads. `toast.promise` is resolved
as app-owned orchestration rather than a package API: the fixture and docs prove
the loading trigger and record that app promise branches dispatch the eventual
`Event has been created` or `Error` notifications.

`sonner-example-inventory.md` now marks both rows `Covered`,
`resolved-clusters.json` records `sonner` as a resolved example cluster, and
`node scripts/audit-shadcn-parity.mjs` regenerated `parity-inventory.md`. The
first recommended cluster is now `accordion`, not Sonner.

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
node - <<'NODE'
const fs = require('fs')
const file = 'issues/0004-complete-shadcn-parity-and-docs/sonner-example-inventory.md'
const text = fs.readFileSync(file, 'utf8')
const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
const expected = ['sonner-demo', 'sonner-types']
const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)]
let failed = rows.length !== expected.length
for (const id of expected) {
  const row = rows.filter((match) => match[1] === id)
  console.log(`${id}: ${row.length} ${row[0]?.[0] ?? ''}`)
  if (
    row.length !== 1 ||
    (!row[0][0].includes('| Covered |') &&
      !row[0][0].includes('| Intentional divergence |'))
  ) {
    failed = true
  }
}
for (const row of rows) {
  if (!expected.includes(row[1])) {
    console.log(`unexpected: ${row[1]}`)
    failed = true
  }
}
if (failed) process.exit(1)
NODE
```

Passed. Both `sonner-demo` and `sonner-types` appear exactly once and are
`Covered`.

```text
node - <<'NODE'
const fs = require('fs')
const data = JSON.parse(fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json', 'utf8'))
const entry = data.examples?.find((item) => item.slug === 'sonner')
const required = [
  'issues/0004-complete-shadcn-parity-and-docs/77-audit-sonner-example-parity.md',
  'issues/0004-complete-shadcn-parity-and-docs/78-implement-sonner-example-parity-depth.md',
  'issues/0004-complete-shadcn-parity-and-docs/sonner-example-inventory.md',
]
if (!entry || entry.status !== 'resolved') {
  console.error('missing resolved sonner entry')
  process.exit(1)
}
for (const file of required) {
  if (!entry.evidence?.includes(file)) {
    console.error(`missing evidence ${file}`)
    process.exit(1)
  }
}
console.log('sonner resolved evidence ok')
NODE
```

Passed. The `sonner` example entry is `resolved` and includes Experiment 77,
Experiment 78, and `sonner-example-inventory.md` evidence.

```text
node - <<'NODE'
const fs = require('fs')
const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md', 'utf8')
const unresolved = text.match(/## Unresolved Example Clusters[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
const first = text.match(/## First Recommended Cluster[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
if (unresolved.includes('`sonner`') || first.includes('Example parity for sonner')) {
  console.error('sonner still appears unresolved or recommended')
  process.exit(1)
}
console.log(first.trim().split('\n').slice(0, 6).join('\n'))
NODE
```

Passed. `sonner` is absent from unresolved example clusters, and the first
recommendation no longer says `Example parity for sonner`.

```text
node - <<'NODE'
const fs = require('fs')
const path = require('path')
const roots = ['radcn/packages/radcn', 'radcn/apps/docs', 'radcn/fixtures/candidate-remix']
function forbiddenImport(name) {
  return (
    name === 'react' ||
    name === 'react-dom' ||
    name === 'sonner' ||
    name === 'next-themes' ||
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
  'sonner',
  'next-themes',
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
```

Passed.

```text
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

```text
pnpm exec playwright test -c radcn/fixtures/playwright.config.ts notifications.spec.ts
```

Passed: 7 tests. The run printed the existing Node `module.register()`
deprecation warning and `NO_COLOR`/`FORCE_COLOR` web-server warnings.

```text
pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
```

Passed: 5 tests. The run printed the existing Node `module.register()`
deprecation warning and `NO_COLOR`/`FORCE_COLOR` web-server warnings.

Expected changed files before result commit:

```text
issues/0004-complete-shadcn-parity-and-docs/78-implement-sonner-example-parity-depth.md
issues/0004-complete-shadcn-parity-and-docs/README.md
issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md
issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json
issues/0004-complete-shadcn-parity-and-docs/sonner-example-inventory.md
radcn/apps/docs/app/content/components.tsx
radcn/apps/docs/tests/coverage.spec.ts
radcn/fixtures/candidate-remix/app/fixtures/sonner.tsx
radcn/fixtures/scenarios/index.ts
radcn/fixtures/tests/notifications.spec.ts
```

No `radcn/packages/radcn` package source or package metadata changes were
needed.

## Conclusion

Sonner example parity is resolved for the active upstream New York v4 examples.
RadCN should keep Sonner as dependency-free Toaster rendering plus explicit
browser toast events. `toast.promise` should remain app-owned orchestration
unless later clusters reveal repeated complexity that justifies a small helper.
The regenerated parity inventory recommends auditing `accordion` example
parity next.

## Completion Review

Reviewer: Dirac the 2nd (`019e9d32-36c9-7e50-9d5e-1bd5c4437ddf`),
fresh-context Codex subagent (`fork_context: false`).

Initial findings:

- Blocker: none.
- Major: the recorded Node verification commands were placeholders rather than
  reproducible script bodies. Fixed by replacing each placeholder block with
  the exact script body used for the Sonner inventory, resolved-cluster,
  parity recommendation, forbidden import, and manifest dependency checks.
- Minor: none.

Re-review findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval: approved. The reviewer confirmed the implementation matches the
approved scope; `sonner-demo` and `sonner-types` have docs, fixture, scenario,
and Playwright evidence; the experiment has Result and Conclusion; the Issue 4
README status and learnings match the result; `git diff --check` and vendor
cleanliness passed; no package API or metadata changes were made; no forbidden
imports or dependencies were found; the result commit had not been made before
review; and the fixed verification record is reproducible.
