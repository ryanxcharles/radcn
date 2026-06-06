# Experiment 13: Audit button-group example parity

## Description

The regenerated Issue 4 parity inventory now recommends example parity for
`button-group`. RadCN already exports `ButtonGroup`, `ButtonGroupText`, and
`ButtonGroupSeparator`, and it has basic fixture coverage for horizontal,
vertical, and separator cases. Upstream shadcn/ui has 11 ButtonGroup examples
that exercise a broader surface: nested groups, split buttons, size variants,
inputs, input groups, selects, dropdown menus, popovers, separators, vertical
orientation, and React-owned state.

This experiment audits that upstream example surface before implementation. It
should identify which examples are already covered, which need package/docs/test
depth, and which React-only mechanics should map to Remix 3 web-first behavior.
It must not implement new package APIs.

## Changes

- Create
  `issues/0004-complete-shadcn-parity-and-docs/button-group-example-inventory.md`.
  - List all 11 upstream ButtonGroup example ids:
    `button-group-demo`, `button-group-dropdown`, `button-group-input`,
    `button-group-input-group`, `button-group-nested`,
    `button-group-orientation`, `button-group-popover`,
    `button-group-select`, `button-group-separator`, `button-group-size`, and
    `button-group-split`.
  - For each example, record user-facing behavior, current RadCN evidence,
    outcome, and follow-up.
  - Use outcomes `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - Record mapping decisions for React-only `useState`, `asChild`, icon
    packages, and controlled select/dropdown/input-group behavior.
- Inspect these upstream references:
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/button-group.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/button-group-*.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
- Inspect current RadCN evidence:
  - `radcn/packages/radcn/src/components/button-group.tsx`
  - `radcn/packages/radcn/src/components/button.tsx`
  - `radcn/packages/radcn/src/components/input.tsx`
  - `radcn/packages/radcn/src/components/input-group.tsx`
  - `radcn/packages/radcn/src/components/select.tsx`
  - `radcn/packages/radcn/src/components/dropdown-menu.tsx`
  - `radcn/packages/radcn/src/components/popover.tsx`
  - `radcn/apps/docs/app/content/components.tsx`
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/navigation-collection.tsx`
  - `radcn/fixtures/tests/navigation-collection.spec.ts`
- Update Issue 4 `README.md` learnings with the audit result and the next
  recommended implementation cluster.
- Do not change `radcn/packages/radcn`, docs app source, fixture app source, or
  tests in this experiment except for issue documentation.

## Verification

Pass criteria:

- `button-group-example-inventory.md` exists and contains exactly one table row
  for each upstream ButtonGroup example id.
- A deterministic Node check proves all 11 upstream ButtonGroup example ids
  appear exactly once in `button-group-example-inventory.md`.
- The inventory distinguishes current evidence from follow-up work and does not
  mark the cluster resolved unless every upstream example is `Covered` or
  `Intentional divergence`.
- The inventory explicitly addresses:
  - nested ButtonGroups;
  - split buttons;
  - small/default/large and icon sizes;
  - input composition;
  - input-group composition;
  - select composition;
  - dropdown-menu composition;
  - popover composition;
  - separator behavior;
  - vertical orientation;
  - React state mappings for demo/input-group/select examples.
- `issues/0004-complete-shadcn-parity-and-docs/README.md` records the audit
  conclusion and the next recommended experiment.
- `rg -n "button-group-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md`
  finds the new learning.
- `git diff --check`
- `git status --short` shows only expected issue documentation changes before
  the plan/result commits.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any upstream ButtonGroup example id from the generated
  inventory.
- The audit treats React implementation details as mandatory RadCN behavior
  instead of mapping to equivalent user-facing behavior.
- The audit marks `button-group` resolved without package/docs/fixture/test
  evidence for the full upstream example surface.
- The experiment changes package, docs app, fixture, or test source instead of
  staying an audit.

## Design Review

Reviewer: Leibniz (`019e9a6d-44db-7be3-b191-ddb634ebc753`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval result: approved. Leibniz confirmed the issue README links Experiment
13 as `Designed`, the experiment has the required Description, Changes, and
Verification sections, the scope is audit-only, source changes are explicitly
excluded, and the verification includes concrete pass/fail criteria plus diff,
status, and vendor hygiene checks.

## Result

**Result:** Pass

The ButtonGroup example parity audit is complete.

Created
`issues/0004-complete-shadcn-parity-and-docs/button-group-example-inventory.md`
with all 11 upstream ButtonGroup example ids:

- `button-group-demo`
- `button-group-dropdown`
- `button-group-input`
- `button-group-input-group`
- `button-group-nested`
- `button-group-orientation`
- `button-group-popover`
- `button-group-select`
- `button-group-separator`
- `button-group-size`
- `button-group-split`

The audit concludes that ButtonGroup example parity is not complete yet. RadCN
has the base package API and basic horizontal, vertical, separator, and text-hook
proof, but it still needs broader docs, fixture, and Playwright proof for nested
groups, split buttons, size matrices, input and InputGroup composition, Select
composition, DropdownMenu and Popover compositions, accessible vertical icon
groups, and React state mappings.

Verification run on 2026-06-05:

- Deterministic ButtonGroup id check — passed; all 11 upstream ButtonGroup ids
  appear exactly once in `button-group-example-inventory.md`.
- Deterministic required-topic check — passed; the inventory addresses nested
  ButtonGroups, split buttons, small/default/large and icon sizes, input
  composition, InputGroup composition, Select composition, DropdownMenu
  composition, Popover composition, separator behavior, vertical orientation,
  and React `useState` mappings.
- `rg -n 'nested|split|small/default/large|input composition|InputGroup|select composition|DropdownMenu|Popover|separator|vertical orientation|React \`useState\`|React state' issues/0004-complete-shadcn-parity-and-docs/button-group-example-inventory.md`
  — passed.
- `rg -n "button-group-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md`
  — passed.
- `git diff --check` — passed.
- `git status --short` showed only expected issue documentation changes before
  completion review:
  `13-audit-button-group-example-parity.md`, `README.md`, and
  `button-group-example-inventory.md`.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  — passed with no output.

## Conclusion

ButtonGroup should be the next implementation cluster. The follow-up experiment
should implement ButtonGroup example parity depth by adding docs, candidate
fixtures, and focused Playwright proof for all 11 upstream examples, while
recording intentional divergences for React state and `asChild`.

## Completion Review

Reviewer: Ptolemy (`019e9a70-3e27-73c1-ba93-629f07445729`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: none.
- Major: none.
- Minor: the recorded `git status --short` evidence omitted the modified
  Experiment 13 file itself. Fixed by updating the status evidence to list
  `13-audit-button-group-example-parity.md`, `README.md`, and
  `button-group-example-inventory.md`.

Ptolemy verified that Result and Conclusion are present, the Issue 4 README
marks Experiment 13 as `Pass`, README learnings record the ButtonGroup audit and
next implementation cluster, the inventory has exactly one row for each of the
11 upstream ButtonGroup ids, `git diff --check` exits 0, vendor status checks
print no output, no package/docs app/fixture/test source files are changed, and
the result commit had not been made before review.

Approval result: approved. No blocker findings remain.
