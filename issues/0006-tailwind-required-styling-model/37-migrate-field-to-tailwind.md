# Experiment 37: Migrate Field surfaces to Tailwind utilities

## Description

Field is a form-layout primitive (no computed/class assertions — it's tested
structurally via data attributes). Migrate the surfaces (field root + the
`orientation` variants, field-set, field-group, field-content, field-label/
legend/title, field-separator, field-description, field-error) to
token-referencing Tailwind utilities. Two things stay bespoke:

1. the `[data-invalid]` parent-state → label color (it crosses to BOTH the
   field-label AND the Label component's `[data-radcn-label]` hook — a child
   can't read its parent's `[data-invalid]` via a utility);
2. the `.radcn-field--choice-card` modifier — it is NOT emitted by the Field
   component (a consumer applies it as a class), so there is no element to put
   utilities on; it remains a bespoke consumer-modifier rule (documented).

The custom-field fixture (`--radcn-field-error`) is unchanged (read by the
utilities + the invalid rule).

### Exact utility mapping

- field root: `grid gap-2 max-w-96 text-foreground` + orientation `Record`:
  vertical `''`; horizontal `grid-cols-[auto_minmax(0,1fr)] items-center`;
  responsive `grid-cols-[minmax(0,12rem)_minmax(0,1fr)] items-start gap-x-4
  gap-y-3 max-w-3xl max-[640px]:grid-cols-1` (gap 0.75rem 1rem → gap-y-3 gap-x-4;
  max-w 48rem → max-w-3xl; the `@media (max-width:640px)` → the EXACT arbitrary
  breakpoint `max-[640px]:grid-cols-1`, not `max-sm:` which is 639.98px).
  Drops `radcn-field`/`radcn-field--{orientation}`; keeps `data-orientation`/
  `data-invalid`/`data-radcn-field`.
- field-set (`<fieldset>`): `grid gap-3 min-w-0 m-0 border-0 p-0 text-foreground`.
- field-group: `grid gap-4 min-w-0`.
- field-content: `grid gap-1.5 min-w-0`.
- field-label (`<label>`): `text-foreground text-sm font-medium leading-[1.2]
  data-[disabled=true]:text-muted-foreground`.
- field-legend (`<legend>`): `text-foreground text-[0.9375rem] font-semibold
  leading-[1.2] mb-1 p-0` + variant `Record`: default `''`; label `text-sm
  font-medium` (the `--label` variant is `font-size:0.875rem; font-weight:500`,
  overriding the legend's 0.9375rem/600).
- field-title: `text-foreground text-sm font-medium leading-[1.2]`.
- field-separator (`<hr>`): `h-px w-full m-0 border-0 bg-border`.
- field-description (`<p>`): `m-0 text-muted-foreground text-[0.8125rem]
  leading-[1.4]`.
- field-error (`<p>`): `m-0 text-[var(--radcn-field-error,var(--radcn-destructive))]
  text-[0.8125rem] font-medium leading-[1.4]`.

Kept bespoke:
- `[data-radcn-field][data-invalid="true"] [data-radcn-field-label],
  [data-radcn-field][data-invalid="true"] [data-radcn-label] { color:
  var(--radcn-field-error, var(--radcn-destructive)); }` (repointed from the
  `.radcn-field` class to the data attribute; keeps the Label cross-ref).
- `.radcn-field--choice-card { border: 1px solid var(--radcn-field-choice-border,
  var(--radcn-border)); border-radius: var(--radcn-radius); padding: 0.875rem; }`
  — a consumer-applied modifier class (the component never emits it), kept as a
  documented bespoke rule with no element to host utilities.

## Why both suites stay green

- Field has NO computed/class assertions; it is exercised structurally (data
  attributes, which are all retained) + visually through the demos. The invalid
  label color + the field-error color hold via the kept rule + the token utility
  reading the unchanged `--radcn-field-error` (custom-field #7c3aed).
- The orientation layouts reproduce exactly (the Record + `max-sm:` for the
  responsive media query); `data-orientation` retained.
- `text-foreground`/`text-muted-foreground`/`bg-border`/`destructive` resolve via
  the contract.

## Changes

- `radcn/packages/radcn/src/components/field.tsx`: emit utility-const strings for
  all parts (root + orientation `Record`, set, group, content, label, legend +
  variant `Record`, title, separator, description, error); drop the
  `radcn-field*` classes; keep ALL data attributes.
- `radcn/packages/radcn/src/styles/tokens.css`: remove the migrated
  `.radcn-field*` rules + the `@media` responsive rule (now `max-sm:`); KEEP the
  invalid parent-state rule (repointed to `[data-radcn-field][data-invalid]`) and
  the `.radcn-field--choice-card` consumer-modifier rule; KEEP
  `.radcn-fixture-custom-field`. (The `.radcn-form*` rules are a separate
  component — untouched.)
- `radcn/packages/radcn/src/styles/index.ts`: regenerate.

Expected git status: `field.tsx`, `tokens.css`, `index.ts`, this file, README.
Both generated CSS untracked.

## Verification

1. Both `styles:build` exit 0; the field utilities generate
   (`grid-cols-[auto_minmax(0,1fr)]`, `max-[640px]:grid-cols-1`,
   `data-[disabled=true]:text-muted-foreground`).
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css`; no migrated `.radcn-field*` CLASS
   rule remains EXCEPT the kept `.radcn-field--choice-card` consumer modifier;
   the invalid parent-state rule present (keyed on `[data-radcn-field]
   [data-invalid]`); `.radcn-fixture-custom-field` retained; `.radcn-form*`
   untouched.
4. Docs suite green (11), run twice.
5. Fixture suite green (1191), run twice — incl. the Field-using fixtures
   (native-controls, native-state, native-select, menu-overlays — field layout,
   invalid label color, the choice-card demo).
6. `git diff --check` clean; `vendor/` untouched; only the expected files changed.

Pass criteria: Field renders from Tailwind utilities (no `radcn-field*` class
except the documented choice-card modifier); orientation + invalid + custom
error color hold; BOTH suites green; `tokens.css`/`index.ts` byte-identical.

Fail criteria: a Field-using fixture regresses; the invalid label color or a
layout breaks; `tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to the source)

Findings: the reviewer's SUBSTANTIVE verification was entirely positive — all
three cruxes PASS: (1) `.radcn-field--choice-card` is a consumer-applied modifier
(not component-emitted; only the choice-card fixture uses it; its presence is
count-asserted, so keeping it bespoke is correct); (2) the invalid parent-state
rule must stay bespoke (child can't read parent `[data-invalid]`), and the
`[data-radcn-field]`/`[data-radcn-field-label]`/`[data-radcn-label]` (Label
cross-ref) attributes are all emitted; (3) Field has NO `toHaveClass(/radcn-field--/)`
or computed-style assertions — only structural/data-attribute + count checks
(all retained) — and the FieldError color + custom-field `#7c3aed` hold via the
token utility. The mapping, the legend variant Record, and the raw-class scan
(only choice-card) all check out.

It returned "REJECTED" on two fixable points, both now corrected: (1) my legend
prose had a self-correcting typo ("font-normal — wait … font-medium"); the value
is `text-sm font-medium` (font-weight 500) — reworded. (2) `@media (max-width:
640px)` → I now use the EXACT `max-[640px]:grid-cols-1` (Tailwind's `max-sm:` is
639.98px), eliminating the 1px boundary discrepancy.

Lead-agent judgment: the substantive review is an APPROVAL; both fixes are
applied.

Approval result: approved (with the two clarity/exactness fixes) —
self-contained migration; orientation Record + the exact responsive breakpoint,
the invalid parent-state + Label cross-ref kept bespoke, the choice-card consumer
modifier kept + documented, custom token read in place.
