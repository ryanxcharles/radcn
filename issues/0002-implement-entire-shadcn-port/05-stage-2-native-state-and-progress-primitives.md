# Experiment 5: Stage 2 Native State and Progress Primitives

## Description

Start Stage 2 with bounded state and feedback primitives that can preserve or
improve shadcn/ui behavior through native browser controls.

This experiment covers:

- `checkbox`
- `radio-group`
- `switch`
- `progress`

The goal is to establish Stage 2's native-state foundation before introducing
custom client-state primitives. `checkbox`, `radio-group`, and `switch` should
use real form controls so RadCN preserves form submission, reset, disabled,
required, checked, and keyboard behavior. `progress` should use a real
`<progress>` element unless implementation discovers a concrete blocker.

This experiment should not port `accordion`, `collapsible`, `tabs`, `toggle`,
`toggle-group`, `slider`, `avatar`, `scroll-area`, or `hover-card`. Those
components need separate follow-up experiments because they either require
custom state, richer keyboard behavior, fallback timing, scroll behavior, or a
Stage 3 positioning decision.

The experiment must record reusable discoveries in the issue `## Learnings`
section when they affect later components.

## Changes

Add RadCN source files under `packages/radcn/src/components/`:

- `checkbox.tsx`
- `radio-group.tsx`
- `switch.tsx`
- `progress.tsx`

The exported component families should include:

- `Checkbox`
- `RadioGroup`, `RadioGroupItem`
- `Switch`
- `Progress`

Update package exports in `packages/radcn/package.json` and public exports in
`packages/radcn/src/index.ts`.

Extend RadCN styles and tokens for:

- checkbox wrapper/input/indicator hooks;
- radio group, item, input, and indicator hooks;
- switch wrapper/input/thumb hooks;
- progress root and indicator/value hooks;
- checked, unchecked, disabled, invalid, required, indeterminate, size, and
  customization states where applicable;
- stable `radcn-*` classes and `data-radcn-*` attributes;
- stable state attributes such as `data-state`, `data-disabled`, and
  `data-invalid` where useful for styling.

Update candidate fixtures so the Remix 3 app imports all covered components
from `radcn`, not fixture-local placeholders.

Update React Router reference fixtures with equivalent shadcn/ui-inspired
examples for the same scenarios. Reference fixtures may use local reference
markup/styles instead of importing vendored source directly, but they must
preserve the visible and semantic surfaces needed for comparison.

Add shared scenarios only for this batch. Expected coverage:

- `checkbox/default`
- `checkbox/checked`
- `checkbox/disabled`
- `checkbox/invalid`
- `checkbox/indeterminate`
- `checkbox/custom-token`
- `checkbox/form-submit-reset`
- `radio-group/default`
- `radio-group/disabled`
- `radio-group/invalid`
- `radio-group/custom-token`
- `radio-group/form-submit-reset`
- `switch/default`
- `switch/checked`
- `switch/disabled`
- `switch/custom-token`
- `switch/form-submit-reset`
- `progress/default`
- `progress/indeterminate`
- `progress/custom-token`

Add component-specific Playwright checks for native state, form, accessibility,
and customization behavior, not only screenshot capture. The checks should prove
at least:

- `Checkbox` renders a real checkbox input with label association, stable
  wrapper/input/indicator hooks, checked/unchecked state, disabled state,
  invalid state, indeterminate visual/state hooks, reset behavior, and form
  submission behavior.
- `RadioGroup` renders a real radio group with shared `name`, labelable radio
  inputs, checked state, disabled and invalid state, reset behavior, form
  submission behavior, and group/item hooks.
- `Switch` renders a real checkbox input with `role="switch"`, checked state,
  disabled state, reset behavior, form submission behavior, size or state hooks,
  and switch/thumb hooks.
- `Progress` renders a real `<progress>` element with accessible name/value,
  determinate and indeterminate states, max/value behavior, and customization
  hooks.
- customization probes can override documented tokens or class hooks for each
  family.

Document approved divergences from upstream shadcn/ui/Radix behavior:

- RadCN may use native `<input type="checkbox">` for `Checkbox`.
- RadCN may use native radio inputs for `RadioGroup`.
- RadCN may use native `<input type="checkbox" role="switch">` for `Switch`.
- RadCN may use native `<progress>` for `Progress`.

These divergences are acceptable only if the experiment proves equivalent or
better form, accessibility, interaction, visual, and customization outcomes.

Update documentation for Stage 2 native state primitives. This can extend
`docs/radcn-source.md` or add a focused Stage 2 note. It must explain:

- source and export shape for the four families;
- why these components use native controls instead of Radix custom DOM;
- state attributes, checked/indeterminate/value behavior, and form behavior;
- label, disabled, invalid, required, and reset behavior;
- customization hooks and tokens;
- which Stage 2 questions remain unanswered after this experiment.

## Verification

The experiment passes if:

1. RadCN source exists for all four covered families.
2. `packages/radcn` exports all four families from package subpaths and the root
   index.
3. The Remix 3 candidate app imports all covered components from RadCN source.
4. Shared scenarios include default, checked/value, disabled, invalid,
   indeterminate, customization, and form probes for this batch.
5. Reference and candidate fixture routes exist for every shared scenario.
6. `pnpm radcn:typecheck` passes.
7. `pnpm fixtures:candidate:typecheck` passes.
8. `pnpm fixtures:reference:typecheck` passes.
9. `pnpm fixtures:artifacts` passes and captures paired artifacts for all
   shared scenarios.
10. Component-specific checks prove the native state, form, accessibility, and
    customization behavior listed in `## Changes`.
11. Documentation explains source layout, native-control divergences, state
    hooks, form behavior, and customization hooks for this batch.
12. Any reusable discovery needed by later components is added to the issue
    `## Learnings` section with evidence.
13. No files under `vendor/` are modified.
14. Independent completion review approves the result or findings are fixed and
    recorded.

This experiment does not complete Stage 2. It establishes the native state and
feedback foundation before later Stage 2 experiments handle disclosure, custom
toggle state, sliders, avatar fallback behavior, scroll areas, and the
`hover-card` Stage 2 versus Stage 3 decision.

## Design Review

Independent AI design review was performed by subagent `Pascal`, which approved
the design with no required fixes.

The review confirmed that the experiment is scoped to Stage 2, limited to
`checkbox`, `radio-group`, `switch`, and `progress`, explicitly excludes the
rest of Stage 2 instead of designing the full stage upfront, preserves the
one-experiment-at-a-time workflow, provides concrete verification for all four
families, documents native-control divergences with acceptance tied to form,
accessibility, interaction, visual, and customization outcomes, and keeps
`vendor/` clean.

Implementation caveat from the review: checkbox `indeterminate` cannot be
represented as a plain serialized HTML attribute on a real input. The
implementation must explicitly prove how RadCN exposes and verifies that state
without pretending it is natively serialized HTML.
