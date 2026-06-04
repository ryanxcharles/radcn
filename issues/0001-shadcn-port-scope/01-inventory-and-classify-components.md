# Experiment 1: Inventory and Classify Components

## Description

Create the first authoritative RadCN component inventory by auditing upstream
shadcn/ui against Remix 3's UI model. This experiment should not port a
component and should not build the parity harness yet. Its job is to turn the
unknown component surface into a ranked, evidence-backed map that later
experiments can follow.

The audit starts from the vendored upstream sources:

- `vendor/shadcn-ui/apps/v4/lib/components.ts` for the documented UI component
  list.
- `vendor/shadcn-ui/apps/v4/registry.json` for registry item metadata,
  dependencies, registry dependencies, files, and CSS variables.
- `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/` for component source.
- `vendor/shadcn-ui/apps/v4/examples/` and docs/content files for canonical
  usage scenarios.
- `vendor/remix/packages/ui/README.md` and relevant `vendor/remix/packages/ui/`
  source for Remix 3 UI primitives, server rendering, mix composition, events,
  refs, CSS helpers, animation helpers, first-party components, and theme
  tokens.

The output should be a new analysis document in this issue:

```text
issues/0001-shadcn-port-scope/component-inventory.md
```

That document should contain a table for every shadcn/ui component and a short
summary that recommends the next experiment.

## Changes

Create `issues/0001-shadcn-port-scope/component-inventory.md` with these
sections:

1. `# shadcn/ui Component Inventory`
2. `## Sources Audited`
3. `## Classification Model`
4. `## Component Inventory`
5. `## Dependency Clusters`
6. `## Remix 3 Mapping Strategies`
7. `## Parity Requirements`
8. `## Recommended First Proof Set`
9. `## Next Experiment`

For each component, record:

- `component`: the shadcn/ui component name.
- `source`: the registry source file or files.
- `registry dependencies`: other shadcn registry items required by it.
- `package dependencies`: npm packages required by the upstream implementation.
- `React surface`: React APIs used, such as hooks, context, refs, portals,
  render props, controlled state, effects, client-only behavior, or React event
  handlers.
- `Radix surface`: Radix primitive package and primitive parts, if any.
- `visual surface`: Tailwind classes, CSS variables, animation classes, layout
  primitives, icons, and theme tokens that affect rendered output.
- `behavior class`: one of `static`, `form-control`, `disclosure`, `overlay`,
  `composite-widget`, `collection`, `data-display`, `feedback`, or
  `application-shell`.
- `Remix 3 mapping hypothesis`: one of `native-html-css`, `server-rendered`,
  `progressive-enhancement`, `remix-ui-primitive`, `small-client-script`,
  `needs-design`, or `defer`.
- `parity checks`: required verification types, chosen from `screenshot`,
  `DOM`, `a11y-tree`, `keyboard`, `pointer`, `form`, `animation`,
  `responsive`, and `theme`.
- `risk`: `low`, `medium`, or `high`.
- `notes`: short evidence-backed notes and unresolved questions.

Use deterministic, scriptable inspection where practical. A small local script
or shell pipeline may be used to extract registry names, dependencies, and file
paths from `registry.json`, but the result must be reviewed against the actual
component source before being recorded.

Do not edit files under `vendor/`. Do not commit generated output from vendor
repos. If a temporary script is useful, either keep it out of the final diff or
place it under an appropriate RadCN path only if it will be reused.

## Verification

The experiment passes if `component-inventory.md` satisfies all of these
criteria:

1. It lists every component from
   `vendor/shadcn-ui/apps/v4/lib/components.ts`.
2. Every listed component has a source path, dependency summary, behavior class,
   Remix 3 mapping hypothesis, parity checks, and risk level.
3. It identifies dependency clusters, including at minimum:
   - static and mostly visual components;
   - native form controls;
   - Radix-backed disclosure and overlay components;
   - composite keyboard widgets;
   - data/display helpers;
   - components that likely depend on third-party React-only libraries.
4. It explains which shadcn/ui assumptions do not map directly to Remix 3.
5. It recommends a smallest useful first proof set for the next experiment.
   The proof set should include at least:
   - one low-risk static or form component;
   - one interactive component with keyboard behavior;
   - one component that stresses theme or variant mapping.
6. It proposes the next experiment in one or two sentences.
7. It makes no changes to vendored source checkouts.

Manual review is required before implementation work proceeds. A reviewer should
check whether the classification is complete enough to drive the first harness
or component-port experiment.

## Result

**Result:** Pass

Created `component-inventory.md` with an audited inventory of the current
shadcn/ui component surface against Remix 3's UI model. The current
`vendor/shadcn-ui/apps/v4/lib/components.ts` source lists 60 components, and the
inventory covers all 60.

The inventory records source locations, dependency summaries, React/Radix/Base
surfaces, visual surfaces, behavior classes, Remix 3 mapping hypotheses, parity
checks, risk levels, dependency clusters, Remix mapping assumptions, a first
proof set, and the recommended next experiment.

Automated/local verification:

- Checked that every component from
  `vendor/shadcn-ui/apps/v4/lib/components.ts` appears in
  `component-inventory.md`.
- Checked that all required sections exist in `component-inventory.md`.
- Checked that vendor checkouts remain ignored and unmodified by the main repo.

Review:

- Independent reviewer: Codex sub-agent `Cicero`.
- Review result: Approved.
- Review evidence: the reviewer confirmed 60 components, no missing/extra or
  duplicate names, complete per-row fields, required dependency clusters, Remix
  mismatch assumptions, first proof set, next experiment recommendation, and no
  modifications in `vendor/shadcn-ui` or `vendor/remix`.
- Residual risk: some rows should be revalidated during harness work because
  several documented components are demo/block surfaces rather than direct
  `registry:ui` entries.

## Conclusion

The first component map is complete enough to guide implementation. The next
experiment should build a minimal parity harness for `button`, `input`/`field`,
and `accordion`, using paired upstream shadcn/ui and RadCN fixtures with
Playwright screenshots plus DOM, accessibility, keyboard, and native form
assertions.
