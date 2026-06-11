# Experiment 29: Migrate Sheet overlay + content surface to Tailwind utilities

## Description

The third MODAL overlay — a side-anchored panel (the modal pattern of Exp 27-28
+ a 4-side variant). Sheet already owns its standalone overlay rule (split out
in Exp 28). JS-driven (`setupModal`); enter-only (`hidden` hide).

Scope: the OVERLAY backdrop + the content SURFACE. The content's side
positioning + sizing (the 4 `side` variants) and the slide animation stay
bespoke (data-side-keyed) — that side-anchoring is RadCN's panel system. The
header/footer/title/description/close sub-parts + Button-coupled trigger are
untouched.

Mappings:

- SheetOverlay: `fixed inset-0 z-50 bg-black/50 animate-in fade-in-0`.
- SheetContent SURFACE (no position/size/animation — those stay bespoke):
  `fixed z-50 flex flex-col gap-4 border bg-background p-6 shadow-lg
  outline-none`.

Kept as RadCN side-anchoring + animation bespoke (data-attribute-keyed; the
content drops the `radcn-sheet-content`/`radcn-sheet-content--${side}` classes,
keeps `data-side`):

- `[data-radcn-sheet-content] { animation: radcn-sheet-slide-in 140ms ease-out; }`
- the 4 side variants, repointed from `.radcn-sheet-content--{side}` →
  `[data-radcn-sheet-content][data-side="{side}"]`:
  - right/left: `top: 0; bottom: 0; width: min(100vw, var(--radcn-sheet-width,
    24rem));` + `right: 0` / `left: 0`;
  - top/bottom: `right: 0; left: 0; min-height: var(--radcn-sheet-height,
    14rem);` + `top: 0` / `bottom: 0`.

The `@keyframes radcn-sheet-slide-in` is KEPT (sheet-only; the content's bespoke
rule still uses it). For the `@media (prefers-reduced-motion)` rule at ~2618
(`.radcn-sheet-overlay, .radcn-sheet-content { animation: none }`): the OVERLAY
now uses the `animate-in` utility (no guard — shadcn-faithful, matching the
other migrated overlays), so its entry is removed; the CONTENT keeps its bespoke
`radcn-sheet-slide-in` animation, so its reduced-motion guard is KEPT, repointed
from `.radcn-sheet-content` → `[data-radcn-sheet-content]`. (The Drawer
reduced-motion block at ~3151 is separate and untouched.)

Custom-token fixture: `.radcn-fixture-custom-sheet` (on the portal — shared
ancestor) sets `--radcn-modal-overlay-bg`, `--radcn-sheet-border`,
`--radcn-sheet-bg`, `--radcn-modal-action-bg`. `modal-variants.spec.ts:251,254`
asserts the content class presence AND the overlay `background-color:
rgba(15, 118, 110, 0.25)`. Translate to DESCENDANT direct rules (keeping the
action token):

- `.radcn-fixture-custom-sheet [data-radcn-sheet-overlay] { background-color:
  rgb(15 118 110 / 0.25); }` (the asserted overlay bg);
- `.radcn-fixture-custom-sheet [data-radcn-sheet-content] { border-color:
  #0f766e; background-color: #f0fdfa; }` (content border/bg — not asserted, but
  preserved for faithfulness; overrides the migrated `border`/`bg-background`);
- keep `--radcn-modal-action-bg: #0f766e;` (the un-migrated action reads it).

## Why both suites stay green

- The custom overlay `background-color` (rgba(15,118,110,0.25)) holds via the
  descendant rule; the content class presence (`toHaveClass`) is retained on the
  content.
- Visibility (`hidden`), `data-side`/`data-state`, the side anchoring + sizing
  (data-side-keyed rules), the slide animation (kept keyframe), and the demo
  composition (sub-parts retained) are intact.
- The enter (slide) animation runs on `hidden` removal (Exp 24 mechanism).
- `bg-background`/`border` resolve via the contract + Exp 16 base; `bg-black/50`/
  `animate-in`/`fade-in-0` via core Tailwind + Exp 23.

## Changes

- `radcn/packages/radcn/src/components/sheet.tsx`: `SheetOverlay` emits the
  shadcn overlay utilities (no `radcn-sheet-overlay` class); `SheetContent`
  emits the shadcn content-surface utilities and drops BOTH the
  `radcn-sheet-content` and `radcn-sheet-content--${side}` classes; keep
  `data-side` and ALL other `data-radcn-sheet*`/`data-state`/`hidden`.
  (Trigger/close/header/footer/title/description unchanged.)
- `radcn/packages/radcn/src/styles/tokens.css`:
  - migrate `.radcn-sheet-overlay` (now `→` utilities; remove the rule);
  - replace the `.radcn-sheet-content` base rule with the
    `[data-radcn-sheet-content]` animation rule (surface now on the component);
    repoint the 4 side variants to `[data-radcn-sheet-content][data-side="X"]`;
  - in the Sheet `@media (prefers-reduced-motion)` block, remove
    `.radcn-sheet-overlay` and repoint `.radcn-sheet-content` →
    `[data-radcn-sheet-content]` (the content keeps its bespoke slide, so its
    guard stays);
  - KEEP `@keyframes radcn-sheet-slide-in`;
  - translate `.radcn-fixture-custom-sheet` to the descendant overlay + content
    rules (keeping the action token).
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the standard
  formula.

Expected git status: `sheet.tsx`, `tokens.css`, `index.ts`, this experiment
file, README index + Learnings. Both generated CSS untracked.

## Verification

1. Both `styles:build` exit 0; generated CSS contains the sheet utilities
   (`bg-background`, `bg-black/50`, `flex-col`, `shadow-lg`, `animate-in`).
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css`; no `.radcn-sheet-overlay`/
   `.radcn-sheet-content`/`--{side}` base CLASS rule remains; the
   `[data-radcn-sheet-content]` + `[data-side="X"]` rules present; the
   `radcn-sheet-slide-in` keyframe kept; the Sheet `@media` block keeps
   `[data-radcn-sheet-content]` (overlay removed); the Drawer `@media` block
   remains; `.radcn-fixture-custom-sheet` has the descendant overlay + content
   rules.
4. Docs suite green (11), run twice.
5. Fixture suite green (1191), run twice — incl. `modal-variants.spec.ts` sheet
   tests (open/close, the four sides, the demo, AND the custom-token overlay bg
   `rgba(15,118,110,0.25)`) AND the alert-dialog tests (unaffected) AND
   `dialog.spec.ts` (the shared keyframes are untouched here, but confirm).
6. `git diff --check` clean; `vendor/` untouched; only the expected files
   changed.

Pass criteria: Sheet overlay + content render from Tailwind utilities (no
`radcn-sheet-overlay`/`-content`/`--{side}` class); the side anchoring + sizing +
slide intact via data-keyed rules; the custom overlay bg holds; BOTH suites
green and stable; `tokens.css`/`index.ts` byte-identical.

Fail criteria: a sheet/alert-dialog/dialog assertion regresses; a side variant
mis-anchors; the custom overlay bg fails; the slide keyframe breaks;
`tokens.css`/`index.ts` diverge.

## Result

**Result:** Pass

Sheet's overlay + content surface are migrated; both suites are green and
stable. Verification:

1. Both `styles:build` exit 0; the sheet utilities generate (`bg-background`,
   `bg-black/50`, `flex-col`, `shadow-lg`, `animate-in`).
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css`; no `.radcn-sheet-overlay`/
   `.radcn-sheet-content`/`--{side}` base CLASS rule remains (count 0); the
   `[data-radcn-sheet-content]` animation + 4 side variant rules present; the
   `radcn-sheet-slide-in` keyframe kept; the Sheet `@media` block keeps
   `[data-radcn-sheet-content]` (overlay removed); `.radcn-fixture-custom-sheet`
   has the descendant overlay + content rules.
4. Docs suite: **11 passed** ×2.
5. Fixture suite: **1191 passed** ×2; `modal-variants.spec.ts` + `dialog.spec.ts`
   in isolation **14 passed** — incl. the sheet open/close, the four sides, the
   demo, the custom-token overlay `background-color: rgba(15, 118, 110, 0.25)`,
   the alert-dialog tests (unaffected), and the dialog tests (shared keyframes
   intact).
6. `git diff --check` clean; `vendor/` untouched; generated CSS untracked; the
   three expected files changed.

No deviations from the (corrected) approved design.

## Conclusion

Sheet is the third migrated modal (the side-anchored panel): its overlay +
content surface render from shadcn utilities, the 4 `side` variants + the
`radcn-sheet-slide-in` animation stay data-side-keyed bespoke (the panel's
side-anchoring system), the content's reduced-motion guard is kept (repointed,
since it retains the bespoke slide) while the overlay's is dropped (shadcn-
faithful `animate-in`), and the custom-token override (on the portal) became
descendant rules for the sibling overlay + content. Twenty-one components are
now migrated (… Dialog, AlertDialog, Sheet — plus sub-parts). Only Drawer
remains in the modal cluster (its own keyframe + reduced-motion block,
untouched).

Learnings (also copied to the issue README Learnings digest):

- A multi-SIDE overlay variant (Sheet's right/left/top/bottom) is preserved by
  keeping `data-side` and repointing each `--{side}` rule (position + size) to
  `[data-…-content][data-side="{side}"]` — the side anchoring survives while the
  surface migrates.
- When an overlay's CONTENT keeps a bespoke animation (Sheet's
  `radcn-sheet-slide-in`) but its OVERLAY moves to the `animate-in` utility,
  keep the content's `@media (prefers-reduced-motion)` guard (repointed to the
  data attribute) and drop only the overlay's — don't blanket-remove the block.

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to referenced sources)

Findings: the reviewer's SUBSTANTIVE verification was positive — it confirmed
the descendant custom-token translation (overlay bg `rgba(15,118,110,0.25)`
asserted at line 254 is satisfied; content class retained at 251), that the
side placement is bounding-box-asserted (not computed-CSS, so the data-side
bespoke rules cover it), the `radcn-sheet-slide-in` keyframe is sheet-only
(kept), custom-sheet is on the portal+content (descendant rules reach the
sibling overlay; `toHaveClass` passes), the action token is kept, and Dialog/
AlertDialog are unaffected. Most of its "blockers" were the recurring
design-vs-implementation misread (it even states the component is "NOT MIGRATED —
EXPECTED for DESIGN stage", then lists the still-old tokens.css as "BLOCKED";
the descendant translation it "requires" is exactly what the design specifies).

ONE genuine correction (surfaced via its reduced-motion "clarification"): because
the content KEEPS its bespoke `radcn-sheet-slide-in` animation, its
`@media (prefers-reduced-motion)` guard must be KEPT (repointed to
`[data-radcn-sheet-content]`), NOT removed — only the overlay (now the
`animate-in` utility, shadcn-faithfully unguarded) leaves the block. The design
was updated accordingly (the block is no longer "removed entirely"). The
z-index note resolves: the content uses `z-50` (consistent with Dialog/
AlertDialog; content after overlay in DOM → on top).

Lead-agent judgment: the substantive verification is an APPROVAL; the
design-vs-implementation "blockers" are overruled; the real reduced-motion-guard
correction is folded into the design.

Approval result: approved (with the reduced-motion-guard fix applied) — the
side-anchored modal migration is sound; the custom-token descendant translation,
the side data-keying, and the kept slide keyframe + guard are correct.

## Completion Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to the working tree).

Findings: none (no Blocker, Major, or Minor).

The reviewer confirmed sheet.tsx emits the shadcn overlay + content-surface
utilities (no `radcn-sheet-overlay`/`-content`/`--side` class), keeps `data-side`
+ the other data attributes, and leaves trigger/close/sub-parts unchanged;
tokens.css has ZERO sheet overlay/content/--side class rules, the
`[data-radcn-sheet-content]` animation + 4 `[data-side=X]` side rules, the kept
`radcn-sheet-slide-in` keyframe, the Sheet `@media` block keeping
`[data-radcn-sheet-content]` (overlay removed) with the Drawer block untouched,
and `.radcn-fixture-custom-sheet` with the kept action token + descendant
overlay/content rules; byte-identical `index.ts`. It re-ran both `styles:build`,
the three typechecks, the docs suite (2/2 = 11), the fixture suite (2/2 = 1191),
and `modal-variants.spec.ts` + `dialog.spec.ts` (14 — the sheet 4 sides/demo/
custom overlay `rgba(15,118,110,0.25)`, alert-dialog, AND dialog all pass). It
judged the side-anchored migration faithful, the side variants intact via
`data-side`, the custom overlay bg from the descendant rule, the content
reduced-motion guard correctly kept (content retains the bespoke slide), and
Drawer/AlertDialog/Dialog unaffected. Verdict: APPROVED.

Approval result: approved with no blockers — three modals done; only Drawer
remains in the modal cluster.
