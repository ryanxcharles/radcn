# Experiment 68: Implement drawer example parity depth

## Description

Experiment 67 audited the two active upstream Drawer examples and found the
cluster is partial because RadCN has generic Drawer package/fixture proof but
no named evidence for:

- `drawer-demo`
- `drawer-dialog`

This experiment should resolve the Drawer example cluster by adding named
docs, candidate fixture routes, and Playwright coverage for both examples. The
audit did not identify a required package API change: RadCN already owns modal
edge-panel behavior, while Button, Input, Label, native forms, goal state,
chart rendering, responsive Dialog/Drawer branch selection, and icon
presentation remain separate package/app surfaces.

RadCN should not add React, Vaul, `asChild`, controlled React-style
`open`/`onOpenChange` state, `lucide-react`, Recharts, Tailwind, `cn`,
media-query hooks, form-state libraries, charting-library dependencies, or
vendor dependencies. DOM equivalence is not required; the examples need
equivalent user-facing behavior, accessibility, visual modifiability, and
author-facing customization.

## Changes

- Update `radcn/apps/docs/app/content/components.tsx`.
  - Promote Drawer from the generic registry preview to an authored rich docs
    page if needed by the existing docs architecture.
  - Render stable docs hooks for both upstream Drawer example ids using
    `data-radcn-docs-drawer-family`.
  - Demonstrate `drawer-demo` with:
    - outline-styled trigger text `Open Drawer`;
    - bottom Drawer content with handle;
    - title `Move Goal`;
    - description `Set your daily activity goal.`;
    - centered content layout equivalent to upstream `max-w-sm`;
    - goal display initialized to `350`;
    - accessible decrement/increment controls with labels `Decrease` and
      `Increase`;
    - min/max disabled state evidence for the 200/400 bounds, either through
      deterministic fixture states or documented app-owned state mapping;
    - label `Calories/day`;
    - chart visualization using existing RadCN chart/static SVG/CSS bars or a
      documented chart-composition substitute rather than Recharts;
    - footer with `Submit` action and outline `Cancel` close action.
  - Demonstrate `drawer-dialog` with:
    - app-owned responsive branch evidence for desktop Dialog and mobile
      Drawer behavior;
    - shared trigger text `Edit Profile`;
    - shared title `Edit profile`;
    - shared description `Make changes to your profile here. Click save when you're done.`;
    - shared form with labelled `Email` and `Username` fields;
    - default values `shadcn@example.com` and `@shadcn`;
    - submit `Save changes`;
    - mobile Drawer footer with outline `Cancel` close action;
    - desktop Dialog content width equivalent to upstream `sm:max-w-[425px]`.
  - Include mapping copy for React props/state, Vaul `DrawerPrimitive`,
    `asChild`, controlled `open`/`onOpenChange`, React `useState`,
    `useMediaQuery`, `className`, `data-slot`, Tailwind utilities, `cn`,
    Button composition, Input/Label composition, Dialog composition, native
    forms, goal state, min/max disabled controls, `Minus`/`Plus` icons,
    `lucide-react`, Recharts chart rendering, responsive branch ownership, and
    vendor source.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/drawer.tsx`
  Add named Drawer fixture routes for `demo` and `dialog-demo`, preserving
  existing generic Drawer routes.
- Update fixture Playwright coverage in `radcn/fixtures/tests/drawer.spec.ts`.
  - Verify `drawer/demo` exposes public Drawer hooks, opens from
    `Open Drawer`, has dialog role/ARIA relationships, contains upstream
    title/description, handle, goal display, `Calories/day`, accessible
    decrement/increment controls, disabled min/max state evidence, chart
    evidence, footer `Submit` and `Cancel` actions, focus behavior, Escape
    close behavior, explicit close behavior, and custom layout evidence.
  - Verify `drawer/dialog-demo` exposes public Drawer/Dialog hooks and proves
    the mobile Drawer branch and desktop Dialog branch through viewport-sized
    test cases or deterministic branch fixtures.
  - Verify the shared edit-profile form copy, Email/Username labels, default
    values, submit action, mobile Drawer footer Cancel, desktop Dialog width
    evidence, app-owned responsive branch ownership, and close/focus behavior.
  - Keep existing generic Drawer behavior tests passing.
- Update docs Playwright coverage in
  `radcn/apps/docs/tests/coverage.spec.ts`.
  - Assert stable docs hooks for `drawer-demo` and `drawer-dialog`.
  - Assert rendered Drawer/Dialog hooks, trigger copy, title/description copy,
    labels, default input values, goal controls, chart evidence, footer actions,
    layout hooks, and mapping copy.
  - Exercise modal opening and closing where docs enhancement supports it
    without requiring DOM equivalence with shadcn/ui.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/drawer-example-inventory.md`.
  - Change `drawer-demo` to `Covered` only after docs, fixture, and Playwright
    evidence exists.
  - Change `drawer-dialog` to `Covered` only after docs, fixture, and
    Playwright evidence exists.
  - Record final decisions for `asChild`, Button/Input/Label/native-form
    composition, goal state, disabled min/max controls, chart rendering,
    responsive branch ownership, Dialog composition, icon composition, public
    hooks, custom layout evidence, and upstream non-dependencies.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Add `drawer` as a resolved example cluster only after both example rows are
    `Covered` or intentionally diverged with evidence.
- Regenerate
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md` with
  `node scripts/audit-shadcn-parity.mjs`.
- Update Issue 4 `README.md` learnings with the final Drawer example outcome
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
- Fixture Drawer coverage passes:
  ```text
  pnpm exec playwright test -c radcn/fixtures/playwright.config.ts drawer.spec.ts
  ```
- Docs Playwright coverage passes:
  ```text
  pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
  ```
- A deterministic Node check proves both upstream Drawer example ids appear
  exactly once in `drawer-example-inventory.md`, and both are `Covered` or an
  explicitly recorded intentional divergence:
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/drawer-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const expected = ['drawer-demo', 'drawer-dialog']
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
  `examples` entry with `slug = "drawer"`, `status = "resolved"`, and evidence
  for Experiment 67, Experiment 68, and `drawer-example-inventory.md`.
- `node scripts/audit-shadcn-parity.mjs` regenerates
  `parity-inventory.md`; a deterministic check proves:
  - `drawer` is absent from `## Unresolved Example Clusters`;
  - `## First Recommended Cluster` no longer says `Example parity for drawer`.
- Fixture tests assert:
  - named Drawer routes expose public RadCN hooks;
  - `drawer/demo` proves trigger copy, title/description copy, handle, goal
    display, goal controls, disabled state evidence, chart evidence, footer
    actions, content layout evidence, ARIA relationships, focus behavior,
    Escape close, and explicit close behavior;
  - `drawer/dialog-demo` proves responsive branch ownership, mobile Drawer
    branch, desktop Dialog branch, shared edit-profile form content, footer
    Cancel behavior, default values, submit action, public hooks, and close
    behavior;
  - existing generic Drawer behavior tests still pass.
- Docs coverage asserts the Drawer page renders stable evidence for both named
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
      name === 'vaul' ||
      name === 'recharts' ||
      name === 'lucide-react' ||
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
  ```
- A deterministic manifest check proves no forbidden dependencies exist in the
  current RadCN manifests, and a diff check proves this experiment did not add
  forbidden lockfile dependency markers:
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
    'vaul',
    'recharts',
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
      for (const dep of forbidden) {
        if (Object.prototype.hasOwnProperty.call(deps, dep)) {
          console.log(`${file}: forbidden ${field} dependency ${dep}`)
          failed = true
        }
      }
      for (const dep of Object.keys(deps)) {
        if (dep.includes('vendor') || String(deps[dep]).includes('vendor')) {
          console.log(`${file}: forbidden vendor dependency ${dep}`)
          failed = true
        }
      }
    }
  }
  if (failed) process.exit(1)
  NODE
  git diff -- package.json radcn/package.json radcn/packages/radcn/package.json radcn/apps/docs/package.json radcn/fixtures/candidate-remix/package.json pnpm-lock.yaml | node -e '
  const fs = require("fs")
  const diff = fs.readFileSync(0, "utf8")
  const forbidden = [
    "react",
    "react-dom",
    "vaul",
    "recharts",
    "lucide-react",
    "tailwindcss",
    "@tailwindcss/vite",
    "@tailwindcss/postcss",
    "class-variance-authority",
  ]
  let failed = false
  for (const line of diff.split("\n")) {
    if (!line.startsWith("+") || line.startsWith("+++")) continue
    for (const dep of forbidden) {
      if (line.includes(`"${dep}"`) || line.includes(`/${dep}@`) || line.includes(`${dep}:`)) {
        console.log(`forbidden dependency added in diff: ${line}`)
        failed = true
      }
    }
    if (line.includes("vendor")) {
      console.log(`forbidden vendor dependency added in diff: ${line}`)
      failed = true
    }
  }
  if (failed) process.exit(1)
  '
  ```
- `git diff --check`
- `git status --short` shows only expected implementation and issue
  documentation changes before the result commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- Either active upstream Drawer example remains `Partial` or `Missing` without
  a recorded intentional divergence.
- The implementation treats React, Vaul, `asChild`, `lucide-react`, Recharts,
  Tailwind, `cn`, upstream `data-slot`, media-query hooks, form-state
  libraries, charting libraries, or vendor source as mandatory RadCN Drawer
  dependencies.
- The docs or fixtures prove generic Drawer behavior but omit the named
  `drawer-demo` or `drawer-dialog` compositions.
- The implementation changes `radcn/drawer` package APIs without a recorded
  package-level need found during implementation.
- The implementation conflates Drawer-owned modal/edge-panel behavior with
  app-owned Button, Input, Label, Dialog, Form, Chart, Combobox, Breadcrumb,
  responsive branch selection, goal counter state, chart rendering, icon
  presentation, or custom-class styling decisions.

## Design Review

Reviewer: Aquinas the 2nd (`019e9cb0-5521-7302-9ea4-d825ed248a66`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: the experiment did not yet contain a recorded `## Design Review`
  section. This was expected before recording the review and is now addressed.

Approval: approved. The reviewer confirmed that the plan is narrow enough,
matches Experiment 67's gaps, targets named evidence for `drawer-demo` and
`drawer-dialog`, maps upstream mechanics for the goal controls, min/max
behavior, chart visualization, Submit/Cancel actions, responsive Dialog/Drawer
branching, and shared edit-profile form content, and maintains the correct
dependency boundaries. The reviewer also confirmed that Experiment 68 is linked
from the Issue 4 README with status `Designed`, implementation has not started,
and the plan commit still needs to happen before implementation.

## Result

**Result:** Pass.

Experiment 68 resolved Drawer example parity without changing the
`radcn/drawer` package API.

Implemented evidence:

- `radcn/apps/docs/app/content/components.tsx` now promotes Drawer to a rich
  docs page with named `drawer-demo` and `drawer-dialog` examples, stable
  `data-radcn-docs-drawer-family` hooks, source snippets, accessibility notes,
  customization notes, and divergence mapping.
- `radcn/fixtures/scenarios/index.ts` and
  `radcn/fixtures/candidate-remix/app/fixtures/drawer.tsx` now include named
  `demo` and `dialog-demo` candidate routes.
- `radcn/fixtures/tests/drawer.spec.ts` now proves the Move Goal drawer
  composition, deterministic min/max disabled evidence, dependency-free chart
  bars, footer actions, focus/close behavior, and deterministic desktop Dialog
  plus mobile Drawer edit-profile branches.
- `radcn/apps/docs/tests/coverage.spec.ts` now proves the Drawer docs page
  renders both named example families, relevant public hooks, exact copy,
  form/default values, chart/control evidence, footer actions, and mapping copy.
- `drawer-example-inventory.md` marks `drawer-demo` and `drawer-dialog`
  `Covered`.
- `resolved-clusters.json` records the `drawer` example cluster as resolved
  with evidence for Experiments 67 and 68 plus the Drawer inventory.
- `parity-inventory.md` was regenerated and now recommends example parity for
  `scroll-area` next.

Verification passed:

```text
pnpm radcn:typecheck
pnpm --dir radcn/apps/docs typecheck
pnpm fixtures:candidate:typecheck
pnpm exec playwright test -c radcn/fixtures/playwright.config.ts drawer.spec.ts
pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
node scripts/audit-shadcn-parity.mjs
drawer-example-inventory deterministic row/status check
resolved-clusters drawer evidence check
parity-inventory unresolved/recommendation check
forbidden import scope check
manifest forbidden dependency check
lockfile/package diff forbidden dependency check
git diff --check
vendor git status loop
```

The first Playwright pass exposed two assertion issues, not implementation
gaps: the fixture width check measured padded Dialog content instead of the
authored `425px` width style, and docs Drawer internals are hidden after
enhancement. The tests now assert the correct authored evidence for both cases.

## Conclusion

Drawer example parity is complete. RadCN already had the required Drawer-owned
modal/edge-panel behavior, and the missing work was named docs, fixture, and
Playwright proof for the two upstream compositions. Goal counter state,
increments, chart engine choice, icon presentation, and responsive breakpoint
selection remain app-owned surfaces. No React, Vaul, Recharts, `lucide-react`,
Tailwind, `cn`, media-query hook, form-state, charting-library, vendor
dependency, or package API change was needed.

The regenerated parity inventory recommends auditing `scroll-area` example
parity next.

## Completion Review

Reviewer: Bohr the 2nd (`019e9cba-7537-7d93-a19e-d7e1e910fc2d`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: `drawer-example-inventory.md` still had stale summary wording saying
  docs, fixtures, and tests did not yet prove the named Drawer compositions.
  Fixed by rewriting the summary in resolved past tense.
- Minor: the `drawerSource` docs snippet showed the Move Goal drawer and only
  the desktop Dialog branch of `drawer-dialog`. Fixed by adding the mobile
  Drawer edit-profile branch to the displayed source snippet.

Re-review:

- The reviewer confirmed both minor findings were resolved.
- No new blocker was introduced.
- `git diff --check` was clean during re-review.

Approval: approved. The reviewer confirmed the implementation matches the
approved scope, the result commit had not been made before review, the issue
README and inventories record the result, the resolved-cluster evidence is
complete, the regenerated inventory recommends `scroll-area` next, and no
forbidden dependency or vendor-source issue was found.
