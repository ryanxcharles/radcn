---
name: write-tests
description: Write, refactor, or review tests for RadCN packages, fixtures, and the future docs app using the repo's TypeScript checks, Playwright harness, and narrow verification loops.
---

# Write Tests for RadCN

Provenance: adapted for RadCN from
`vendor/remix/.agents/skills/write-tests/SKILL.md` in the vendored Remix source
on 2026-06-05. This is not a verbatim copy; upstream Remix package-runner and
workspace-maintainer guidance was replaced with RadCN commands and fixtures.

Use this skill when adding or reviewing:

- `radcn/fixtures/tests/*.spec.ts`;
- package typecheck/build test coverage;
- docs app Playwright tests;
- route/controller tests for a future Remix 3 docs app;
- fixture scenarios or artifact coverage;
- test-only package metadata.

## Workflow

1. Read the nearest `package.json`, `tsconfig.json`, and sibling tests before
   choosing a test style.
2. Identify the behavior owner: `radcn/packages/radcn`, `radcn/fixtures`, or
   `radcn/apps/docs`.
3. Keep tests close to the behavior and use the smallest useful fixture.
4. Assert public behavior, not private implementation structure, unless the
   public contract is the structure.
5. Run the narrowest meaningful check first, then the broader experiment
   verification before recording a result.

## RadCN Test Surfaces

Use these existing patterns:

- `pnpm radcn:typecheck` for `radcn/packages/radcn`;
- `pnpm fixtures:candidate:typecheck` for the Remix candidate fixture app;
- `pnpm fixtures:reference:typecheck` for the React Router reference app;
- `pnpm playwright test -c fixtures/playwright.config.ts <spec>` for focused
  fixture behavior;
- `pnpm fixtures:artifacts` for full paired screenshot/artifact coverage.

Future docs-site experiments may add:

```sh
cd radcn
pnpm --dir apps/docs typecheck
pnpm --dir apps/docs build
pnpm playwright test -c apps/docs/playwright.config.ts
```

Do not assume upstream Remix commands such as `remix-test`,
`pnpm run test:changed`, or `pnpm --filter @remix-run/<package>` exist in
RadCN unless a later experiment adds them.

## Playwright Guidance

- Prefer focused specs for component behavior and one full artifact pass for
  broad visual coverage.
- Use stable public hooks such as `data-radcn-*`, roles, labels, ARIA state,
  and visible text.
- Avoid strict DOM equivalence with shadcn/ui unless the public contract is the
  DOM shape. RadCN should look the same and be modifiable in the same way while
  using Remix 3 architecture.
- For custom tokens, assert computed CSS on public hooks.
- For browser events, attach listeners in the page and assert observable
  effects.
- Keep tests deterministic: avoid timers, randomness, network calls, and
  browser-global state unless explicitly controlled.

## Fixture And Docs Examples

- Shared fixture scenarios live in `radcn/fixtures/scenarios`.
- Candidate fixtures should import real RadCN source from `radcn`.
- Reference fixtures should match visible behavior well enough for comparison.
- Docs examples should be user-facing. Reuse fixture lessons, but avoid leaking
  test-only scaffolding into docs pages.

## Assertions

Assert behavior users and authors can rely on:

- roles and accessible names;
- keyboard and pointer behavior;
- form submission/reset where relevant;
- package exports and dependency policy;
- public data hooks and CSS variables;
- rendered routes/pages for the docs app;
- artifact generation for broad visual smoke coverage.

## Dependency Hygiene

- Runtime dependencies belong in `dependencies`.
- Test-only tools belong in `devDependencies`.
- Keep `radcn/packages/radcn` free of React, React DOM, Radix packages, and upstream
  React-only dependencies unless a future reviewed experiment explicitly
  changes that policy.
- If package metadata changes, run the install/lockfile verification required
  by the active experiment.

## Result Recording

When an experiment changes tests, record:

- exact commands run;
- pass/fail counts where available;
- known warnings such as the existing React Router `module.register()`
  deprecation warning;
- any narrowed scope if a full suite was intentionally not run.
