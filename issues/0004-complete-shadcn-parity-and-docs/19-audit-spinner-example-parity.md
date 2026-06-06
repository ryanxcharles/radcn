# Experiment 19: Audit spinner example parity

## Description

The regenerated Issue 4 parity inventory now recommends example parity for
`spinner`. RadCN already exports `Spinner` as an accessible SVG status
indicator with a default `ariaLabel`, package styling hooks, CSS-variable
customization for size and color, docs seed coverage, and candidate fixture
coverage for default and custom-size spinners.

Upstream shadcn/ui has 10 Spinner example families that exercise a broader
example surface: standalone spinner usage, size changes, color changes, custom
spinner replacement, Button loading composition, Badge loading composition,
InputGroup loading composition, Empty loading composition, Item loading
composition, and Progress composition inside an Item loading row. The upstream
registry also includes `input-group-spinner`, which is an InputGroup example
using Spinner and LoaderIcon; that related example should be checked as
existing InputGroup evidence, but this experiment should keep the Spinner audit
focused on Spinner-owned behavior and Spinner composition gaps.

This experiment audits the upstream Spinner example surface before
implementation. It should identify which examples are already covered, which
need package/docs/test depth, and which React-only, lucide-only, or
presentation mechanics should map to Remix 3 web-first behavior. It must not
implement new package APIs.

## Changes

- Create
  `issues/0004-complete-shadcn-parity-and-docs/spinner-example-inventory.md`.
  - List all 10 upstream Spinner example ids:
    `spinner-badge`, `spinner-basic`, `spinner-button`, `spinner-color`,
    `spinner-custom`, `spinner-demo`, `spinner-empty`,
    `spinner-input-group`, `spinner-item`, and `spinner-size`.
  - For each example, record user-facing behavior, current RadCN evidence,
    outcome, and follow-up.
  - Use outcomes `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - Record mapping decisions for lucide `LoaderIcon`/`Loader2Icon`, React SVG
    component props, Tailwind `size-*` and `text-*` utility customization,
    custom spinner replacement, loading text, disabled Button composition,
    Badge composition, InputGroup composition, Empty composition, Item
    composition, Progress composition, accessible status names, reduced-motion
    considerations if relevant, and whether Spinner needs package props for
    size/color or should keep those as class/style/CSS-variable customization.
- Inspect these upstream references:
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/spinner.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/spinner-*.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/input-group-spinner.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/_registry.ts`
- Inspect current RadCN evidence:
  - `radcn/packages/radcn/src/components/spinner.tsx`
  - `radcn/packages/radcn/src/components/button.tsx`
  - `radcn/packages/radcn/src/components/badge.tsx`
  - `radcn/packages/radcn/src/components/input-group.tsx`
  - `radcn/packages/radcn/src/components/empty.tsx`
  - `radcn/packages/radcn/src/components/item.tsx`
  - `radcn/packages/radcn/src/components/progress.tsx`
  - `radcn/packages/radcn/src/styles/tokens.css`
  - `radcn/apps/docs/app/content/components.tsx`
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/static-display.tsx`
  - `radcn/fixtures/candidate-remix/app/fixtures/input-group.tsx`
  - `radcn/fixtures/candidate-remix/app/fixtures/navigation-collection.tsx`
  - `radcn/fixtures/tests/static-display.spec.ts`
  - `radcn/fixtures/tests/form-input-cluster.spec.ts`
  - `radcn/fixtures/tests/navigation-collection.spec.ts`
- Update Issue 4 `README.md` learnings with the audit result and the next
  recommended implementation cluster.
- Do not change `radcn/packages/radcn`, docs app source, fixture app source, or
  tests in this experiment except for issue documentation.

## Verification

Pass criteria:

- `spinner-example-inventory.md` exists and contains exactly one table row for
  each upstream Spinner example id.
- A deterministic Node check proves all 10 upstream Spinner example ids appear
  exactly once in `spinner-example-inventory.md`.
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/spinner-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const ids = ['spinner-badge','spinner-basic','spinner-button','spinner-color','spinner-custom','spinner-demo','spinner-empty','spinner-input-group','spinner-item','spinner-size']
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
- The inventory distinguishes current evidence from follow-up work and does not
  mark the cluster resolved unless every upstream example is `Covered` or
  `Intentional divergence`.
- The inventory explicitly addresses:
  - standalone status spinner semantics;
  - accessible `role="status"` and `aria-label` behavior;
  - default loading label behavior;
  - size customization;
  - color customization;
  - custom spinner replacement;
  - Button loading composition with disabled buttons and loading text;
  - Badge loading composition;
  - InputGroup loading composition, including the related
    `input-group-spinner` example as prior InputGroup evidence;
  - Empty loading composition;
  - Item loading composition with secondary content;
  - Progress composition inside an Item loading row;
  - lucide icon package mapping;
  - React SVG component prop mapping;
  - Tailwind utility mapping to RadCN classes, styles, or CSS variables;
  - current RadCN package/docs/fixture/Playwright evidence.
- `issues/0004-complete-shadcn-parity-and-docs/README.md` records the audit
  conclusion and the next recommended experiment.
- `rg -n "spinner-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md`
  finds the new learning.
- `git diff --check`
- `git status --short` shows only expected issue documentation changes before
  the plan/result commits.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any upstream Spinner example id from the generated inventory.
- The audit treats React component props, lucide icons, Tailwind utility class
  names, or custom spinner replacement as mandatory RadCN package dependencies
  instead of mapping them to equivalent user-facing behavior.
- The audit marks `spinner` resolved without package/docs/fixture/test evidence
  for the full upstream example surface.
- The audit ignores the related `input-group-spinner` example when deciding
  whether InputGroup loading composition is already covered.
- The experiment changes package, docs app, fixture, or test source instead of
  staying an audit.

## Design Review

Reviewer: Kant (`019e9ab9-25fc-7372-858e-0155c07eae7d`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval result: approved. Kant confirmed the Issue 4 README links Experiment
19 as `Designed`, the experiment has the required sections, the scope is
audit-only and explicitly forbids package/docs/fixture/test implementation
changes, verification includes concrete pass/fail criteria and repo hygiene
checks, vendor paths are only inspected as read-only references, the upstream
Spinner example set matches the generated parity inventory and registry
evidence, and current git status showed only the issue README modification and
new experiment file.
