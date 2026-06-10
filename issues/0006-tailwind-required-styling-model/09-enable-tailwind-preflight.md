# Experiment 9: Enable Tailwind preflight

## Description

The maintainer decided (recorded in the issue README Decisions) to enable
Tailwind preflight, reversing the Experiments 1–8 deferral. shadcn component
utility strings assume preflight's global base reset — most importantly
`border-style: solid` (so `border` renders a visible border),
`box-sizing: border-box`, and margin/heading/list resets. Bordered components
(Empty, Input, Card, Dialog, …) cannot migrate faithfully without it, so this
experiment turns it on for both Tailwind pipelines before the bordered-component
migrations continue.

This experiment was de-risked with a throwaway probe (preflight enabled in both
pipelines, both suites run, then reverted). Findings:

- Blast radius is small. With the Tailwind `<link>` ordered BEFORE `radcnStyles`
  (Experiments 4/6), bespoke `.radcn-*` rules win cascade ties, so preflight's
  resets only apply where RadCN sets nothing. Fixture suite: 1189/1191 passed;
  docs suite: 10/11 passed.
- The hover-card overlay tests (fixture `positioned-overlays.spec.ts` and the
  docs hover-card rich-example) failed under full-suite load but PASS in
  isolation — they are timing-flaky, not deterministically broken by preflight.
- The menubar test (`menubar-navigation.spec.ts:140`) fails DETERMINISTICALLY:
  hovering the "Help" menubar trigger is blocked because an open menu's
  `radcn-menubar-label` (inside the portal-root) intercepts pointer events at
  the trigger — a real positioned-overlay layout overlap that preflight
  introduces. `.radcn-menubar-content` has no `position` rule in `tokens.css`
  (it relies on JS-applied inline positioning), so it is sensitive to
  preflight's `box-sizing`/margin resets; the exact mechanism is diagnosed at
  runtime in implementation.

So this experiment is: enable preflight in both pipelines, then diagnose and
fix the menubar positioned-overlay regression (and any sibling overlay that the
full dual-suite run shows is deterministically affected), and confirm the
flaky hover-card tests pass. Both suites must end green.

Scope limits: enable preflight + fix the positioned-overlay regression(s) it
causes. No component migration in this experiment (that resumes next, now
preflight-backed). The fix is CSS-only — the minimal explicit
`position`/`box-sizing` (or similar) on the affected overlay/portal containers
in `tokens.css` so preflight's reset cannot perturb their JS-applied inline
positioning. The JS positioning (`menu-overlay.ts` `positionElement()`, which
applies `position: fixed` from `getBoundingClientRect()` measurements) is NOT
rewritten here: if runtime diagnosis shows the JS math itself is wrong (not
merely CSS-sensitive), this experiment escalates to Fail and a dedicated
overlay-positioning experiment is opened.

Implementation pre-step (classify flaky vs deterministic): before fixing
anything, re-run each test that failed in the probe — the fixture hover-card
overlay tests, the docs hover-card rich-example, and the menubar test — in
isolation 3–5 times each, and record the pass/fail counts in the Result. Tests
that pass consistently in isolation are confirmed timing-flaky (the full-suite
serial timing is the cause, not preflight) and are validated by a stable
re-run at the end; any test that fails deterministically is treated as a real
preflight regression to fix, not flaky.

## Changes

- `radcn/fixtures/candidate-remix/app/styles/tailwind.css` and
  `radcn/apps/docs/app/styles/tailwind.css`: add
  `@import 'tailwindcss/preflight';` immediately after
  `@import 'tailwindcss/theme';` and before `@import 'radcn/theme.css';`
  (so preflight sits inside the Tailwind link, which the shells order before
  `radcnStyles`). Update each file's header comment (preflight no longer
  "deliberately excluded").
- `radcn/packages/radcn/src/styles/tokens.css` (and regenerated `index.ts`):
  the minimal CSS-only fix for the menubar (and any sibling) positioned-overlay
  overlap found at runtime — e.g. giving `.radcn-menubar-content`/portal
  containers an explicit `position` and/or `box-sizing` so preflight's reset
  cannot perturb their placement. The exact element(s) that receive the fix
  (`.radcn-menubar-content`, the portal-root, `.radcn-menubar-label`, or a
  combination), the specific preflight reset that caused the overlap
  (box-sizing/margin/padding), and the rule added are determined by runtime
  diagnosis and documented in the Result. If the fix touches `tokens.css`,
  regenerate `index.ts` with
  `export const radcnStyles = ${JSON.stringify(tokensCss)}\n`.
- Test files: only if the dual-suite run shows a computed-style assertion
  shifted by a preflight reset that reflects intended new behavior (documented
  per-assertion in the Result). The probe suggests none beyond the overlay
  layout fix, but this is confirmed empirically.

Expected git status for the result commit: the two `tailwind.css` files, and
(if the overlay fix needs CSS) `tokens.css` + `index.ts`, plus any documented
test updates, this experiment file, and the README index + Learnings. Both
generated CSS files stay untracked.

## Verification

From the repo root:

1. `pnpm --dir radcn/fixtures/candidate-remix styles:build` and
   `pnpm --dir radcn/apps/docs styles:build` — both exit 0; each generated CSS
   now contains preflight (e.g. the `*,::before,::after { box-sizing: border-box;
   border: 0 solid; }` reset and the heading/margin resets).
2. `pnpm radcn:typecheck`, `pnpm fixtures:candidate:typecheck`,
   `pnpm --dir radcn/apps/docs typecheck` — all pass.
3. `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts` — docs
   suite green (11 passed).
4. `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts` — fixture
   suite green (1191 passed), including the menubar test and the hover-card
   overlay tests.
5. Re-run any test that failed in an earlier pass a second time to confirm it
   is stably green (guarding against the observed overlay flakiness).
6. `git diff --check` clean; `vendor/` untouched; both generated CSS untracked;
   only the expected files changed.

Pass criteria (all must hold):

- Preflight is imported in both pipelines (ordered before `radcnStyles`); the
  generated CSS contains the reset.
- BOTH suites are green and stable on re-run; the menubar overlap is fixed by a
  recorded, minimal change; previously-migrated components (Badge/Skeleton/
  Separator/Kbd) still render correctly.
- `tokens.css`/`index.ts` byte-identical (if touched); typechecks and hygiene
  clean.

Fail criteria (any → record Partial/Fail with specifics and a narrower step):

- A regression beyond the characterized positioned-overlay cluster appears and
  cannot be resolved minimally (would indicate a larger preflight interaction
  needing its own experiment).
- The menubar overlap cannot be fixed without re-deriving overlay positioning
  broadly (escalate to a dedicated overlay-positioning experiment).
- `tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given only `AGENTS.md`, the issue README, this experiment
file, Experiments 4/6, and read access to referenced sources)

Round 1 findings:

- Major: the "hover-card failures are timing-flaky" claim rested on a single
  probe run with no statistical validation. Fixed: the design now adds an
  implementation pre-step that re-runs each probe failure in isolation 3–5×
  and records pass/fail counts, classifying flaky vs deterministic before
  relying on the characterization (and a stable end re-run validates them).
- Minor: the JS-fix escalation was ambiguous. Fixed: the design now states the
  fix is CSS-only and that if runtime diagnosis shows the JS positioning math
  itself is wrong, the experiment escalates to Fail + a dedicated experiment.
- Minor: the exact CSS fix location was unspecified. Fixed: the Result will
  document which element(s) received the fix and the specific preflight reset
  that caused the overlap.

The reviewer independently confirmed: both pipeline files currently import
theme→radcn/theme.css→utilities with no preflight; the `@import preflight`
after `theme` placement is correct; both document shells order the Tailwind
`<link>` before `radcnStyles` (so bespoke rules win ties); the menubar
hypothesis is credible (`.radcn-menubar-content` has no `position`;
`menu-overlay.ts` applies `position: fixed` from `getBoundingClientRect`, so
it is box-sizing/measurement-sensitive); the probe was reverted (clean tree);
and the dual-suite + typecheck gate and scope are appropriate.

Round 2 (re-review of the three fixes by a fresh Claude subagent): confirmed
all three resolved — the flaky-vs-deterministic pre-step (3–5× isolated runs +
recorded counts + stable end re-run), the CSS-only scope with JS-math Fail
escalation, and the Result fix-location/causal-reset documentation requirement
— and found the additions internally coherent with the verification steps and
no new blocker. Verdict: APPROVED.

Approval result: approved (round 2). No blocker findings remain.
