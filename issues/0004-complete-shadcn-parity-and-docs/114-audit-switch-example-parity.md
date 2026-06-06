# Experiment 114: Audit switch example parity

## Description

The regenerated parity inventory after Experiment 113 recommends `switch` as
the next unresolved direct example cluster. Upstream shadcn/ui New York v4 has
one direct Switch example, `switch-demo`, registered as an example dependency
on `switch`.

RadCN already ships `radcn/switch` with a dependency-free native checkbox
using `role="switch"`, wrapper/input/thumb public hooks, checked and unchecked
state metadata, disabled behavior, small/default sizing, form submit/reset
behavior, custom-token fixture coverage, and generic docs preview coverage.
RadCN docs currently have generic Switch preview coverage, not a named direct
upstream `switch-demo`.

This experiment should audit whether existing evidence covers the exact direct
upstream `switch-demo`, or whether a named implementation experiment is needed.
The likely remaining gap is named docs/fixture/test evidence for the upstream
demo composition:

- `<div className="flex items-center space-x-2">`;
- `<Switch id="airplane-mode" />`;
- `<Label htmlFor="airplane-mode">Airplane Mode</Label>`;
- upstream package mechanics: `"use client"`, React props,
  `React.ComponentProps<typeof SwitchPrimitive.Root>`, Radix Switch primitive,
  `SwitchPrimitive.Root`, `SwitchPrimitive.Thumb`, `size = "default"`,
  `data-slot`, `data-size`, `className`, Tailwind utilities, `cn`, checked/
  unchecked `data-state`, disabled styling, focus styling, thumb translation,
  `Label htmlFor`, native switch accessibility, custom tokens, and vendor
  source.

The audit should not implement named parity yet.

## Changes

- Add
  `issues/0004-complete-shadcn-parity-and-docs/switch-example-inventory.md`.
  - List direct upstream Switch example rows found under
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
    with `type: "registry:example"` and
    `registryDependencies: ["switch"]`, and cross-check those entries against
    `examples/switch*.tsx` files.
  - Summarize upstream user-facing behavior from
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/switch-demo.tsx`
    and upstream package mechanics from
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/switch.tsx`.
  - Compare upstream behavior and mechanics with current RadCN package, docs,
    fixture, and Playwright evidence.
  - Mark `switch-demo` as `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - For every non-covered outcome, record exact follow-up requirements or an
    explicit disposition for the next experiment.
  - Record decisions for React non-dependency, Radix non-dependency, native
    checkbox role switch mapping, default unchecked state, id/label mapping,
    row layout mapping, `className`, Tailwind utility mapping, `cn`,
    `data-slot`, `data-size`, checked/unchecked state hooks, thumb behavior,
    disabled/form/custom-token behavior, browser switch behavior, and vendor
    source.
- Update Issue 4 `README.md`.
  - Add Experiment 114 to the experiments index as `Designed`.
  - Do not add final learnings until the experiment result is recorded.

No package, docs app, fixture, Playwright implementation,
`resolved-clusters.json`, or generated parity inventory changes should be made
in this audit experiment unless the audit itself proves the direct example is
already covered entirely from existing evidence. If that happens, keep the
change limited to issue documentation and required resolved-cluster/generated
inventory updates.

## Verification

Pass criteria:

- `switch-example-inventory.md` exists and has:
  - `# Switch Example Inventory`;
  - `## Summary`;
  - `## Examples`;
  - a table with exactly one direct upstream row, `switch-demo`, using this
    header:
    `Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up`;
  - `## Decisions`.
- A deterministic check proves the direct upstream vendor Switch example
  cluster count is exactly one by the direct switch filename-prefix and
  `registryDependencies: ["switch"]` rule used for this audit, the matching
  file-glob count is exactly one, and the inventory table contains exactly one
  matching row.

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const registry = fs.readFileSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts', 'utf8')
  const registryEntries = [...registry.matchAll(/\{\s*name: "([^"]+)",\s*type: "registry:example",\s*registryDependencies: \[([^\]]*)\],[\s\S]*?path: "examples\/([^"]+)"/g)]
    .filter((match) => match[1] === 'switch' || match[1].startsWith('switch-'))
    .map((match) => ({
      dependencies: [...match[2].matchAll(/"([^"]+)"/g)].map((dependency) => dependency[1]).sort(),
      name: match[1],
    }))
    .filter((entry) => entry.dependencies.length === 1 && entry.dependencies[0] === 'switch')
    .map((entry) => entry.name)
    .sort()
  const files = fs.readdirSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples')
    .filter((file) => /^switch.*\.tsx$/.test(file))
    .map((file) => file.replace(/\.tsx$/, ''))
    .sort()
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/switch-example-inventory.md', 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)].map((match) => match[1]).sort()
  console.log(`registry: ${registryEntries.join(', ')}`)
  console.log(`files: ${files.join(', ')}`)
  console.log(`inventory: ${rows.join(', ')}`)
  if (registryEntries.length !== 1 || registryEntries[0] !== 'switch-demo') process.exit(1)
  if (files.length !== 1 || files[0] !== 'switch-demo') process.exit(1)
  if (rows.length !== 1 || rows[0] !== 'switch-demo') process.exit(1)
  NODE
  ```

- A deterministic check proves the row outcome is one of `Covered`,
  `Partial`, `Missing`, or `Intentional divergence` and that any non-covered
  row has a non-empty follow-up:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/switch-example-inventory.md', 'utf8')
  const row = text.match(/^\| `switch-demo` \|([^\n]+)$/m)?.[0]
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
  `"use client"`, `React.ComponentProps<typeof SwitchPrimitive.Root>`,
  Radix Switch primitive, `SwitchPrimitive.Root`, `SwitchPrimitive.Thumb`,
  `size = "default"`, `<div className="flex items-center space-x-2">`,
  `<Switch id="airplane-mode" />`,
  `<Label htmlFor="airplane-mode">Airplane Mode</Label>`, `className`,
  Tailwind utilities, `cn`, `data-slot`, `data-size`, checked/unchecked
  `data-state`, disabled behavior, focus styling, thumb translation, browser
  switch behavior, custom tokens, and vendor source.
- The audit explicitly compares current RadCN evidence from:
  - `radcn/packages/radcn/src/components/switch.tsx`;
  - `radcn/packages/radcn/src/components/label.tsx`;
  - `radcn/packages/radcn/src/styles/tokens.css`;
  - `radcn/packages/radcn/src/index.ts`;
  - `radcn/packages/radcn/package.json`;
  - `radcn/apps/docs/app/content/components.tsx`;
  - `radcn/apps/docs/tests/coverage.spec.ts`;
  - `radcn/fixtures/scenarios/index.ts`;
  - `radcn/fixtures/candidate-remix/app/fixtures/native-state.tsx`;
  - `radcn/fixtures/tests/native-state.spec.ts`;
  - `radcn/fixtures/tests/native-controls.spec.ts`, only to record related
    Field Switch composition evidence, not direct `switch-demo` evidence.
- The Issue 4 README `## Experiments` section links Experiment 114 with
  status `Designed`.
- After the audit result is recorded, the Issue 4 README `## Learnings`
  section records the Switch audit outcome and next-step decision. A
  deterministic check finds both the experiment and inventory references:

  ```text
  rg -n "Experiment 114|switch-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
  ```

- `git diff --check`
- `git diff --exit-code -- pnpm-lock.yaml`
- A deterministic tracked-vendor-source check proves the RadCN repository only
  tracks `vendor/.gitignore` under `vendor/`:

  ```text
  node - <<'NODE'
  const { execFileSync } = require('child_process')
  const files = execFileSync('git', ['ls-files', 'vendor'], { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean)
  console.log(files.join('\n'))
  if (files.length !== 1 || files[0] !== 'vendor/.gitignore') process.exit(1)
  NODE
  ```

- `git status --short` shows only the new experiment file and the Issue 4
  README before the plan commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any exact upstream id, label text, row layout, switch parts,
  state hooks, or mechanics listed above.
- The audit marks `switch-demo` covered without named docs, fixture, and
  Playwright evidence for the exact upstream id `airplane-mode`, label text
  `Airplane Mode`, unchecked default state, row layout, public hooks, and
  native browser switch behavior, unless existing evidence already proves the
  same composition on the Switch surface.
- The audit treats React/Radix DOM equivalence as required instead of
  user-facing behavior, accessibility, browser behavior, and author-facing
  modifiability.
- The audit modifies package, docs, fixture, Playwright, vendor, or lockfile
  implementation files without proving that the row is already covered and
  only issue documentation/bookkeeping is needed.

## Design Review

Reviewer: Jason the 3rd (`019e9ec7-eb09-7611-9f97-2030496241db`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approved. The reviewer confirmed the Issue 4 README links Experiment 114 as
`Designed`, the experiment has the required `Description`, `Changes`,
`Verification`, and `Design Review` sections, the scope is a narrow audit-only
pass with implementation deferred until after audit results, verification has
concrete pass/fail criteria, deterministic checks, repo hygiene, lockfile, and
vendor cleanliness checks, and the issue scope correctly excludes upstream
blocks and chart-gallery examples while retaining the ordinary `radcn/chart`
package component scope.
