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
