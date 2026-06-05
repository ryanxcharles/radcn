# Experiment 2: Create Nested RadCN Workspace and Docs App

## Description

Create a nested `radcn/` pnpm workspace for all JavaScript, TypeScript, and
pnpm-managed RadCN code, then use the official Remix 3 CLI scaffold path to
create the initial docs app inside that workspace.

The repository root remains the source-control and issue/process root. It keeps
`AGENTS.md`, `CLAUDE.md`, `issues/`, `skills/`, `scripts/`, `docs/`, and
`vendor/`. The `vendor/` directory is reference-only and must stay outside the
pnpm workspace so pnpm cannot discover, link, install, or typecheck vendor
packages.

The new `radcn/` folder becomes the pnpm workspace root for project code:

```text
radcn/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── apps/
│   └── docs/
├── fixtures/
└── packages/
    └── radcn/
```

The upstream Remix 3 README documents:

```sh
npx remix@next new my-remix-app
```

The pnpm equivalent, run from the new `radcn/` workspace root, is:

```sh
pnpm dlx remix@next new apps/docs
```

This experiment should prefer the CLI over manually copying
`vendor/remix/template` because the CLI is the canonical setup path. It may
apply template substitutions, package metadata, dependency versions, generated
files, install prompts, or other setup logic that a direct copy would miss.

The goal is not to design the finished documentation site yet. The goal is to
prove that RadCN can isolate pnpm-managed code under `radcn/`, keep `vendor/`
invisible to pnpm, and create/run a Remix 3 docs app from the same setup path
recommended by Remix 3 itself.

## Changes

- `radcn/`
  - Create the nested pnpm workspace root.
  - Move all TypeScript, JavaScript, and pnpm-managed project code into this
    folder.
  - Move the current root `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`,
    `packages/`, and `fixtures/` into `radcn/`.
  - Keep repo-process and reference material at the repository root:
    `AGENTS.md`, `CLAUDE.md`, `.codex/`, `.claude/`, `skills/`, `issues/`,
    `scripts/`, `docs/`, and `vendor/`.
  - Preserve generated artifacts only if they are intentionally part of the
    pnpm-managed project; otherwise leave non-code historical docs at the root.
- `radcn/pnpm-workspace.yaml`
  - Include `apps/*`, `packages/*`, and `fixtures/*`.
  - Do not include `vendor/` or any path beneath `../vendor/`.
- `radcn/package.json`
  - Keep this as the pnpm workspace root package, not as the docs webapp.
  - Update scripts so they reference paths relative to `radcn/`.
  - Ensure existing package/fixture commands still address the moved code.
- `radcn/packages/radcn/`
  - Preserve the component library package and its package name/exports.
  - Replace dependencies on vendored Remix workspace packages with a published
    or cataloged Remix dependency that does not resolve through `vendor/`.
- `radcn/fixtures/`
  - Preserve the existing comparison fixtures under the nested workspace.
  - Update path assumptions and scripts as needed after the move.
- `radcn/apps/docs/`
  - Run `pnpm dlx remix@next new apps/docs` from `radcn/`.
  - If the CLI refuses a nested path, run it in a temporary sibling location and
    move the generated app into `radcn/apps/docs` without changing generated
    source semantics.
  - Keep the generated app shape as close to the CLI output as possible.
  - Ensure the generated app is committed as normal RadCN workspace source, not
    as a nested git repository. If the CLI creates `radcn/apps/docs/.git`,
    remove only that nested metadata after recording the behavior.
- Root `package.json`, `pnpm-workspace.yaml`, and `pnpm-lock.yaml`
  - Remove these from the repository root as pnpm-owned files after moving them
    into `radcn/`.
  - The repository root must not be the webapp package root or pnpm workspace
    root after this experiment.
- `issues/0003-build-radcn-documentation-site/README.md`
  - Add a `## Learnings` section if it does not exist, then record setup
    learnings if the CLI exposes requirements or constraints that later
    docs-site experiments must know.
- `issues/0003-build-radcn-documentation-site/02-scaffold-docs-app-with-remix-cli.md`
  - Record the exact command used, any prompts or deviations, verification
    output, resolved Remix CLI/package version, result, conclusion, and
    completion review.

Do not build the RadCN landing page in this experiment. A minimal generated
homepage is acceptable if the nested workspace, published Remix dependency
resolution, and docs app runtime work.

## Verification

The experiment passes when all of these are true:

- The repository root no longer contains pnpm-owned `package.json`,
  `pnpm-workspace.yaml`, or `pnpm-lock.yaml`.
- The nested pnpm workspace exists at `radcn/`.
- All TypeScript, JavaScript, and pnpm-managed project code lives under
  `radcn/`.
- `radcn/pnpm-workspace.yaml` includes `apps/*`, `packages/*`, and `fixtures/*`.
- `radcn/pnpm-workspace.yaml` does not include `vendor/` or `../vendor/`.
- `pnpm list -r --depth -1`, run from `radcn/`, does not list any package from
  `../vendor`.
- `radcn/pnpm-lock.yaml` contains no vendor workspace importer, package path, or
  link references.
- The docs app exists at `radcn/apps/docs`.
- The app was created by the Remix CLI path or by a documented fallback that
  preserves the generated CLI output.
- The generated app uses Remix 3 app conventions such as `app/routes.ts`,
  `app/router.ts`, route actions/controllers, server rendering middleware, and
  browser asset entrypoints.
- The repository has workspace wiring sufficient to install and run the docs
  app from `radcn/`.
- `radcn/apps/docs/.git` does not exist after setup.
- The docs app can run on a documented port that does not conflict with the
  comparison fixtures. Prefer an explicit docs port such as `5175` if the
  scaffold supports it.
- A browser request to the running app returns the generated homepage.
- Typecheck and/or build commands are recorded. If the generated scaffold does
  not provide one of these commands, record that as a learning instead of
  inventing broad infrastructure.
- The resolved Remix CLI/package version used by `remix@next` is recorded in
  the result.
- Any differences between the CLI output and `vendor/remix/template` that
  matter for future work are recorded in the issue learnings.
- Existing RadCN package and fixture typecheck commands still run from the
  nested workspace or any failures are recorded with a clear follow-up if they
  are unrelated to the workspace move.
- `git diff --check` passes.
- `git status --short -- vendor` confirms this experiment did not modify
  ignored vendor checkouts.
- A separate AI agent reviews the completed experiment result before the result
  commit or any next experiment design.

Setup command:

```sh
mkdir radcn
mv package.json pnpm-workspace.yaml pnpm-lock.yaml packages fixtures radcn/
cd radcn
pnpm dlx remix@next new apps/docs
```

Suggested post-setup verification commands:

```sh
cd radcn
pnpm install
pnpm list -r --depth -1
! rg '(^\s+vendor/|\.\./vendor|link:.*vendor)' pnpm-lock.yaml
pnpm radcn:typecheck
pnpm fixtures:candidate:typecheck
pnpm fixtures:reference:typecheck
pnpm --dir apps/docs typecheck
PORT=5175 pnpm --dir apps/docs start
curl -I http://localhost:5175/
test ! -e apps/docs/.git
test ! -e ../package.json
test ! -e ../pnpm-workspace.yaml
test ! -e ../pnpm-lock.yaml
git diff --check
git -C .. status --short -- vendor
```

If the generated scripts differ, use the generated scripts and record the exact
commands.

## Design Review

This experiment was originally designed as a docs-app-only scaffold. On
2026-06-05, the experiment was revised before implementation to also create a
nested `radcn/` pnpm workspace and move all pnpm-managed code into it, keeping
`vendor/` outside pnpm visibility.

Initial fallback review was performed by Codex subagent `Raman` on 2026-06-05.
That review reused an existing agent thread because the subagent pool was full,
so it was not a fresh-context adversarial review.

Findings:

- The original design did not explicitly include repository hygiene gates or
  completion review in verification.
- The original design did not guard against the CLI creating a nested git
  repository under `apps/docs`.
- The original design mixed the one-time setup command with post-setup
  verification commands.
- The original design did not explicitly require recording the resolved
  `remix@next` version.

Resolution:

- Added explicit verification for `git diff --check`, vendor status, completion
  review, absence of `apps/docs/.git`, and resolved CLI/package version.
- Split the scaffold command from post-setup verification commands.
- Raman approved the fixed design for the plan commit.

Fresh-context adversarial review was performed by Codex subagent `Ampere` on
2026-06-05 with `fork_context: false`.

Findings:

- **Minor:** The previous design review record did not state fresh-context
  status.

Resolution:

- Recorded the earlier Raman review as a non-fresh fallback review and recorded
  this fresh-context Codex adversarial review separately.
- Ampere approved the experiment design.

Revised design review was performed by Codex subagent `Jason` on 2026-06-05
with fresh context.

Findings:

- **Major:** Vendor invisibility verification did not explicitly check the
  moved lockfile for stale `vendor` or `../vendor` references.

Resolution:

- Added a pass/fail criterion requiring `radcn/pnpm-lock.yaml` to contain no
  vendor workspace importer, package path, or link references.
- Added the suggested verification command
  `! rg '(^\s+vendor/|\.\./vendor|link:.*vendor)' pnpm-lock.yaml`, run from
  `radcn/`.
- Jason re-reviewed the fix and approved the revised experiment design.
