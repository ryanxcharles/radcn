# Experiment 84: Implement aspect-ratio example parity depth

## Description

Experiment 83 audited the single active upstream Aspect Ratio example,
`aspect-ratio-demo`, and found the cluster is partial. RadCN already has a
dependency-free `radcn/aspect-ratio` package primitive, fixtures, and
Playwright coverage for ratio layout, custom ratios, public root hooks, class
and style customization, overflow clipping, token border radius, muted
background, and full-size direct children. The missing evidence is named
`aspect-ratio-demo` parity in docs, candidate fixtures, and tests.

This experiment should resolve the Aspect Ratio example cluster by adding named
docs, candidate fixture, and Playwright coverage for `aspect-ratio-demo`.

The implementation should prefer the current RadCN authoring model unless a
real package-level gap appears during implementation:

- upstream `ratio={16 / 9}` maps to RadCN `ratio="16 / 9"`;
- upstream Next `Image fill` maps to native app-owned image markup or a
  deterministic local docs/fixture asset with equivalent full-cover sizing,
  alt text, and modifiability;
- upstream `rounded-lg bg-muted` root styling maps to RadCN package CSS plus
  explicit class/style evidence where needed;
- upstream `h-full w-full rounded-lg object-cover dark:brightness-[0.2]
  dark:grayscale` maps to app-owned image class/style and RadCN theme hooks;
- Aspect Ratio remains a dependency-free CSS primitive.

The experiment should not add React, Radix, Next, Tailwind, lucide-react,
class-variance-authority, `cn`, image optimization libraries, or vendor
dependencies. If implementation discovers that current `AspectRatio` cannot
provide equivalent user-facing behavior or author-facing modifiability, record
the package gap before changing package code.

## Changes

- Update `radcn/apps/docs/app/content/components.tsx`.
  - Promote Aspect Ratio from a generated seed doc to a rich docs page if
    needed.
  - Render a stable docs hook
    `data-radcn-docs-aspect-ratio-family="aspect-ratio-demo"`.
  - Demonstrate `aspect-ratio-demo` with:
    - root `AspectRatio`;
    - `ratio="16 / 9"`;
    - rounded/muted root styling evidence;
    - image alt text `Photo by Drew Beamer`;
    - exact upstream image URL or a documented deterministic local equivalent;
    - full-cover child image sizing;
    - `object-fit: cover`;
    - border-radius inheritance or equivalent rounded image styling;
    - dark-mode brightness/grayscale image filter evidence;
    - public `data-radcn-aspect-ratio` hook evidence.
  - Include mapping copy for React client component marker, Radix
    AspectRatio, Next Image, `data-slot`, `className`, `ratio={16 / 9}`,
    Tailwind rounded/background/sizing/object-fit utilities, dark-mode
    utilities, remote image handling, package CSS, public hooks, custom tokens,
    and vendor source.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/static-display.tsx`
  Add a named `aspect-ratio/demo` fixture route, preserving existing default
  and custom-ratio routes.
- Update fixture Playwright coverage in
  `radcn/fixtures/tests/static-display.spec.ts`.
  - Verify `aspect-ratio/demo` exposes exact image alt text, source strategy,
    16:9 layout, public root hook, rounded/muted root styling, full-cover child
    image sizing, object-fit cover, and dark-mode filter behavior.
  - Keep existing static display tests passing.
- Update docs Playwright coverage in
  `radcn/apps/docs/tests/coverage.spec.ts`.
  - Assert the `/docs/components/aspect-ratio` page renders the named family
    hook, exact alt text, source strategy evidence, ratio/root styling evidence,
    full-cover image evidence, dark-mode image filter evidence, public hooks,
    and dependency-divergence/mapping copy.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/aspect-ratio-example-inventory.md`.
  - Change `aspect-ratio-demo` to `Covered` only after docs, fixture, and
    Playwright evidence exists.
  - Record the final image strategy and any remote/local deterministic
    divergence.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Add `aspect-ratio` as a resolved example cluster only after the example
    row is `Covered` or intentionally diverged with evidence.
- Regenerate
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md` with
  `node scripts/audit-shadcn-parity.mjs`.
- Update Issue 4 `README.md` learnings with the final Aspect Ratio example
  outcome and the next generated recommendation.

Do not change `radcn/packages/radcn` unless implementation proves the current
primitive cannot meet the upstream example's user-facing behavior,
accessibility, and author-facing modifiability. If package code changes, add
package-level verification and record why the audit assumption changed.

## Verification

Pass criteria:

- Package, docs, and fixture typechecks pass:

  ```text
  pnpm radcn:typecheck
  pnpm --dir radcn/apps/docs typecheck
  pnpm fixtures:candidate:typecheck
  ```
- Fixture static display coverage passes:

  ```text
  pnpm exec playwright test -c radcn/fixtures/playwright.config.ts static-display.spec.ts
  ```
- Docs Playwright coverage passes:

  ```text
  pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
  ```
- A deterministic Node check proves `aspect-ratio-example-inventory.md` has
  exactly one upstream row, `aspect-ratio-demo`, and the row is `Covered` or an
  explicitly recorded intentional divergence:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/aspect-ratio-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)]
  const row = rows.filter((match) => match[1] === 'aspect-ratio-demo')
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
  `examples` entry with `slug = "aspect-ratio"`, `status = "resolved"`, and
  evidence for Experiment 83, Experiment 84, and
  `aspect-ratio-example-inventory.md`.
- `node scripts/audit-shadcn-parity.mjs` regenerates
  `parity-inventory.md`; a deterministic check proves:
  - `aspect-ratio` is absent from `## Unresolved Example Clusters`;
  - `## First Recommended Cluster` no longer says
    `Example parity for aspect-ratio`.
- Fixture tests assert:
  - `aspect-ratio/demo` renders exact image alt text;
  - image source strategy is explicit and documented;
  - the root has public `data-radcn-aspect-ratio` hook evidence;
  - the root has 16:9 layout evidence;
  - root rounded/muted styling is visible through classes or computed CSS;
  - the child image fills the root dimensions and uses `object-fit: cover`;
  - dark-mode image filter behavior is testable with
    `[data-radcn-theme="dark"]` or the docs app's theme hook.
- Docs coverage asserts the Aspect Ratio page renders stable evidence for the
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
      name === 'next' ||
      name.startsWith('next/') ||
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
    'next',
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
          name.startsWith('next/')
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

- `aspect-ratio-demo` remains `Partial` or `Missing` without a recorded
  intentional divergence.
- Docs, fixtures, or tests omit the exact alt text, ratio, full-cover image
  evidence, or dark-mode filter evidence.
- The implementation hides the Next Image/remote-image strategy instead of
  documenting and testing it.
- The implementation adds React, Radix, Next, Tailwind, lucide-react,
  class-variance-authority, `cn`, image optimization libraries, or vendor
  source as package/app dependencies.
- The implementation changes unrelated component clusters or skips the
  regenerated parity inventory.

## Design Review

Reviewer: Hume the 2nd (`019e9d68-9c63-7501-bb32-e04493c0da26`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: added this `## Design Review` section before the plan commit.

Approval: approved. The reviewer confirmed the Issue 4 README links
Experiment 84 as `Designed`, implementation has not started, vendor checkouts
are clean, and the plan is narrow enough to resolve the Experiment 83
`aspect-ratio-demo` parity gap without adding forbidden dependencies.
