# Experiment 52: Implement resizable example parity depth

## Description

Experiment 51 audited the four upstream shadcn/ui New York v4 Resizable
examples and found the cluster is still partial. RadCN has strong Resizable
primitive mechanics already, but lacks named docs/fixture/Playwright evidence
for:

- `resizable-demo`
- `resizable-demo-with-handle`
- `resizable-handle`
- `resizable-vertical`

This experiment implements that missing proof while preserving Resizable as a
dependency-free panel primitive. It should compose existing RadCN
`ResizablePanelGroup`, `ResizablePanel`, and `ResizableHandle` parts rather
than introducing React, `react-resizable-panels`, `lucide-react`, Tailwind,
vendor imports, or new Resizable package APIs unless a direct blocker is
discovered and recorded.

Nested panel groups are a specific risk to verify. If the current
`enhanceResizable()` implementation treats descendant nested panels/handles as
belonging to the outer group, fix that package-level blocker narrowly and
record the learning.

## Changes

- Update `radcn/apps/docs/app/content/components.tsx`.
  - Promote Resizable from a generated draft page to an authored rich docs page
    if needed by the existing docs architecture.
  - Render stable docs hooks for all four upstream Resizable example ids using
    `data-radcn-docs-resizable-family`.
  - Demonstrate `resizable-demo`: horizontal outer group splitting `One` from a
    nested vertical group containing `Two` and `Three`; outer panels 50/50,
    nested panels 25/75, and plain handles.
  - Demonstrate `resizable-demo-with-handle`: the same nested layout, but both
    outer and nested handles use `withHandle`.
  - Demonstrate `resizable-handle`: horizontal `Sidebar` and `Content` panels
    at 25/75 with a visible handle grip.
  - Demonstrate `resizable-vertical`: vertical `Header` and `Content` panels at
    25/75 with a plain handle.
  - Explain mappings from shadcn React props, `defaultSize`, `minSize`,
    `orientation`, `withHandle`, `className`, `data-slot`,
    `react-resizable-panels`, `GripVerticalIcon`, `lucide-react`, Tailwind,
    nested panel groups, vendor source, and RadCN dependency-free enhancement
    to explicit props, `class`, `style`, CSS variables, app-owned panel
    content, public hooks, keyboard/pointer behavior, and non-dependencies.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/resizable.tsx`
  Add named Resizable fixture routes for `demo`, `demo-with-handle`, `handle`,
  and `vertical-upstream`, or equivalent route ids that keep all four upstream
  example ids explicit in scenario metadata and tests. Preserve existing
  generic Resizable routes.
- Update fixture Playwright coverage in
  `radcn/fixtures/tests/application-shell.spec.ts`.
  - Verify `resizable/demo` exposes the nested horizontal-plus-vertical
    `One`/`Two`/`Three` layout, two panel groups, two plain separator handles,
    50/50 outer sizes, 25/75 nested sizes, public hooks, and independent
    resize behavior for nested and outer handles.
  - Verify `resizable/demo-with-handle` exposes the same nested layout with two
    visible handle grips and independent resize behavior.
  - Verify `resizable/handle` exposes `Sidebar`/`Content`, 25/75 sizes,
    horizontal separator semantics, visible handle grip, keyboard resizing,
    and public hooks.
  - Verify `resizable/vertical-upstream` exposes `Header`/`Content`, 25/75
    sizes, vertical separator semantics, keyboard resizing, and public hooks.
  - Keep existing generic Resizable and application-shell behavior tests
    passing.
- Update docs Playwright coverage in
  `radcn/apps/docs/tests/coverage.spec.ts`.
  - Assert stable docs hooks for all four named Resizable examples.
  - Assert rendered evidence for ResizablePanelGroup, ResizablePanel,
    ResizableHandle, nested groups, horizontal and vertical orientation,
    default sizes, plain handles, visible grips, semantic separator handles,
    ARIA orientation/value attributes, dependency-free enhancement, `class`,
    `style`, CSS variables, `react-resizable-panels`, `GripVerticalIcon`,
    `lucide-react`, Tailwind, `className`, `data-slot`, public hooks, and no
    vendor dependency.
- Update `radcn/packages/radcn/src/components/resizable.tsx` only if nested
  example implementation proves a direct blocker.
  - If changed, keep the fix narrow and preserve the public API.
  - Likely acceptable fix: make each group enhance only its direct child
    panels/handles so nested groups remain independent.
  - Preserve existing `radcn-resizable-change`, keyboard, pointer, ARIA, and
    token behavior.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/resizable-example-inventory.md`.
  - Change all four Resizable rows to `Covered` only after package/docs/
    fixture/Playwright evidence exists.
  - Record final API decisions for nested groups, grip presentation,
    `react-resizable-panels` non-dependency, pointer/keyboard behavior,
    public hooks, and app-owned panel content.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Add `resizable` as a resolved example cluster with evidence from
    Experiments 51 and 52 plus `resizable-example-inventory.md`.
- Regenerate
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md` with
  `node scripts/audit-shadcn-parity.mjs`.
- Update Issue 4 `README.md` learnings with the final Resizable example
  outcome and the next generated recommendation.

## Verification

Pass criteria:

- Package, docs, and fixture checks pass:
  ```text
  pnpm radcn:typecheck
  pnpm --dir radcn/apps/docs typecheck
  pnpm fixtures:candidate:typecheck
  ```
- Fixture Playwright application-shell coverage passes:
  ```text
  pnpm exec playwright test -c radcn/fixtures/playwright.config.ts application-shell.spec.ts
  ```
- Docs Playwright coverage passes:
  ```text
  pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
  ```
- A deterministic Node check proves all four upstream Resizable example ids
  appear exactly once in `resizable-example-inventory.md` and every row is
  `Covered`:
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/resizable-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const ids = [
    'resizable-demo',
    'resizable-demo-with-handle',
    'resizable-handle',
    'resizable-vertical',
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
  `examples` entry with `slug = "resizable"`, `status = "resolved"`, and
  evidence for Experiment 51, Experiment 52, and
  `resizable-example-inventory.md`.
- `node scripts/audit-shadcn-parity.mjs` regenerates
  `parity-inventory.md`; a deterministic check proves:
  - `resizable` is absent from `## Unresolved Example Clusters`;
  - `## First Recommended Cluster` no longer says
    `Example parity for resizable`.
- Fixture tests assert:
  - all four named Resizable routes expose public RadCN hooks;
  - nested demo route proves two independent panel groups, two handles, labels
    `One`, `Two`, `Three`, 50/50 outer sizes, 25/75 nested sizes, and no handle
    grips;
  - nested demo-with-handle route proves the same composition with two visible
    grips;
  - handle route proves `Sidebar`/`Content`, 25/75 sizes, horizontal separator
    ARIA, visible grip, keyboard resizing, and public hooks;
  - vertical route proves `Header`/`Content`, 25/75 sizes, vertical separator
    ARIA, keyboard resizing, and public hooks;
  - nested groups resize independently and do not let the outer group claim
    nested panels/handles as its direct members;
  - existing generic Resizable and application-shell tests still pass.
- Docs coverage asserts the Resizable page renders stable evidence for all four
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
      name === 'react-resizable-panels' ||
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
    'react-resizable-panels',
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

- Any upstream Resizable example row remains `Partial` or `Missing` after the
  implementation.
- Named docs, fixture, or Playwright evidence is missing for any of the four
  upstream example ids.
- Nested groups cannot resize independently, or the outer group includes nested
  child panels/handles in its own sizing calculations.
- The implementation introduces React, `react-resizable-panels`,
  `lucide-react`, Tailwind, Radix, vendor imports, or a new package dependency.
- The implementation changes Resizable package APIs without recording a
  concrete primitive blocker in the experiment result and Issue 4 learnings.
- Existing generic Resizable fixture behavior regresses.
- `resizable` is marked resolved before docs, fixture, Playwright, inventory,
  and regenerated parity evidence all agree.

## Design Review

Reviewer: Cicero the 2nd (`019e9c0d-9a77-79d3-836e-59603a6dc639`) with fresh
context (`fork_context: false`).

Findings: none.

Approval: Approved for plan commit. The reviewer confirmed that the Issue 4
README links this experiment with status `Designed`, the experiment includes
the required sections, scope is limited to the Resizable example-parity
cluster, package changes are allowed only for a discovered nested-group
blocker, verification has concrete typecheck, Playwright, inventory,
dependency, hygiene, and vendor checks, no implementation has started before
the plan commit, and the plan directly addresses the Experiment 51 audit gaps.
