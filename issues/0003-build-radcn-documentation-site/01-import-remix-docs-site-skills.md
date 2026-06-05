# Experiment 1: Import Remix Docs Site Skills

## Description

Import the relevant Remix 3 agent skills into RadCN so Codex and Claude can use
Remix-native guidance while building the documentation site.

The vendored Remix repository includes agent skills under
`vendor/remix/.agents/skills/`. These skills are reference input only while
they remain inside `vendor/`; the vendor tree is ignored and should not be the
runtime source for RadCN-local skills. RadCN already has shared project-local
skills through:

```text
skills/
.codex/skills -> ../skills
.claude/skills -> ../skills
```

This experiment should import only the skills that materially help Issue 3:

- `remix` for Remix 3 app structure, routing, controllers, assets, component
  model, hydration, navigation, and testing references;
- `author-ui-modules` if its UI-module guidance is useful for RadCN examples
  and docs app primitives;
- `write-tests` only if its test guidance can be adapted without pulling in
  Remix repository-specific package assumptions.

Do not blindly copy every Remix skill. Skills such as `make-pr`, `update-pr`,
`review-pr`, `supersede-pr`, `publish-placeholder-package`, and similar
maintainer workflow skills are not part of RadCN's docs-site workflow.

The imported skills should include provenance notes that they came from the
vendored Remix source and were adapted for RadCN. If any skill is copied
verbatim, record that explicitly. If a skill is adapted, keep the Remix-specific
substance but remove instructions that are wrong for RadCN.

## Changes

Expected files:

- `skills/remix/SKILL.md`
  - Import and adapt the Remix 3 app-building skill for RadCN docs work.
  - Keep guidance about Remix 3 structure, `remix/*` subpath imports,
    `remix/ui`, routes, controllers, assets, hydration, and test strategy.
  - Add RadCN-specific notes: docs app should consume `packages/radcn`, avoid
    fixture-only shortcuts, and use Issue 3 experiments.
- `skills/author-ui-modules/SKILL.md`
  - Import only if useful after review.
  - Adapt language from Remix `packages/ui` internals to RadCN component/docs
    examples where applicable.
- `skills/write-tests/SKILL.md`
  - Import only if useful after review.
  - Adapt validation commands and dependency guidance to this repo's `pnpm`
    scripts and Playwright fixture harness.
- `AGENTS.md`
  - Add a short policy for Remix-origin skills: use `remix` when building or
    reviewing the docs app; prefer RadCN repo commands and issue workflow over
    upstream Remix maintainer workflows.
- `CLAUDE.md`
  - Preserve the existing compatibility policy. If `CLAUDE.md` is a symlink,
    no separate edit should be needed.
- `issues/0003-build-radcn-documentation-site/README.md`
  - Update experiment status after result.

Implementation should copy files into `skills/`, not symlink to
`vendor/remix`, because `vendor/` is ignored and local checkouts should not be
required for skills to work.

## Verification

The experiment passes if:

1. RadCN has local Remix 3 skill guidance in `skills/` that works through both
   `.codex/skills` and `.claude/skills`.
2. Imported skills include clear provenance and RadCN-specific adaptation notes.
3. No symlink points from `skills/` into `vendor/remix`.
4. Maintainer-only Remix workflow skills are not imported unless the experiment
   records a concrete RadCN use for them.
5. `AGENTS.md` documents when to use the imported Remix-origin skills.
6. `CLAUDE.md` remains compatible with `AGENTS.md`.
7. The experiment result records exactly which skills were imported, skipped,
   adapted, or copied verbatim.
8. `git diff --check` passes.
9. `git status --short -- vendor` returns no output.
10. Independent completion review approves the imported skill set, or findings
    are fixed and recorded.

This experiment does not scaffold the docs app. It prepares the agent guidance
needed before the docs app experiments begin.

## Design Review

Independent AI design review was performed by subagent `Raman` and returned
**Pass**.

Raman confirmed:

- the design imports only docs-site-relevant candidates and explicitly rejects
  broad copying;
- maintainer workflow skills such as PR and publish skills are excluded;
- imported skills must be local copies in `skills/`, not symlinks into ignored
  vendor source;
- the plan aligns with RadCN's shared `.claude/skills` and `.codex/skills`
  symlinks;
- the upstream `remix` skill is relevant to docs-site app work because it
  covers Remix 3 routes, controllers, assets, hydration, UI, and tests;
- `author-ui-modules` and `write-tests` are appropriately conditional because
  they contain Remix-repository-specific assumptions that need adaptation before
  use in RadCN;
- verification covers provenance, no vendor symlinks, skipped/imported/adapted
  records, AGENTS policy, vendor cleanliness, and completion review.

## Result

**Result:** Pass

Experiment 1 imported and adapted the Remix-origin skills needed before docs
site implementation begins.

Imported:

- `skills/remix/SKILL.md`
  - Adapted from `vendor/remix/.agents/skills/remix/SKILL.md`.
  - Keeps Remix 3 app guidance for routes, controllers, middleware, assets,
    hydration, navigation, `remix/ui`, and tests.
  - Adds RadCN-specific docs-site policy: consume `packages/radcn`, avoid
    fixture-only shortcuts, follow Issue 3 experiments, and prefer RadCN repo
    commands.
- `skills/remix/references/`
  - Copied from the vendored Remix `remix` skill so the local skill works
    without the ignored `vendor/` checkout.
  - These reference files are copied as upstream Remix reference material and
    are reached selectively from the adapted `skills/remix/SKILL.md`.
- `skills/author-ui-modules/SKILL.md`
  - Adapted from the vendored Remix `author-ui-modules` skill.
  - Narrowed from Remix internal `packages/ui` module work to RadCN docs UI,
    examples, host-element behavior, and Remix UI-style state ownership.
- `skills/write-tests/SKILL.md`
  - Adapted from the vendored Remix `write-tests` skill.
  - Replaces upstream Remix package-runner assumptions with RadCN commands:
    `pnpm radcn:typecheck`, fixture typechecks, focused Playwright specs,
    `pnpm fixtures:artifacts`, and future `apps/docs` checks.

Skipped:

- `add-package`
- `fix-issue`
- `make-changes`
- `make-decision-doc`
- `make-demo`
- `make-pr`
- `publish-placeholder-package`
- `review-pr`
- `supersede-pr`
- `typescript-expert`
- `update-pr`
- `write-api-docs`
- `write-readme`
- `write-ui-module-readme`

These were skipped because they are upstream Remix maintainer workflow,
package-management, PR, publishing, or broad repository skills without a
concrete RadCN docs-site need in this experiment.

`AGENTS.md` now documents when to use the imported Remix-origin skills and
explicitly says to prefer RadCN repository commands, Issue 3 experiment
requirements, and this repo workflow over upstream Remix maintainer workflows.

No skill symlinks point into `vendor/remix`. `.codex/skills` and
`.claude/skills` remain symlinks to `../skills`, and `CLAUDE.md` remains a
symlink to `AGENTS.md`.

Verification passed:

- `find skills -type l -ls` returned no skill-local symlinks.
- `ls -l .codex/skills .claude/skills CLAUDE.md` confirmed the existing
  compatibility symlinks.
- `git diff --check`
- `git status --short -- vendor` returned no output.

## Conclusion

RadCN now has local Remix 3 docs-site skill guidance available to both Codex and
Claude. The next experiment can use the `remix` skill to design or scaffold the
Remix 3 documentation app.

## Completion Review

Independent AI completion review was performed by subagent `Raman` and returned
**Pass**.

Raman confirmed:

- local `remix`, `author-ui-modules`, and `write-tests` skills include
  provenance and RadCN adaptation notes;
- `remix` is scoped to `apps/docs`, RadCN package imports, Issue 3 experiments,
  and RadCN commands instead of upstream maintainer commands;
- `author-ui-modules` is narrowed from Remix internals to RadCN docs UI and
  examples, and explicitly avoids component forks;
- `write-tests` replaces upstream runner assumptions with RadCN typecheck,
  fixture, Playwright, and artifact commands;
- `AGENTS.md` documents when to use Remix-origin skills and rejects upstream
  PR, publish, and repository-maintenance workflows without a future
  experiment;
- `CLAUDE.md`, `.codex/skills`, and `.claude/skills` compatibility symlinks are
  intact;
- no skill-local symlinks exist, and imported Remix references are regular
  local files under `skills/remix/references/`;
- the experiment result records imported skills, copied references, skipped
  maintainer skills, verification, and conclusion;
- Issue 3 marks Experiment 1 as `Pass`.

No blocker findings remained.
