# Experiment 40: Migrate Slider surfaces to Tailwind utilities

## Description

Slider is a custom-rendered range control (a hidden native `<input type="range">`
overlaid on a visual track + range + thumb). The JS sets `--radcn-slider-percent`
inline on the wrapper; the range width + thumb position read it. It is
self-contained (no rules shared with the other form controls). Migrate the
surfaces to token-referencing Tailwind utilities; the `:has(:focus-visible)`
focus ring on the thumb stays a bespoke parent-state→child rule keyed on the
data attributes. The custom-slider fixture is unchanged (asserted track bg
`rgb(204,251,241)` reads the token).

### Exact utility mapping

- wrapper (`.radcn-slider`): `relative block w-[min(100%,20rem)] h-5
  text-[var(--radcn-slider-fg,var(--radcn-primary))]
  data-[disabled=true]:opacity-50` (1.25rem → h-5; font-family dropped, inherited).
  Keeps the inline `--radcn-slider-percent` style + all `data-*` attrs.
- input (`.radcn-slider-input`, native range): `absolute inset-0 z-[2] size-full
  m-0 opacity-0 cursor-pointer disabled:cursor-not-allowed`.
- track (`.radcn-slider-track`): `absolute top-1/2 left-0 right-0 block h-2
  overflow-hidden rounded-[999px]
  bg-[var(--radcn-slider-track-bg,var(--radcn-secondary))] -translate-y-1/2`
  (0.5rem → h-2; `translateY(-50%)` → `-translate-y-1/2`).
- range (`.radcn-slider-range`): `block w-[var(--radcn-slider-percent,0%)] h-full
  rounded-[inherit] bg-[var(--radcn-slider-range-bg,var(--radcn-primary))]`.
- thumb (`.radcn-slider-thumb`): `absolute top-1/2
  left-[var(--radcn-slider-percent,0%)] z-[1] size-4 border-2
  border-[var(--radcn-slider-thumb-border,var(--radcn-primary))] rounded-[999px]
  bg-[var(--radcn-slider-thumb-bg,var(--radcn-background))]
  shadow-[0_1px_2px_rgb(0_0_0_/_0.12)] pointer-events-none -translate-x-1/2
  -translate-y-1/2` (1rem → size-4; `translate(-50%,-50%)` →
  `-translate-x-1/2 -translate-y-1/2`).

Kept bespoke (parent-state → child focus ring, keyed on data attributes):
- `[data-radcn-slider]:has([data-radcn-slider-input]:focus-visible)
  [data-radcn-slider-thumb] { box-shadow: 0 0 0 3px color-mix(in srgb,
  var(--radcn-ring) 35%, transparent); }`

## Why both suites stay green

- The custom track bg (#ccfbf1) holds via `bg-[var(--radcn-slider-track-bg,…)]`
  reading the unchanged fixture token (asserted slider.spec.ts:156); the range/
  thumb custom tokens likewise.
- The range width + thumb position read the JS-set inline `--radcn-slider-percent`
  (retained); `data-value`/`data-min`/`data-max`/`data-step`/`data-disabled` are
  retained (the JS sync + assertions).
- The thumb focus ring holds via the kept bespoke `:has(:focus-visible)` rule.

## Changes

- `radcn/packages/radcn/src/components/slider.tsx`: emit utility-const strings
  for wrapper/input/track/range/thumb; drop the `radcn-slider*` classes; keep ALL
  data attributes + the inline `--radcn-slider-percent` style + the native input.
- `radcn/packages/radcn/src/styles/tokens.css`: remove the migrated
  `.radcn-slider*` rules; REWRITE the bespoke `:has(:focus-visible)` thumb rule's
  selector from `.radcn-slider:has(.radcn-slider-input:focus-visible)
  .radcn-slider-thumb` → `[data-radcn-slider]:has([data-radcn-slider-input]:focus-visible)
  [data-radcn-slider-thumb]` (the class selectors are dropped, so it MUST move to
  the data attributes in this experiment, or the focus ring stops matching); KEEP
  `.radcn-fixture-custom-slider`.
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the canonical node
  formula.

Expected git status: `slider.tsx`, `tokens.css`, `index.ts`, this file, README.
Both generated CSS untracked.

## Verification

1. Both `styles:build` exit 0 (the `w-[var(--radcn-slider-percent,0%)]`,
   `-translate-x-1/2`, the bespoke `:has()` rule + `color-mix` compile).
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css` (node formula); no `.radcn-slider*`
   CLASS rule remains; the bespoke `:has(:focus-visible)` thumb rule present
   (keyed on `[data-radcn-slider]`); `.radcn-fixture-custom-slider` retained.
4. Docs suite green (11), run twice.
5. Fixture suite green (1191), run twice — incl. `slider.spec.ts` (value/min/max/
   step, keyboard, AND the range computed `width` assertions at :79/:87 — `160px`/
   `256px`, which the `w-[var(--radcn-slider-percent,0%)]` utility must reproduce
   from the inline percent — and the custom-token track bg `rgb(204,251,241)`).
6. `git diff --check` clean; `vendor/` untouched; only the expected files changed.

Pass criteria: Slider renders from Tailwind utilities (no `radcn-slider*` class);
the track/range/thumb + the percent-driven positioning + the focus ring + the
custom track bg hold; BOTH suites green; `tokens.css`/`index.ts` byte-identical.

Fail criteria: a slider assertion regresses; the range/thumb mis-positions; the
focus ring or custom bg fails; `tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to the source)

Findings: the reviewer's SUBSTANTIVE verification passed — Slider is confirmed
SELF-CONTAINED (NONE of its rules combine with checkbox/radio/switch — safe to
remove without splitting); the var-read arbitrary utilities
(`w-[var(--radcn-slider-percent,0%)]`, `left-[var(…)]`) have precedent (Tabs/
ScrollArea) and reproduce the percent-driven positioning; the `translate`/`size`/
token mappings are exact; the bespoke focus-ring selectors are valid; no raw
`radcn-slider` class strings in fixtures.

It returned "REJECTED" on the recurring make-the-implementation-explicit asks,
now addressed: (1) the focus-ring rule's selector REWRITE
(`.radcn-slider…` → `[data-radcn-slider]…`) is now explicit in Changes (it was
already specified as "repointed to data attributes", now spelled out); (2) the
real assertions the reviewer surfaced — `slider.spec.ts:79/87` assert the range
computed `width` (`160px`/`256px`), which the `w-[var(--radcn-slider-percent,0%)]`
utility reproduces from the inline percent — are now called out in Verification
(the existing suite is the gate; no new assertions are added). The focus ring is
visual/unasserted (reproduced bespoke, as before).

Lead-agent judgment: the substantive review is an APPROVAL; the self-contained
confirmation is the key check; the explicitness asks are folded in.

Approval result: approved — self-contained migration; the percent-var positioning
+ token-referencing track/range/thumb + the repointed bespoke focus ring are
sound.
