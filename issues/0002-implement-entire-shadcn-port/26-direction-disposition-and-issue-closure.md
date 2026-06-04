# Experiment 26: Direction Disposition and Issue Closure

## Description

Resolve the final unresolved Issue 1 inventory row, `direction`, and close
Issue 2 if the inventory-wide audit passes.

Upstream shadcn/ui `direction` is a React client wrapper around Radix
`DirectionProvider`:

- `DirectionProvider` accepts `dir` or `direction`;
- `useDirection` reads the current direction from React/Radix context.

RadCN should preserve the useful author-visible and user-visible contract
without React context. Text direction is already a platform feature through the
HTML `dir` attribute and CSS logical properties. The expected RadCN outcome is
a tiny server-rendered `DirectionProvider` wrapper that sets `dir="ltr"` or
`dir="rtl"` on real markup, exposes stable RadCN hooks, and documents that
`useDirection` is intentionally not exported because Remix 3 components can
read direction from markup, route state, request locale, or recipe code instead
of React context.

This experiment should also perform the final Issue 2 closure audit. If every
inventory row now has a source, helper, recipe/block, or documented no-export
disposition, update Issue 2 to closed, add the conclusion, and regenerate the
issue index.

## Changes

Expected implementation files:

- `packages/radcn/src/components/direction.tsx`
  - Add `DirectionProvider`, `Direction`, `DirectionValue`, and props. Render a
    real wrapper element with `dir`, `data-direction`,
    `data-radcn-direction-provider`, and customization hooks.
- `packages/radcn/package.json`
  - Add `./direction`.
- `packages/radcn/src/index.ts`
  - Export the direction provider and types from the root package.
- `packages/radcn/src/styles/tokens.css`
  - Add minimal direction styling and custom-token fixture hooks.
- `packages/radcn/src/styles/index.ts`
  - Regenerate after token changes.
- `fixtures/scenarios/types.ts`
  - Add `direction` to `FixtureComponent`.
- `fixtures/scenarios/index.ts`
  - Add shared scenarios:
    - `direction/ltr`
    - `direction/rtl`
    - `direction/prop-alias`
    - `direction/nested`
    - `direction/custom-token`
- `fixtures/candidate-remix/app/fixtures/direction.tsx`
  - Add candidate fixtures using real RadCN source.
- `fixtures/candidate-remix/app/fixtures/index.tsx`
  - Route the direction fixture.
- `fixtures/reference-react-router/app/fixtures/direction.tsx`
  - Add matching reference fixtures.
- `fixtures/reference-react-router/app/fixtures/index.ts`
  - Route the direction fixture.
- `fixtures/reference-react-router/app/app.css`
  - Add reference direction styles.
- `fixtures/tests/direction.spec.ts`
  - Add focused checks for package exports, absence of React/Radix direction
    dependencies, `dir`/`data-direction` output, prop alias behavior, nested
    direction override, and customization hooks.
- `docs/radcn-source.md`
  - Document the direction outcome, `useDirection` divergence, native
    `dir`/logical-CSS policy, install/source parity, and RTL recipe guidance.
- `issues/0002-implement-entire-shadcn-port/final-audit.md`
  - Add the inventory-wide final audit.
- `issues/0002-implement-entire-shadcn-port/README.md`
  - Update experiment status, learnings, conclusion, and closed frontmatter if
    the final audit passes.
- `issues/README.md`
  - Regenerate with `scripts/build-issues-index.sh` if Issue 2 closes.

## Verification

The experiment passes if:

1. `direction` has a final RadCN outcome with source, package export, root
   export, docs, fixtures, artifact coverage, and focused tests.
2. `DirectionProvider` renders a real `dir` attribute for `ltr` and `rtl`.
3. The `direction` prop alias works like upstream's `direction ?? dir` policy.
4. Nested direction providers can override inherited direction through normal
   DOM inheritance.
5. Stable `data-radcn-direction-provider` and `data-direction` hooks exist.
6. Documentation explains why RadCN does not export `useDirection` and how apps
   should use native `dir`, request/route locale state, and CSS logical
   properties instead.
7. No React, React DOM, Radix direction, or context dependency is added to
   `packages/radcn`.
8. The final audit proves every Issue 1 inventory row now has source, helper,
   recipe/block, or documented no-export disposition.
9. If the final audit passes, Issue 2 is closed with `closed = "2026-06-04"`
   and `issues/README.md` is regenerated.
10. `pnpm radcn:typecheck` passes.
11. `pnpm fixtures:candidate:typecheck` passes.
12. `pnpm fixtures:reference:typecheck` passes.
13. Focused direction Playwright tests pass.
14. `pnpm fixtures:artifacts` passes.
15. `git status --short -- vendor` returns no output.
16. Independent completion review approves the result and the Issue 2 closure,
    or findings are fixed and recorded.

This experiment should close Issue 2 only if the final audit proves the full
component port is complete.

## Design Review

Independent AI design review was performed by subagent `Raman` and returned
**Pass**.

Raman confirmed:

- the experiment directly targets the unresolved `direction` row and the
  closure audit;
- the design correctly identifies upstream as `DirectionProvider` plus
  `useDirection`, including the `direction ?? dir` alias behavior;
- the proposed RadCN outcome fits the Issue 1 inventory disposition by using a
  native/server-rendered `dir` attribute instead of React context;
- the plan includes source, exports, fixtures, docs, focused tests, artifacts,
  final audit, issue closure, and index regeneration;
- the verification gates cover alias behavior, nested direction, dependency
  avoidance, inventory-wide audit, closure, artifacts, vendor cleanliness, and
  completion review;
- resolving `direction` plus a final inventory audit is the correct closure
  boundary because Stage 5 identified `direction` as the only remaining gap.
