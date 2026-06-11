# Experiment 58: Migrate Calendar to Tailwind utilities

## Description

Calendar (root + nav + prev/next + months/month/caption + grid + weekday + day +
day-button + day-states) is standalone (no Button/family coupling). Its
day-STATE styling is a set of parent(`.radcn-calendar-day[data-*]`)→child
(`.radcn-calendar-day-button`) cascades — migrate via the proven Exp-47/50 CSS-var
PROPAGATION: the day SETS `--radcn-cal-day-bg`/`-fg`/`-shadow` via `data-[…]:[--…]`,
the day-button READS them.

### Day-state propagation

- day-button base reads: `bg-[var(--radcn-cal-day-bg,transparent)]
  text-[var(--radcn-cal-day-fg,inherit)] shadow-[var(--radcn-cal-day-shadow,none)]`.
- day sets (on its own data-states, inherited by the button):
  - `data-[selected=true]` / `data-[range-start=true]` / `data-[range-end=true]`:
    `[--radcn-cal-day-bg:var(--radcn-calendar-selected-bg,var(--radcn-primary))]`
    `[--radcn-cal-day-fg:var(--radcn-calendar-selected-fg,var(--radcn-primary-foreground))]`.
  - `data-[today=true]`: `[--radcn-cal-day-shadow:inset_0_0_0_1px_var(--radcn-ring)]`.
  - `data-[outside=true]`: `[--radcn-cal-day-fg:var(--radcn-muted-foreground)]`.
- range-middle is on the DAY itself (own state, not a child cascade):
  `data-[range-middle=true]:bg-[var(--radcn-calendar-range-bg,var(--radcn-secondary))]`.

### Exact utility mapping

- root (`.radcn-calendar`): `inline-grid gap-3 border
  border-[var(--radcn-calendar-border,var(--radcn-border))] rounded-md
  bg-[var(--radcn-calendar-bg,var(--radcn-background))]
  text-[var(--radcn-calendar-fg,var(--radcn-foreground))] p-3 [font-family:var(--radcn-font)]`.
- nav: `flex justify-between gap-2`.
- prev/next (`.radcn-calendar-previous, .radcn-calendar-next`): `inline-flex w-8 h-8
  items-center justify-center border
  border-[var(--radcn-calendar-border,var(--radcn-border))]
  rounded-[calc(var(--radcn-radius)-0.125rem)] bg-transparent text-inherit
  cursor-pointer`.
- months: `flex flex-wrap gap-4`.
- month: `grid gap-2`.
- caption: `text-center text-[0.875rem] font-semibold leading-[1.2]
  [font-family:var(--radcn-font)]`.
- grid: `border-separate [border-spacing:0.125rem]`.
- weekday / week-number-header / week-number: `w-[var(--radcn-calendar-cell-size,2.25rem)]
  h-6 text-muted-foreground text-center text-[0.75rem] font-medium leading-none
  [font-family:var(--radcn-font)]`.
- day: `w-[var(--radcn-calendar-cell-size,2.25rem)]
  h-[var(--radcn-calendar-cell-size,2.25rem)] p-0 text-center` + the day-state
  var-sets + `data-[range-middle=true]:bg-[var(--radcn-calendar-range-bg,var(--radcn-secondary))]`.
- day-button: `w-full h-full border-0 rounded-[calc(var(--radcn-radius)-0.125rem)]
  bg-[var(--radcn-cal-day-bg,transparent)] text-[var(--radcn-cal-day-fg,inherit)]
  shadow-[var(--radcn-cal-day-shadow,none)] cursor-pointer text-[0.875rem]
  font-normal leading-none [font-family:var(--radcn-font)]
  disabled:cursor-not-allowed disabled:opacity-40 data-[focused=true]:outline-2
  data-[focused=true]:outline-[var(--radcn-ring)]
  data-[focused=true]:[outline-offset:2px] focus-visible:outline-2
  focus-visible:outline-[var(--radcn-ring)] focus-visible:[outline-offset:2px]`.

The interleaved `.radcn-date-picker-trigger` + `.radcn-date-picker-content` rules
(kept bespoke by Exp 57) are PRESERVED (they sit between the calendar root and nav
rules). The `.radcn-fixture-custom-calendar` fixture is unchanged.

## Why both suites stay green

- `calendar-date-picker.spec.ts:91/92` assert the root `radcn-fixture-custom-calendar`
  class + `border-color rgb(15,118,110)` — the migrated root reads
  `border-[var(--radcn-calendar-border,…)]` from the fixture token. Held.
- The day states (selected/range/today/outside) propagate via the day's var-sets →
  the button's inherited reads (the Toast/Exp-50 pattern; the day-state computed
  styles are not separately asserted but reproduced faithfully).
- prev/next, nav, grid, weekday surfaces are structural; `bg`/`border`/etc. resolve
  via the contract + the fixture tokens.

## Changes

- `radcn/packages/radcn/src/components/calendar.tsx`: emit utility-const strings for
  all calendar surfaces; the day SETS the day-state vars, the day-button READS them;
  keep all data attributes. ASCII/token-free comments.
- `radcn/packages/radcn/src/styles/tokens.css`: remove the `.radcn-calendar*` rules
  (root + nav + prev/next + months/month/caption/grid/weekday/day/day-button +
  day-states); PRESERVE the interleaved `.radcn-date-picker-trigger`/`-content` +
  the `.radcn-fixture-custom-calendar` fixture.
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the node formula.

## Verification

1. Both `styles:build` exit 0; the day-state var-sets + `[border-spacing:0.125rem]`,
   `shadow-[var(…)]`, `[outline-offset:2px]` utilities compile; no junk ellipsis.
2. All three typechecks pass.
3. `index.ts` byte-identical; no `.radcn-calendar*` rule remains; the date-picker
   trigger/content + the fixture retained.
4. Docs suite green (11) ×2.
5. Fixture suite green (1191) ×2 — incl. `calendar-date-picker.spec.ts` (the custom
   calendar class + border `rgb(15,118,110)`, day selection/range/today/outside, nav
   prev/next, weekday headers, keyboard nav) AND the DatePicker (which renders the
   Calendar).
6. `git diff --check` clean; `vendor/` untouched; only the expected files changed.

Pass criteria: Calendar renders from Tailwind utilities; the custom border + day
states (via propagation) + structure hold; BOTH suites green; byte-identical.

Fail criteria: a calendar assertion regresses; a day-state propagation fails; the
date-picker trigger/content rules get dropped; `tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool). Fresh
context: yes.

Findings: APPROVED, no Blocker/Major (documentation-clarity notes only). The reviewer
verified all five cruxes: (1) the day-state propagation is correct — the DAY sets
`--radcn-cal-day-bg/-fg/-shadow` on its `data-[selected/range-start/range-end/today/
outside]` variants, the day-button READS them (bg/text/shadow each once, no
conflict), and range-middle is the day's own bg utility; CSS custom properties
inherit child-ward so the pattern works; (2) every utility maps exactly
(`w-8`=2rem, `gap-3`=0.75rem, the caption/grid/weekday values, the outline/offset);
(3) the style-less classes (caption-dropdowns/month-select/year-select/weekdays/week)
have no CSS rule and stay as structural hooks; (4) the interleaved
`.radcn-date-picker-trigger`/`-content` rules are preserved; (5) `:91/:92` hold (the
migrated root reads `--radcn-calendar-border`); no spec locates by a dropped class.
Implementation note (from the review): emit utility consts (the Exp-57 pattern),
wire BOTH the internal grid renderer (raw class sites) AND the exported component
wrappers, and the day td + day-button must carry the var-sets/var-reads.

Approval result: approved — the day-state propagation + the surface mappings are
sound; the date-picker rules + style-less hooks are preserved.
