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

## Result

**Result:** Pass

Created
`issues/0004-complete-shadcn-parity-and-docs/input-group-example-inventory.md`
as an audit-only inventory for all 11 upstream InputGroup examples:
`input-group-button`, `input-group-button-group`, `input-group-custom`,
`input-group-demo`, `input-group-dropdown`, `input-group-icon`,
`input-group-label`, `input-group-spinner`, `input-group-text`,
`input-group-textarea`, and `input-group-tooltip`.

The inventory records each example's user-facing behavior, current RadCN
evidence, outcome, and required follow-up. It does not mark `input-group`
resolved, because the examples need package/docs/fixture/test depth beyond the
current primitive coverage.

Verification run:

```text
node - <<'NODE'
const fs = require('fs')
const file = 'issues/0004-complete-shadcn-parity-and-docs/input-group-example-inventory.md'
const text = fs.readFileSync(file, 'utf8')
const ids = ['input-group-button','input-group-button-group','input-group-custom','input-group-demo','input-group-dropdown','input-group-icon','input-group-label','input-group-spinner','input-group-text','input-group-textarea','input-group-tooltip']
let failed = false
for (const id of ids) {
  const pattern = new RegExp('\\| `'+id+'` \\|', 'g')
  const count = (text.match(pattern) || []).length
  console.log(`${id}: ${count}`)
  if (count !== 1) failed = true
}
if (failed) process.exit(1)
NODE
```

Output:

```text
input-group-button: 1
input-group-button-group: 1
input-group-custom: 1
input-group-demo: 1
input-group-dropdown: 1
input-group-icon: 1
input-group-label: 1
input-group-spinner: 1
input-group-text: 1
input-group-textarea: 1
input-group-tooltip: 1
```

```text
rg -n "input-group-button|input-group-button-group|input-group-custom|input-group-demo|input-group-dropdown|input-group-icon|input-group-label|input-group-spinner|input-group-text|input-group-textarea|input-group-tooltip|popover|dropdown|tooltip|Spinner|ButtonGroup|Label|Separator|type=\"email\"|type=\"password\"|useState|useCopyToClipboard|react-textarea-autosize" issues/0004-complete-shadcn-parity-and-docs/input-group-example-inventory.md
```

Confirmed that the inventory addresses all required examples and mapping
topics: buttons, icon-sized buttons, ButtonGroup composition, custom autosizing
textarea behavior, full demo composition, DropdownMenu, icons, labels, Popover,
Spinner, text addons, textarea toolbars, Tooltip, non-text input types, React
state, and third-party dependency mappings.

Additional verification:

```text
rg -n "input-group-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
git diff --check
git status --short
for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done
```

Observed output:

```text
issues/0004-complete-shadcn-parity-and-docs/README.md:280:  `input-group-example-inventory.md`. InputGroup example parity is not complete
```

`git diff --check` passed with no output. `git status --short` showed only the
expected issue documentation changes:

```text
 M issues/0004-complete-shadcn-parity-and-docs/15-audit-input-group-example-parity.md
 M issues/0004-complete-shadcn-parity-and-docs/README.md
?? issues/0004-complete-shadcn-parity-and-docs/input-group-example-inventory.md
```

The vendor status loop printed no output.

## Conclusion

InputGroup parity is not resolved yet. RadCN has the base InputGroup package
API and primitive fixture evidence, but upstream example parity requires a
depth implementation pass for Popover, DropdownMenu, Tooltip, Spinner,
ButtonGroup, Label, Separator, icon addons, icon buttons, text addons, textarea
toolbars, custom textarea mapping, and non-text input types.

The next experiment should implement InputGroup example parity depth, then mark
`input-group` resolved only after docs, fixtures, Playwright coverage, and the
inventory prove all 11 upstream examples are covered or intentionally diverged.

## Completion Review

Reviewer: Meitner (`019e9a87-cd6f-7363-b3e0-7d7c571f78b9`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: none.
- Major: none.
- Minor: the Additional verification section listed `rg`, `git diff --check`,
  `git status --short`, and the vendor status loop without recording their
  outputs or explicit pass/no-output results. Fixed by adding the observed
  README `rg` output, `git diff --check` no-output result, expected
  `git status --short` output, and vendor status no-output result.

Approval result: approved. Meitner independently reran the checks and confirmed
that the inventory has exactly one row for each required InputGroup id,
`git diff --check` is clean, vendor status checks print no output, only issue
documentation is changed, no nested git repositories outside `./.git` were
found, the result commit had not been made before review, and the README marks
Experiment 15 as `Pass` with the required follow-up learnings.
