# Experiment 44: Migrate Toggle (button surface) to Tailwind utilities

> **Result: Fail (dead end — reverted).** Toggle's `.radcn-toggle*` rules are
> SHARED: `ToggleGroupItem` (in `toggle-group.tsx`) emits `radcn-toggle` +
> `radcn-toggle--{variant}`/`--{size}` and relies on those rules for its base,
> states, and (via the group cascade) size/variant. Removing the `.radcn-toggle`
> rules to migrate Toggle ALONE broke the group-item pressed background
> (`toggle.spec.ts:199`). Toggle and ToggleGroupItem must be migrated TOGETHER (the
> Exp-39 sibling-sharing lesson). The change was reverted to the clean Exp-43
> state (toggle 7/7 green, byte-identical restored); the next experiment migrates
> Toggle + ToggleGroup together. The design below is retained as the (incomplete)
> starting point; see the Result for the full analysis. The design review missed
> the share because it inspected `toggle.tsx` + the fixture but not
> `toggle-group.tsx` — reinforcing: grep ALL `src/components/*.tsx` for the class
> before dropping its rule.

## Description

Toggle is a pressable button (`data-state` on/off, variant default/outline, size
default/sm/lg). It is heavily class-locator-coupled and has a companion icon that
is NOT a RadCN component — fixtures (and consumers) write `<span
class="radcn-toggle-icon">` as a RAW class and rely on the `.radcn-toggle-icon`
CSS for styling (incl. the on-state color via an inline `--radcn-toggle-icon-on-fg`).
So this experiment migrates the toggle BUTTON surface to Tailwind utilities and
KEEPS the `.radcn-toggle-icon` rules bespoke (a consumed styling API — the Exp-37
lesson), repointing their parent selector off the dropped base class.

Design constraints (hard-won lessons applied):

- **Class-locator markers (Exp-43).** `toggle.spec.ts` locates by
  `.radcn-toggle--sm`/`--lg` (with `toHaveCSS('min-height', …)`) AND asserts
  `toHaveClass(/--sm|--lg|--outline/)`. So the `radcn-toggle--{variant}` and
  `radcn-toggle--{size}` classes are RETAINED on the button as style-less markers;
  the base `radcn-toggle` class is dropped (only `data-radcn-toggle` is used as a
  locator/attr).
- **Conflicting props go in the Records, base keeps only common props (Exp-41).**
  base vs `--outline` differ on border-color AND background; base vs `--sm`/`--lg`
  differ on min-height, padding, font-size. So: the base sets NO background, NO
  border-color, NO min-height/padding/font-size. The variant `Record` owns
  background + border-color; the size `Record` owns min-height/padding/font-size.
- **ASCII/token-free comments (Exp-42).**

### Exact utility mapping (the `<button>`)

base: `inline-flex items-center justify-center gap-2 border rounded-md
text-[var(--radcn-toggle-fg,var(--radcn-foreground))] cursor-pointer font-medium
leading-none [font-family:var(--radcn-font)] outline-none
transition-[background-color,color,border-color,box-shadow]
hover:bg-[var(--radcn-toggle-hover-bg,var(--radcn-secondary))]
focus-visible:border-[var(--radcn-ring)]
focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--radcn-ring)_35%,transparent)]
data-[state=on]:bg-[var(--radcn-toggle-pressed-bg,var(--radcn-primary))]
data-[state=on]:text-[var(--radcn-toggle-pressed-fg,var(--radcn-primary-foreground))]
data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50
disabled:cursor-not-allowed disabled:opacity-50`
(`border` = width only, NO color; `font: 500 .875rem/1` → font-medium leading-none,
size in the size Record).

- variant `Record` (owns border-color + background): default `border-transparent
  bg-transparent`; outline `border-[var(--radcn-toggle-border,var(--radcn-border))]
  bg-background`.
- size `Record` (owns min-height + padding + font-size): default
  `min-h-[var(--radcn-control-height)] px-3 py-2 text-[0.875rem]` (0.5rem 0.75rem);
  sm `min-h-8 px-2.5 py-1.5 text-[0.8125rem]` (2rem; 0.375rem 0.625rem); lg
  `min-h-11 px-4 py-2.5 text-base` (2.75rem = 44px; 0.625rem 1rem).
- PLUS retained markers: `radcn-toggle--{variant}` + `radcn-toggle--{size}`
  (style-less; for the locators + `toHaveClass`).

The conditional variants (`hover:`/`focus-visible:`/`data-[state=on]:`) carry
higher selector specificity than the unconditional `Record` background/border-color,
so the pressed/hover/focus states win when active (verified by the suite).

### Kept bespoke (the icon — a raw-class styling API, NOT migrated)

- `.radcn-toggle-icon { … }` — unchanged (fixtures/consumers use the raw class).
- `.radcn-toggle[data-state="on"] .radcn-toggle-icon { color:
  var(--radcn-toggle-icon-on-fg, currentColor); }` → REWRITE the parent selector
  to `[data-radcn-toggle][data-state="on"] .radcn-toggle-icon` (the base
  `.radcn-toggle` class is dropped, so the parent must key on the data attribute;
  the child `.radcn-toggle-icon` raw class is retained).

The `.radcn-fixture-custom-toggle` / `-toggle-group` fixture rule is retained
(read by the token-referencing utilities — hover/pressed/border).

## Why both suites stay green

- The size markers + min-heights hold: `.radcn-toggle--sm` (locator) carries
  `min-h-8` → `min-height: 32px`; `--lg` → `min-h-11` → 44px; the `toHaveClass`
  assertions pass (markers retained).
- The outline border/background, the pressed (`data-[state=on]`) bg/fg, hover, and
  the custom tokens (hover #ccfbf1, pressed #0f766e, border #0f766e) hold via the
  token-referencing utilities reading the unchanged fixture.
- The icon color (incl. the on-state `rgb(59,130,246)` from the inline
  `--radcn-toggle-icon-on-fg`) holds because the `.radcn-toggle-icon` rules stay
  bespoke; the parent `[data-radcn-toggle][data-state=on]` repoint keeps the
  on-color cascade.

## Changes

- `radcn/packages/radcn/src/components/toggle.tsx`: emit base + variant `Record`
  + size `Record` utilities; RETAIN the `radcn-toggle--{variant}`/`--{size}`
  markers; DROP the base `radcn-toggle` class; keep all data attributes.
- `radcn/packages/radcn/src/styles/tokens.css`: remove the migrated `.radcn-toggle`
  button rules (base/hover/focus/state-on/--outline/--sm/--lg/disabled); KEEP the
  `.radcn-toggle-icon` rule + REWRITE the on-state icon rule's parent selector to
  `[data-radcn-toggle][data-state="on"]`; leave ALL `.radcn-toggle-group*` rules
  untouched (a later experiment); KEEP the custom fixture.
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the canonical node
  formula.

Comments in the component stay ASCII and free of bracketed class-like tokens.

Expected git status: `toggle.tsx`, `tokens.css`, `index.ts`, this file, README.

## Verification

1. Both `styles:build` exit 0; no junk ellipsis utility; the size markers'
   min-heights emit (`min-h-8`→32px, `min-h-11`→44px).
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css` (node formula); no `.radcn-toggle`
   BUTTON class rule remains (markers style-less); the `.radcn-toggle-icon` rules
   retained (the on-state one repointed to `[data-radcn-toggle]`); the
   `.radcn-toggle-group*` rules untouched; custom fixture retained.
4. Docs suite green (11), run twice.
5. Fixture suite green (1191), run twice — incl. `toggle.spec.ts` (the `--sm`/`--lg`
   min-heights at :46/:48, the marker `toHaveClass` at :63/:79/:84/:87, the icon
   on-color `rgb(59,130,246)` at :70, the custom tokens, variant/size/state) AND
   the ToggleGroup tests (unaffected — group rules untouched).
6. `git diff --check` clean; `vendor/` untouched; only the expected files changed.

Pass criteria: the Toggle button renders from Tailwind utilities (only the
`--{variant}`/`--{size}` markers remain, style-less); the sizes/variants/states +
the kept icon (incl. on-color) hold; ToggleGroup unaffected; BOTH suites green;
`tokens.css`/`index.ts` byte-identical.

Fail criteria: a size min-height/marker assertion, the icon color, or a
variant/state regresses; a base-vs-Record conflict collapses a property;
ToggleGroup breaks; `tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README with the Exp-37/41/42/43
lessons, this experiment file, and read access to the source + fixtures)

Findings: APPROVED, no Blocker/Major/Minor. The reviewer verified all five
cruxes + enumerated all 23 Toggle (non-group) assertions and confirmed each
holds: (1) base sets NO bg/border-color/min-h/padding/font-size — variant Record
owns bg+border-color, size Record owns min-h+padding+font-size (no Exp-41
conflict); the conditional `hover:`/`focus-visible:`/`data-[state=on]:` variants
win over the unconditional Record values via Tailwind v4 attribute/pseudo
specificity. (2) The `radcn-toggle--{variant}`/`--{size}` markers are retained
for the locators + `toHaveClass` + min-height (`min-h-8`=32px, `min-h-11`=44px);
the base `radcn-toggle` class is safely dropped. (3) The icon is a raw-class API
(fixtures write `radcn-toggle-icon`; no component) — kept bespoke, the on-state
parent rule repointed to `[data-radcn-toggle][data-state="on"]`; the on-color
`rgb(59,130,246)` from the inline `--radcn-toggle-icon-on-fg` survives. (4) all
mappings exact; color via `text-[var()]` (correct), font-size via literal
`text-[Xrem]` (unambiguous). (5) the `.radcn-toggle-group*` rules are untouched.
Custom fixture retained; comments to stay ASCII.

Approval result: approved — the button surface migrates cleanly with conflict-free
Records, retained markers, and a bespoke repointed icon; ToggleGroup deferred.

(Note: this approval — and the implementation — both MISSED that `ToggleGroupItem`
reuses the `.radcn-toggle` rules. The review checked `toggle.tsx` and the fixture
markup, but not `toggle-group.tsx`. See the Result.)

## Result

**Result:** Fail (reverted to the clean Exp-43 state)

Implemented as designed (Toggle button → utilities; icon kept bespoke; `.radcn-toggle`
button rules removed). The Toggle-only assertions passed, BUT the full suite showed
a deterministic regression: `toggle.spec.ts:199` (ToggleGroup custom tokens) — a
group-item's pressed `background-color` was `rgba(0,0,0,0)` instead of
`rgb(15,118,110)`. Diagnosis: `ToggleGroupItem` (`toggle-group.tsx:240-246`) emits
`radcn-toggle` + `radcn-toggle-group-item` + `radcn-toggle--{variant}`/`--{size}`,
so it draws its base/hover/focus/pressed/disabled + (when its own size/variant are
absent) the group-cascade styling from the SAME `.radcn-toggle*` rules. Removing
those rules to migrate Toggle alone stripped the group-item's pressed background
(no `.radcn-toggle-group-item[data-state="on"]` background rule exists — only an
icon one). There is no clean "Toggle button only" migration: the `.radcn-toggle*`
rules are shared with `ToggleGroupItem`, which additionally resolves size/variant
through the bespoke group-cascade rules (`.radcn-toggle-group[data-size=…]
.radcn-toggle-group-item:not([data-size])`).

Action: reverted `toggle.tsx`/`tokens.css`/`index.ts` to the Exp-43 commit
(`fb357d2`); `toggle.spec.ts` back to 7/7, `tokens.css`/`index.ts` byte-identical,
`.radcn-toggle` rule restored. No code change ships from this experiment.

## Conclusion

Toggle and ToggleGroup are a single migration unit (they share `.radcn-toggle*`
rules, with the group cascading size/variant to its items). The next experiment
migrates them TOGETHER: the Toggle button + ToggleGroupItem both emit the shared
base/variant/size utilities (the conflict-free Records from this design carry
over), the `.radcn-toggle*` rules are fully removed, and the group-specific pieces
(`.radcn-toggle-group*`: orientation, the joined border-radius, the
size/variant cascade to size/variant-less items, and the two raw-class icon APIs
`.radcn-toggle-icon`/`.radcn-toggle-group-icon`) are handled — the cascade likely
stays bespoke (parent-data-attr keyed), the icons stay bespoke (raw-class APIs).

Learnings (also copied to the issue README Learnings digest):

- Before removing a component's bespoke rules, grep ALL `src/components/*.tsx`
  (not just the obvious file + fixtures) for the class — `ToggleGroupItem` reused
  `radcn-toggle`. A composite "item" sub-component frequently renders the base
  component's class; migrate the base + its reusing siblings TOGETHER (Exp-39).
- A design/completion review scoped to the primary component + its fixtures can
  miss a sibling component's raw-class reuse; the reviewer brief must explicitly
  list "grep every component file for the class."
