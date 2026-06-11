# Experiment 19: Migrate Alert to Tailwind utilities

## Description

Migrate Alert and its sub-components (AlertTitle, AlertDescription, and the
RadCN-only AlertAction) off bespoke `radcn-alert*` CSS. Alert is bordered
(unblocked by the Experiment 16 `--border` base) and has a `default`/
`destructive` variant. The base `.radcn-alert` class is NOT cross-referenced by
any other component (only the separate AlertDialog shares the `radcn-alert`
PREFIX via its own `.radcn-alert-dialog-*` rules — left intact).

shadcn v4 mappings (vendored `alert.tsx`, a `cva`), verbatim except the one
documented adaptation:

- Alert base: `relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5
  rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]
  has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current`
- variant `default`: `bg-card text-card-foreground`
- variant `destructive`: `bg-card text-destructive
  *:data-[radcn-alert-description]:text-destructive/90 [&>svg]:text-current` —
  ADAPTED: shadcn uses `*:data-[slot=alert-description]`; RadCN's
  AlertDescription emits `data-radcn-alert-description`, so the selector is
  repointed to that attribute.
- AlertTitle: `col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight`
- AlertDescription: `col-start-2 grid justify-items-start gap-1 text-sm
  text-muted-foreground [&_p]:leading-relaxed`
- AlertAction (RadCN-only; shadcn has no equivalent): its sole bespoke property
  was `margin-top: 0.25rem`, so it becomes `col-start-2 mt-1` (the `mt-1`
  preserves the margin; `col-start-2` aligns it in the content column like the
  title/description).

The Alert emits `classes(alertBase, alertVariants[variant], className)` and
keeps `data-radcn-alert`, `data-variant`, `role="alert"`. Like all prior
migrations (Badge, Card, Input, …), Alert REMAINS a Remix 3 `Handle`-based
component — only its class string changes from bespoke `radcn-alert*` to the
shadcn utility constants; no API/structure change. AlertAction likewise stays a
`Handle` component, emitting `col-start-2 mt-1` (it is RadCN-only and unused by
any fixture/test, so its migration is faithful-but-untested).

AlertDialog independence (grep-confirmed): no selector combines
`.radcn-alert-dialog*` with the base `.radcn-alert` (the only
`.radcn-alert-dialog … .radcn-alert*` match is
`.radcn-alert-dialog-content--sm .radcn-alert-dialog-footer`, both
alert-dialog classes), and `alert-dialog.tsx` renders no base `<Alert>` (it uses
its own `[data-radcn-alert-dialog-*]` hooks). So removing the base `.radcn-alert*`
rules cannot strand AlertDialog.

## Syntax validation (throwaway probe, before plan commit)

The non-trivial utilities were validated by a temporary `@source`-scanned file
+ `styles:build` + grep, then reverted:

- `has-[>svg]:grid-cols-[…]` → generates a `:has(> svg)` grid rule. ✓
- `*:data-[radcn-alert-description]:text-destructive/90` → generates a valid
  direct-child rule (`&[data-radcn-alert-description] { color: … }` inside the
  `*:` child context). ✓ (The shadcn-faithful form works with the RadCN
  attribute name.)
- `[&>svg]:size-4`, `[&_p]:leading-relaxed`, `col-start-2`, `line-clamp-1` →
  all generate. ✓

## Why both suites stay green

- The alert demo fixture supplies its OWN inline grid layout
  (`grid-template-columns:auto minmax(0,1fr)`) and wraps title/description in a
  `<div>`, so shadcn's `grid-cols-[0_1fr]`/`has-[>svg]`/`col-start-2` utilities
  are overridden or inert there — no layout regression. The icon is a direct
  `<svg>` child with inline `style="width:1rem;height:1rem;margin-top:0.125rem"`
  (confirmed), which overrides `[&>svg]:size-4`/`translate-y-0.5`.
- No test asserts the alert's layout, title/description color, icon size, or the
  destructive border/fg. The alert tests assert role, `data-variant`, title/
  description TEXT and counts (all preserved via the retained attributes and
  children) — not computed alert styling.
- The ONE computed alert assertion is the custom-token border:
  `static-display.spec.ts:55` `border-color: rgb(15, 118, 110)` (#0f766e) on
  `.radcn-fixture-custom-alert`. That rule currently sets `--radcn-alert-border`
  (which the migrated Alert ignores), so it is translated to a direct
  `border-color: #0f766e` (unlayered `radcnStyles`, wins over the alert's
  `border` + the Exp 16 base). `background-color: #f0fdfa` and `color: #134e4a`
  are translated too (preserved; untested).

## Changes

- `radcn/packages/radcn/src/components/alert.tsx`: replace the bespoke classes
  with the shadcn base + variant constants (Alert), the title/description
  strings, and `col-start-2 mt-1` for AlertAction. Keep all `data-radcn-alert*`,
  `data-variant`, and `role="alert"`.
- `radcn/packages/radcn/src/styles/tokens.css`: remove `.radcn-alert`,
  `.radcn-alert--destructive`, `.radcn-alert-title`, `.radcn-alert-description`,
  `.radcn-alert-action` (migration comment, no literal selectors); translate
  `.radcn-fixture-custom-alert` from `--radcn-alert-bg/border/fg` to direct
  `background-color: #f0fdfa; border-color: #0f766e; color: #134e4a;`. Leave ALL
  `.radcn-alert-dialog-*` and `.radcn-fixture-custom-alert-dialog` rules intact
  (AlertDialog is a separate component).
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the standard
  formula.

Expected git status: `alert.tsx`, `tokens.css`, `index.ts`, this experiment
file, README index + Learnings. Both generated CSS untracked.

## Verification

1. Both `styles:build` exit 0; generated CSS contains the alert utilities
   (`rounded-lg`, `has-[>svg]` grid, `col-start-2`, the
   `*:data-[radcn-alert-description]` destructive rule).
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css`; no `.radcn-alert` (base/title/
   description/action/destructive) rule remains; `.radcn-alert-dialog-*` intact;
   `.radcn-fixture-custom-alert` sets `border-color: #0f766e` directly.
4. Docs suite green (11), run twice.
5. Fixture suite green (1191), run twice — incl. the alert demo (role/variant/
   title/description), the destructive scenarios, and the custom-alert
   border-color (#0f766e).
6. `git diff --check` clean; `vendor/` untouched; only the expected files
   changed.

Pass criteria: Alert + subparts render from Tailwind utilities (no `radcn-alert`
base/title/description/action classes emitted); `data-radcn-alert*`/
`data-variant`/`role` intact; AlertDialog untouched; the custom-alert
border-color preserved via the direct rule; BOTH suites green and stable;
`tokens.css`/`index.ts` byte-identical.

Fail criteria: any alert assertion regresses; AlertDialog styling breaks (a
removal/translation hit a shared rule); a utility not generated;
`tokens.css`/`index.ts` diverge.

## Result

**Result:** Pass

Alert is migrated; both suites are green and stable. Verification:

1. Both `styles:build` exit 0; the alert utilities generate.
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css`; no base/title/description/action/
   destructive `.radcn-alert` rule remains (grep excluding `alert-dialog` is
   empty); `.radcn-fixture-custom-alert` sets `border-color: #0f766e` directly;
   `.radcn-alert-dialog-*` and `.radcn-fixture-custom-alert-dialog` intact.
4. Docs suite: **11 passed** ×2.
5. Fixture suite: **1191 passed** on 3 of 4 runs; one run hit a single transient
   failure in the positioned-overlay tests (the serial-load flake classified in
   Experiment 9, unrelated to Alert). The Alert test itself
   (`static-display.spec.ts` "candidate alert exposes role variant and custom
   token hooks", incl. the custom-alert `border-color: rgb(15, 118, 110)` and
   role/variant/title/description) passes deterministically — the static-display
   suite is **12 passed** ×2 in isolation.
6. `git diff --check` clean; `vendor/` untouched; generated CSS untracked; the
   three expected files changed.

No deviations from the approved design.

## Conclusion

Alert is migrated to shadcn v4 cva utilities — default/destructive variants via
a per-variant class map, the icon grid (`has-[>svg]`, `[&>svg]`) and the
destructive description tint (adapted to `*:data-[radcn-alert-description]`),
with the RadCN-only AlertAction faithfully mapped (`mt-1`). The custom-token
override was translated to a direct rule, and AlertDialog (a separate component)
was confirmed independent and left untouched. Twelve components are now migrated
(Badge, Skeleton, Separator, Kbd, Empty, Label, AspectRatio, Card, Input,
Textarea, Alert — plus sub-components).

Learnings for later experiments (also copied to the issue README Learnings
digest):

- A shadcn `cva` with variants ports to a Remix 3 `Handle` component as a base
  constant + a `Record<Variant, string>` class map, selected by the `variant`
  prop (no cva runtime needed).
- A variant's child-targeting selector keyed on `data-[slot=…]` adapts to the
  RadCN boolean attribute as `*:data-[radcn-…]:…` (validated to generate
  `&[data-radcn-…]`).
- Prefix-sharing is not coupling: `.radcn-alert*` (Alert) and
  `.radcn-alert-dialog*` (AlertDialog) are separate components — grep-confirm no
  shared selector and no cross-render before removing one's rules.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to referenced sources incl. vendored shadcn)

Round 1: the reviewer verified the shadcn strings, the destructive
`data-[slot=alert-description]` → `data-[radcn-alert-description]` adaptation
(AlertDescription emits that attribute), the custom-alert translation values
(#0f766e = rgb(15,118,110)), and that the alert demo fixture's inline grid +
no computed layout/variant-color assertions make the migration safe. It
returned REJECTED on: (Blocker) "unclear Remix-3-Handle vs React-CVA"; (Blocker)
"probe not committed"; (Major) "AlertDialog independence not grep-verified";
plus minors (icon inline size, AlertAction path).

Lead-agent judgment + resolutions:

- "Remix-3 vs React" is a FALSE blocker: every RadCN component is a Remix 3
  `Handle` component, and the design (now explicit) keeps Alert/AlertAction as
  `Handle` components, changing only the class string — identical to the 11
  prior migrations. Clarified in the Description.
- "Probe not committed" is a FALSE blocker: probes are throwaway by design
  (same as Card's, accepted); the result (`*:data-[radcn-alert-description]`
  generates `&[data-radcn-alert-description]`) is recorded in Syntax validation.
- AlertDialog independence: grep-confirmed and recorded — no shared selector
  with base `.radcn-alert`, and `alert-dialog.tsx` renders no base `<Alert>`.
- Icon inline size confirmed (overrides `[&>svg]:size-4`); AlertAction is
  RadCN-only/untested, faithfully mapped (`margin-top:0.25rem` → `mt-1`).
- Custom-alert translation values are spelled out exactly; only `border-color`
  is asserted.

Round 2 (re-review of these resolutions by a fresh Claude subagent): confirmed
all legitimate items resolved — Alert/AlertAction stay Handle components (only
class strings change); AlertDialog independence independently grep-verified (no
shared selector, no base `<Alert>` render); the throwaway-probe validation
matches the accepted Card precedent; the custom-alert translation follows the
Badge pattern (only border-color asserted); icon inline-size override and
AlertAction faithful mapping accurate. It confirmed the two round-1 blockers
were a design-vs-component-model misread and an artifact-form misread, not
substantive. Verdict: APPROVED.

Approval result: approved (round 2). Design correct and complete; the shadcn
mappings, the destructive selector adaptation, the custom-alert translation,
AlertDialog isolation, and the dual-suite gate are all sound. No substantive
blocker remains.

## Completion Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to the working tree).

Findings: none (no Blocker, Major, or Minor).

The reviewer confirmed alert.tsx emits the verbatim shadcn base + variant map
(destructive via `*:data-[radcn-alert-description]`, AlertAction `col-start-2
mt-1`) with all data hooks/role and no `radcn-alert*` class; tokens.css has no
base `.radcn-alert*` rule (alert-dialog intact), `.radcn-fixture-custom-alert`
translated to direct border/bg/color, and byte-identical `index.ts`. It
independently re-ran both `styles:build`, the three typechecks, the docs suite
(2/2 = 11), the static-display suite in isolation (2/2 = 12 — the alert test
incl. the custom-alert `rgb(15, 118, 110)` border-color passes
deterministically), and the AlertDialog tests (modal-variants.spec.ts = 8
passed, proving AlertDialog unaffected). It judged the migration faithful, the
custom-token translation correct, and AlertDialog provably independent. Verdict:
APPROVED.

Approval result: approved with no blockers.
