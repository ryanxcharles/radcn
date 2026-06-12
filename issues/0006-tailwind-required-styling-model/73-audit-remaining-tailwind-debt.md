# Experiment 73: Audit remaining Tailwind debt

## Description

Experiment 72 cleared the overlay trigger/close cluster, but Issue 6 is still
open and the previous "remaining" maps are stale. This experiment performs a
fresh, current-state audit of every remaining style rule that can affect RadCN
components, docs, or fixtures.

The goal is not to migrate styles yet. The goal is to produce an authoritative
inventory that separates:

- required theme/token rules;
- behavior or positioning glue that should intentionally remain bespoke;
- component visual styling that must still move into Tailwind utilities;
- docs/fixture/demo styling that should move out of package `tokens.css` or into
  Tailwind-scanned call sites;
- obsolete comments or historical maps that now mislead future experiments.

The audit result will determine whether Issue 6 can be closed after a small
cleanup, or which final migration clusters remain before closure.

## Changes

- `issues/0006-tailwind-required-styling-model/73-audit-remaining-tailwind-debt.md`:
  record the audit method, inventory, result, and conclusion.
- `issues/0006-tailwind-required-styling-model/README.md`: add this experiment
  to the experiment index as `Designed`; after the audit, copy durable findings
  into `## Learnings` and update stale remaining-debt guidance.

No source migration is part of this experiment. If the audit finds concrete
style debt, the next experiment will migrate one coherent cluster with its own
plan/review/commit cycle.

## Verification

Audit commands and checks:

1. Enumerate remaining package style selectors and at-rules:
   `rg -n "^\\.|^\\[data-radcn|^@media|^@keyframes|radcn-[a-z0-9-]+" radcn/packages/radcn/src/styles/tokens.css`.
2. Confirm `tokens.css` and `radcn/packages/radcn/src/styles/index.ts` are in
   sync with the repository's JSON-stringify formula.
3. Search component, docs, and fixture usage for each remaining visual selector
   family before classifying it:
   `rg -n "<selector-or-marker>" radcn/packages/radcn/src/components radcn/apps/docs/app radcn/fixtures/candidate-remix/app`.
4. Classify every remaining rule group as one of:
   - `Theme/token foundation`
   - `Intentional behavior/layout glue`
   - `Component Tailwind migration debt`
   - `Docs/fixture/demo Tailwind migration debt`
   - `Obsolete or stale documentation`
5. For every `Component Tailwind migration debt` and
   `Docs/fixture/demo Tailwind migration debt` group, identify:
   - owner files;
   - whether the migration is component-emitted, consumer-site, or both;
   - likely verification tests;
   - whether it can be safely grouped with another debt item.
6. Run hygiene checks:
   - `git diff --check`;
   - `git status --short`;
   - `git diff --name-only | rg '^vendor/'` must produce no matches.

Pass criteria:

- The experiment result contains a complete current-state inventory of remaining
  style rule groups in `tokens.css`.
- The inventory distinguishes closure-acceptable bespoke behavior from actual
  Tailwind migration debt.
- The Issue 6 README Learnings section records durable audit findings and
  removes or supersedes stale remaining-debt claims.
- No source migration occurs in this experiment.
- Hygiene checks pass and vendor is untouched.

Fail criteria:

- Any remaining rule group cannot be classified from current evidence.
- The audit relies on the stale post-Experiment-69 map instead of current code.
- The audit silently treats visual component styling as acceptable bespoke CSS
  without a Remix 3 behavior/layout reason.
- The experiment starts migrating source styles before the audit is concluded.

## Design Review

Reviewer: Feynman (`019ebe11-2d6e-7052-9a3f-ef3899ca502c`), fresh Codex
subagent with `fork_context: false`.

Findings: none.

Approval result: approved. The reviewer confirmed the issue README links the
experiment as `Designed`, the experiment has the required Description, Changes,
Verification, and Design Review sections, the scope is audit-only and narrow
enough for one experiment, verification includes concrete classification and
hygiene checks, vendor cleanliness is covered, and durable learnings must be
copied back into the Issue 6 README.
