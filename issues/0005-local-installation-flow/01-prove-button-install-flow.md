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

## Result

**Result:** Pass

Experiment 1 implemented the local Button installation proof without publishing
RadCN to npm.

The implementation added a private workspace CLI package with a `radcn` bin, a
private local registry package, and a disposable Remix 3 install-target fixture.
The root `radcn` script now runs the local CLI. `radcn init --cwd
radcn/fixtures/install-target --yes` writes `components.json`; `radcn add
button --cwd radcn/fixtures/install-target --yes` resolves the local registry,
installs the generated theme, utility helper, and Button source into the target
app; and a repeated `add button` skips unchanged files.

Generated install-target files are intentionally ignored:

- `components.json`
- `app/styles/radcn-theme.css`
- `app/lib/utils/classes.ts`
- `app/components/ui/button.tsx`
- `app/assets/tailwind.generated.css`

The checked-in fixture route imports `Button` from
`../components/ui/button.tsx`, so the target typecheck and render test pass only
after the local install flow has generated target-owned source. The generated
Button imports its generated utility helper from `../../lib/utils/classes.ts`
and does not import `radcn/button`.

Verification was run with `npm exec --yes pnpm@11.5.2 -- ...` because this
machine does not have a global `pnpm` binary. The commands exercised the pinned
pnpm version from `packageManager`.

Verification evidence:

- `npm exec --yes pnpm@11.5.2 -- install --frozen-lockfile` passed.
- Clean generated state reset, then `npm exec --yes pnpm@11.5.2 -- radcn init
  --cwd radcn/fixtures/install-target --yes` passed and wrote
  `components.json`.
- `npm exec --yes pnpm@11.5.2 -- radcn add button --cwd
  radcn/fixtures/install-target --yes` passed and wrote
  `app/styles/radcn-theme.css`, `app/lib/utils/classes.ts`, and
  `app/components/ui/button.tsx`.
- Re-running the same `add button` command passed and skipped the unchanged
  generated files.
- `npm exec --yes pnpm@11.5.2 -- --dir radcn/fixtures/install-target
  typecheck` passed.
- `npm exec --yes pnpm@11.5.2 -- --dir radcn/fixtures/install-target
  styles:build` passed and emitted Tailwind output containing Button utilities.
  It printed the existing Remix/Node `module.register()` deprecation warning.
- `npm exec --yes pnpm@11.5.2 -- --dir radcn/fixtures/install-target test`
  passed. The fixture test resets generated output, runs `init`, runs
  `add button`, verifies deterministic rerun skip behavior, verifies unsafe
  alias writes are refused, builds Tailwind with the local Tailwind binary, and
  renders the installed Button route.
- `npm exec --yes pnpm@11.5.2 -- radcn:typecheck` passed.
- `git diff --check` passed.
- Vendor cleanliness check found no nested git checkouts at
  `vendor/shadcn-ui`, `vendor/remix`, or `vendor/react-router` on this
  machine, so there was no vendor worktree state to inspect.

An earlier verification attempt ran target typecheck/style checks in parallel
with the clean-state fixture test. That was invalid because the fixture test
resets generated files at startup; serial reruns after generation passed.

## Conclusion

The local installation model is proven for the first Button slice. RadCN can now
initialize a Remix 3 target app, write a shadcn-style `components.json`, resolve
a local structured registry item with recursive dependencies, copy
target-owned source, enforce safe write targets, require Tailwind v4 in the
target, compile the installed Button utilities, and render the installed Button
without publishing to npm.

Durable decisions from this experiment:

- Default install paths for the local proof are:
  - components: `app/components`
  - UI components: `app/components/ui`
  - utilities: `app/lib/utils`
  - hooks: `app/hooks`
  - Tailwind source: `app/styles/tailwind.css`
- Local registry addressing is recorded in `components.json` as
  `workspace:@radcn/registry/{name}` for this pre-publication proof.
- Generated output is not checked into the install target; tests reset and
  regenerate it to prove the clean install flow.
- Publication remains a later distribution issue. The remaining publication
  work is to choose public package names, host or publish registry data, and
  translate the local workspace registry address into a public registry source
  without changing the user-facing `radcn init` / `radcn add button` command
  shape.

## Completion Review

Reviewer: Codex subagent `Galileo` / `Cairn`.

Fresh context: yes (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Review notes:

- The reviewer verified the workflow contract, completed experiment record,
  Issue 5 README, issue index, package metadata, diff, ignored/generated state,
  vendor state, and relevant CLI, registry, and fixture files.
- The reviewer confirmed the result commit had not been made before completion
  review.
- The reviewer confirmed generated fixture outputs were ignored and not commit
  candidates.

Approval: approved with no blockers.
