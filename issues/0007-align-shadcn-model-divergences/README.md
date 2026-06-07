+++
status = "open"
opened = "2026-06-07"
+++

# Issue 7: Align shadcn Model Divergences

## Goal

Resolve RadCN's remaining divergences from the shadcn/ui model, except for
Tailwind styling work that belongs to Issue 6.

The outcome should make RadCN behave like a Remix 3 translation of shadcn/ui:
same broad installation model, registry model, config model, source ownership
model, and component coverage boundaries, with only deliberate Remix 3
differences remaining.

## Background

RadCN started by proving that shadcn/ui components could be translated into
Remix 3 concepts. That produced useful component and docs coverage, but it also
introduced several structural divergences from shadcn/ui.

The largest styling divergence is handled separately in Issue 6: Tailwind v4 is
required and all visual component styling must move to Tailwind. This issue is
for the other model-level differences.

Known non-Tailwind divergences include:

- RadCN currently exposes components from a workspace package, while shadcn/ui
  installs copied source into the consuming app.
- RadCN does not yet have a real local `radcn init` / `radcn add button` CLI
  flow.
- RadCN does not yet have a `radcn/packages/registry` package that stores
  installable registry items.
- RadCN does not yet write or consume a shadcn-style `components.json` contract
  in real target apps.
- The current Remix candidate fixture imports package components instead of
  proving generated source installed into a consumer app.
- The docs app imports RadCN package components directly instead of showing the
  final copied-source model.
- Some shadcn API concepts, such as variant helpers, `asChild`-style
  composition, slot-like behavior, and utility import conventions, may have
  been dropped or replaced without a recorded Remix 3 reason.
- Blocks and charts are out of RadCN scope, but chart code may still exist and
  must be removed if present.

## Relationship to Other Issues

Issue 5 owns the local installation flow. This issue should not duplicate that
work; it should coordinate the broader divergence cleanup so Issue 5's CLI,
registry, fixture, and `components.json` decisions match the final shadcn-style
RadCN architecture.

Issue 6 owns Tailwind v4 styling. This issue must not solve Tailwind migration
directly, but it should make sure non-styling architecture does not block Issue
6 or encode a no-Tailwind model.

Closed issues are historical records and must not be modified.

## Scope

In scope:

- Audit all current RadCN divergences from shadcn/ui outside Tailwind styling.
- Establish which divergences are intentional Remix 3 translations and which
  are accidental drift.
- Implement a real RadCN registry package at `radcn/packages/registry` if Issue
  5 has not already done so.
- Ensure registry items describe copied standalone source, dependencies,
  registry dependencies, and file targets in a shadcn-compatible way.
- Ensure the CLI and config model use `components.json`.
- Ensure `radcn add button` is the primary local proof command.
- Ensure consumer fixtures prove installed local source, not package-imported
  components.
- Align docs examples with the copied-source model where practical.
- Decide how Remix 3 should represent shadcn concepts such as `asChild`, slot
  composition, variant helpers, and utility imports.
- Remove blocks and charts from RadCN code, docs, fixtures, registry, and
  exports if any remain.
- Record every intentional divergence and its Remix 3 reason.

Out of scope:

- Tailwind v4 migration and visual styling replacement. That belongs to Issue
  6.
- Publishing packages to npm.
- Reintroducing blocks or charts.
- Supporting React or React Router as a RadCN runtime target.
- Supporting plain JavaScript output.
- Modifying closed issues.

## Analysis

The core question is not whether RadCN can be implemented in Remix 3; earlier
work proved that it can. The question is whether the resulting project still
feels like shadcn/ui from a user's perspective.

The desired model is:

- users initialize a target Remix 3 app with `radcn init`;
- users install components with commands such as `radcn add button`;
- the target app owns the installed source;
- installable items come from a RadCN registry, not from direct workspace
  imports;
- `components.json` tells RadCN where aliases, components, utilities, styles,
  hooks, and registries live;
- generated components are TypeScript-only;
- every difference from shadcn is required by Remix 3's web-first model or by a
  recorded RadCN scope decision.

This issue should likely be solved through a series of experiments that each
close a cluster of related divergences. Do not design all experiments upfront.
Each completed experiment should update this issue with any learnings needed by
later experiments.

## Learnings

Record discoveries here when they affect later divergence decisions.

## Key Questions

- Which current package components are temporary implementation scaffolding,
  and which should become registry source templates?
- Should the docs app import generated local source, registry source, or the
  RadCN package during development?
- What is the Remix 3 equivalent of shadcn's `asChild` and `Slot` composition
  patterns?
- Should RadCN use a class-variance helper equivalent for generated source, or
  simpler local functions that fit Remix 3 output better?
- Which `radcn-*` classes and data attributes are behavior hooks that should
  remain after Tailwind migration?
- What exact files must be removed to enforce the no-blocks/no-charts scope?

## Completion Criteria

This issue is complete when:

- all non-Tailwind shadcn divergences have been audited and classified;
- every intentional divergence is recorded with a Remix 3 or scope reason;
- accidental divergences are fixed or moved into a specific open issue with
  clear ownership;
- RadCN has a shadcn-style registry/config/source-ownership model;
- `components.json` is the canonical project config contract;
- fixtures prove generated/copied consumer-owned source rather than direct
  package consumption;
- docs examples no longer misrepresent the final consumption model;
- blocks and charts are absent from RadCN code, exports, docs, fixtures, and
  registry data;
- Issue 5 and Issue 6 assumptions remain compatible with the resulting model;
- verification proves the remaining RadCN model is a deliberate Remix 3 port of
  shadcn/ui, not an unrelated component package.
