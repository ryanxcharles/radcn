# Experiment 26: Migrate HoverCard content surface to Tailwind utilities

## Description

The third overlay migration, the natural pair to Popover (Experiment 25, which
split the shared `.radcn-popover-content, .radcn-hover-card-content` surface and
left HoverCard a standalone bespoke copy). This migrates HoverCard's content
SURFACE to shadcn v4 utilities, applying the established overlay pattern.

Scope mirrors Popover: only `HoverCardContent` (the surface) migrates. The
HoverCard avatar/body are package COMPOSITION-helper classes
(`.radcn-hover-card-avatar`, `.radcn-hover-card-body`) used by the demo, not
emitted by `HoverCardContent`; they are NOT asserted (only the content
border/bg are) and are left as-is (like the popover sub-parts / breadcrumb
extensions — a follow-up). The Button-coupled trigger
(`radcn-button--link`) is untouched.

shadcn v4 `hover-card.tsx` HoverCardContent → utilities (ENTER-only; the JS
hides via `hidden`, exit utilities omitted; `w-64` default omitted like
Popover — the width stays in the data-keyed rule):

- HoverCardContent surface: `z-50 rounded-md border bg-popover p-4
  text-popover-foreground shadow-md outline-hidden animate-in fade-in-0
  zoom-in-95 data-[side=bottom]:slide-in-from-top-2
  data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
  data-[side=top]:slide-in-from-bottom-2`.

Kept as RadCN layout + positioning bespoke (data-attribute-keyed; the two
existing `.radcn-hover-card-content` rules — the standalone surface body and the
`grid-template-columns`/width override — merge into one):

- `[data-radcn-hover-card-content] { display: grid; grid-template-columns: auto
  1fr; gap: 0.875rem; width: min(20rem, var(--radcn-overlay-available-width,
  calc(100vw - 1rem))); transform-origin: var(--radcn-overlay-transform-origin,
  center top); }` — the two-column profile layout + default/collision width +
  the JS transform origin. (`--radcn-hover-card-width` token dropped → `20rem`.)

Reduced-motion hygiene: remove the now-migrated `.radcn-hover-card-content` from
the `@media (prefers-reduced-motion)` combined rule (leaving the un-migrated
dialog/alert-dialog/sheet).

Custom-token fixture: `.radcn-fixture-custom-hover-card` sets `--radcn-overlay-border:
#0f766e; --radcn-overlay-bg: #f0fdfa; --radcn-overlay-fg: #134e4a` (surface) plus
`--radcn-hover-card-avatar-bg/fg` (avatar). `positioned-overlays.spec.ts:277-278`
asserts the content `border-color: rgb(15, 118, 110)` (#0f766e) and
`background-color: rgb(240, 253, 250)` (#f0fdfa). Translate the surface tokens to
direct rules (the migrated content uses `border`/`bg-popover`, which the
unlayered direct rules override); KEEP the `--radcn-hover-card-avatar-*` tokens
(the un-migrated avatar helper class still reads them; avatar not asserted):
`.radcn-fixture-custom-hover-card { border-color: #0f766e; background-color:
#f0fdfa; color: #134e4a; --radcn-hover-card-avatar-bg: #0f766e;
--radcn-hover-card-avatar-fg: #ffffff; }`.

## Why both suites stay green

- The custom hover-card content `border-color` (#0f766e) and `background-color`
  (#f0fdfa) are satisfied by the translated direct rules (unlayered, after the
  Tailwind link, beating `border`/`bg-popover`).
- Visibility (`toBeVisible`/`toBeHidden`), `data-side`, the trigger text/class,
  and the profile composition (avatar/body helper classes, retained) are
  unaffected.
- The enter animation runs via `animate-in` on `hidden` removal (Exp 24
  mechanism); no exit/animation assertion exists for hover-card.
- `bg-popover`/`text-popover-foreground` resolve via the contract; animation
  utilities via Exp 23.

## Changes

- `radcn/packages/radcn/src/components/hover-card.tsx`: define a
  `hoverCardContentClass` constant with the shadcn surface utility string and
  emit `classes(hoverCardContentClass, className)` (removing
  `'radcn-hover-card-content'`), exactly mirroring Popover's `popoverContentClass`
  pattern (Exp 25). Keep ALL `data-radcn-hover-card*`, `data-side`/`data-align`/
  `data-side-offset`, `data-state`, `hidden`. (Trigger/avatar/body unchanged.)
  (Cascade note: the document shell links the Tailwind stylesheet BEFORE the
  inline `radcnStyles` `<style>` — Exp 4 — so the unlayered direct
  custom-hover-card rules win over `border`/`bg-popover`; the
  `.radcn-tooltip-content` `@media` strand was already cleaned in Exp 25.)
- `radcn/packages/radcn/src/styles/tokens.css`:
  - replace the standalone `.radcn-hover-card-content` surface rule AND the
    separate `.radcn-hover-card-content { grid-template-columns; width }`
    override with the single `[data-radcn-hover-card-content]` layout/positioning
    rule above;
  - remove `.radcn-hover-card-content` from the `@media (prefers-reduced-motion)`
    combined rule;
  - translate `.radcn-fixture-custom-hover-card` surface tokens to direct rules
    (keeping the avatar tokens).
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the standard
  formula.

Expected git status: `hover-card.tsx`, `tokens.css`, `index.ts`, this experiment
file, README index + Learnings. Both generated CSS untracked.

## Verification

1. Both `styles:build` exit 0; generated CSS contains the hover-card utilities
   (`bg-popover`, `text-popover-foreground`, `shadow-md`, the `data-[side]:slide`
   + `animate-in`).
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css`; no `.radcn-hover-card-content`
   CLASS rule remains; the `[data-radcn-hover-card-content]` layout rule present
   (with `grid-template-columns: auto 1fr`); the `@media` reduced-motion rule no
   longer lists hover-card; `.radcn-fixture-custom-hover-card` sets
   `border-color`/`background-color` directly + keeps the avatar tokens.
4. Docs suite green (11), run twice.
5. Fixture suite green (1191), run twice — incl. `positioned-overlays.spec.ts`
   hover-card tests (visibility, `data-side`, trigger, demo profile, AND the
   custom-token content border `rgb(15,118,110)` + bg `rgb(240,253,250)`).
6. `git diff --check` clean; `vendor/` untouched; only the expected files
   changed.

Pass criteria: HoverCard content renders from Tailwind utilities (no
`radcn-hover-card-content` class); the custom-token border/bg hold via the direct
rules; the profile layout (grid-template-columns) + avatar/body composition
intact; BOTH suites green and stable; `tokens.css`/`index.ts` byte-identical.

Fail criteria: a hover-card assertion regresses; the custom border/bg fail; the
profile two-column layout breaks; `tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to referenced sources)

Findings: the reviewer's SUBSTANTIVE verification is entirely positive (an
approval on the merits) — by reading the FULL hover-card test block it confirmed
every assertion survives: the custom content `border-color: rgb(15, 118, 110)`
+ `background-color: rgb(240, 253, 250)` (277-278) via the translated direct
rules; NO avatar/body computed assertion (so leaving those helper classes is
safe); the profile two-column layout covered by the data-keyed
`grid-template-columns: auto 1fr`; visibility/`data-side`/trigger/text all from
preserved attributes/JS. It confirmed the two `.radcn-hover-card-content` rules
merge into the one data-keyed layout rule with nothing stranded, the avatar/body
helper classes (reading `--radcn-hover-card-avatar-*`, which the custom rule
keeps) are untouched, and the contract tokens resolve.

The reviewer returned "REJECTED" only on a one-line clarity ask (state that
HoverCardContent uses a `hoverCardContentClass` constant like Popover's pattern)
plus two already-established facts it asked to make explicit (the document
links Tailwind before `radcnStyles` so direct rules win — Exp 4; the
`.radcn-tooltip-content` `@media` strand was cleaned in Exp 25). All three are
now stated in Changes.

Lead-agent judgment: the substantive verification is an APPROVAL; the
"blocker" was a documentation-explicitness ask (the design mirrors the
already-passed Popover exactly), now addressed.

Approval result: approved — design sound, mirrors the proven Popover pattern,
all assertions verified to survive; the clarifications are folded in.
