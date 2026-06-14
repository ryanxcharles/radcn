# Experiment 1: Prove the Button install flow

## Description

Build the smallest local proof that RadCN can behave like shadcn/ui without
publishing to npm: a local `radcn init` command writes `components.json` into a
disposable Remix 3 target app, and a local `radcn add button` command installs
Button source into that target app from a local registry item.

This experiment should prove the contract, not the entire component catalog.
Button is the first component because it exercises the key installation shape:
component source, a shared utility dependency, Tailwind utility classes, target
aliases, deterministic file writes, and a rendered route that imports from
target-owned generated source.

The install-target fixture must act like a consumer app. It may live in the
workspace so local commands and tests can run before npm publication, but its
rendered Button route must import from generated files inside the target app,
not from `radcn/button`.

## Changes

- `radcn/packages/cli/`
  - Add a local, private workspace CLI package with a `radcn` bin.
  - Implement minimal `init` and `add` command parsing for:
    - `radcn init --cwd <target> --yes`
    - `radcn add button --cwd <target> --yes`
  - Keep unsupported flags out of scope except for clear errors when they are
    provided.
- `radcn/packages/cli/src/config.*`
  - Write and read a Remix-oriented `components.json`.
  - Validate TypeScript-only output, required aliases, Tailwind v4 fields, and
    local registry configuration.
  - Resolve write targets from the target app root and refuse paths outside the
    target or inside `vendor/`.
- `radcn/packages/registry/`
  - Add a local, private workspace registry package or data directory.
  - Define a minimal structured registry item schema for this proof.
  - Add registry items for `button` and any required utility dependency such as
    `utils/classes`.
  - Store copied-source templates that can be installed into a consumer app
    without importing `radcn/button`.
- `radcn/fixtures/install-target/`
  - Add a disposable Remix 3 target app with TypeScript and Tailwind v4.
  - Keep it distinct from the docs app and the candidate parity fixture.
  - Add a route that renders the installed Button from target-owned source.
  - Add scripts for typecheck, Tailwind style build, and install-flow tests.
- Root workspace metadata
  - Add any package scripts needed to run the local install-flow proof from the
    repository root.
  - Keep workspace globs explicit and avoid enrolling `vendor/`.
- Tests
  - Add deterministic install-flow tests that run from a clean target state.
  - Verify `init` writes the expected `components.json`.
  - Verify `add button` writes Button and utility source to safe targets.
  - Verify rerunning `add button` is deterministic: unchanged files are skipped
    or overwrite behavior is explicit and covered.
  - Verify the target app typechecks, builds Tailwind output, and renders the
    installed Button through browser or route-level coverage.

## Verification

Pass criteria:

- `pnpm install --lockfile-only` or the equivalent lockfile update command
  succeeds if workspace packages or dependencies change.
- `pnpm radcn init --cwd radcn/fixtures/install-target --yes` writes a valid
  `components.json` without npm publication.
- `pnpm radcn add button --cwd radcn/fixtures/install-target --yes` resolves
  the local registry, installs Button and its utility dependency, and does not
  read from or install from `vendor/`.
- Re-running `pnpm radcn add button --cwd radcn/fixtures/install-target --yes`
  is deterministic and reports or proves unchanged-file behavior.
- `pnpm --dir radcn/fixtures/install-target typecheck` passes.
- `pnpm --dir radcn/fixtures/install-target styles:build` passes and emits
  Tailwind output containing the installed Button utilities.
- The install-target render test passes and proves the route imports Button
  from target-owned generated source.
- The result records durable learnings in this experiment or the issue README:
  discovered Remix 3 install paths, the local registry addressing choice,
  generated-output behavior, and any remaining publication follow-up.
- `pnpm radcn:typecheck` passes.
- `git diff --check` passes.
- Vendor checkout cleanliness is verified with `git -C vendor/shadcn-ui status
  --short`, `git -C vendor/remix status --short`, and
  `git -C vendor/react-router status --short` if those checkouts exist.

Fail criteria:

- The target app renders Button only through package imports such as
  `radcn/button`.
- The proof requires RadCN to be published to npm.
- Generated files can escape the target app root or write into `vendor/`.
- The proof relies only on manual browser inspection.
- Tailwind v4 is not required or the installed Button utilities are not
  compiled by the target app.

## Design Review

Reviewer: Codex subagent `Volta` / `Fresh Context Install Plan Review`.

Fresh context: yes (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: verification did not explicitly require recording durable learnings
  back into the issue record.

Fixes:

- Added a pass criterion requiring the result to record discovered Remix 3
  install paths, the local registry addressing choice, generated-output
  behavior, and remaining publication follow-up.

Approval: approved with no blockers.

Re-review:

- Reviewer confirmed the prior minor finding is resolved and no new blocker was
  introduced.
- Approval: approved with no blockers.
