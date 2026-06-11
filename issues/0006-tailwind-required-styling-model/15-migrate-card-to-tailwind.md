# Experiment 15: Migrate Card to Tailwind utilities

## Description

Migrate Card and its five sub-components (CardHeader, CardTitle,
CardDescription, CardAction, CardContent, CardFooter) from bespoke
`radcn-card*` CSS to verbatim shadcn v4 utilities. Card is consumed via its JSX
API (no raw `radcn-card*` class strings in fixtures/docs) and reads no
custom-token override in any tested scenario (the `var(--radcn-card-foreground)`
references in the docs are docs-theme styling, not per-instance card overrides).

shadcn v4 mappings (vendored `registry/new-york-v4/ui/card.tsx`, verbatim
except the one documented adaptation):

- Card: `flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm`
- CardHeader: `@container/card-header grid auto-rows-min grid-rows-[auto_auto]
  items-start gap-2 px-6 has-[[data-radcn-card-action]]:grid-cols-[1fr_auto]
  [.border-b]:pb-6` — ADAPTED: shadcn detects the action via
  `has-data-[slot=card-action]`; RadCN's CardAction emits
  `data-radcn-card-action`, so the `has-[...]` selector is repointed to that
  attribute so the action two-column layout still triggers.
- CardTitle: `leading-none font-semibold`
- CardDescription: `text-sm text-muted-foreground`
- CardAction: `col-start-2 row-span-2 row-start-1 self-start justify-self-end`
- CardContent: `px-6`
- CardFooter: `flex items-center px-6 [.border-t]:pt-6`

`bg-card`/`text-card-foreground`/`text-muted-foreground` resolve via the
Experiment 2 contract (`--color-card`, `--color-card-foreground`,
`--color-muted-foreground` confirmed present). The rest are Tailwind defaults;
`@container/card-header`, `has-[...]`, and the `[.border-b]/[.border-t]`
arbitrary selectors are Tailwind v4 features.

Documented divergence (size variant): RadCN's Card has a `size`
(`default`/`sm`) prop that set the card WIDTH (`28rem`/`22rem`). shadcn's Card
has no size and no width — it sizes to its container. The migration adopts
shadcn's model: the card no longer sets a width, and the `radcn-card--${size}`
class is dropped. The `size` prop and `data-size` attribute are RETAINED as a
non-visual hook (no API break), but `size` no longer affects width. No fixture
uses `size="sm"` and no test asserts card width, so this is safe; it is a
faithful shadcn-parity change (card width is consumer/container-controlled).

## Why both suites stay green (no test changes expected)

- The only card computed-style/class assertions are: docs class-presence on the
  docs fixture classes `radcn-docs-card-demo`/`radcn-docs-card-with-form`
  (consumer classes, retained); and `[data-radcn-card-content]`
  `toHaveClass(/grid/)`, `/gap-6/`, `toHaveCSS('gap','24px')` in
  `tabs.spec.ts` and docs `coverage.spec.ts`. Those `grid gap-6` classes are
  CONSUMER classes the tabs/docs fixtures add to card-content (shadcn's
  card-content is just `px-6`), backed by Tailwind utilities already loaded, so
  `gap: 24px` (= `gap-6`) holds independent of the card base. No base card
  styling (bg/border/width/radius) is computed-asserted.
- No raw `radcn-card*` class string and no `--radcn-card*` custom-token override
  is used in any tested scenario, so nothing is stranded.

## Syntax validation (throwaway probe, before plan commit)

The two non-trivial Tailwind v4 features were validated empirically by putting
the exact class strings in a temporary `@source`-scanned file
(`radcn/fixtures/candidate-remix/app/_probe-card.tsx`), running
`pnpm --dir radcn/fixtures/candidate-remix styles:build`, grepping the generated
CSS, then deleting the probe and rebuilding. Recorded grep output:

- `grep -c "@container"` → `1` (the `@container/card-header` context generates).
- `grep -o "grid-template-columns: 1fr auto"` → one match, i.e. the
  `has-[[data-radcn-card-action]]` utility generated
  `&:has([data-radcn-card-action]) { grid-template-columns: 1fr auto }`.
- `grep -c "\.bg-card\|\.rounded-xl\|\.shadow-sm"` → `3` (all three generate).

So the design's selectors are valid Tailwind v4 that generate the expected CSS;
the round-1 unvalidated-syntax blockers are resolved. (Implementation re-runs
`styles:build` and the suites, which re-confirm generation.)

Width-safety audit (exact grep, no matches → safe to drop the base width):
`grep -rnE "data-radcn-card['\"]?\]" radcn/fixtures/tests/ radcn/apps/docs/tests/ | grep -iE "toHaveCSS.*(width|background|border|radius|shadow)"`
returned nothing — no test asserts the card base box.

## Changes

- `radcn/packages/radcn/src/components/card.tsx`: replace each sub-component's
  `radcn-card*` class(es) with the verbatim shadcn string(s) (CardHeader using
  the validated adapted `has-[[data-radcn-card-action]]`). Card emits the base
  string (no size class). Keep ALL `data-radcn-card*` attributes and Card's
  `data-size` (now a non-visual hook); keep the `size` prop in the type with a
  comment noting it is retained for API compatibility but no longer affects
  width (card width is consumer/container-controlled, shadcn-style).
- `radcn/fixtures/tests/static-display.spec.ts`: in the card slot-hooks test
  (the `/fixtures/card/default` scenario, which renders a Card WITH a
  CardAction), add a runtime guard for the `has-[[data-radcn-card-action]]`
  layout. The resolved `grid-template-columns` is pixel values (e.g.
  `"344px 40px"`), NOT the literal `1fr auto`, so assert robustly: the header
  is `display: grid` AND its computed `grid-template-columns` is not `none` and
  has ≥2 space-separated tracks —
  `expect((await header.evaluate(el => getComputedStyle(el).gridTemplateColumns)).trim().split(/\s+/).length).toBeGreaterThanOrEqual(2)`.
  This proves the has-selector matched at runtime (two-column layout active),
  guarding against a silent failure, without brittleness to exact px.
- `radcn/packages/radcn/src/styles/tokens.css`: remove `.radcn-card`,
  `.radcn-card--sm`, `.radcn-card-header`, `.radcn-card-title`,
  `.radcn-card-description`, `.radcn-card-content`, `.radcn-card-footer`
  (replace with a migration comment, no literal selectors).
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the standard
  formula.

Expected git status: `card.tsx`, `tokens.css`, `index.ts`,
`radcn/fixtures/tests/static-display.spec.ts` (the added header-layout
assertion), this experiment file, README index + Learnings. Both generated CSS
untracked. (A precise grep confirmed NO test asserts the card base
width/bg/border/radius/shadow, so dropping the base width is safe.)

## Verification

1. Both `styles:build` exit 0; the generated CSS contains the card utilities
   (`rounded-xl`, `bg-card`, `shadow-sm`, `@container/card-header` rule, the
   `has-[[data-radcn-card-action]]` rule, `col-start-2`).
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css`; no `.radcn-card` rule remains.
4. Docs suite green (11), run twice — incl. the card-demo/with-form class
   assertions and the card-content `grid gap-6`/`gap: 24px`.
5. Fixture suite green (1191), run twice — incl. `tabs.spec.ts` card-content
   assertions.
6. `git diff --check` clean; `vendor/` untouched; generated CSS untracked; only
   the expected files changed.

Pass criteria: Card + subparts render from Tailwind utilities (no `radcn-card*`
classes emitted); all `data-radcn-card*`/`data-size` hooks intact; BOTH suites
green and stable; the card-content `gap: 24px` and class assertions pass;
`tokens.css`/`index.ts` byte-identical.

Fail criteria: any card assertion regresses; a utility (esp. the `@container`
or `has-[...]` ones) is not generated; a usage relied on the base
width/bg/border in a tested way; `tokens.css`/`index.ts` diverge.

## Result

**Result:** Fail (reverted; useful — see Conclusion)

Implementing the migration and running the fixture suite revealed prerequisites
the design (and its reviews) missed. The Card implementation was reverted to
keep `main` green; the experiment is recorded as Fail.

What went wrong:

1. **Missing default border-color contract (foundational).** shadcn cards use
   `border` (border-WIDTH only) and rely on a base layer setting
   `border-color: var(--border)` globally (shadcn's
   `@layer base { *,::before,::after { @apply border-border } }`). RadCN's
   `theme.css` has NO such rule (grep for `border-color`/`@layer base`/
   `border-border` in theme.css returned nothing). So the migrated card's
   `border` rendered `border-color: rgb(24, 24, 27)` (currentColor =
   `--foreground`), not the `--border` token. The fixture custom-card
   assertion failed: `static-display.spec.ts:155` expected
   `border-color: rgb(147, 51, 234)`, got `rgb(24, 24, 27)`. This affects
   EVERY bordered component (Input, Dialog, …), not just Card. Empty
   (Experiment 10) used `border-dashed` (width 0, invisible) so it never
   surfaced this.
2. **Custom-token scenario missed.** `radcn-fixture-custom-card` sets
   `--radcn-card-bg`/`--radcn-card-border` (tokens.css), and
   `static-display.spec.ts:155` asserts the resulting border-color. The design
   checked fixture *source* for `--radcn-card-*` (found none) but the override
   lives in `tokens.css`, so it was missed. The migrated card ignores those
   vars, so the override must be translated to a direct class rule (like
   Badge's custom-class), and only works once (1) is fixed.
3. **Cross-component selector missed.** `tokens.css:711`
   `.radcn-chart-example-card .radcn-card-content` styles card-content inside a
   chart example; removing the `radcn-card-content` class would strand it. It
   must be repointed to `[data-radcn-card-content]` (the Label→Field pattern
   from Experiment 11). The design's cross-selector grep missed it.

The header-layout migration itself (the `@container`/`has-[[data-radcn-card-action]]`
utilities, validated by the probe) worked — the failure is the missing
border-color foundation and the two missed call-site dependencies, not the
shadcn mapping.

## Conclusion

Card cannot be faithfully migrated until the theme contract provides a default
`border-color: var(--border)` for the `border` utility — a foundational piece
Experiments 2 and 9 did not set up and that Card (the first visible-border
component) surfaced. This Fail eliminates the assumption that bordered
components migrate cleanly on the current contract.

Next steps (separate, reviewed experiments):

1. Add the default border-color base rule to `radcn/packages/radcn/src/styles/theme.css`
   (`@layer base { *, ::before, ::after { border-color: var(--border) } }`,
   shadcn's approach) so `border` renders `--border`. Verify it does not shift
   existing border-color assertions (existing components use bespoke `radcn-*`
   border CSS with explicit colors; the rule only affects utility `border`).
2. Re-attempt Card, now also: translating `radcn-fixture-custom-card` to a
   direct `border-color`/`background-color` rule, and repointing
   `.radcn-chart-example-card .radcn-card-content` to `[data-radcn-card-content]`.

Learnings for later experiments (also copied to the issue README Learnings
digest):

- Bordered-component migration needs a default `border-color: var(--border)`
  base rule in the theme contract (shadcn's `@apply border-border` base);
  without it, the `border` utility renders currentColor. Build this BEFORE
  migrating any visible-border component.
- When checking a component for custom-token override scenarios, grep
  `tokens.css` (where fixture override classes set `--radcn-*` vars), not just
  the fixture `.tsx` source — the override CSS lives in `tokens.css`.
- Cross-component selector grep must include sub-part classes
  (`.radcn-X-content` etc.), not just the base class.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to referenced sources incl. vendored shadcn)

Round 1: REJECTED on two unvalidated-syntax blockers (`@container/card-header`
and `has-[[data-radcn-card-action]]`) plus minors (width-safety grep rigor, a
two-column-layout assertion, a size-prop comment). All confirmed the scope and
verbatim mapping were sound, no cross-component selector deps, tokens present,
and the card-content `grid gap-6` assertions are consumer-class-driven.

Resolutions:

- The two blockers are resolved empirically by the throwaway probe above: both
  `@container/card-header` and `has-[[data-radcn-card-action]]:grid-cols-[1fr_auto]`
  generate valid CSS (the latter a `:has([data-radcn-card-action])
  { grid-template-columns: 1fr auto }` rule).
- Width safety: a precise grep confirmed NO test asserts the card base
  width/bg/border/radius/shadow.
- Added a fixture card-header layout assertion (grid + two-track
  grid-template-columns when an action is present) to guard against a silent
  has-selector failure.
- Added the size-prop API-compatibility comment.

Round 2 (re-review of the resolutions): the reviewer asked for (a) the probe's
actual recorded output (legit) and (b) flagged that a literal `1fr auto` regex
would be brittle (correct — resolved values are px); it also raised the
"assertion not yet in the test file" as a blocker. Resolutions: the probe grep
output is now recorded verbatim in the Syntax-validation section; the planned
assertion is specified robustly (display:grid + ≥2 grid tracks, not a literal
regex); and the width-safety grep command/result is documented.

Lead-agent judgment on round 2: the "assertion not yet in the test file"
finding is rejected as a design-vs-implementation misread — this is a design
doc reviewed BEFORE implementation (per `AGENTS.md`, implementation must not
begin until the design is approved and the plan commit exists), and the
reviewer itself conceded unimplemented test changes are acceptable for a design
doc when marked as planned (they are, in Changes). The substantive asks (probe
evidence, robust assertion, grep audit) are addressed.

Round 3 (re-review of these resolutions by a fresh Claude subagent): confirmed
the recorded probe output, the robust (≥2-track, non-brittle) layout assertion
spec, the documented width-safety grep, and the planned size-prop comment;
overruled round 2's "assertion not implemented" as a design-stage misread; no
new blocker. Verdict: APPROVED.

Approval result: approved (round 3). The two real round-1 syntax blockers are
resolved by the recorded probe; round-2 asks addressed; round-2's
implementation-stage misread overruled by lead judgment. No blockers remain.

(Note: the design was approved, but implementation then surfaced three
prerequisites the design and all three review rounds missed — see Result. The
experiment is recorded Fail and reverted; the gaps are addressed by
Experiment 16 onward.)

## Completion Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to the working tree).

Findings: none — the Fail is correctly recorded.

The reviewer confirmed the Card implementation is FULLY reverted (card.tsx,
tokens.css, index.ts, static-display.spec.ts all back to original; `git status`
shows only the experiment file + README changed), independently verified all
three documented gaps are real (theme.css has no default border-color base
rule; tokens.css:711 `.radcn-chart-example-card .radcn-card-content`
cross-selector; `radcn-fixture-custom-card` sets `--radcn-card-border` with a
tested border-color assertion), re-ran the FULL fixture suite (1191) and docs
suite (11) confirming `main` is restored green, and judged recording Fail (vs.
a scope-expanded unreviewed fix touching the theme contract) the correct
workflow call for a foundational dead-end. Verdict: APPROVED (the Fail
recording).

Approval result: approved — Fail accurately diagnosed, revert complete, main
green, next steps sound.
