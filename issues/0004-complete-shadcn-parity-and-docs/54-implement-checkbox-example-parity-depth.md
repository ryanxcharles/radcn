# Experiment 54: Implement checkbox example parity depth

## Description

Experiment 53 audited the three upstream shadcn/ui New York v4 Checkbox
examples and found the cluster is still partial. RadCN has strong Checkbox
primitive mechanics already, but lacks named docs/fixture/Playwright evidence
for:

- `checkbox-demo`
- `checkbox-disabled`
- `checkbox-with-text`

This experiment implements that missing proof while preserving Checkbox as a
dependency-free native input primitive. It should compose existing RadCN
`Checkbox`, `Label`, `Field`, and app-owned markup/CSS rather than introducing
React, Radix, `lucide-react`, Tailwind, vendor imports, or new Checkbox package
APIs unless a direct blocker is discovered and recorded.

## Changes

- Update `radcn/apps/docs/app/content/components.tsx`.
  - Promote Checkbox from a generic preview page to an authored rich docs page
    if needed by the existing docs architecture.
  - Render stable docs hooks for all three upstream Checkbox example ids using
    `data-radcn-docs-checkbox-family`.
  - Demonstrate `checkbox-demo` with the four upstream compositions:
    unchecked terms checkbox with label; checked terms checkbox with label and
    description; disabled notifications checkbox with label; checked
    card-like notifications label with description and custom checked styling.
  - Demonstrate `checkbox-disabled` with a disabled checkbox and `Accept terms
    and conditions` label.
  - Demonstrate `checkbox-with-text` with unchecked terms checkbox, associated
    label, and the `You agree to our Terms of Service and Privacy Policy.`
    description.
  - Explain mappings from shadcn React props, `defaultChecked`, `disabled`,
    `className`, `data-slot`, `aria-invalid`, Radix
    `CheckboxPrimitive.Root`/`CheckboxPrimitive.Indicator`, `data-state`,
    `CheckIcon`, `lucide-react`, Tailwind utilities, peer/has selectors,
    card-like label wrappers, vendor source, and RadCN dependency-free native
    input semantics to explicit props, `class`, `style`, CSS variables,
    public hooks, app-owned composition, and non-dependencies.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/native-state.tsx`
  Add named Checkbox fixture routes for `demo`, `disabled-upstream`, and
  `with-text`, or equivalent route ids that keep all three upstream example ids
  explicit in scenario metadata and tests. Preserve existing generic Checkbox
  routes.
- Update fixture Playwright coverage in
  `radcn/fixtures/tests/native-state.spec.ts`.
  - Verify `checkbox/demo` exposes four checkbox inputs, public wrapper/input/
    indicator hooks, two checked states, one disabled state, upstream labels and
    descriptions, the card-like checked composition, custom checked styling,
    and native click/label behavior where applicable.
  - Verify `checkbox/disabled-upstream` exposes the disabled checkbox, upstream
    label copy, disabled input state, and public hooks.
  - Verify `checkbox/with-text` exposes the unchecked checkbox, associated
    label, description copy, public hooks, and click/check behavior.
  - Keep existing generic Checkbox behavior tests passing.
- Update docs Playwright coverage in
  `radcn/apps/docs/tests/coverage.spec.ts`.
  - Assert stable docs hooks for all three named Checkbox examples.
  - Assert rendered evidence for Checkbox wrapper/input/indicator hooks,
    checked and unchecked state, disabled state, label association,
    description composition, card-like label composition, custom checked
    styling, `class`, `style`, CSS variables, public hooks, React
    `defaultChecked`, `className`, `data-slot`, Radix primitives,
    `data-state`, `CheckIcon`, `lucide-react`, Tailwind, peer/has selectors,
    vendor source, and no vendor dependency.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/checkbox-example-inventory.md`.
  - Change all three Checkbox rows to `Covered` only after package/docs/
    fixture/Playwright evidence exists.
  - Record final API decisions for native input semantics, initial checked
    state, disabled example, label/description composition, card-like wrapper
    composition, custom checked styling, public hooks, state hooks, icon
    presentation, and upstream non-dependencies.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Add `checkbox` as a resolved example cluster with evidence from
    Experiments 53 and 54 plus `checkbox-example-inventory.md`.
- Regenerate
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md` with
  `node scripts/audit-shadcn-parity.mjs`.
- Update Issue 4 `README.md` learnings with the final Checkbox example outcome
  and the next generated recommendation.
- Do not change `radcn/packages/radcn/src/components/checkbox.tsx` or Checkbox
  package APIs unless implementation discovers and records a direct blocker in
  the current primitive.

## Verification

Pass criteria:

- Package, docs, and fixture checks pass:
  ```text
  pnpm radcn:typecheck
  pnpm --dir radcn/apps/docs typecheck
  pnpm fixtures:candidate:typecheck
  ```
- Fixture Playwright native-state coverage passes:
  ```text
  pnpm exec playwright test -c radcn/fixtures/playwright.config.ts native-state.spec.ts
  ```
- Docs Playwright coverage passes:
  ```text
  pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
  ```
- A deterministic Node check proves all three upstream Checkbox example ids
  appear exactly once in `checkbox-example-inventory.md` and every row is
  `Covered`:
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/checkbox-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const ids = [
    'checkbox-demo',
    'checkbox-disabled',
    'checkbox-with-text',
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
  `examples` entry with `slug = "checkbox"`, `status = "resolved"`, and
  evidence for Experiment 53, Experiment 54, and
  `checkbox-example-inventory.md`.
- `node scripts/audit-shadcn-parity.mjs` regenerates
  `parity-inventory.md`; a deterministic check proves:
  - `checkbox` is absent from `## Unresolved Example Clusters`;
  - `## First Recommended Cluster` no longer says
    `Example parity for checkbox`.
- Fixture tests assert:
  - all three named Checkbox routes expose public RadCN hooks;
  - demo route proves four checkbox inputs, associated labels, the upstream
    description texts, two checked states, one disabled state, card-like
    composition, custom checked styling, and native label/click behavior;
  - disabled route proves disabled input state, upstream label copy, and public
    hooks;
  - with-text route proves unchecked state, associated label, description copy,
    public hooks, and native check behavior;
  - existing generic Checkbox behavior tests still pass.
- Docs coverage asserts the Checkbox page renders stable evidence for all three
  named docs examples and source/API text mentions the required mapping copy.
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

- Any upstream Checkbox example row remains `Partial` or `Missing` after the
  implementation.
- Named docs, fixture, or Playwright evidence is missing for any of the three
  upstream example ids.
- The implementation introduces React, Radix, `lucide-react`, Tailwind, vendor
  imports, or a new package dependency.
- The implementation changes Checkbox package APIs without recording a
  concrete primitive blocker in the experiment result and Issue 4 learnings.
- Existing generic Checkbox fixture behavior regresses.
- `checkbox` is marked resolved before docs, fixture, Playwright, inventory,
  and regenerated parity evidence all agree.

## Design Review

Reviewer: Popper the 2nd (`019e9c20-13a8-7543-bb95-0c284ac92948`) with fresh
context (`fork_context: false`).

Findings: none.

Approval: Approved for plan commit. The reviewer confirmed that the Issue 4
README links this experiment with status `Designed`, the experiment includes
the required sections, scope follows Experiment 53 with exactly
`checkbox-demo`, `checkbox-disabled`, and `checkbox-with-text`, adjacent
form/field/menu checkbox examples remain out of cluster, the plan preserves
the no React/Radix/`lucide-react`/Tailwind/vendor dependency policy unless a
blocker is recorded, verification has concrete typecheck, Playwright,
inventory, resolved-cluster, dependency, hygiene, and vendor checks, and no
implementation files or vendor checkouts are modified before the plan commit.

## Result

**Result:** Pass

Implemented named Checkbox example parity depth for all three active upstream
examples:

- `checkbox-demo`
- `checkbox-disabled`
- `checkbox-with-text`

Docs now render an authored Checkbox page with stable
`data-radcn-docs-checkbox-family` hooks for every named example. The page shows
the four `checkbox-demo` compositions, disabled terms example, and with-text
example, and includes mapping copy for `defaultChecked`, `disabled`,
`className`, `data-slot`, `aria-invalid`, Radix `CheckboxPrimitive.Root` and
`CheckboxPrimitive.Indicator`, `data-state`, `CheckIcon`, `lucide-react`,
Tailwind peer/has selectors, card-like wrappers, public hooks, CSS variables,
app-owned label/description composition, and vendor non-dependency.

Candidate fixtures now expose named routes for `checkbox/demo`,
`checkbox/disabled-upstream`, and `checkbox/with-text` while preserving the
existing generic Checkbox routes. Fixture Playwright coverage proves public
wrapper/input/indicator hooks, four demo inputs, two checked states, one
disabled state, upstream label and description copy, the card-like checked
composition, custom checked styling, disabled upstream state, with-text
unchecked state, and native label/check behavior.

Updated `checkbox-example-inventory.md` to mark all three rows `Covered`, added
`checkbox` to `resolved-clusters.json`, and regenerated
`parity-inventory.md`. The regenerated inventory no longer lists Checkbox as
unresolved and now recommends `Example parity for date-picker` as the next
cluster.

No Checkbox package API change was needed.

Verification run:

```text
pnpm radcn:typecheck
pnpm --dir radcn/apps/docs typecheck
pnpm fixtures:candidate:typecheck
pnpm exec playwright test -c radcn/fixtures/playwright.config.ts native-state.spec.ts
pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
node scripts/audit-shadcn-parity.mjs
git diff --check
for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done
```

Additional deterministic Node checks passed for:

- all three Checkbox inventory rows appearing exactly once and marked
  `Covered`;
- `resolved-clusters.json` containing `checkbox` with evidence for Experiments
  53 and 54 plus `checkbox-example-inventory.md`;
- `parity-inventory.md` excluding `checkbox` from unresolved examples and no
  longer recommending Checkbox first;
- no forbidden imports from React, Radix, `lucide-react`, Tailwind, or
  `vendor/`;
- no forbidden dependencies in the RadCN package, docs app, or candidate
  fixture manifests.

Playwright emitted existing runtime warnings for `module.register()` and
`NO_COLOR`/`FORCE_COLOR`; neither warning changed the pass result. Vendor
status printed no output.

## Conclusion

Checkbox example parity is resolved for Issue 4. RadCN covers the three active
upstream Checkbox examples with package behavior, docs, fixtures, Playwright
coverage, inventory evidence, and no new dependencies.

The package-level learning is that the base Checkbox primitive can remain a
small native input wrapper. Upstream card rows, descriptions, peer/has styling,
and icon presentation are better represented as app-owned composition over
public hooks and CSS variables than as new package APIs.

The next generated Issue 4 recommendation is `Example parity for date-picker`.

## Completion Review

Reviewer: Carson the 2nd (`019e9c26-03de-7360-939e-67cf7eee34d9`) with fresh
context (`fork_context: false`).

Findings: none.

Approval: Approved for result commit. The reviewer confirmed that the
experiment has `Result` and `Conclusion`, the Issue 4 README marks Experiment
54 `Pass` and records the Checkbox learning plus next recommendation, all
three Checkbox inventory rows are `Covered`, `resolved-clusters.json` records
Checkbox with Experiments 53 and 54 plus inventory evidence, docs render the
three named hooks and compositions, fixture scenarios and Playwright cover the
named examples, `git diff --check` passed, vendor status printed no output, the
result commit had not been made yet, no Checkbox package diff exists, and the
regenerated parity inventory now recommends `Example parity for date-picker`.
