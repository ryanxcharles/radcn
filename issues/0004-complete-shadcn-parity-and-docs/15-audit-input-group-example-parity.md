# Experiment 15: Audit input-group example parity

## Description

The regenerated Issue 4 parity inventory now recommends example parity for
`input-group`. RadCN already exports `InputGroup`, `InputGroupAddon`,
`InputGroupButton`, `InputGroupText`, `InputGroupInput`, and
`InputGroupTextarea`, and it has fixture coverage for default input groups,
inline addons, nested buttons, textarea controls, disabled/invalid state, form
submit/reset behavior, block addons, and custom token styling.

Upstream shadcn/ui has 11 InputGroup examples that exercise a broader example
surface: icon addons, labels inside groups, tooltips, dropdowns, buttons,
ButtonGroup composition, spinners/loading state, text addons, textarea toolbars,
custom autosizing textarea behavior, and a full demo composition.

This experiment audits that upstream example surface before implementation. It
should identify which examples are already covered, which need package/docs/test
depth, and which React-only or third-party mechanics should map to Remix 3
web-first behavior. It must not implement new package APIs.

## Changes

- Create
  `issues/0004-complete-shadcn-parity-and-docs/input-group-example-inventory.md`.
  - List all 11 upstream InputGroup example ids:
    `input-group-button`, `input-group-button-group`, `input-group-custom`,
    `input-group-demo`, `input-group-dropdown`, `input-group-icon`,
    `input-group-label`, `input-group-spinner`, `input-group-text`,
    `input-group-textarea`, and `input-group-tooltip`.
  - For each example, record user-facing behavior, current RadCN evidence,
    outcome, and follow-up.
  - Use outcomes `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - Record mapping decisions for React `useState`, `useCopyToClipboard`,
    `react-textarea-autosize`, shadcn `asChild`, icon packages, dropdown,
    popover, tooltip, spinner, ButtonGroup, Label, Separator composition, and
    non-text input type parity.
- Inspect these upstream references:
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/input-group.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/input-group-*.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
- Inspect current RadCN evidence:
  - `radcn/packages/radcn/src/components/input-group.tsx`
  - `radcn/packages/radcn/src/components/button-group.tsx`
  - `radcn/packages/radcn/src/components/dropdown-menu.tsx`
  - `radcn/packages/radcn/src/components/popover.tsx`
  - `radcn/packages/radcn/src/components/tooltip.tsx`
  - `radcn/packages/radcn/src/components/spinner.tsx`
  - `radcn/packages/radcn/src/components/label.tsx`
  - `radcn/packages/radcn/src/components/separator.tsx`
  - `radcn/apps/docs/app/content/components.tsx`
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/input-group.tsx`
  - `radcn/fixtures/tests/form-input-cluster.spec.ts`
- Update Issue 4 `README.md` learnings with the audit result and the next
  recommended implementation cluster.
- Do not change `radcn/packages/radcn`, docs app source, fixture app source, or
  tests in this experiment except for issue documentation.

## Verification

Pass criteria:

- `input-group-example-inventory.md` exists and contains exactly one table row
  for each upstream InputGroup example id.
- A deterministic Node check proves all 11 upstream InputGroup example ids
  appear exactly once in `input-group-example-inventory.md`.
- The inventory distinguishes current evidence from follow-up work and does not
  mark the cluster resolved unless every upstream example is `Covered` or
  `Intentional divergence`.
- The inventory explicitly addresses:
  - input group buttons and icon-sized buttons;
  - ButtonGroup composition;
  - custom autosizing textarea behavior;
  - the full demo composition;
  - dropdown composition;
  - icon addons;
  - label composition;
  - popover composition;
  - spinner/loading composition;
  - text addons;
  - textarea toolbar composition;
  - tooltip composition;
  - non-text input types such as email and password;
  - React state and third-party dependency mappings.
- `issues/0004-complete-shadcn-parity-and-docs/README.md` records the audit
  conclusion and the next recommended experiment.
- `rg -n "input-group-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md`
  finds the new learning.
- `git diff --check`
- `git status --short` shows only expected issue documentation changes before
  the plan/result commits.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any upstream InputGroup example id from the generated
  inventory.
- The audit treats React implementation details, shadcn `asChild`, or
  third-party autosize/copy hooks as mandatory RadCN package behavior instead of
  mapping to equivalent user-facing behavior.
- The audit marks `input-group` resolved without package/docs/fixture/test
  evidence for the full upstream example surface.
- The experiment changes package, docs app, fixture, or test source instead of
  staying an audit.

## Design Review

Reviewer: Singer (`019e9a82-52f0-7560-bc02-cd721f502028`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: none.
- Major: none.
- Minor: the explicit verification checklist omitted popover composition even
  though upstream `input-group-button` uses Popover. Fixed by adding popover
  composition to the audit checklist.
- Minor: the checklist did not explicitly require auditing non-text input type
  parity even though upstream examples use `type="email"` and `type="password"`
  while current RadCN Input hardcodes `type="text"`. Fixed by adding non-text
  input type parity to the audit checklist and mapping decisions.

Approval result: approved after applying the two checklist fixes. Singer
confirmed the issue README links Experiment 15 as `Designed`, the experiment is
audit-only, repo hygiene checks are present, vendor changes are excluded, and
the plan is likely to achieve the stated audit goal.
