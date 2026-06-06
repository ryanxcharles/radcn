# Experiment 50: Implement native-select example parity depth

## Description

Experiment 49 audited the four upstream shadcn/ui New York v4 Native Select
examples and found the cluster is still partial. RadCN has strong Native Select
primitive mechanics already, but lacks named docs/fixture/Playwright evidence
with complete upstream option sets for:

- `native-select-demo`
- `native-select-disabled`
- `native-select-groups`
- `native-select-invalid`

This experiment implements that missing proof while preserving Native Select as
a dependency-free wrapper around browser-native `<select>`, `<option>`, and
`<optgroup>` elements. It should compose existing RadCN Native Select and Field
parts rather than introducing React, `lucide-react`, Tailwind, vendor imports,
or new Native Select package APIs unless a direct blocker is discovered and
recorded.

## Changes

- Update `radcn/apps/docs/app/content/components.tsx`.
  - Promote Native Select from a generic generated-style page to an authored
    docs page if needed by the existing docs architecture.
  - Render stable docs hooks for all four upstream Native Select example ids
    using `data-radcn-docs-native-select-family`.
  - Demonstrate `native-select-demo`: status prompt plus `Todo`,
    `In Progress`, `Done`, and `Cancelled`.
  - Demonstrate `native-select-disabled`: disabled priority select with
    `Low`, `Medium`, `High`, and `Critical`.
  - Demonstrate `native-select-groups`: department prompt plus Engineering,
    Sales, and Operations optgroups with the complete upstream option labels.
  - Demonstrate `native-select-invalid`: invalid role select with `Admin`,
    `Editor`, `Viewer`, and `Guest`.
  - Explain mappings from shadcn React props, `size`, `className`,
    `data-slot`, `aria-invalid`, `disabled`, `ChevronDownIcon`,
    `lucide-react`, Tailwind utilities, option/optgroup Canvas colors, browser
    native popup rendering, and vendor source to RadCN explicit props, `class`,
    public hooks, CSS variables, dependency-free decorative icon behavior, and
    browser-owned native select behavior.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/native-select.tsx`
  Add named Native Select fixture routes for `demo`, `disabled-upstream`,
  `groups-upstream`, and `invalid-upstream`, or use equivalent route ids that
  keep all four upstream example ids explicit in scenario metadata and tests.
  Preserve existing generic Native Select routes.
- Update fixture Playwright coverage in
  `radcn/fixtures/tests/native-select.spec.ts`.
  - Verify `native-select/demo` exposes the status prompt, all four status
    options, native value selection, wrapper/select/option hooks, and
    dependency-free decorative icon.
  - Verify `native-select/disabled-upstream` exposes the disabled priority
    select and all four priority options.
  - Verify `native-select/groups-upstream` exposes Engineering, Sales, and
    Operations optgroups and the complete upstream department option labels.
  - Verify `native-select/invalid-upstream` exposes invalid ARIA state and all
    four role options.
  - Keep existing generic Native Select behavior tests passing.
- Update docs Playwright coverage in
  `radcn/apps/docs/tests/coverage.spec.ts`.
  - Assert stable docs hooks for all four named Native Select examples.
  - Assert rendered evidence for Native Select, options, optgroups, disabled
    state, invalid ARIA state, CSS variables/classes, public hooks,
    browser-native behavior, `class`, React `className`, `data-slot`,
    `aria-invalid`, `disabled`, `ChevronDownIcon`, `lucide-react`, Tailwind,
    Canvas option colors, and no vendor dependency.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/native-select-example-inventory.md`.
  - Change all four Native Select rows to `Covered` only after package/docs/
    fixture/Playwright evidence exists.
  - Record final API decisions for native select state ownership,
    option/optgroup coverage, disabled/invalid examples, decorative icon
    behavior, browser-native popup rendering, public hooks, and upstream
    non-dependencies.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Add `native-select` as a resolved example cluster with evidence from
    Experiments 49 and 50 plus `native-select-example-inventory.md`.
- Regenerate
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md` with
  `node scripts/audit-shadcn-parity.mjs`.
- Update Issue 4 `README.md` learnings with the final Native Select example
  outcome and the next generated recommendation.
- Do not change `radcn/packages/radcn/src/components/native-select.tsx` or
  Native Select package APIs unless implementation discovers and records a
  direct blocker in the current primitive.

## Verification

Pass criteria:

- Package, docs, and fixture checks pass:
  ```text
  pnpm radcn:typecheck
  pnpm --dir radcn/apps/docs typecheck
  pnpm fixtures:candidate:typecheck
  ```
- Fixture Playwright Native Select coverage passes:
  ```text
  pnpm exec playwright test -c radcn/fixtures/playwright.config.ts native-select.spec.ts
  ```
- Docs Playwright coverage passes:
  ```text
  pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
  ```
- A deterministic Node check proves all four upstream Native Select example ids
  appear exactly once in `native-select-example-inventory.md` and every row is
  `Covered`:
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/native-select-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const ids = [
    'native-select-demo',
    'native-select-disabled',
    'native-select-groups',
    'native-select-invalid',
  ]
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)]
  let failed = rows.length !== ids.length
  for (const id of ids) {
    const row = rows.filter((match) => match[1] === id)
    console.log(`${id}: ${row.length} ${row[0]?.[0] ?? ''}`)
    if (row.length !== 1 || !row[0][0].includes('| Covered |')) {
      failed = true
    }
  }
  for (const row of rows) {
    if (!ids.includes(row[1])) {
      console.log(`unexpected: ${row[1]}`)
      failed = true
    }
  }
  if (failed) process.exit(1)
  NODE
  ```
- A deterministic Node check proves `resolved-clusters.json` includes an
  `examples` entry with `slug = "native-select"`, `status = "resolved"`, and
  evidence for Experiment 49, Experiment 50, and
  `native-select-example-inventory.md`.
- `node scripts/audit-shadcn-parity.mjs` regenerates
  `parity-inventory.md`; a deterministic check proves:
  - `native-select` is absent from `## Unresolved Example Clusters`;
  - `## First Recommended Cluster` no longer says
    `Example parity for native-select`.
- Fixture tests assert:
  - all four named Native Select routes expose public RadCN hooks;
  - demo route proves the status prompt, four status options, native selection,
    option hooks, and decorative icon;
  - disabled route proves disabled state and the full priority option set;
  - groups route proves Engineering, Sales, and Operations optgroups and the
    complete upstream option labels;
  - invalid route proves invalid ARIA state and the full role option set;
  - existing generic Native Select tests still pass.
- Docs coverage asserts the Native Select page renders stable evidence for all
  four named docs examples and source/API text mentions the required mapping
  copy.
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
      name === 'lucide-react' ||
      name === 'radix-ui' ||
      name.startsWith('@radix-ui/') ||
      name === 'tailwindcss' ||
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

  node - <<'NODE'
  const fs = require('fs')
  const manifests = [
    'radcn/packages/radcn/package.json',
    'radcn/apps/docs/package.json',
    'radcn/fixtures/candidate-remix/package.json',
  ]
  const forbidden = new Set([
    'react',
    'react-dom',
    'lucide-react',
    'radix-ui',
    'tailwindcss',
  ])
  let failed = false
  for (const manifest of manifests) {
    const json = JSON.parse(fs.readFileSync(manifest, 'utf8'))
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const name of Object.keys(json[field] ?? {})) {
        if (forbidden.has(name) || name.startsWith('@radix-ui/') || name.startsWith('@tailwindcss/')) {
          console.log(`${manifest}: forbidden dependency ${name}`)
          failed = true
        }
      }
    }
  }
  if (failed) process.exit(1)
  NODE
  ```
- `git diff --check`
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- Any upstream Native Select example row remains `Partial` or `Missing` after
  the implementation.
- Named docs, fixture, or Playwright evidence is missing for any of the four
  upstream example ids.
- The implementation introduces React, `lucide-react`, Tailwind, Radix, vendor
  imports, or a new package dependency.
- The implementation changes Native Select package APIs without recording a
  concrete primitive blocker in the experiment result and Issue 4 learnings.
- Existing generic Native Select fixture behavior regresses.
- `native-select` is marked resolved before docs, fixture, Playwright,
  inventory, and regenerated parity evidence all agree.

## Design Review

Reviewer: Euler the 2nd (`019e9bfd-2739-7743-b2f0-b00a39eb0a6a`) with fresh
context (`fork_context: false`).

Findings: none.

Approval: Approved for plan commit. The reviewer confirmed that the Issue 4
README links this experiment with status `Designed`, the experiment includes
the required sections, Experiment 49 and the inventory support this
implementation scope, verification includes concrete typecheck, Playwright,
deterministic inventory, resolved-cluster, dependency, hygiene, and vendor
checks, and the current git state shows only plan/index docs modified before
implementation.
