# Experiment 21: Migrate Progress to Tailwind utilities

## Description

Migrate Progress off bespoke `radcn-progress*` CSS. Progress is self-contained
(no cross-component selectors, no raw class-string consumers). Its architecture
differs from shadcn's Radix Progress, so this is an architecture-AWARE
adaptation, not a verbatim port:

- RadCN renders a wrapper `<span>` (the visible bar) containing a
  visually-hidden native `<progress>` (for accessibility), a track `<span>`, and
  a width-driven indicator `<span>` (`style="width:X%"`). shadcn renders a Radix
  Root + a transform-driven Indicator.
- `native-state.spec.ts:306` asserts the indicator's inline
  `style="width:48%"`, so RadCN's WIDTH-based indicator is kept (the component
  already sets the inline width; only the classes change). shadcn's
  transform-based indicator is NOT adopted.

shadcn v4 utilities (from `progress.tsx`), mapped onto RadCN's elements:

- wrapper (the visible bar = shadcn Root): `relative block h-2 w-full
  overflow-hidden rounded-full bg-primary/20` (RadCN's wrapper was a `<span>`,
  hence `block`; `h-2` = the old `0.5rem`; the old `width:min(100%,20rem)`
  becomes shadcn's `w-full` — consumer-constrained; the old `bg-secondary`
  becomes shadcn's `bg-primary/20`. Neither width nor wrapper bg is asserted.)
- native `<progress>` (a11y, hidden): `absolute inset-0 size-full opacity-0`
- track: `block size-full`
- indicator (shadcn Indicator, width-based): `block h-full w-0 rounded-[inherit]
  bg-primary transition-all` — the component's inline `style="width:X%"`
  overrides `w-0`, so the asserted inline width is preserved; `transition-all`
  covers the width transition.

RadCN extension kept (indeterminate): shadcn has no indeterminate Progress.
RadCN's indeterminate state (a 35%-wide indicator with a sliding keyframe
animation) is a RadCN value-add. The component keeps emitting the
`radcn-progress-wrapper--indeterminate` class when `value === undefined`, and the
bespoke rule `.radcn-progress-wrapper--indeterminate .radcn-progress-indicator {
width: 35%; animation: radcn-progress-slide … }` plus the
`@keyframes radcn-progress-slide` are RETAINED. Only `data-state=indeterminate`
(an attribute) is asserted, not the animation, so retaining the extension is
safe and faithful.

Custom-token translation: `.radcn-fixture-custom-progress` (applied to the
wrapper) sets `--radcn-progress-bg: #ccfbf1` and `--radcn-progress-fg: #0f766e`,
which the migrated component no longer reads. `native-state.spec.ts:316` asserts the WRAPPER
`background-color: rgb(204, 251, 241)` (#ccfbf1) and `:317` asserts the
INDICATOR `background-color: rgb(15, 118, 110)` (#0f766e). BOTH are required, so
translate to direct rules: `.radcn-fixture-custom-progress {
background-color: #ccfbf1; }` (the asserted wrapper bg — wins over the
`bg-primary/20` utility because unlayered `radcnStyles` is ordered after the
Tailwind `<link>`) and
`.radcn-fixture-custom-progress [data-radcn-progress-indicator] {
background-color: #0f766e; }` (the asserted indicator bg; a descendant rule
since the custom class is on the wrapper, the assertion on the indicator).

## Why both suites stay green

- The indicator `style="width:48%"` (306) is set inline by the component
  (unchanged) — survives. The `w-0` class is overridden by the inline width.
- `data-state` determinate/indeterminate (305, 311) and the native `<progress
  value>` (399) are attributes — retained.
- The custom-progress WRAPPER `background-color: #ccfbf1` (316) and INDICATOR
  `background-color: #0f766e` (317) both hold via the translated direct/
  descendant rules (unlayered `radcnStyles`, winning over `bg-primary/20` and
  `bg-primary`).
- Consumer overrides on the wrapper — a `w-[60%]` class and inline
  `style="width:60%"` (docs `coverage.spec.ts:371-372`) — are passed through
  via the `class`/`style` props (the component composes `classes(wrapperClass,
  className)` and forwards `style`), so they survive.
- No animation assertion exists (only `data-state=indeterminate`), so the kept
  indeterminate extension is safe; no default-indicator-color assertion.

## Changes

- `radcn/packages/radcn/src/components/progress.tsx`: emit the shadcn-adapted
  utility strings for the wrapper, native `<progress>`, track, and indicator
  (per-element constants), keeping the inline `indicatorStyle` width, all
  `data-radcn-progress*` attributes, `data-state`, `max`/`value`/`aria-label`,
  and the `radcn-progress-wrapper--indeterminate` class for the indeterminate
  case.
- `radcn/packages/radcn/src/styles/tokens.css`: remove the
  `.radcn-progress-wrapper`, `.radcn-progress`, `.radcn-progress-track`,
  `.radcn-progress-indicator` base rules (migration comment, no literal
  selectors). KEEP `.radcn-progress-wrapper--indeterminate
  .radcn-progress-indicator` + the `@keyframes radcn-progress-slide` (RadCN
  extension). Translate `.radcn-fixture-custom-progress` to the two direct rules
  above.
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the standard
  formula.

Expected git status: `progress.tsx`, `tokens.css`, `index.ts`, this experiment
file, README index + Learnings. Both generated CSS untracked.

## Verification

1. Both `styles:build` exit 0; generated CSS contains the progress utilities
   (`rounded-full`, `bg-primary/20`, `size-full`, `rounded-[inherit]`).
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css`; no base
   `.radcn-progress`/`-wrapper`/`-track`/`-indicator` rule remains; the
   indeterminate rule + keyframe remain; `.radcn-fixture-custom-progress` +
   its indicator descendant set the colors directly.
4. Docs suite green (11), run twice.
5. Fixture suite green (1191), run twice — incl. `native-state.spec.ts`
   progress (determinate/indeterminate `data-state`, indicator
   `style="width:48%"`, custom indicator `background-color: rgb(15, 118, 110)`)
   and `static-display.spec.ts` `value="75"`.
6. `git diff --check` clean; `vendor/` untouched; only the expected files
   changed.

Pass criteria: Progress renders from Tailwind utilities (no base `radcn-progress*`
classes beyond the retained indeterminate extension); the inline width, data
attributes, native progress, and custom indicator color all hold; BOTH suites
green and stable; `tokens.css`/`index.ts` byte-identical.

Fail criteria: any progress assertion regresses (esp. the inline width or the
custom indicator color); the indeterminate animation breaks; a utility not
generated; `tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to referenced sources incl. vendored shadcn)

Findings: one Major (a doc-label correction), one Minor (verify `rounded-[inherit]`
generates), no blocker. The reviewer verified ALL eight progress assertions map
to design provisions: `data-state` determinate/indeterminate (attributes,
retained); indicator `style="width:48%"` (inline, survives — `w-0` overridden);
native `value="75"` (attribute); the custom indicator bg #0f766e (descendant
translation); the consumer `w-[60%]` class + inline `style="width:60%"` on the
wrapper (passed through via class/style props); track count (structure). It
confirmed the width-based-indicator adaptation is sound and keeps the width
assertion, the indeterminate extension retention is safe (no animation
assertion), `bg-primary/20`/`bg-primary` resolve via the contract, and there is
NO cross-component `.radcn-progress*` dependency.

- Major resolved: the custom-progress WRAPPER background IS asserted
  (`native-state.spec.ts:316` = #ccfbf1), not "untested" as I had written. The
  design now states both wrapper (316) and indicator (317) backgrounds are
  asserted and both translations are required; the wrapper rule wins via
  unlayered `radcnStyles` ordering. The consumer `w-[60%]`/style passthrough is
  also now documented as surviving.
- Minor: verification step 1 will confirm `rounded-[inherit]` generates; if it
  somehow does not, the indicator falls back to `rounded-full` (harmless — the
  indicator is clipped by the wrapper's `overflow-hidden`).

Approval result: APPROVED (with the documentation fix applied). The
architecture-aware adaptation is correct and all assertions are accounted for.
