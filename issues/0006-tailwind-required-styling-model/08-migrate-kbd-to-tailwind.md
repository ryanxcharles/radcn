# Experiment 8: Migrate Kbd to Tailwind utilities

## Description

Continuing the per-component migration, this experiment migrates Kbd and
KbdGroup from bespoke `radcn-kbd*` CSS to verbatim shadcn v4 Tailwind
utilities. A survey of remaining leaf components ranked Kbd the safest next
target: it is consumed only through its `<Kbd>`/`<KbdGroup>` JSX API (no raw
`radcn-kbd` class strings in fixtures or docs), reads no custom-token CSS
variables, and has NO computed-style assertion in either test suite (both
suites assert only Kbd text, counts, and attributes). So this is a clean
class-swap with no expected test changes.

shadcn v4 mappings (vendored `registry/new-york-v4/ui/kbd.tsx`, copied
verbatim):

- Kbd (`<kbd>`): `pointer-events-none inline-flex h-5 w-fit min-w-5
  items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs
  font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3
  [[data-slot=tooltip-content]_&]:bg-background/20
  [[data-slot=tooltip-content]_&]:text-background
  dark:[[data-slot=tooltip-content]_&]:bg-background/10`
- KbdGroup: `inline-flex items-center gap-1`

Utility resolution: `bg-muted`/`text-muted-foreground`/`bg-background`/
`text-background` come from the Experiment 2 contract; `font-sans` maps to the
contract's `--font-sans`; the rest (`h-5`, `w-fit`, `min-w-5`, `px-1`,
`rounded-sm`, `text-xs`, `font-medium`, `gap-1`, `size-3`, `pointer-events-none`,
`select-none`, `inline-flex`, `items-center`, `justify-center`) are Tailwind
defaults; opacity modifiers and `dark:` resolve as in prior experiments.

Faithful-copy note: the `[[data-slot=tooltip-content]_&]:*` variants are copied
verbatim from shadcn but are currently INERT in RadCN — RadCN tooltips emit
`data-radcn-tooltip-content`, not `data-slot="tooltip-content"`, so these
selectors never match. They are kept for fidelity and as a marker for a future
tooltip structural-alignment item (Issue 7 territory); they cause no harm.

Scope limits: Kbd and KbdGroup only. No preflight. Markup/elements unchanged —
Kbd stays a `<kbd>` (already matches shadcn); KbdGroup stays a `<div>` (shadcn
uses a `<kbd>` element for the group, but the element-name divergence is a
structural-parity question for Issue 7, not styling). The
`data-radcn-kbd`/`data-radcn-kbd-group` attributes stay as non-visual hooks.
The appearance shifts to shadcn's look (borderless `bg-muted`, `rounded-sm`,
`h-5`) — that is the intended parity outcome; visual artifacts are not
pixel-compared.

## Why both suites stay green (with two intended fixture test updates)

There are NO computed-style assertions on kbd in either suite, and no
`--radcn-kbd*` custom token anywhere, so the visual swap changes no computed
value. But the fixture spec has TWO class-PRESENCE assertions on the bespoke
classes being removed (caught in design review):

- `static-display.spec.ts:204`: `await expect(group).toHaveClass(/radcn-kbd-group/)`
- `static-display.spec.ts:208`: `await expect(keys.first()).toHaveClass(/radcn-kbd/)`

Both are redundant with their locators — the elements are already selected by
`[data-radcn-kbd-group]` and `kbd[data-radcn-kbd]` respectively, and those
`data-*` attributes are the retained hooks (the class is being removed as a
visual concern, per the issue Decisions). These two assertions are deleted; the
data-attribute locators stay, so the tests still pin the same elements, text,
and counts. The docs suite has no `toHaveClass(/radcn-kbd/)` assertion.

All other Kbd assertions in both suites are text/count/attribute and are
unaffected.

## Changes

- `radcn/packages/radcn/src/components/kbd.tsx`:
  - `Kbd`: replace `classes('radcn-kbd', className)` with
    `classes(<verbatim shadcn kbd string>, className)`; keep the `<kbd>`
    element, `data-radcn-kbd`, `style`.
  - `KbdGroup`: replace `classes('radcn-kbd-group', className)` with
    `classes('inline-flex items-center gap-1', className)`; keep the `<div>`
    element, `data-radcn-kbd-group`, `style`.
- `radcn/packages/radcn/src/styles/tokens.css`: remove `.radcn-kbd` and
  `.radcn-kbd-group` rules (replace with a short migration comment that does
  not carry the literal selectors, per the Experiment 7 learning).
- `radcn/packages/radcn/src/styles/index.ts`: regenerate from `tokens.css`
  with `export const radcnStyles = ${JSON.stringify(tokensCss)}\n`.
- `radcn/fixtures/tests/static-display.spec.ts`: delete the two
  `toHaveClass(/radcn-kbd-group/)` (line ~204) and `toHaveClass(/radcn-kbd/)`
  (line ~208) assertions; keep the surrounding `[data-radcn-kbd-group]` /
  `kbd[data-radcn-kbd]` locators, count, and text assertions.

Expected git status for the result commit: `kbd.tsx`, `tokens.css`,
`index.ts`, fixture `static-display.spec.ts`, this experiment file, and the
README index + Learnings. Both generated CSS files stay untracked.

## Verification

From the repo root:

1. `pnpm --dir radcn/fixtures/candidate-remix styles:build` and
   `pnpm --dir radcn/apps/docs styles:build` — both exit 0; each generated CSS
   contains the kbd utilities (`.bg-muted`, `.rounded-sm`, `.h-5`,
   `.text-muted-foreground`).
2. `pnpm radcn:typecheck`, `pnpm fixtures:candidate:typecheck`,
   `pnpm --dir radcn/apps/docs typecheck` — all pass.
3. `index.ts` byte-identical to `tokens.css`; neither contains a `.radcn-kbd`
   rule (the migration comment must not carry the literal selectors).
4. `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts` — docs
   suite green.
5. `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts` — fixture
   suite green (1191).
6. `git diff --check` clean; `vendor/` untouched; both generated CSS untracked;
   only the expected files changed (the only `.spec.ts` change is the two
   deleted class-presence assertions in `static-display.spec.ts`).

Pass criteria (all must hold):

- Kbd/KbdGroup render from Tailwind utilities (no `radcn-kbd*` classes
  emitted); `data-*` hooks intact.
- BOTH suites green, with the only test change being the two deleted
  class-presence assertions.
- `tokens.css`/`index.ts` byte-identical; typechecks and hygiene clean.

Fail criteria (any → record Partial/Fail with specifics):

- Any spec regresses (would reveal a previously-unnoticed computed-style
  dependence on the bespoke kbd CSS).
- A kbd utility is not generated by either `styles:build`.
- `tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given only `AGENTS.md`, the issue README, this experiment
file, and read access to referenced sources incl. vendored shadcn)

Round 1 findings (REJECTED):

- Blocker: the design claimed "no test changes" by checking only
  computed-style assertions, but the fixture spec has two class-PRESENCE
  assertions on the classes being removed (`static-display.spec.ts:204`
  `toHaveClass(/radcn-kbd-group/)`, `:208` `toHaveClass(/radcn-kbd/)`). Fixed:
  the design now plans to delete those two redundant assertions (the elements
  remain located by their `data-radcn-kbd-group`/`data-radcn-kbd` locators),
  adds `static-display.spec.ts` to the changed files, and corrects the
  "stays green" / pass-criteria language.

The reviewer also verified everything else: the verbatim shadcn strings, the
tokens.css rules to remove, all theme tokens present (`--color-muted`,
`--color-muted-foreground`, `--color-background`, `--font-sans`), no
`--radcn-kbd*` custom token anywhere, no raw `radcn-kbd` class strings (JSX
only), no element-tag assertion on KbdGroup (so keeping `<div>` is safe), the
inert tooltip-content variants acceptable, and the dual-suite-plus-typechecks
verification. Apart from the one blocker, no other issues.

Round 2 (re-review of the fix by a fresh Claude subagent): confirmed all four
fix criteria (acknowledges the two assertions; plans to delete only those while
keeping the data-attribute locators + count/text; adds the spec to changed
files; corrected the language), verified deleting exactly those two lines
leaves a valid suite, and found no other kbd class-presence assertion in either
suite and no new blocker. Verdict: APPROVED.

Approval result: approved (round 2). No blocker findings remain.
