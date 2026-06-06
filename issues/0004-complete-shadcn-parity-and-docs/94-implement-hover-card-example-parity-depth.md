# Experiment 94: Implement hover-card example parity depth

## Description

Experiment 93 audited the single direct upstream Hover Card example,
`hover-card-demo`, and found the cluster is partial. RadCN already has the
package substrate: `radcn/hover-card`, `radcn/avatar`, `radcn/button`, browser
enhancement, portal/content hooks, hover/focus behavior, open/close delays,
side/align placement, non-modal behavior, package exports, generic docs,
candidate fixtures, and Playwright coverage.

This experiment should resolve the direct Hover Card example cluster by adding
named docs, candidate fixture, and Playwright coverage for the exact upstream
`@nextjs` profile composition while preserving RadCN's dependency-free model:

- render trigger text `@nextjs`;
- map `HoverCardTrigger asChild` and Button `variant="link"` to a RadCN trigger
  with equivalent link-button presentation and public trigger hooks;
- render Hover Card content with 20rem `w-80` width evidence;
- render Avatar composition with image URL `https://github.com/vercel.png` and
  fallback `VC`;
- render heading `@nextjs`;
- render description text
  `The React Framework – created and maintained by @vercel.`;
- render metadata text `Joined December 2021`;
- preserve hover and focus opening behavior, Escape closing, portal/content
  hooks, side/align/default offset evidence, and non-modal behavior;
- include mapping copy for `"use client"`, Radix Hover Card, `asChild`,
  Button link trigger styling, Avatar/Image/Fallback, `className`, Tailwind
  utilities, `cn`, `data-slot`, unused `CalendarIcon`, native/server-rendered
  markup plus browser enhancement, and vendor source.

The implementation should not add React, Radix, lucide-react, Tailwind,
class-variance-authority, or vendor dependencies. It should use existing RadCN
primitives and app-owned composition. Package code should change only if the
current Hover Card, Avatar, or Button primitives cannot represent the upstream
example's user-facing behavior or author-facing modifiability.

## Changes

- Update `radcn/apps/docs/app/content/components.tsx`.
  - Promote the Hover Card docs example from generic preview/source to a named
    `hover-card-demo` example if needed.
  - Render a stable docs hook
    `data-radcn-docs-hover-card-family="hover-card-demo"`.
  - Render the exact upstream trigger, Avatar image/fallback, heading,
    description, metadata, content width, profile layout, and public RadCN
    hooks.
  - Use existing `HoverCard`, `HoverCardTrigger`, `HoverCardPortal`,
    `HoverCardContent`, `Avatar`, `AvatarImage`, `AvatarFallback`, and Button
    link classes/primitive behavior as appropriate.
  - Include mapping copy for React/Radix/`asChild`/Avatar/Button/lucide/
    Tailwind/`cn`/`data-slot`/vendor mechanics and RadCN equivalents.
- Update `radcn/apps/docs/app/assets/entry.ts`.
  - Import `enhanceHoverCard`.
  - Enhance only the named docs Hover Card demo, not all docs hover cards, so
    runtime state is exercised without changing unrelated docs overlay
    behavior.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/positioned-overlays.tsx`
  Add a named `hover-card/demo` fixture route, preserving existing default,
  focus, side-align, delay, content-hover, and custom-token routes.
- Update fixture Playwright coverage in
  `radcn/fixtures/tests/positioned-overlays.spec.ts`.
  - Verify `hover-card/demo` renders the exact upstream profile composition,
    public Hover Card/Avatar/Button hooks, link-button trigger presentation,
    20rem width evidence, image URL, fallback text, profile text, hover/focus
    opening, Escape closing, non-modal behavior, side/align/default offset
    evidence, and no React/Radix DOM-equivalence assumption.
  - Keep existing positioned overlay tests passing.
- Update docs Playwright coverage in
  `radcn/apps/docs/tests/coverage.spec.ts`.
  - Assert the `/docs/components/hover-card` page renders the named family
    hook, exact profile data/copy, public hooks, width/layout evidence,
    runtime hover-card state evidence, and required mapping copy.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/hover-card-example-inventory.md`.
  - Change `hover-card-demo` from `Partial` to `Covered` only after docs,
    fixture, and Playwright evidence exists.
  - Record final decisions for trigger/asChild mapping, Button link styling,
    Avatar image/fallback behavior, width/class mapping, hover/focus behavior,
    unused `CalendarIcon`, package API needs, and vendor source.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Add `hover-card` as a resolved example cluster only after the inventory row
    is `Covered` or intentionally diverged with evidence.
- Regenerate
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md` with
  `node scripts/audit-shadcn-parity.mjs`.
- Update Issue 4 `README.md`.
  - Record the final Hover Card example outcome in `## Learnings`.
  - Update the Experiment 94 index status from `Designed` to the recorded
    result.
  - Record the next generated recommendation after Hover Card is resolved.

Do not change `radcn/packages/radcn` unless implementation proves the current
Hover Card, Avatar, or Button primitives cannot meet the upstream example's
user-facing behavior, accessibility, and author-facing modifiability. If
package code changes, add package-level verification, synchronize generated
styles if needed, and record why the audit assumption changed.

## Verification

Pass criteria:

- Package, docs, and fixture typechecks pass:

  ```text
  pnpm radcn:typecheck
  pnpm --dir radcn/apps/docs typecheck
  pnpm fixtures:candidate:typecheck
  ```

- Fixture positioned overlay coverage passes:

  ```text
  pnpm exec playwright test -c radcn/fixtures/playwright.config.ts positioned-overlays.spec.ts
  ```

- Docs Playwright coverage passes:

  ```text
  pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
  ```

- A deterministic Node check proves `hover-card-example-inventory.md` has
  exactly one direct upstream row, `hover-card-demo`, and the row is `Covered`
  or an explicitly recorded intentional divergence:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/hover-card-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)]
  const row = rows.filter((match) => match[1] === 'hover-card-demo')
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
  `examples` entry with `slug = "hover-card"`, `status = "resolved"`, and
  evidence for Experiment 93, Experiment 94, and
  `hover-card-example-inventory.md`.
- `node scripts/audit-shadcn-parity.mjs` regenerates
  `parity-inventory.md`; a deterministic check proves:
  - `hover-card` is absent from `## Unresolved Example Clusters`;
  - `## First Recommended Cluster` no longer says
    `Example parity for hover-card`.
- Fixture tests assert:
  - `hover-card/demo` renders Hover Card root, trigger, portal, content,
    Avatar, AvatarImage, AvatarFallback, and Button/link trigger evidence with
    public hooks;
  - trigger text is `@nextjs`;
  - content exposes 20rem width evidence;
  - image `src` is `https://github.com/vercel.png`;
  - fallback is `VC`;
  - visible text includes `@nextjs`,
    `The React Framework – created and maintained by @vercel.`, and
    `Joined December 2021`;
  - hover opens the card, focus opens the card, Escape closes it, body overflow
    is not locked, and default side/align/sideOffset evidence is present;
  - no test depends on React state, Radix internals, or literal DOM
    equivalence.
- Docs coverage asserts the Hover Card page renders stable evidence for the
  named docs example and required dependency-divergence/mapping copy.
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
      name === '@radix-ui/react-hover-card' ||
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
    const patterns = [
      /^\s*import(?:\s+type)?[\s\S]*?\sfrom\s+['"]([^'"]+)['"]/gm,
      /^\s*import\s+['"]([^'"]+)['"]/gm,
      /\bimport\(\s*['"]([^'"]+)['"]\s*\)/gm,
      /\brequire\(\s*['"]([^'"]+)['"]\s*\)/gm,
    ]
    for (const pattern of patterns) {
      for (const match of text.matchAll(pattern)) {
        if (forbiddenImport(match[1])) {
          console.log(`${file}: forbidden import ${match[1]}`)
          failed = true
        }
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
    '@radix-ui/react-hover-card',
    'lucide-react',
    'tailwindcss',
    'class-variance-authority',
  ]
  let failed = false
  for (const manifest of manifests) {
    const json = JSON.parse(fs.readFileSync(manifest, 'utf8'))
    for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const name of Object.keys(json[section] ?? {})) {
        if (forbidden.includes(name) || name.startsWith('@radix-ui/')) {
          console.log(`${manifest}: forbidden ${section} ${name}`)
          failed = true
        }
      }
    }
  }
  if (failed) process.exit(1)
  NODE
  git diff --exit-code -- pnpm-lock.yaml
  ```

- If `tokens.css` changes, a deterministic Node check proves
  `radcn/packages/radcn/src/styles/index.ts` exactly serializes `tokens.css`.
- `git diff --check`
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The implementation adds React, Radix, lucide-react, Tailwind,
  class-variance-authority, or vendor dependencies.
- The named demo omits any upstream visible text, image URL, fallback, width,
  trigger behavior, or mapping requirement listed above.
- Hover/focus behavior is only documented and not tested.
- The implementation treats literal Radix or React DOM equivalence as required
  instead of proving user-facing behavior, accessibility, and modifiability.
- The implementation modifies vendor source.

## Design Review

Reviewer: Erdos the 3rd
(`019e9dea-4fb5-75b3-b5cd-e9f4ba178d30`), fresh-context Codex subagent
(`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approved. The reviewer confirmed the issue README links Experiment 94 with
status `Designed`, the plan has the required sections, the scope is narrow
around the direct `hover-card-demo` implementation, implementation has not
started before the plan commit, verification includes typechecks, Playwright,
deterministic inventory/resolved-cluster checks, dependency/lockfile checks,
`git diff --check`, and vendor cleanliness, and the plan targets Experiment
93's Partial outcome without adding forbidden dependencies.

## Result

**Result:** Pass

Experiment 94 implemented direct `hover-card-demo` parity in the docs app and
candidate fixture without changing package code or adding dependencies.

- `radcn/apps/docs/app/content/components.tsx` now renders a rich named
  `hover-card-demo` docs example with stable
  `data-radcn-docs-hover-card-family="hover-card-demo"`, trigger text
  `@nextjs`, RadCN button link classes on `HoverCardTrigger`, Avatar image URL
  `https://github.com/vercel.png`, fallback `VC`, heading `@nextjs`, exact
  description and joined-date copy, 20rem width evidence, profile layout
  evidence, source snippet, and mapping copy for React/Radix/`asChild`/Button/
  Avatar/`className`/Tailwind/`cn`/`data-slot`/unused `CalendarIcon`/vendor
  mechanics.
- `radcn/apps/docs/app/assets/entry.ts` scopes `enhanceHoverCard` to the named
  docs Hover Card demo. Docs coverage follows the portaled content by id after
  enhancement moves it out of the wrapper.
- `radcn/fixtures/scenarios/index.ts` registers `hover-card/demo`.
- `radcn/fixtures/candidate-remix/app/fixtures/positioned-overlays.tsx`
  renders the same named profile composition.
- `radcn/fixtures/tests/positioned-overlays.spec.ts` verifies exact profile
  data and copy, public Hover Card/Avatar hooks, link trigger evidence, 20rem
  width, default side/align/offset, hover opening, focus opening, Escape
  closing, and non-modal behavior. The shared helper now waits for
  `data-radcn-hover-card-ready="true"` before closing default-open hover-card
  fixtures, avoiding a race with browser enhancement setup.
- `radcn/apps/docs/tests/coverage.spec.ts` verifies the named docs route
  evidence, runtime hover/focus/Escape behavior, non-modal behavior, and
  mapping copy.
- `hover-card-example-inventory.md`, `resolved-clusters.json`, and
  `parity-inventory.md` now mark the direct Hover Card example cluster
  covered.

Verification passed:

```text
pnpm radcn:typecheck
pnpm --dir radcn/apps/docs typecheck
pnpm fixtures:candidate:typecheck
pnpm exec playwright test -c radcn/fixtures/playwright.config.ts positioned-overlays.spec.ts
pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
node scripts/audit-shadcn-parity.mjs
```

The deterministic `hover-card-example-inventory.md` check found exactly one
direct row, `hover-card-demo`, with outcome `Covered`. The deterministic
`resolved-clusters.json` check found `examples.hover-card` with status
`resolved` and evidence for Experiments 93 and 94 plus the Hover Card example
inventory. The deterministic regenerated-inventory check confirmed
`hover-card` is absent from unresolved example clusters and that the first
recommended cluster is now `Example parity for label`.

Dependency and scope checks passed:

```text
forbidden import scanner for radcn/packages/radcn, radcn/apps/docs, and radcn/fixtures/candidate-remix
manifest forbidden dependency scanner
git diff --exit-code -- pnpm-lock.yaml
git diff --check
for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done
```

`tokens.css` did not change, so the style serialization check was not
applicable.

## Conclusion

The direct upstream Hover Card example cluster is resolved. RadCN can represent
the shadcn `@nextjs` profile hover card through existing `radcn/hover-card`,
`radcn/avatar`, and RadCN button link classes. Literal React/Radix DOM
equivalence and `asChild` mechanics are unnecessary; the verified surface is
user-facing behavior, accessibility/state behavior, and author-facing
modifiability.

The regenerated parity inventory recommends auditing `label` example parity
next.

## Completion Review

Reviewer: Cicero the 3rd
(`019e9df2-644f-7903-83cb-1832d42c9bf4`), fresh-context Codex subagent
(`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: `hover-card-example-inventory.md` still had a future-tense note saying
  the follow-up should decide the trigger/asChild mapping. Fixed by recording
  the final decision: RadCN applies button link classes and style directly to
  `HoverCardTrigger`, preserving equivalent link-button presentation without
  Slot or a new package API. The related Avatar decision now records that the
  named docs and fixture coverage verify the vercel image URL and `VC`
  fallback.

Approved. The reviewer independently verified the typechecks, Playwright
suites, regenerated parity audit, deterministic inventory/resolved-cluster/
recommendation checks, forbidden import and manifest checks, lockfile check,
`git diff --check`, vendor cleanliness, and that the result commit had not
been made before review.
