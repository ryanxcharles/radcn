# Experiment 20: Stage 4 Calendar and Date Picker

## Description

Continue Stage 4 by porting `calendar` and giving `date-picker` an explicit
RadCN disposition around that calendar.

This is the right next experiment after the menu/navigation cluster because
calendar and date picker share a date-grid model that is distinct from menu,
navigation-menu, listbox, searchable-listbox, and carousel behavior:

- `calendar` is a date grid with month navigation, selected/today/outside/
  disabled state, keyboard movement, and optional range/multiple visual hooks;
- `date-picker` in the current shadcn inventory is a composed block/example
  that depends on calendar plus surrounding layout, not a standalone primitive
  in the same way as `calendar`;
- upstream `calendar` is a React `react-day-picker` wrapper and should not be
  copied directly into Remix 3;
- calendar/date-picker need deterministic date math, focus movement, ARIA
  grid semantics, pointer selection, form value policy, responsive artifacts,
  and customization hooks.

This experiment should not port `carousel`, `input-group`, `form`,
`input-otp`, `data-table`, `sidebar`, `chart`, `toast`, `sonner`, or
`resizable`. `carousel` should remain the final Stage 4 composite-widget
experiment. Stage 5 systems and blocks need their own disposition after Stage
4 closes.

RadCN should match shadcn/ui's visible behavior and author-facing
customization value while using Remix 3-compatible server markup plus
package-exported browser enhancements. Exact DOM equivalence with
`react-day-picker`, Radix, or shadcn is not required.

## Changes

Add RadCN source under:

- `packages/radcn/src/components/calendar.tsx`
- `packages/radcn/src/components/date-picker.tsx`

Add any shared date utility under `packages/radcn/src/utils/` if the calendar
and date picker need common deterministic date math. Prefer native `Date` plus
small local helpers over adding a React-specific date-grid dependency.

The calendar component family should include:

- `Calendar`
- `CalendarMonth`
- `CalendarCaption`
- `CalendarNav`
- `CalendarPrevious`
- `CalendarNext`
- `CalendarGrid`
- `CalendarWeekdays`
- `CalendarWeek`
- `CalendarDay`
- `CalendarDayButton`

The date-picker surface should include one of these outcomes, chosen and
documented during implementation:

- a small `DatePicker` component that composes RadCN `Popover`, `Button`, and
  `Calendar` with hidden form synchronization; or
- a documented recipe/block disposition if the upstream shape is too
  application-specific to belong in the core primitive package.

If `DatePicker` is implemented as a component, it should include:

- `DatePicker`
- `DatePickerTrigger`
- `DatePickerContent`
- `DatePickerValue`
- `DatePickerHiddenInput`

Add package exports in `packages/radcn/package.json` and public exports in
`packages/radcn/src/index.ts` for every supported component and enhancement.
If `date-picker` is recorded as a recipe/block rather than a core component,
document that disposition and do not add a misleading package subpath.

Load browser enhancements from:

- `fixtures/candidate-remix/app/assets/entry.ts`

The implementation should add dedicated helpers such as `enhanceCalendar()`
and, if a core date-picker component exists, `enhanceDatePicker()`.

Calendar props and state hooks should support:

- root `month`, `defaultMonth`, `selected`, `defaultSelected`, `mode`,
  `numberOfMonths`, `showOutsideDays`, `showWeekNumber`, `disabledDates`,
  `min`, `max`, `name`, `required`, `id`, `class`, and `style`;
- navigation `previousLabel`, `nextLabel`, `disabled`, `class`, and `style`;
- day `date`, `outside`, `today`, `selected`, `disabled`, `rangeStart`,
  `rangeMiddle`, `rangeEnd`, `class`, and `style`;
- stable `data-radcn-calendar-*` hooks for every public part;
- shared state hooks: `data-month`, `data-date`, `data-selected`,
  `data-today`, `data-outside`, `data-disabled`, `data-focused`,
  `data-range-start`, `data-range-middle`, and `data-range-end`.

Date-picker props and state hooks, if implemented as a core component, should
support:

- root `name`, `defaultValue`, `value` as initial value only, `placeholder`,
  `disabled`, `required`, `id`, `class`, and `style`;
- trigger/content/value/hidden-input slots with stable
  `data-radcn-date-picker-*` hooks;
- popover composition through the existing RadCN popover foundation;
- hidden input synchronization for form submit/reset;
- shared state hooks: `data-value`, `data-placeholder`, `data-open`,
  `data-disabled`, and `data-invalid` where applicable.

Accessibility and keyboard policy for calendar:

- calendar root exposes an accessible label or labelled caption;
- date cells use a grid/table semantics strategy that is documented and
  testable;
- day buttons expose accessible names with full dates;
- selected dates expose `aria-selected` or an explicitly documented equivalent;
- disabled dates use native disabled buttons or `aria-disabled` with
  non-activation;
- previous/next month buttons update visible month and disabled state;
- ArrowLeft/ArrowRight/ArrowUp/ArrowDown move focused day by day/week;
- Home/End move to start/end of week;
- PageUp/PageDown move to previous/next month;
- Enter/Space select the focused date;
- Escape behavior is documented for standalone calendar and for date-picker
  popover composition;
- focus stays inside the calendar grid only when the component is embedded in
  a modal/popover that owns focus trapping.

Selection and form policy:

- single-date selection must be implemented and tested;
- range and multiple selection may be implemented only if the state model is
  clear; otherwise render static visual hooks and document deferral;
- hidden form value serialization for calendar/date-picker must use an
  explicit stable format, preferably `YYYY-MM-DD`;
- reset restores the initial/default selected date;
- required validation for custom calendar/date-picker is an approved
  divergence unless a native validation strategy is explicitly implemented.

Overlay and composition policy:

- standalone calendar renders inline and does not portal;
- date-picker, if implemented as a component, should compose the existing
  RadCN popover portal, positioning, Escape, outside dismissal, and focus
  restoration behavior;
- date-picker should not create a second overlay system;
- date-picker should document whether it is core component or recipe/block.

Extend RadCN styles and tokens for:

- calendar root, months, month, caption, nav, previous/next buttons, grid,
  weekday, week, week number, day cell, day button, selected, today, outside,
  disabled, focused, range start/middle/end, and custom token hooks;
- date-picker trigger, value, content, hidden input, placeholder, open/closed,
  disabled, invalid, and custom token hooks if implemented;
- reduced-motion-compatible month/popup transitions;
- responsive one-month and two-month layouts.

Add candidate fixtures that import components from `radcn`, not fixture-local
placeholders.

Add React Router reference fixtures with shadcn/ui-inspired local markup for
the same scenarios. The reference may use local React state and local date math
instead of `react-day-picker` if it preserves the visible, semantic, keyboard,
pointer, focus, form, and customization behavior needed for comparison
artifacts.

Shared calendar scenarios should include:

- `calendar/default`
- `calendar/selected`
- `calendar/outside-days`
- `calendar/disabled`
- `calendar/month-navigation`
- `calendar/range`
- `calendar/two-months`
- `calendar/custom-token`

Shared date-picker scenarios should include either core component scenarios or
documented recipe/block disposition scenarios:

- `date-picker/default`
- `date-picker/selected`
- `date-picker/form-submit-reset`
- `date-picker/popover`
- `date-picker/disabled`
- `date-picker/custom-token`

Add component-specific Playwright checks proving:

- the candidate app renders real RadCN calendar source;
- package subpath and root exports exist for supported public parts and
  enhancements;
- the candidate app loads calendar/date-picker enhancements when implemented;
- calendar root, caption, nav, grid/table, weekday, week, day, and day button
  semantics are present;
- selected, today, outside, disabled, focused, and range state hooks render;
- previous/next month navigation updates visible month;
- keyboard movement covers arrows, Home/End, PageUp/PageDown, Enter/Space,
  disabled skip, and deterministic focus;
- pointer selection updates selected hooks and hidden form value where
  applicable;
- date-picker popover composition uses existing RadCN popover behavior if a
  core date-picker exists;
- form submit/reset and stable date serialization work where applicable;
- custom token hooks affect rendered styles;
- artifact screenshots capture paired reference/candidate output for every
  calendar and date-picker scenario;
- no files under `vendor/` are modified.

Document the calendar/date-picker strategy in `docs/radcn-source.md`. The docs
must answer:

- how calendar differs from listbox/menu/navigation widgets;
- why `react-day-picker` is not copied directly;
- what date math and serialization format RadCN uses;
- how grid semantics, roving focus, month navigation, disabled dates,
  selected/today/outside state, range hooks, and customization work;
- whether date-picker is a core component or recipe/block, and why;
- how date-picker composes popover if implemented;
- what divergences from `react-day-picker`, Radix, and shadcn are approved;
- what later `carousel` should reuse or avoid.

Add issue-level learnings for date-grid semantics, date serialization, range
or multi-selection disposition, date-picker core-vs-recipe disposition,
popover composition, and any implications for closing Stage 4.

## Verification

The experiment passes if:

1. RadCN source exists for `calendar`.
2. Calendar exports all supported public parts and `enhanceCalendar()` if a
   browser enhancement is required.
3. Date-picker has a final disposition: core component with source/exports, or
   documented recipe/block outcome with rationale and fixtures.
4. `packages/radcn` exports calendar and any supported date-picker component
   from package subpaths and the root index.
5. The Remix 3 candidate app loads any required calendar/date-picker browser
   enhancements.
6. Shared scenarios include every required calendar scenario and every required
   supported date-picker scenario/disposition route.
7. Reference and candidate fixture routes exist for every shared scenario.
8. Component-specific Playwright checks cover semantics, month navigation,
   roving focus, keyboard selection, pointer selection, selected/today/outside/
   disabled/range hooks, date serialization, form submit/reset where
   applicable, popover composition where applicable, customization hooks, and
   non-vendor cleanliness.
9. `pnpm radcn:typecheck` passes.
10. `pnpm fixtures:candidate:typecheck` passes.
11. `pnpm fixtures:reference:typecheck` passes.
12. Focused calendar/date-picker Playwright tests pass.
13. `pnpm fixtures:artifacts` passes and captures paired artifacts for every
    calendar and supported date-picker scenario.
14. Documentation explains calendar/date-picker boundaries, date math,
    serialization, grid and focus policy, date-picker disposition, approved
    divergences, and implications for later Stage 4 work.
15. Any reusable discovery needed by later components is added to the issue
    `## Learnings` section with evidence.
16. No files under `vendor/` are modified.
17. Independent completion review approves the result or findings are fixed and
    recorded.

This experiment should not complete Stage 4 unless it also proves that only
`carousel` remains and records the next Stage 4 closure path. It should leave
carousel for a separate focused experiment.

## Design Review

Independent AI design review was performed by subagent `Dalton`, which approved
the design with **Pass** and no blocking findings.

The review checked that the plan is appropriately scoped after Experiment 19,
groups `calendar` and `date-picker` around the shared date-grid/date-selection
problem, excludes `carousel` and Stage 5 work, treats `react-day-picker` and
the shadcn date-picker block as reference material rather than directly
portable React code, and defines concrete implementation, fixture, scenario,
test, documentation, learning, vendor-cleanliness, and completion-review
gates.

Dalton noted one non-blocking implementation caution: if date-picker is
ultimately recorded as a recipe/block disposition, do not add misleading core
source or package subpaths for it.
