# Experiment 1: Stage 1 Source and Native Control Foundation

## Description

Establish the real Stage 1 foundation for RadCN by creating the first component
source layout, install/copy shape, documentation shape, fixture integration, and
verification pattern. Use the smallest native form-control proof slice to prove
the foundation:

- `button`
- `input`
- `field`
- `label`
- `textarea`

This experiment should replace the existing candidate placeholders for this
slice with real RadCN source consumed by the Remix 3 candidate fixture app. It
should not try to complete all Stage 1 components in one step. The goal is to
make later Stage 1 ports repeatable.

The experiment must record reusable discoveries in the issue `## Learnings`
section when they affect later components.

## Changes

Create the first RadCN source and documentation structure. The exact layout may
change during implementation, but the final result must clearly answer where
RadCN source lives and how fixture apps consume it. A likely starting shape:

```text
packages/
└── radcn/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── components/
        │   ├── button.tsx
        │   ├── field.tsx
        │   ├── input.tsx
        │   ├── label.tsx
        │   └── textarea.tsx
        ├── styles/
        │   └── tokens.css
        └── utils/
            └── classes.ts
```

Add or update workspace metadata so the candidate Remix app can import RadCN
source through a workspace package rather than fixture-local placeholders.

Update candidate fixtures:

- remove or stop using placeholder candidate implementations for the proof
  slice;
- render the proof scenarios through RadCN source;
- add customization probe scenarios where needed.

Update reference fixtures only as needed to keep paired scenario coverage
aligned with shadcn/ui behavior.

Update shared scenarios if the first proof slice needs more coverage, for
example:

- `button/sizes`
- `button/custom-class`
- `button/form-submit`
- `field/required`
- `field/custom-error-token`
- `textarea/default`
- `textarea/disabled`

Do not add scenarios for components outside this experiment's proof slice.

Add documentation for the first real component source shape. This may be a
minimal markdown file under a future docs area or an issue-local design note if
the documentation site does not exist yet. The documentation must explain:

- how RadCN source is organized;
- how candidate fixtures import components;
- how class hooks, variants, tokens, and customization probes work for this
  proof slice;
- what install/copy workflow is assumed until the final CLI/site exists.

## Verification

The experiment passes if:

1. A real RadCN source package or equivalent source root exists for the proof
   slice.
2. The Remix 3 candidate app imports proof-slice components from RadCN source,
   not fixture-local placeholder components.
3. The proof-slice components cover `button`, `input`, `field`, `label`, and
   `textarea`. If implementation discovers a blocker that prevents `textarea`
   from landing with the rest of the proof slice, the experiment result must be
   recorded as `Partial` and explain the blocker.
4. Shared scenarios cover default, state, form, and customization probes needed
   to validate the proof slice.
5. `pnpm fixtures:artifacts` passes and captures paired artifacts for all shared
   scenarios.
6. Component-specific checks prove at least:
   - button native submit/reset behavior;
   - input label/help/error linkage through field;
   - disabled and invalid state semantics;
   - class or token customization changes the rendered result.
7. Documentation explains source layout, fixture imports, customization hooks,
   and the interim install/copy workflow.
8. Any reusable discovery needed by later components is added to the issue
   `## Learnings` section with evidence.
9. No files under `vendor/` are modified.
10. Independent completion review approves the result or findings are fixed and
    recorded.

This experiment does not complete Stage 1. It creates the Stage 1 foundation and
first native form-control proof so the remaining static and native components
can be ported through follow-up experiments.

## Design Review

Independent AI design review was performed by subagent `Heisenberg`, which
approved the design after one fix.

The review initially found that `textarea` was optional in the proof slice. The
design was updated so `textarea` is required; if implementation discovers a
blocker that prevents `textarea` from landing with the rest of the proof slice,
the result must be recorded as `Partial` with the blocker explained.

The review found no remaining blocking issues. It verified that the experiment
starts Stage 1 without claiming to finish all Stage 1, establishes source
layout, install/copy documentation, fixture integration, and verification
foundation, requires the candidate app to consume real RadCN source instead of
fixture-local placeholders, requires artifacts and component-specific checks,
requires reusable discoveries to be recorded in `## Learnings`, prohibits vendor
edits, and keeps Issue 2 to one designed experiment.

Residual risks:

- The source layout is intentionally flexible, so implementation must make the
  final package and import shape concrete.
- Component-specific checks are described at the behavior level, so
  implementation should translate them into explicit Playwright or fixture tests
  rather than relying only on artifact capture.
