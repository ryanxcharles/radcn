# Experiment 69: Migrate toggle-group-icon + breadcrumb-glyph (+ drop dead toggle-group rule)

## Description

Three more debt rules via the proven consumer-site pattern (Exp 68) + one dead-rule
removal:

1. `.radcn-toggle-group` (container) is a DEAD rule — the ToggleGroup component already
   emits the equivalent `toggleGroupClass` utilities (Exp 47) and does NOT emit the bare
   `radcn-toggle-group` class; a precise grep confirms nothing (component, fixture, or
   docs) uses the bare class. Just remove the rule.
2. `.radcn-toggle-group-icon` — raw-class, ~23 sites (docs `components.tsx` + the toggle
   fixture). Consumer-site migrate (append utilities, keep marker). Its color reads
   `--radcn-toggle-icon-fg` (set per-item via the icon's inline `style`), which the
   `toggle.spec.ts:190/:192` `toHaveCSS('color', …)` assertions exercise — the
   `text-[var(--radcn-toggle-icon-fg,currentColor)]` utility reads that inline var, and
   the `.radcn-toggle-group-icon` marker (the test's locator) is kept.
3. `.radcn-breadcrumb-glyph` — raw-class, 6 sites (docs + navigation-collection fixture).
   Consumer-site migrate. No computed assertions.

### Utility mapping (appended after the kept marker)

- toggle-group-icon: `inline-grid w-[var(--radcn-toggle-icon-size,1rem)]
  h-[var(--radcn-toggle-icon-size,1rem)] place-items-center
  text-[var(--radcn-toggle-icon-fg,currentColor)] font-bold text-[0.75rem] leading-none
  [font-family:var(--radcn-font)]` (`font:700 0.75rem/1`).
- breadcrumb-glyph: `inline-flex w-4 h-4 items-center justify-center text-current
  text-[0.875rem] leading-none` (`1rem`=`w-4/h-4`; `color:currentColor`=`text-current`).

## Why both suites stay green

- toggle-group-icon: the `:190/:192` color assertions read the per-item inline
  `--radcn-toggle-icon-fg` via the migrated `text-[var(...)]` utility; the marker
  (locator) is kept. No other toggle assertion touches the icon's box.
- breadcrumb-glyph: no computed/class assertions; marker kept; the appended utilities
  reproduce the removed CSS exactly.
- The dead `.radcn-toggle-group` rule matched nothing (container emits utilities).

## Changes

- `toggle.tsx` (fixture, 1 icon site), `navigation-collection.tsx` (fixture, 2 glyph),
  `components.tsx` (docs, ~22 icon + 4 glyph): append the utilities to each raw `class`
  string (keep markers).
- `tokens.css`: remove `.radcn-toggle-group`, `.radcn-toggle-group-icon`,
  `.radcn-breadcrumb-glyph`.
- `index.ts`: regenerate via the node formula.

## Verification

1. Both `styles:build` exit 0; the icon/glyph utilities GENERATE in the candidate AND
   docs builds (grep the generated CSS for `place-items: center` from the icon +
   `w-4`/glyph), confirming the consumer-site utilities compiled; no junk.
2. All three typechecks pass.
3. `index.ts` byte-identical; the 3 rules removed.
4. Docs suite green (11) ×2.
5. Fixture suite green (1191) ×2 — incl. `toggle.spec.ts` (the icon colors `:190/:192`)
   and `navigation-collection.spec.ts` (breadcrumb).
6. `git diff --check` clean; `vendor/` untouched; only the expected files changed.

Pass criteria: toggle-group-icon + breadcrumb-glyph render from utilities at the
consumer sites (generated); the icon color assertions hold; the dead toggle-group rule
removed; BOTH suites green; byte-identical. Clears 3 rules (≈12 remain).

Fail criteria: the icon color assertions regress; a utility doesn't generate; divergence.

## Result

**Result:** Pass

Both consumer-site migrations + the dead-rule removal landed; both suites green (both
fixture runs clean). All three `styles:build`/typechecks pass; the consumer-site icon/
glyph utilities GENERATE (count 5 incl. the `--radcn-toggle-icon-size`/`-fg` reads); no
junk; `index.ts` byte-identical; the 3 base rules removed with the on-state icon
cascade kept; `toggle.spec.ts` isolation **7 passed** (incl. the icon color `:190/:192`
`rgb(202,138,4)`/`rgb(220,38,38)` via the kept on-state cascade) + `navigation-collection.spec.ts`
**9 passed**; docs 11 ×2; fixture 1191 ×2 (both clean); `git diff --check` clean; five
files changed.

## Conclusion

`toggle-group-icon` (23 raw sites) + `breadcrumb-glyph` (6) now render from utilities
appended at the consumer sites (markers kept); the dead `.radcn-toggle-group` base rule
(superseded by the component's `toggleGroupClass` at Exp 47) is removed; the on-state
icon-color cascade is preserved (drives the assertions). Clears 3 rules. ~12 visual-debt
rules remain — the **Button keystone** (`radcn-button*`, ~95 raw sites/13 files/27
class-presence assertions) and its coupled **triggers/closes** (dialog/drawer/dropdown/
select trigger, popover-close), all now migratable via this proven (battle-tested over
Exps 68–69) consumer-site pattern.

Learnings (also copied to the issue README Learnings digest):

- A many-site raw-class primitive (the 23 toggle-icon sites) migrates by a single
  uniform literal find/replace (append utilities, keep marker) across the fixture +
  docs — the consumer-site pattern scales. A component-state cascade that targets the
  marker (`[data-state=on] .icon`) stays bespoke + reliably overrides the migrated base
  (unlayered > @layer), so the marker MUST be kept.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool). Fresh
context: yes.

Findings: APPROVED, no Blocker/Major. Verified all 5 cruxes: (1) `.radcn-toggle-group`
is dead (container emits `toggleGroupClass`; zero bare-class uses) — safe to remove; (2)
the icon mapping is exact AND — KEY DETAIL the reviewer surfaced — the `:190/:192` color
assertions are driven by a SEPARATE kept cascade
`.radcn-toggle-group-item[data-state="on"] .radcn-toggle-group-icon { color:
var(--radcn-toggle-icon-on-fg, …) }` (the fixture sets `--radcn-toggle-icon-on-fg`
#ca8a04/#dc2626 per item); that cascade is NOT removed (only the BASE
`.radcn-toggle-group-icon` rule is) and, being unlayered, overrides the migrated base
`text-[var(--radcn-toggle-icon-fg,currentColor)]` via the kept `.radcn-toggle-group-icon`
marker — so the assertions hold; (3) the breadcrumb-glyph mapping is exact (`w-4`=1rem,
`text-current`, `leading-none`); (4) all 23 icon + 6 glyph raw sites are uniform
single-class literals (safe find/replace), none missed; (5) no orphan refs. The
tokens.css removal targets ONLY the line-start base rules, NOT the
`[data-state=on] .icon` descendant cascade.

Approval result: approved — dead-rule removal + the two consumer-site migrations are
sound; the kept on-state cascade preserves the icon color assertions.

## Completion Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool). Fresh
context: yes.

Findings: none (no Blocker, Major, or Minor). Confirmed all 23 icon + 6 glyph raw sites
migrated (markers kept, no bare literals remain); the 3 base rules removed with the
on-state icon cascade kept; byte-identical `index.ts`. It rebuilt both pipelines
(the icon `place-items:center`/`--radcn-toggle-icon-size` width + glyph `w-4` GENERATE,
no junk), re-ran the three typechecks, docs (11), `toggle.spec.ts` (7 — incl. the icon
colors `:190/:192` via the kept on-state cascade) + `navigation-collection.spec.ts` (9),
and the full fixture suite (1191). Verdict: APPROVED.

Approval result: approved with no blockers — 27 of the 39 visual-debt rules cleared.
