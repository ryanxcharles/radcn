# Experiment 75: Migrate Field, Form, and InputGroup residuals

## Description

Experiment 74 cleared the Select/DatePicker trigger cluster. The next cluster
identified by Experiment 73 is Field/Form/InputGroup residual styling:

- Field invalid-label cascades and the consumer `radcn-field--choice-card`
  modifier;
- Form invalid-label cascades;
- InputGroup nested Input/Textarea resets, addon alignment/borders, and
  InputGroup button size modifiers;
- ButtonGroup coupling for Button, raw Input, and InputGroup children.

This experiment migrates only that cluster. It should not migrate the later
state-indicator residuals, modal/drawer layout residuals, or docs/fixture/demo
CSS evacuation beyond the `radcn-field--choice-card` call sites that belong to
this cluster.

The main risk is cascade order. Existing package CSS deliberately overrides
migrated Input/Textarea/Button utilities from outside their components. The
migration should move those overrides into the owning component's emitted
Tailwind utilities or into Tailwind-scanned consumer call sites while preserving
marker classes and behavior hooks.

## Changes

- `radcn/packages/radcn/src/components/field.tsx`:
  - add parent-state descendant utilities to the Field root so
    `[data-invalid="true"]` colors `FieldLabel` and nested `Label` hooks without
    package CSS;
  - update comments to remove the now-stale bespoke invalid-label and
    choice-card explanation;
  - keep `data-radcn-field`, `data-radcn-field-label`, and
    `data-radcn-label` behavior/test hooks.
- Field choice-card consumer sites:
  - append Tailwind utilities equivalent to `.radcn-field--choice-card`
    (`border`, token border color, radius, padding) at every raw call site that
    uses the marker class;
  - keep the `radcn-field--choice-card` marker class for existing tests and
    docs text unless no references require it.
- `radcn/packages/radcn/src/components/form.tsx`:
  - add equivalent parent-state/self-state utilities for
    `FormLabel(error)`, `FormField(invalid)`, and `FormItem(invalid)` label
    color behavior;
  - preserve `radcn-form-label`, `data-radcn-form-field`,
    `data-radcn-form-item`, and `data-radcn-form-label` hooks.
- `radcn/packages/radcn/src/components/input-group.tsx`:
  - move nested Input/Textarea border/radius/shadow/focus reset behavior into
    the emitted InputGroupInput/InputGroupTextarea utility strings;
  - move addon alignment and border behavior into addon utility maps keyed by
    `align`;
  - move InputGroupButton size modifiers into button utility maps keyed by
    `size`, including `sm`, `icon-xs`, and `icon-sm`;
  - keep marker classes such as `radcn-input-group`,
    `radcn-input-group-addon--{align}`, and
    `radcn-input-group-button--{size}` for tests, docs, and raw overlay trigger
    sites.
- Raw InputGroup button-like sites in docs/fixtures:
  - append the same size utility maps to raw `TooltipTrigger`,
    `PopoverTrigger`, and `DropdownMenuTrigger` call sites that carry
    `radcn-input-group-button radcn-input-group-button--{size}` but do not go
    through `InputGroupButton`.
- `radcn/packages/radcn/src/components/button-group.tsx`:
  - move Button/Input/InputGroup grouping cascades into scoped descendant
    Tailwind utilities emitted by ButtonGroup;
  - keep only the grouping subset owned by ButtonGroup in this experiment,
    preserving ButtonGroup marker classes and separator rules as needed.
- `radcn/packages/radcn/src/styles/tokens.css` and
  `radcn/packages/radcn/src/styles/index.ts`:
  - remove the migrated Field invalid-label and choice-card rules;
  - remove the migrated Form invalid-label rules;
  - remove the migrated InputGroup nested control, addon, and button-size rules;
  - remove migrated ButtonGroup Button/Input/InputGroup coupling rules;
  - keep theme tokens, custom fixture token variables, keyframes, unrelated
    component residuals, and behavior/layout glue outside this cluster;
  - regenerate `styles/index.ts` from `tokens.css` with the repository's
    JSON-stringify formula.
- `issues/0006-tailwind-required-styling-model/README.md`:
  - update the experiment index status when the result is recorded;
  - copy durable Field/Form/InputGroup/ButtonGroup coupling findings into
    `## Learnings`;
  - update the remaining cluster queue if the experiment passes.

## Verification

1. Build style output:
   - `pnpm --dir radcn/fixtures/candidate-remix styles:build`
   - `pnpm --dir radcn/apps/docs styles:build`
2. Typecheck:
   - `pnpm radcn:typecheck`
   - `pnpm fixtures:candidate:typecheck`
   - `pnpm fixtures:reference:typecheck`
   - `pnpm --dir radcn/apps/docs typecheck`
3. Confirm generated CSS contains representative migrated utilities for:
   - Field/Form invalid label color descendant/self-state behavior;
   - choice-card border/radius/padding utilities from docs and fixture call
     sites;
   - InputGroup nested Input/Textarea resets;
   - InputGroup addon align/border variants;
   - InputGroup button size variants, including raw overlay trigger call sites;
   - ButtonGroup descendant coupling for Button, raw Input, and InputGroup
     children in horizontal and vertical groups.
4. Confirm `tokens.css` and `radcn/packages/radcn/src/styles/index.ts` are in
   sync with the repository's JSON-stringify formula after the CSS edit.
5. Confirm `tokens.css` no longer contains migrated visual rules for:
   - `[data-radcn-field][data-invalid="true"] [data-radcn-field-label]`;
   - `[data-radcn-field][data-invalid="true"] [data-radcn-label]`;
   - `.radcn-field--choice-card`;
   - `.radcn-form-label[data-error="true"]`;
   - `.radcn-form-field[data-invalid="true"] .radcn-form-label`;
   - `.radcn-form-item[data-invalid="true"] .radcn-form-label`;
   - `.radcn-input-group [data-radcn-input]`;
   - `.radcn-input-group [data-radcn-textarea]`;
   - `.radcn-input-group-addon--*` visual rules;
   - `.radcn-input-group-button--*` visual rules;
   - migrated ButtonGroup Button/Input/InputGroup child coupling rules.
6. Focused Playwright gates:
   - `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts tests/form-input-cluster.spec.ts tests/native-controls.spec.ts tests/native-state.spec.ts tests/static-display.spec.ts tests/navigation-collection.spec.ts`
   - `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts`
7. Full fixture artifact gate:
   - `pnpm fixtures:artifacts`
8. Hygiene:
   - `git diff --check`
   - `git status --short`
   - `git diff --name-only | rg '^vendor/'` must produce no matches.

Pass criteria:

- Field and Form invalid label color comes from Tailwind utilities, not package
  CSS cascades.
- Choice-card visuals come from Tailwind-scanned call-site utilities, not the
  package `.radcn-field--choice-card` rule.
- InputGroup nested control resets, addon align/border styling, and button size
  styling come from component-emitted or call-site Tailwind utilities.
- ButtonGroup still joins Button, raw Input, and InputGroup children correctly
  in horizontal and vertical groups.
- Existing Field, Form, InputGroup, ButtonGroup, docs, and fixture behavior
  remains green.
- The Issue 6 README records the result status and durable learnings from the
  cluster.
- No unrelated state-indicator, modal/drawer, or broad docs/fixture evacuation
  work is migrated.

Fail criteria:

- Any focused Field/Form/InputGroup/ButtonGroup test regresses.
- The migration requires keeping the same package CSS visual cascades.
- The migration removes marker classes or behavior hooks used by tests/docs.
- Tailwind does not generate the arbitrary descendant utilities needed for the
  cluster.
- Raw overlay trigger call sites lose their InputGroup button sizing.

## Design Review

Reviewer: Confucius (`019ebe24-249b-7781-8c76-6dff1d5ed754`), fresh Codex
subagent with `fork_context: false`.

Initial findings:

- Minor: the description said "The next Experiment 73 cluster," which was
  internally confusing for Experiment 75.

Fixes:

- Reworded the sentence to "The next cluster identified by Experiment 73."

Approval result: approved. No blocker or major findings were reported. The
reviewer confirmed the issue README links Experiment 75 as `Designed`, the
experiment includes the required sections, verification has concrete pass/fail
criteria and hygiene checks, no source implementation had started before the
plan commit, and the technical scope matches the residual CSS and component
structure for Field/Form invalid-label cascades, InputGroup residuals, and
ButtonGroup child coupling.

## Result

**Result:** Pass

The Field/Form/InputGroup residual cluster migrated successfully.

Changes made:

- `field.tsx` now emits invalid descendant label color through Tailwind
  parent-state utilities on the Field root.
- Field choice-card raw call sites in the candidate fixture and docs now carry
  Tailwind border/radius/padding utilities beside the
  `radcn-field--choice-card` marker.
- `form.tsx` now emits self-state and parent-state Tailwind utilities for
  `FormLabel(error)`, `FormField(invalid)`, and `FormItem(invalid)` label color
  behavior.
- `input-group.tsx` now emits nested Input/Textarea reset utilities, addon
  align/border utility maps, and InputGroupButton size utility maps.
- Raw InputGroup overlay trigger sites in docs and fixtures now include the
  equivalent size utilities beside their existing
  `radcn-input-group-button--{size}` marker classes.
- `button-group.tsx` now emits the remaining ButtonGroup vertical, clustered,
  nested, separator, Button, raw Input, and InputGroup coupling behavior through
  Tailwind utilities.
- `tokens.css` removed the migrated Field/Form/InputGroup/ButtonGroup rules and
  `styles/index.ts` was regenerated from `tokens.css`.

Verification run:

- `pnpm --dir radcn/fixtures/candidate-remix styles:build` — pass.
- `pnpm --dir radcn/apps/docs styles:build` — pass.
- `pnpm radcn:typecheck` — pass.
- `pnpm fixtures:candidate:typecheck` — pass.
- `pnpm fixtures:reference:typecheck` — pass.
- `pnpm --dir radcn/apps/docs typecheck` — pass.
- Generated CSS evidence confirmed representative Field/Form invalid label
  variants, choice-card utilities, InputGroup border/addon utilities, and
  ButtonGroup descendant coupling utilities in the candidate fixture and docs
  generated CSS.
- Removed-rule checks confirmed `tokens.css` no longer contains the migrated
  Field/Form invalid label selectors, `.radcn-field--choice-card`,
  InputGroup nested control/addon/button-size selectors, or ButtonGroup child
  coupling selectors.
- Style sync check for `tokens.css` and `styles/index.ts` — pass,
  `styles in sync`.
- Focused fixture Playwright gate:
  `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts tests/form-input-cluster.spec.ts tests/native-controls.spec.ts tests/native-state.spec.ts tests/static-display.spec.ts tests/navigation-collection.spec.ts`
  — 47 passed.
- Docs Playwright gate:
  `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts` —
  11 passed.
- Full fixture artifact gate: `pnpm fixtures:artifacts` — 1191 passed.
- `git diff --check` — pass.
- `git status --short` — inspected before result commit; only Experiment 75
  issue docs, package source/style files, and the planned docs/fixture raw
  marker call sites were modified.
- `git diff --name-only | rg '^vendor/'` — no matches.

## Conclusion

Experiment 75 clears the Field/Form/InputGroup residual cluster identified by
Experiment 73. Tailwind v4 generated the parent-state descendant utilities
needed for invalid Field/Form labels and the self/descendant utilities needed
for ButtonGroup's remaining grouping behavior. For consumer-only marker classes
that package components do not emit directly, such as choice-card examples and
raw InputGroup overlay triggers, the reliable pattern is to keep the marker for
tests/docs while adding the equivalent Tailwind utilities at the scanned call
site.

## Completion Review

Reviewer: Hypatia (`019ebe2c-afc8-7751-aa3a-212d43323592`), fresh Codex
subagent with `fork_context: false`.

Findings:

- Minor: the planned hygiene checks listed `git status --short`, but the result
  evidence recorded only `git diff --check` and the vendor diff check.
- Minor: a `tokens.css` comment still said InputGroup/ButtonGroup target
  `[data-radcn-input]` and `[data-radcn-textarea]` rules "below", even though
  the matching rules moved to component-emitted utilities.

Fixes:

- Added the `git status --short` evidence to the result record.
- Updated the stale `tokens.css` comment and regenerated `styles/index.ts`.

Approval result: approved. No blocker or major findings were reported. The
reviewer also verified `git diff --check`, style sync, vendor cleanliness, and
that the result commit had not yet been made.
