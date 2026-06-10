# Experiment 13: Align Issue 5 install-flow docs with Tailwind-required

## Description

Issue 6's completion criteria require that "Issue 5's installation-flow
documentation reflects Tailwind as required." Issue 5
(`issues/0005-local-installation-flow/`) is open with no experiments yet, and
its README predates Issue 6's Tailwind decision: it currently treats Tailwind
as optional/deferred. Two passages contradict the now-established requirement:

- ShadCN Install Findings: "Tailwind config updates are part of shadcn, but
  RadCN should only carry Tailwind-specific fields forward if a component or
  docs requirement actually needs them." (Tailwind is now always needed.)
- Decisions: "RadCN should carry forward only config fields that make sense for
  Remix 3. Omit or reinterpret shadcn fields such as `rsc`, Tailwind-specific
  fields, and icon-library defaults unless an experiment records a concrete
  Remix 3 need for them." (Tailwind-specific fields are now required, not
  conditional.)

Issue 6 has decided (and proven across Experiments 1–12): Tailwind v4 is
required; components emit Tailwind utilities; the package declares `tailwindcss`
as a peer dependency; and `components.json` should retain Tailwind configuration
fields adapted for Remix 3 and Tailwind v4. This experiment updates Issue 5's
README so its install-flow assumptions match, with clear attribution to Issue
6 (avoiding a contradiction between the two open issues).

This is a documentation-only experiment: it edits one open issue's spine. It
does not implement the install flow (that is Issue 5's own work) — it records
the Tailwind-required constraint that flow must honor.

## Changes

- `issues/0005-local-installation-flow/README.md`:
  - In the install-findings passage, replace the conditional Tailwind sentence
    with: Tailwind v4 is required for RadCN (per Issue 6), so the install flow
    assumes the target project has Tailwind v4 and the generated
    `components.json` carries the Tailwind configuration fields adapted for
    Remix 3 and Tailwind v4; the registry/components declare Tailwind as a
    required peer.
  - In Decisions, remove "Tailwind-specific fields" from the "omit/reinterpret
    unless a concrete need" list, and add a Decision: "Tailwind v4 is a
    required peer for installed RadCN components (Issue 6). `components.json`
    retains the Tailwind configuration fields (adapted for Remix 3 + Tailwind
    v4), and `radcn init` must assume/verify Tailwind v4 in the target."
  - Optionally note in Key Questions or Architecture that `radcn init` should
    surface a clear error if the target lacks Tailwind v4 (the install-flow
    expression of Issue 6's "fail loudly if Tailwind is absent" criterion),
    leaving the implementation to Issue 5.
  - Attribute the edits to Issue 6 (e.g. "(per Issue 6)") so the cross-issue
    provenance is explicit.
  - Preserve the reserved frontmatter (`status = "open"`, `opened`); do not
    change status or add experiments to Issue 5.

No code, fixture, or test changes. No change to `issues/README.md` (the index
reflects issue status/title, which are unchanged), so no index rebuild is
needed.

## Verification

1. `issues/0005-local-installation-flow/README.md` no longer contains the
   conditional/deferred Tailwind language; it states Tailwind v4 is required
   and `components.json` retains Tailwind fields, attributed to Issue 6.
2. The edits do not contradict Issue 6's Decisions (Tailwind required, Tailwind
   v4, `components.json` retains Tailwind fields) — cross-read both.
3. Issue 5's frontmatter still has `status = "open"` and `opened`; no
   experiments were added to Issue 5; its goal/scope are otherwise intact.
4. `scripts/build-issues-index.sh` output (`issues/README.md`) is unchanged by
   this edit (issue title/status unchanged) — confirm the index does not need
   regeneration, or regenerate and confirm no diff.
5. `git diff --check` clean; only `issues/0005-.../README.md` plus this Issue 6
   experiment file and the Issue 6 README index/Learnings change; `vendor/`
   untouched.

Pass criteria: Issue 5's README reflects Tailwind v4 as required (consistent
with Issue 6), with attribution; Issue 5 frontmatter/scope otherwise intact;
no index regeneration needed; hygiene clean.

Fail criteria: the edit contradicts Issue 6's decisions; alters Issue 5 status
or adds experiments to it; the issues index would need regeneration and does
not match.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, both issue READMEs, and this experiment
file)

Findings: one Minor, no Blocker/Major.

- Minor: the proposed "`radcn init` must assume/verify Tailwind v4" wording is
  slightly prescriptive of HOW Issue 5 implements. Implementation will phrase
  it as a constraint ("the install flow must require Tailwind v4 and fail
  loudly if the target lacks it"), leaving the mechanism to Issue 5.

The reviewer confirmed: Issue 5 is open (editable; immutability applies only to
closed issues) and the edit preserves its reserved frontmatter, status, and
adds no experiments to it; the planned language faithfully matches Issue 6's
decisions (Tailwind required, v4, `components.json` retains Tailwind fields,
peer dependency) without overreaching into Issue 5's implementation choices;
the exact contradictory passages (Issue 5 install-findings ~92-94 and Decisions
~120-122) are targeted without collateral edits; editing the README body does
not change `issues/README.md` (generated from frontmatter), so no index rebuild
is needed; attribution to Issue 6 is explicit; and the doc-experiment
verification is adequate. Verdict: APPROVED.

Approval result: approved with no blockers (minor phrasing folded into
implementation).
