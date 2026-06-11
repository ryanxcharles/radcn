# Experiment 22: Migrate Spinner to Tailwind utilities

## Description

Migrate Spinner off bespoke `radcn-spinner*` CSS. Spinner is a RadCN-original
rotating SVG (a faint track circle + a head arc); shadcn has no Spinner
component (it uses a `Loader2` icon with `animate-spin`, sized/colored by
`size-*`/`text-*` utilities). So the faithful migration (a) expresses the
spinner's own styling in Tailwind utilities and (b) moves its size/color API
from the `--radcn-spinner-*` custom-property tokens to direct
`width`/`height`/`color` (per the custom-token-drop decision — shadcn sizes/
colors a spinner with utilities/inline styles, not component tokens).

### Component mapping (bespoke → utilities)

- `.radcn-spinner` (`width/height: var(--radcn-spinner-size, 1rem); animation:
  radcn-spin 1s linear infinite; color: var(--radcn-spinner-color, foreground)`)
  → `size-4 animate-spin text-foreground`. Tailwind's built-in `animate-spin`
  is `animation: spin 1s linear infinite` with `@keyframes spin { to {
  transform: rotate(360deg) } }` — identical to the bespoke `radcn-spin`.
- `.radcn-spinner-track` (`opacity: 0.2`) → `opacity-20`.
- `.radcn-spinner-head` (`opacity: 0.85`) → `opacity-[0.85]` (arbitrary).

### Call-site conversions (the size/color API moves off tokens)

The size/color variants are driven by inline `--radcn-spinner-*` custom
properties on each `<Spinner>` (19 occurrences across
`fixtures/.../static-display.tsx` and `apps/docs/app/content/components.tsx`),
and ASSERTED (4 widths 12/16/24/32px; 5 colors). Each is converted to the
direct inline equivalent:

- `style="--radcn-spinner-size:X"` → `style="width:X;height:X"`
- `style="--radcn-spinner-size:X;--radcn-spinner-color:Y"` →
  `style="width:X;height:X;color:Y"`

(`0.75rem→12px`, `1rem→16px`, `1.5rem→24px`, `2rem→32px`; `#dc2626→rgb(220,38,38)`,
etc.) The asserted widths/colors then come from the inline styles and survive.

### Raw custom-SVG keyframe references

Two fixtures/docs render a RAW `<svg>` (not the Spinner component) with inline
`style="…animation:radcn-spin 1s linear infinite…"` (`static-display.tsx:719`,
`components.tsx:6077`). These are repointed to Tailwind's keyframe:
`animation:spin 1s linear infinite` (the `spin` keyframe is present in the
generated CSS because the Spinner component uses `animate-spin`). This lets the
bespoke `@keyframes radcn-spin` be removed without breaking the raw SVGs.

### Docs prose + custom-token fixture

- Two docs description strings (`components.tsx:10435,10442`) mention
  `--radcn-spinner-size`/`--radcn-spinner-color`; update them to describe the
  `class`/`style` (`size-*`/`text-*`, `width`/`color`) approach.
- `.radcn-fixture-custom-spinner` (sets `--radcn-spinner-color: #0f766e;
  --radcn-spinner-size: 2rem`) is translated to direct
  `color: #0f766e; width: 2rem; height: 2rem;` (not asserted; preserved).

## Why both suites stay green

- `static-display.spec.ts:342` (basic): role=status, name=Loading,
  `data-radcn-spinner` attribute — retained.
- `static-display.spec.ts` size scenario: 4 spinners widths 12/16/24/32px — now
  from the converted inline `width:X;height:X` — survive.
- color scenario: 5 spinners colors — now from the converted inline `color:Y` —
  survive.
- button/badge/input-group/empty/demo/item scenarios: assert spinner COUNT
  inside those components + the host component attributes — unaffected
  (structure/attributes retained).
- custom scenario: `data-radcn-custom-spinner` attribute — that raw SVG keeps
  its inline size/color; only its `animation:radcn-spin` → `animation:spin`.
- No computed-style assertion targets the spinner's animation, track/head
  opacity, or the custom-spinner color/size.
- The same spinner scenarios in the docs coverage suite mirror these and are
  satisfied identically.

## Changes

- `radcn/packages/radcn/src/components/spinner.tsx`: `radcn-spinner` →
  `size-4 animate-spin text-foreground`; track `radcn-spinner-track` →
  `opacity-20`; head `radcn-spinner-head` → `opacity-[0.85]`. Keep
  `data-radcn-spinner`, `role="status"`, `aria-label`, `fill`, `viewBox`, and
  the SVG children.
- `radcn/fixtures/candidate-remix/app/fixtures/static-display.tsx` and
  `radcn/apps/docs/app/content/components.tsx`: convert every inline
  `--radcn-spinner-size`/`--radcn-spinner-color` to direct
  `width`/`height`/`color`; repoint the raw-SVG `animation:radcn-spin` →
  `animation:spin`; update the two docs prose strings.
- `radcn/packages/radcn/src/styles/tokens.css`: remove `.radcn-spinner`,
  `.radcn-spinner-track`, `.radcn-spinner-head`, `@keyframes radcn-spin`
  (migration comment, no literal selectors); translate
  `.radcn-fixture-custom-spinner` to direct `color`/`width`/`height`.
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the standard
  formula.

Expected git status: `spinner.tsx`, `static-display.tsx`, `components.tsx`,
`tokens.css`, `index.ts`, this experiment file, README index + Learnings. Both
generated CSS untracked.

## Verification

1. Both `styles:build` exit 0; generated CSS contains `animate-spin` (+ the
   `spin` keyframe), `.size-4`, `.opacity-20`, `.opacity-\[0\.85\]`,
   `.text-foreground`.
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css`; no `.radcn-spinner` rule and no
   `@keyframes radcn-spin` remain; no `--radcn-spinner-` token usage remains in
   fixtures/docs (grep empty); `.radcn-fixture-custom-spinner` sets
   `color`/`width`/`height` directly.
4. Docs suite green (11), run twice.
5. Fixture suite green (1191), run twice — incl. the full
   `static-display.spec.ts` spinner test (basic attribute; the 4 size widths;
   the 5 colors; the button/badge/input-group/empty/demo/item counts; the
   custom raw SVG).
6. `git diff --check` clean; `vendor/` untouched; only the expected files
   changed.

Pass criteria: Spinner renders from Tailwind utilities; size/color variants come
from converted inline styles (asserted widths/colors hold); the spin animation
runs via `animate-spin`/`spin`; `data-radcn-spinner`/role/name intact; no
`--radcn-spinner-*` token remains; BOTH suites green and stable;
`tokens.css`/`index.ts` byte-identical.

Fail criteria: any spinner size/color/attribute assertion regresses; a raw SVG
stops animating (keyframe mishandled); a utility not generated;
`tokens.css`/`index.ts` diverge.

## Design Review

Round 1 (fresh Claude subagent, Explore): REJECTED — correctly. The initial
design under-scoped the experiment: it claimed "no computed-style assertion on
the spinner" and treated the migration as component-only. The reviewer found
(a) the spinner size/color are a `--radcn-spinner-*` token API used inline
across ~19 call sites and ASSERTED (4 widths, 5 colors), and (b) two raw
`<svg>`s reference the `radcn-spin` keyframe inline, which a naïve keyframe
removal would break silently. Both are real blockers.

This design has been rewritten to the correct full scope: convert all inline
`--radcn-spinner-*` usages to direct `width`/`height`/`color`, repoint the raw
SVGs to Tailwind's `spin` keyframe, update the two docs prose strings, and only
then remove the bespoke rules + keyframe. Re-review below.

Round 2 (re-review of the rewritten design, fresh Claude subagent): APPROVED.
The reviewer independently confirmed the full scope — 19 inline
`--radcn-spinner-*` occurrences (9 in static-display.tsx, 10 in components.tsx)
with correct width/color value mappings (0.75/1/1.5/2rem → 12/16/24/32px; the 5
colors), exactly 2 raw-SVG `animation:radcn-spin` references, 2 docs prose
strings, no `--radcn-spinner-*`/`radcn-spin` usage outside those files, and that
`animate-spin`'s `spin` keyframe is identical to `radcn-spin`. The only caveat
(verify the `spin` keyframe is present in the generated CSS so the repointed raw
SVGs keep animating) is already covered by verification step 1. No blocker.

Approval result: approved (round 2). The under-scoped round-1 design was
correctly rejected; the rewritten full-scope design is correct and complete.
