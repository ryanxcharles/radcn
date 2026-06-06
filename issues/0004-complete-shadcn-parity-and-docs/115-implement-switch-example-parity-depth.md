# Experiment 115: Implement switch example parity depth

## Description

Experiment 114 audited the single direct upstream Switch example,
`switch-demo`, and found it partial. RadCN already has the package API and
behavior substrate for Switch, but there is no named docs, fixture, and
Playwright evidence for the exact upstream demo composition.

This experiment should resolve the direct Switch example cluster by adding
named docs, candidate fixture, and Playwright coverage for the exact upstream
composition while preserving RadCN's dependency-free native checkbox switch
model:

- render a row equivalent to
  `<div className="flex items-center space-x-2">`;
- render `<Switch id="airplane-mode" />` with default unchecked state and
  default size;
- render `<Label htmlFor="airplane-mode">Airplane Mode</Label>` as RadCN
  `Label for="airplane-mode">Airplane Mode</Label>`;
- prove public wrapper/input/thumb hooks, `role="switch"` accessibility,
  native label activation, checked/unchecked `data-state`, `data-size`, and
  browser check behavior;
- record dependency-divergence mapping for `"use client"`, React component
  props, `React.ComponentProps<typeof SwitchPrimitive.Root>`, Radix Switch
  primitives, `SwitchPrimitive.Root`, `SwitchPrimitive.Thumb`,
  `size = "default"`, Tailwind utilities, `cn`, `className`, `data-slot`,
  `data-size`, `data-state`, custom tokens, Label `htmlFor`, and vendor
  source.

The implementation should not add React, Radix, Tailwind,
class-variance-authority, or vendor dependencies. Package code should change
only if the current Switch primitive cannot represent the upstream example's
user-facing behavior, accessibility, browser behavior, or author-facing
modifiability.

## Changes

- Update `radcn/apps/docs/app/content/components.tsx`.
  - Promote Switch docs from generic generated content to a named
    `switch-demo` rich example if needed.
  - Render stable docs hooks such as
    `data-radcn-docs-switch-family="switch-demo"` and
    `data-radcn-docs-switch-row` if useful for tests.
  - Render the exact upstream id `airplane-mode`, label text `Airplane Mode`,
    default unchecked state, default size, and row layout mapping.
  - Include exact source snippet and mapping copy for React/Radix/defaults/
    Label/Tailwind/`cn`/`className`/`data-slot`/`data-size`/`data-state`/
    custom-token/vendor mechanics.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/native-state.tsx`
  Add a named `switch/demo` fixture route that renders the exact upstream
  composition and preserves existing `switch/default`, `switch/checked`,
  `switch/disabled`, `switch/custom-token`, and
  `switch/form-submit-reset` scenarios.
- Update fixture Playwright coverage in
  `radcn/fixtures/tests/native-state.spec.ts`.
  - Verify `switch/demo` renders the named route, exact id, label text, row
    layout, wrapper/input/thumb hooks, default unchecked state, default size,
    `role="switch"`, native checkbox type, accessible name, label activation,
    checked/unchecked metadata updates, and browser check behavior.
  - Keep existing disabled, form, and custom-token tests unchanged unless a
    selector needs to be narrowed around the new named fixture.
- Update docs Playwright coverage in
  `radcn/apps/docs/tests/coverage.spec.ts`.
  - Assert the `/docs/components/switch` page renders the named family hook,
    row layout evidence, exact id and label text, public Switch hooks,
    `role="switch"`, default unchecked state, `data-size`, source snippet, and
    required dependency-divergence mapping copy.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/switch-example-inventory.md`.
  - Change `switch-demo` from `Partial` to `Covered` only after docs,
    fixture, and Playwright evidence exists.
  - Record final decisions for id/label mapping, row layout, unchecked default
    state, default size, public hooks, role switch behavior, label activation,
    dependency divergences, custom tokens, and vendor source.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Add `switch` as a resolved example cluster only after the inventory row is
    `Covered`. Whole-row intentional divergence is not a pass path for this
    experiment; if a new discovery makes exact demo coverage impossible,
    record a `Partial` or `Fail` result with follow-up instead. Individual
    mechanics such as React/Radix/Tailwind/`data-slot` may still be documented
    as dependency divergences.
- Regenerate
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md` with
  `node scripts/audit-shadcn-parity.mjs`.
- Update Issue 4 `README.md`.
  - Record the final Switch example outcome in `## Learnings`.
  - Update the Experiment 115 index status from `Designed` to the recorded
    result.
  - Record the next generated recommendation after Switch is resolved.
- Update `radcn/packages/radcn/src/components/switch.tsx` and
  `radcn/packages/radcn/src/index.ts` only if implementation proves the
  current Switch primitive cannot keep public `data-state` metadata in sync
  after browser interaction. If needed, add a dependency-free `enhanceSwitch`
  that syncs wrapper/input `data-state` on input, change, and form reset, and
  export it from the package.
- Update browser entry files only if `enhanceSwitch` is needed:
  - `radcn/apps/docs/app/assets/entry.ts`;
  - `radcn/fixtures/candidate-remix/app/assets/entry.ts`.
  Scope docs enhancement to the named `switch-demo` example and run fixture
  enhancement globally with the other package enhancers.

Package code should otherwise stay unchanged. If `enhanceSwitch` is added,
record in the result that the audit assumption changed because static
server-rendered `data-state` metadata did not update after native browser
interaction.

## Verification

Pass criteria:

- Package, docs, and fixture typechecks pass:

  ```text
  pnpm radcn:typecheck
  pnpm --dir radcn/apps/docs typecheck
  pnpm fixtures:candidate:typecheck
  ```

- Fixture native-state coverage passes:

  ```text
  pnpm exec playwright test -c radcn/fixtures/playwright.config.ts native-state.spec.ts
  ```

- Docs Playwright coverage passes:

  ```text
  pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
  ```

- A deterministic Node check proves
  `switch-example-inventory.md` has exactly one direct upstream row,
  `switch-demo`, and the row is `Covered`.
- A deterministic Node check proves `resolved-clusters.json` includes an
  `examples` entry with `slug = "switch"`, `status = "resolved"`, and
  evidence for Experiment 114, Experiment 115, and
  `switch-example-inventory.md`.
- `node scripts/audit-shadcn-parity.mjs` regenerates
  `parity-inventory.md`; a deterministic check proves:
  - `switch` is absent from `## Unresolved Example Clusters`;
  - `## First Recommended Cluster` no longer says
    `Example parity for switch`;
  - block and chart-gallery sections remain out of scope, not unresolved
    deliverables.
- Fixture tests assert:
  - `switch/demo` renders the named route;
  - the row maps upstream `flex items-center space-x-2` with class/style
    evidence;
  - the input has id `airplane-mode`, role `switch`, type `checkbox`,
    accessible name `Airplane Mode`, and default unchecked state;
  - the Label uses `for="airplane-mode"` and native label activation toggles
    the switch;
  - wrapper, input, and thumb expose public hooks;
  - wrapper and input expose `data-state="unchecked"` initially and update to
    `checked` after browser interaction;
  - wrapper and input expose `data-size="default"`;
  - no test depends on React state, Radix internals, Tailwind, `cn`, or literal
    DOM equivalence with upstream.
- Docs coverage asserts the Switch page renders stable evidence for the named
  docs example, exact id and label text, source snippet, public hooks,
  default unchecked/default size metadata, row layout, role switch behavior,
  label activation, and required dependency-divergence/mapping copy.
- A deterministic README check proves the Experiment 115 learning, Switch
  inventory reference, and next generated recommendation were recorded.
- Dependency and scope checks pass:
  - deterministic source import scan over files changed by this experiment for
    forbidden React/Radix/Tailwind/vendor source imports. The scan must include
    any changed files under `radcn/packages/radcn`, `radcn/apps/docs`, and
    `radcn/fixtures/candidate-remix`, but must not fail on unrelated
    pre-existing approved references;
  - manifest checks prove no forbidden dependencies were added;
  - `git diff --exit-code -- pnpm-lock.yaml`;
  - tracked-vendor-source check proves `git ls-files vendor` returns only
    `vendor/.gitignore`;
  - `git diff --check`;
  - `git status --short` shows only the expected Experiment 115 implementation
    files before the result commit:
    `issues/0004-complete-shadcn-parity-and-docs/115-implement-switch-example-parity-depth.md`,
    `issues/0004-complete-shadcn-parity-and-docs/README.md`,
    `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`,
    `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`,
    `issues/0004-complete-shadcn-parity-and-docs/switch-example-inventory.md`,
    `radcn/apps/docs/app/assets/entry.ts`,
    `radcn/apps/docs/app/content/components.tsx`,
    `radcn/apps/docs/tests/coverage.spec.ts`,
    `radcn/fixtures/candidate-remix/app/assets/entry.ts`,
    `radcn/fixtures/candidate-remix/app/fixtures/native-state.tsx`,
    `radcn/fixtures/scenarios/index.ts`, and
    `radcn/fixtures/tests/native-state.spec.ts`,
    `radcn/packages/radcn/src/components/switch.tsx`, and
    `radcn/packages/radcn/src/index.ts`;
  - `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
    prints no output.

Failure criteria:

- The named demo omits exact id `airplane-mode`, label text `Airplane Mode`,
  row layout, default unchecked state, default size, public hooks, role switch
  behavior, label activation, or browser check behavior.
- The implementation marks `switch-demo` covered without docs, fixture, and
  Playwright evidence for the exact upstream composition.
- The implementation adds React, Radix, Tailwind, class-variance-authority, or
  vendor dependencies.
- The implementation treats literal DOM/style equivalence as required instead
  of user-facing behavior, accessibility, browser behavior, and author-facing
  modifiability.
- The experiment modifies unrelated components, resolved clusters, blocks, or
  chart-gallery scope.

## Design Review

Reviewer: Wegener the 3rd (`019e9ecd-fc2c-76d2-aa18-48fa512623a2`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approved. The reviewer confirmed the Issue 4 README links Experiment 115 as
`Designed`, the experiment has `Description`, `Changes`, `Verification`, and
`Design Review`, scope is focused on the `switch-demo` gap from Experiment 114,
implementation has not started before the plan commit, verification has
concrete typecheck, Playwright, deterministic inventory, resolved-cluster,
repo hygiene, lockfile, vendor, and status checks, vendor state is clean, the
issue scope excludes upstream blocks and chart-gallery examples while
retaining ordinary `radcn/chart`, and the technical plan directly addresses
the missing named docs, fixture, and Playwright proof.

## Result

**Result:** Pass

Implemented named `switch-demo` parity across the docs site, candidate fixture,
fixture Playwright coverage, docs Playwright coverage, inventory bookkeeping,
and generated parity inventory.

The docs page now has a rich Switch example that renders id `airplane-mode`,
label text `Airplane Mode`, default unchecked state, default size,
`flex items-center space-x-2` row layout, public wrapper/input/thumb hooks,
`role="switch"` accessibility, native label activation, checked/unchecked
`data-state`, and `data-size`. The docs source and copy record the Remix 3
mappings for upstream React props, `React.ComponentProps`, Radix Switch
primitives, `size = "default"`, Tailwind utilities, `cn`, `className`,
`data-slot`, Label `htmlFor`, custom tokens, and vendor source.

The candidate fixture now has `switch/demo` with the same id, label, row
layout, unchecked default state, default size, hooks, and browser behavior.
`native-state.spec.ts` proves the named route, native checkbox switch
semantics, label activation, state metadata updates after interaction, and
the existing Switch behavior scenarios. `switch-example-inventory.md` marks
`switch-demo` as `Covered`, `resolved-clusters.json` marks `switch` resolved,
and the regenerated parity inventory now recommends example parity for
`table`.

The implementation also added `enhanceSwitch` to `radcn/switch` and wired it
into the docs and candidate fixture browser entries. This package change was
necessary because the server-rendered Switch metadata correctly started as
`unchecked`, but wrapper/input `data-state` did not update after native
browser interaction without a small dependency-free enhancer.

Verification run:

```text
pnpm radcn:typecheck
pnpm --dir radcn/apps/docs typecheck
pnpm fixtures:candidate:typecheck
pnpm exec playwright test -c radcn/fixtures/playwright.config.ts native-state.spec.ts
pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
node scripts/audit-shadcn-parity.mjs
node deterministic check for switch-example-inventory row count and Covered outcome
node deterministic check for resolved-clusters switch evidence
node deterministic check that switch left unresolved examples and the next recommendation is table
rg -n 'Experiment 115|switch-example-inventory|example parity for `table`|example parity for table' issues/0004-complete-shadcn-parity-and-docs/README.md
git diff --exit-code -- pnpm-lock.yaml
git diff --check
node deterministic tracked-vendor-source check
for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done
node deterministic forbidden import/dependency scan over changed implementation files and relevant manifests
git status --short
```

All checks passed. The Playwright runs reported 8 passed tests for
`native-state.spec.ts` and 5 passed tests for docs `coverage.spec.ts`.

## Conclusion

Switch direct example parity is complete. The current in-scope unresolved
example clusters are `table`, `tabs`, and `tooltip`. The next experiment
should audit upstream `table-demo` parity before implementation.

## Completion Review

Reviewer: Kant the 3rd (`019e9ed4-358c-71f1-85dd-e2ed32e84c5f`),
fresh-context Codex subagent (`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approved. The reviewer confirmed the result commit had not been made before
review, the experiment has `Result` and `Conclusion`, the Issue 4 README marks
Experiment 115 `Pass`, the README records the `enhanceSwitch` discovery and
next `table` recommendation, `switch-demo` is `Covered` with docs, fixture,
and Playwright evidence, `switch` is resolved with Experiment 114,
Experiment 115, and inventory evidence, blocks/chart-gallery remain out of
scope while the ordinary chart package scope remains retained, typechecks
passed, fixture Playwright passed 8/8, docs Playwright passed 5/5, the audit
generator and deterministic inventory checks passed, `git diff --check`,
lockfile, tracked-vendor, and nested vendor checks passed.
