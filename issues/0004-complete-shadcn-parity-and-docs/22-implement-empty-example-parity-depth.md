# Experiment 22: Implement empty example parity depth

## Description

Experiment 21 audited all 7 upstream shadcn Empty examples and found that
RadCN's base Empty primitive exists, but example parity depth is not complete.
Current proof covers package slots, default media, icon media, and one Spinner
loading composition. It does not yet prove multi-action default Empty states,
icon grids, Avatar media, stacked Avatar media, InputGroup/Kbd search
composition, support links, outline/dashed styling, or muted/background
styling.

This experiment implements that Empty parity depth. It should preserve RadCN's
Remix 3 model: no React dependency, no shadcn `asChild`, no Radix Slot, no
lucide dependency, no Tabler dependency, no Tailwind dependency, no remote
image dependency, no vendor imports, and no npm publishing.

## Changes

- Update docs in `radcn/apps/docs/app/content/components.tsx`.
  - Expand the Empty docs page from seed coverage into rich docs.
  - Demonstrate all 7 upstream Empty example families: `avatar`,
    `avatar-group`, `background`, `demo`, `icon`, `input-group`, and
    `outline`.
  - Document that shadcn `asChild` maps to explicit RadCN `Button href` or
    native anchor composition.
  - Document that lucide and Tabler icons map to app-owned glyphs/assets or
    inline presentation inside `EmptyMedia`.
  - Document that Tailwind utility classes map to RadCN public classes,
    inline styles, or CSS variables.
  - Document that remote GitHub avatar images map to local/static/app-owned
    images or `AvatarFallback`.
  - Keep installation copy aspirational and do not claim RadCN is published.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/static-display.tsx`
  Add direct fixture scenarios for all 7 upstream Empty examples:
  `avatar`, `avatar-group`, `background`, `demo`, `icon`, `input-group`, and
  `outline`. Preserve the existing `default` and `icon` scenarios unless a
  replacement intentionally proves the same behavior.
  - Implement Avatar media inside `EmptyMedia` using `Avatar`,
    `AvatarImage`, and `AvatarFallback` with deterministic local/static or
    data-URI image content, or fallback-only output if that proves the same
    user-facing behavior without remote network dependency.
  - Implement stacked Avatar media using `AvatarGroup`, `Avatar`,
    `AvatarFallback`, and `AvatarGroupCount` or local/static image content.
  - Implement the 404/search composition with `InputGroup`,
    `InputGroupAddon`, `InputGroupInput`, `InputGroupText`, `Kbd`, and a
    support link in the description.
  - Implement outline/dashed and muted/background examples with existing
    Empty `class` and `style` hooks unless a narrow package/style gap is
    proven.
- Update fixture Playwright coverage in
  `radcn/fixtures/tests/static-display.spec.ts` or a focused Empty spec if
  that keeps the suite clearer. Verify:
  - default/demo Empty renders media, title, description, primary Button,
    outline Button, and link-style action through native anchor/Button `href`
    behavior;
  - icon grid renders four Empty states with `EmptyMedia variant="icon"` and
    distinct accessible titles/descriptions;
  - Avatar Empty composes Avatar output inside Empty media and exposes
    fallback or deterministic image semantics;
  - stacked Avatar Empty composes AvatarGroup output inside Empty media and
    exposes grouped avatar semantics;
  - InputGroup Empty composes a search input, search addon, `Kbd` inline-end
    addon, and support link without Empty owning form state;
  - outline Empty exposes dashed/border styling and an outline Button action;
  - muted/background Empty exposes public class/style/CSS-variable
    customization and an outline Refresh action;
  - existing `default` and `icon` fixture behavior remains covered.
- Update `issues/0004-complete-shadcn-parity-and-docs/empty-example-inventory.md`.
  - Change each upstream row to `Covered` or `Intentional divergence` after
    the new proof lands.
  - Preserve mapping decisions from Experiment 21.
- Update `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Mark `empty` as a resolved example cluster with evidence from Experiments
    21 and 22 plus `empty-example-inventory.md`.
- Regenerate `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`.
- Update Issue 4 learnings with the final Empty outcome and the next generated
  recommendation.
- Update `radcn/packages/radcn/src/components/empty.tsx`,
  `radcn/packages/radcn/src/styles/tokens.css`, and generated
  `radcn/packages/radcn/src/styles/index.ts` only if implementation proves a
  concrete package/style gap. Prefer existing `class`, `style`,
  `EmptyMedia variant`, and composition with Avatar, Button, InputGroup, Kbd,
  and native anchors.

## Verification

Pass criteria:

- `pnpm radcn:typecheck`
- `pnpm --dir radcn/apps/docs typecheck`
- `pnpm fixtures:candidate:typecheck`
- `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts static-display.spec.ts`
  or the focused Empty Playwright spec created by this experiment.
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts`
- `node scripts/audit-shadcn-parity.mjs`
- `tmp=$(mktemp) && cp issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md "$tmp" && node scripts/audit-shadcn-parity.mjs >/tmp/radcn-parity-regen.log && diff -u "$tmp" issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md; regen_status=$?; rm "$tmp"; cat /tmp/radcn-parity-regen.log; exit $regen_status`
  exits 0 and prints no diff.
- A deterministic Node check proves all 7 upstream Empty example ids appear
  exactly once in `empty-example-inventory.md`.
- A deterministic Node check proves every upstream Empty example row has a
  final outcome of `Covered` or `Intentional divergence`, and that no row
  keeps a `Partial` or `Missing` outcome.
- A deterministic Node check proves `resolved-clusters.json` includes an
  `examples` entry with `slug = "empty"`, `status = "resolved"`, and evidence
  for Experiment 21, Experiment 22, and `empty-example-inventory.md`.
- If `tokens.css` changes, a deterministic Node check proves
  `radcn/packages/radcn/src/styles/index.ts` is exactly
  `export const radcnStyles = ${JSON.stringify(tokensCss)}\n` for
  `radcn/packages/radcn/src/styles/tokens.css`.
- A deterministic Node check proves `empty` is absent from
  `## Unresolved Example Clusters` and is not the `## First Recommended
  Cluster` in `parity-inventory.md`.
- Positive documentation checks prove
  `issues/0004-complete-shadcn-parity-and-docs/empty-example-inventory.md`
  still records intentional mappings for shadcn `asChild`, lucide icons,
  Tabler icons, Tailwind utility classes, remote GitHub avatar images, local
  image/fallback choices, and composed primitive ownership.
- A deterministic docs check proves `radcn/apps/docs/app/content/components.tsx`
  contains the 7 intended Empty example family labels or slugs (`avatar`,
  `avatar-group`, `background`, `demo`, `icon`, `input-group`, `outline`) and
  the required mapping copy for `asChild`, icon packages, Tailwind utilities,
  remote image choices, and app-owned composed primitives.
- A focused docs Playwright assertion or deterministic source check proves the
  Empty docs page renders package-backed Empty examples for the family matrix
  rather than only the generic seed preview.
- Targeted dependency-avoidance checks prove Empty docs, fixtures, and package
  source do not import React, lucide, Tabler, vendor source, or remote GitHub
  avatar image URLs:
  ```text
  rg -n "from ['\"]react['\"]|from ['\"][^'\"]*lucide-react|from ['\"][^'\"]*@tabler/icons-react|from ['\"](\\.\\./)*vendor/|from ['\"][^'\"]*vendor/|github\\.com/[^\"']*/\\.png|avatars\\.githubusercontent\\.com|npm publish|pnpm publish|publishConfig" radcn/packages/radcn radcn/apps/docs radcn/fixtures/candidate-remix package.json
  ```
  exits 1 with no matches.
- `rg -n "asChild|Slot\\.Root|@radix-ui/react-slot" radcn/packages/radcn radcn/fixtures/candidate-remix`
  exits 1 with no matches, proving package and fixture implementation code
  does not use shadcn `asChild`, Radix Slot, or Radix Slot imports.
- A focused docs source/snippet check proves any `asChild`, `Slot.Root`, or
  `@radix-ui/react-slot` mentions in `radcn/apps/docs/app/content/components.tsx`
  are mapping/divergence prose, not executable Empty example code or install
  instructions.
- A targeted Tailwind-avoidance check proves Empty docs, fixtures, and source
  snippets do not use Tailwind utility classes from the upstream examples as
  implementation code, such as `min-h-96`, `bg-muted`, `border-dashed`,
  `grayscale`, `size-12`, `rounded-full`, `text-muted-foreground`,
  `text-primary`, or `ring-background`. Mentions are allowed only in issue
  inventory or docs divergence/mapping prose.
- `git diff --check`
- `git status --short` shows only expected package, docs, fixture, test,
  issue, resolved-cluster, and generated-inventory changes before the result
  commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- Empty still lacks proof for any audited upstream example family.
- Empty examples depend on React, Radix Slot, shadcn `asChild`, lucide, Tabler,
  Tailwind utility implementation, remote image availability, vendor imports,
  or npm publishing.
- Docs or fixtures imply Empty owns Avatar, AvatarGroup, Button, InputGroup,
  Kbd, image loading, icon package, route, form, or support-link state.
- Link-style actions cannot render native anchor semantics.
- InputGroup/Kbd search composition cannot render inside Empty content.
- The audit inventory marks `empty` resolved while any upstream Empty example
  still lacks package/docs/fixture/test evidence or a documented intentional
  divergence.
- The regenerated parity inventory still recommends `empty` as the first
  unresolved example cluster.

## Design Review

Reviewer: Helmholtz (`019e9ad6-38f5-7212-8c9d-db39d8dc3ef1`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: the original verification was internally contradictory. It required
  docs mapping copy for `asChild`, but also required a broad `asChild`/Slot grep
  over docs to exit 1. Fixed by narrowing the no-`asChild`/Slot grep to package
  and fixture implementation code, and adding a focused docs check that allows
  mapping/divergence prose while forbidding executable Empty example code or
  install instructions from using `asChild`, `Slot.Root`, or
  `@radix-ui/react-slot`.
- Major: none.
- Minor: none.

Re-review result: approved. Helmholtz confirmed the blocker is resolved: the
no-`asChild`/Slot grep now targets package and fixture implementation code, and
the separate docs check allows mapping/divergence prose while forbidding
executable Empty example code or install instructions from using `asChild`,
`Slot.Root`, or `@radix-ui/react-slot`. No new blocker was introduced by the
fix.
