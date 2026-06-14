+++
status = "closed"
opened = "2026-06-06"
closed = "2026-06-14"
+++

# Issue 5: Build the RadCN Local Installation Flow

## Goal

Implement and prove a shadcn-style RadCN installation flow locally, without
publishing RadCN to npm yet.

The result should let a TypeScript target Remix 3 project initialize RadCN
configuration, install specific RadCN components such as Button from a local
registry, and use those installed components from project-local source files in
the same spirit as shadcn/ui.

## Background

shadcn/ui is not primarily consumed as a normal component runtime package.
Instead, it combines:

- a CLI package, run with commands such as `shadcn init` and
  `shadcn add button`;
- a registry of component payloads;
- a project configuration file, `components.json`, that tells the CLI where
  CSS, components, utilities, hooks, aliases, and registries live;
- generated/copied component source files owned by the consuming application.

RadCN should follow that same model where it makes sense for Remix 3. Publishing
the eventual RadCN CLI or registry package to npm is explicitly out of scope for
this issue. This issue should prove the workflow locally first.

The local proof may use workspace commands, local package paths, packed tarballs,
or a local registry file/server, as long as the behavior proves the real
installation model without depending on public npm publication.

Publishing to npm is not the critical next puzzle piece. The critical work is
to prove the installation contract locally first, so publication later becomes a
distribution problem instead of a place where unresolved CLI, registry, config,
and generated-source decisions surface for the first time.

The proof should have two layers:

1. A disposable consumer app that behaves like an outside user's Remix 3
   project. This app should start without copied RadCN component source, then
   receive generated config and components through the local CLI.
2. Automated install verification that can be repeated from a clean state. The
   verification should run the local `radcn init` and `radcn add button`
   commands, typecheck the target app, build its Tailwind output, and render a
   route that imports Button from the target app's own generated source.

Manual browser testing is useful as a sanity check, but it is not the durable
proof. The durable proof is a fixture plus deterministic commands and tests
that can run before RadCN is published anywhere.

## ShadCN Reference Findings

The vendored shadcn CLI lives at `vendor/shadcn-ui/packages/shadcn/src/`.
Issue work should use it as the behavioral reference, but must not depend on
the vendored source at runtime.

The shadcn command model is:

- `shadcn init [components...]` initializes a project, writes
  `components.json`, and can immediately install requested components.
  Important options include `--cwd`, `--yes`, `--defaults`, `--force`,
  `--template`, `--base`, `--css-variables`, and reinstall controls.
- `shadcn add [components...]` installs registry items into an initialized
  project. Important options include `--cwd`, `--yes`, `--overwrite`, `--all`,
  `--path`, `--dry-run`, `--diff`, and `--view`.
- `add` can detect a missing config and offer to run `init`, but the RadCN
  local proof can start with explicit `init` followed by explicit `add`.

The shadcn config model is:

- The config file is `components.json`. shadcn uses `cosmiconfig("components")`
  but restricts search to `components.json`, so using that filename is the
  most compatible default for RadCN unless an experiment proves a concrete
  reason to diverge.
- The raw config includes `style`, `rsc`, `tsx`, `tailwind`, `iconLibrary`,
  `rtl`, menu options, `aliases`, and `registries`.
- The required alias fields are `components` and `utils`; optional aliases are
  `ui`, `lib`, and `hooks`. Resolved paths are derived from `tsconfig.json` or
  package imports and are not written into `components.json`.
- Registry aliases must be named with an `@` prefix and point to a URL pattern
  containing `{name}`. shadcn also supports an object form with URL, params,
  and headers.

The shadcn registry model is:

- Registry items are validated structured JSON, not arbitrary file manifests.
- Relevant item fields include `name`, `type`, `dependencies`,
  `devDependencies`, `registryDependencies`, `files`, `css`, `cssVars`,
  `envVars`, `meta`, `docs`, and `categories`.
- Relevant item types for the RadCN proof are likely `registry:ui`,
  `registry:lib`, `registry:hook`, `registry:file`, `registry:style`, and
  `registry:base`. Blocks and charts are outside RadCN's current component
  scope.
- `registry:file` and `registry:page` require explicit file targets; other item
  types can derive targets from aliases.

The shadcn install model is:

- Component names resolve through the configured registry, local files, URLs,
  GitHub item addresses, namespaced registry aliases, or the default shadcn
  registry path.
- `registryDependencies` are resolved recursively, then merged and
  deduplicated into a single installation tree.
- Installation updates package dependencies, environment variables, files, and
  CSS. Tailwind config updates are part of shadcn, and for RadCN they are
  required: Issue 6 established that Tailwind v4 is mandatory (components emit
  Tailwind utilities and the package declares `tailwindcss` as a peer
  dependency). The install flow therefore assumes the target project has
  Tailwind v4, the generated `components.json` carries the Tailwind
  configuration fields adapted for Remix 3 and Tailwind v4, and registry items
  declare Tailwind as a required peer.
- File writes validate safe targets, derive paths from config aliases, skip
  unchanged files, and require explicit overwrite behavior for existing files.

The first RadCN proof should therefore mirror the shape of shadcn while staying
minimal: `radcn init --cwd <fixture> --yes`, then
`radcn add button --cwd <fixture> --yes`, backed by a local registry item that
installs Button and any needed utility or style dependencies into a Remix 3
fixture app.

## Decisions

- RadCN will use `components.json`. This matches shadcn's installed-project
  contract and avoids an avoidable divergence in the first installation-flow
  proof.
- Default generated paths must be compatible with standard Remix 3 project
  structure. The exact component, utility, style, and hook paths should be
  discovered from Remix 3 app conventions during the experiment, then recorded
  in this issue.
- Registry-installed components should copy full standalone source into the
  target application by default. If an experiment shows that standalone source
  creates unexpectedly large or fragile payloads, the issue must record the
  tradeoff before introducing package-owned primitive imports.
- RadCN should support TypeScript only. Do not support plain JavaScript output,
  `tsx: false`, or `.jsx` rewrites.
- Tailwind v4 is a required peer for installed RadCN components (per Issue 6).
  The install flow must require Tailwind v4 in the target and fail loudly if it
  is absent (the mechanism is this issue's to design). The generated
  `components.json` retains the Tailwind configuration fields, adapted for
  Remix 3 and Tailwind v4, and generated registry items/components declare
  Tailwind as a required peer.
- RadCN should carry forward only config fields that make sense for Remix 3.
  Omit or reinterpret shadcn fields such as `rsc` and icon-library defaults
  unless an experiment records a concrete Remix 3 need for them. (Tailwind
  configuration fields are an exception: they are required, per the decision
  above and Issue 6.)
- The local flow should be close enough to the eventual published flow that the
  local command, config, registry, and generated source can translate directly
  to the public npm-backed version later.
- The install proof should use a dedicated disposable Remix 3 consumer fixture
  at `radcn/fixtures/install-target/`. This fixture is not the docs app and is
  not RadCN package source; it exists only to prove that RadCN can initialize
  and install components into an external target app.
- The first proof should concentrate on Button only. It should prove the
  command shape, config file, local registry item, copied source ownership,
  Tailwind v4 requirement, idempotent re-run behavior, and Remix 3 render path
  before expanding to more components.
- The fixture route must import Button from generated target-owned source, not
  from `radcn/button`. Package imports can remain an internal source/template
  implementation detail only if the experiment records why that does not weaken
  the copied-source model.

## Scope

In scope:

- A RadCN CLI surface that can be exercised locally.
- A RadCN configuration file equivalent in role to shadcn/ui
  `components.json`.
- A local RadCN registry format for installable component items.
- Local commands equivalent to:
  - `radcn init`
  - `radcn add button`
  - eventually `radcn add <component>`
- A target Remix 3 fixture app that proves initialization and component
  installation. The preferred path is `radcn/fixtures/install-target/`.
- A Button installation proof that writes project-local source and makes it
  usable from the target app.
- TypeScript-only generated output.
- Documentation of how this local flow maps to the eventual published npm
  flow.
- Tests or deterministic checks that verify generated files, config, imports,
  dependencies, and Remix 3 usability.
- An automated clean-state verification path for the install target, including
  local `init`, local `add button`, target typecheck, Tailwind style build, and
  browser or route-level rendering of the installed Button.
- A deterministic re-run check for `radcn add button` showing that unchanged
  files are skipped or that overwrite behavior is explicit and safe.

Out of scope:

- Publishing any package to npm.
- Designing the final public package names or npm release automation beyond
  what is needed to keep the local proof realistic.
- Treating a published package as the proof of the installation model.
- Relying on manual browser testing as the only verification.
- Plain JavaScript output or JavaScript-only target projects.
- Reopening closed parity issues or modifying historical closed issue records.
- Installing from `vendor/` as a dependency. Vendor remains reference-only.

## Architecture

The likely architecture mirrors shadcn/ui:

- `components.json`:
  - records style/config choices;
  - records Remix 3-oriented paths for component output, utilities, CSS, and
    registry aliases;
  - assumes TypeScript output;
  - records import aliases and registry sources.
- RadCN config resolver:
  - validates the written `components.json`;
  - resolves aliases from the target app's `tsconfig.json` or package imports;
  - keeps resolved paths out of the persisted config;
  - refuses to resolve files inside `vendor/`.
- Local RadCN registry:
  - stores installable item metadata;
  - identifies files to write;
  - identifies dependencies or peer requirements;
  - supports recursive `registryDependencies`;
  - validates registry item JSON with a documented schema;
  - supports at least `button` first.
- Local RadCN CLI:
  - `init` detects or asks for project paths and writes config;
  - `add button` resolves the configured registry item;
  - supports `--cwd`, `--yes`, and a safety mode such as `--dry-run` or
    deterministic skip/overwrite handling early in the proof;
  - writes component source into the configured target path;
  - writes or updates utility/style files if needed;
  - avoids reading from or installing from `vendor/`;
  - can run in a local workspace without npm publication.
- Remix 3 proof app:
  - lives at `radcn/fixtures/install-target/`;
  - starts as a target consumer app, not as the RadCN source package itself or
    the RadCN docs app;
  - runs the local CLI against the app;
  - imports the installed Button from the generated local path;
  - renders and verifies the Button in a browser or deterministic route test;
  - can be reset or recreated by tests so the install flow is proven from a
    clean target state, not from checked-in generated leftovers.

The first successful proof should be expressible as a small command sequence in
the repository, conceptually:

```bash
pnpm radcn init --cwd radcn/fixtures/install-target --yes
pnpm radcn add button --cwd radcn/fixtures/install-target --yes
pnpm --dir radcn/fixtures/install-target typecheck
pnpm --dir radcn/fixtures/install-target styles:build
pnpm --dir radcn/fixtures/install-target test
```

The exact package scripts may differ once the implementation exists, but the
verification needs to prove those same behaviors.

## Key Questions

- How should the local registry be addressed during development:
  filesystem path, localhost registry server, workspace package, or packed
  tarball?
- How much of shadcn's registry address surface should the proof support:
  local files, plain names, namespaced `@radcn/button`, URLs, or all of them?
- Which exact Remix 3 default paths should `components.json` write for
  components, utilities, styles, and hooks?
- Should the install-target fixture keep generated files checked in as expected
  outputs, generate them into a disposable temporary copy during tests, or use a
  hybrid approach?
- What is the clearest failure mode when the target app is missing Tailwind v4:
  `init` failure, `add` failure, style-build failure with a RadCN diagnostic,
  or some combination?

## Learnings

- The local proof does not need npm publication. A private workspace CLI,
  private workspace registry, and disposable fixture are enough to prove the
  command, config, registry, source ownership, Tailwind, and render contract.
- The first default install paths are:
  - components: `app/components`
  - UI components: `app/components/ui`
  - utilities: `app/lib/utils`
  - hooks: `app/hooks`
  - Tailwind source: `app/styles/tailwind.css`
- `components.json` records the local registry as
  `workspace:@radcn/registry/{name}` for the pre-publication proof.
- Generated fixture output stays ignored. The install-target test resets
  `components.json`, generated source, generated theme CSS, and generated
  Tailwind output, then reruns the CLI to prove the clean install path.
- Button is generated as target-owned Remix UI source and imports its generated
  utility helper from the target app. The fixture route does not import
  `radcn/button`.
- Publishing remains a later distribution problem: choose public package names,
  host or publish registry data, and replace the workspace registry address
  without changing the user-facing command shape.

## Experiments

- [Experiment 1: Prove the Button install flow](01-prove-button-install-flow.md)
  — **Pass**

## Completion Criteria

This issue is complete when:

- a local RadCN CLI/config/registry proof exists;
- the proof uses `components.json`;
- generated output is TypeScript-only;
- generated default paths are compatible with standard Remix 3 app structure;
- `radcn/fixtures/install-target/` exists as a disposable Remix 3 consumer
  fixture;
- that fixture can run an init flow;
- the same target can run an add-component flow for Button;
- generated config and source files are deterministic and documented;
- registry item validation, recursive dependency resolution, and safe file
  targets are covered at least for the Button proof;
- rerunning `add button` is deterministic: unchanged files are skipped or
  overwrite behavior is explicit and tested;
- the installed Button can be imported and rendered from the target Remix 3
  fixture from its own generated local source;
- the verification runs from a clean target state and proves generated output,
  target typecheck, Tailwind output, and Button rendering without manual-only
  steps;
- the flow does not read from or install dependencies from `vendor/`;
- verification proves the flow works without npm publication;
- the local flow maps directly to the eventual published flow without changing
  the user-facing command shape;
- the issue records what remains for a later publishing issue.

## Conclusion

Issue 5 is complete. RadCN now has a local shadcn-style installation proof that
does not require npm publication: `radcn init` writes a Remix-oriented
`components.json`, `radcn add button` resolves local registry data, recursively
installs the generated theme and utility dependency, writes target-owned Button
source into a disposable Remix 3 target app, and skips unchanged files on a
deterministic rerun.

The install-target fixture proves the generated source by typechecking the
target app, compiling Tailwind v4 output, and rendering a route that imports
Button from `app/components/ui/button.tsx`. Generated output is ignored and
regenerated by the fixture test so the proof starts from a clean target state.

The next installation-related issue should focus on distribution: public
package names, npm publication, registry hosting or packaging, and replacing
the local `workspace:@radcn/registry/{name}` registry address while preserving
the same `radcn init` and `radcn add button` command shape.
