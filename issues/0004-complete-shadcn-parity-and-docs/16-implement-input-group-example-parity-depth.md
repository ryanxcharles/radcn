# Experiment 16: Implement input-group example parity depth

## Description

Experiment 15 audited all 11 upstream shadcn InputGroup examples and found that
RadCN's base InputGroup package exists, but example parity depth is not
complete. Current proof covers primitive grouping, inline and block addons,
nested submit buttons, textarea controls, disabled/invalid state, native
submit/reset, custom tokens, and addon click-to-focus.

This experiment implements the missing InputGroup example depth. It should keep
RadCN's Remix 3 model: no React dependency, no `asChild`, no upstream icon
package dependency, no `react-textarea-autosize`, no `useCopyToClipboard`, no
vendor imports, and no npm publishing.

## Changes

- Update `radcn/packages/radcn/src/components/input.tsx`.
  - Add a typed `type` prop for standard native text-like input types needed by
    the upstream examples, including `text`, `email`, `password`, `url`,
    `search`, and `tel`.
  - Preserve the current default of `type="text"`.
- Update `radcn/packages/radcn/src/components/input-group.tsx`.
  - Pass the new `type` prop through `InputGroupInput`.
  - Add `ariaLabel` to `InputGroupButton` if needed so icon-only buttons inside
    InputGroup can expose accessible names through the existing Button API.
  - Add `readonly` support to `InputGroupInput` only if needed for the
    upstream read-only copy example.
  - Keep InputGroup as a layout/control-shell primitive; do not add state,
    clipboard, autosize, dropdown, popover, tooltip, spinner, label, or
    separator ownership to the package.
- Update RadCN styles if composition gaps appear:
  - `radcn/packages/radcn/src/styles/tokens.css`
  - `radcn/packages/radcn/src/styles/index.ts`
  Refine only the hooks required for InputGroup composition with icon addons,
  icon buttons, ButtonGroup, PopoverTrigger, DropdownMenuTrigger,
  TooltipTrigger, Spinner, Label, Separator, text addons, and block toolbar
  rows.
- Update docs in `radcn/apps/docs/app/content/components.tsx`.
  - Expand the Input Group docs page from seed coverage into rich docs.
  - Demonstrate all 11 upstream InputGroup example families:
    `button`, `button-group`, `custom`, `demo`, `dropdown`, `icon`, `label`,
    `spinner`, `text`, `textarea`, and `tooltip`.
  - Document that shadcn `asChild` maps to explicit RadCN trigger components.
  - Document that React `useState`, `useCopyToClipboard`, and
    `react-textarea-autosize` map to server/default state, submitted native
    state, route state, app-owned dependency-free enhancement, or documented
    custom control hooks rather than package dependencies.
  - Keep installation copy aspirational and do not claim RadCN is published.
- Update candidate fixtures:
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/input-group.tsx`
  Add fixture scenarios for all 11 upstream InputGroup examples:
  `button`, `button-group`, `custom`, `demo`, `dropdown`, `icon`, `label`,
  `spinner`, `text`, `textarea`, and `tooltip`. Preserve the existing
  primitive scenarios unless a replacement intentionally proves the same
  behavior.
- Update Playwright coverage in
  `radcn/fixtures/tests/form-input-cluster.spec.ts` or a focused InputGroup
  test file if that keeps the suite clearer. Verify:
  - InputGroup buttons support submit buttons, icon-sized buttons, accessible
    icon-only names, and read-only copy/favorite mappings without React state;
  - ButtonGroup composition renders `data-radcn-button-group` around a nested
    `data-radcn-input-group` and keeps label/suffix text accessible;
  - custom textarea mapping uses native `InputGroupTextarea` or a documented
    custom control hook, not `react-textarea-autosize`;
  - the full demo composition renders search icon/text addons, Tooltip,
    DropdownMenu, Separator, textarea toolbar, disabled send action, and
    verified-handle status;
  - DropdownMenu composition uses explicit RadCN trigger components inside
    InputGroup addons;
  - icon addons render presentation-only icons and accessible controls without
    upstream icon package dependencies;
  - Label composition works inside inline and block addons;
  - Popover composition uses explicit RadCN PopoverTrigger components;
  - Spinner/loading composition renders Spinner in inline-start and inline-end
    addons;
  - text addons cover representative currency, URL prefix/suffix, domain
    suffix, and textarea character-count patterns;
  - textarea toolbar composition renders block-start and block-end action rows;
  - Tooltip composition works for password/email/API-key help buttons;
  - non-text inputs render native `type="email"` and `type="password"`.
- Update
  `issues/0004-complete-shadcn-parity-and-docs/input-group-example-inventory.md`.
  - Change each upstream row to `Covered` or `Intentional divergence` after the
    new proof lands.
  - Preserve mapping decisions from Experiment 15.
- Update `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Mark `input-group` as a resolved example cluster with evidence from
    Experiments 15 and 16 plus `input-group-example-inventory.md`.
- Regenerate `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`.
- Update Issue 4 learnings with the final InputGroup outcome and the next
  generated recommendation.

## Verification

Pass criteria:

- `pnpm radcn:typecheck`
- `pnpm --dir radcn/apps/docs typecheck`
- `pnpm fixtures:candidate:typecheck`
- `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts form-input-cluster.spec.ts`
  or the focused InputGroup Playwright spec created by this experiment.
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts`
- `node scripts/audit-shadcn-parity.mjs`
- `tmp=$(mktemp) && cp issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md "$tmp" && node scripts/audit-shadcn-parity.mjs >/tmp/radcn-parity-regen.log && diff -u "$tmp" issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md; regen_status=$?; rm "$tmp"; cat /tmp/radcn-parity-regen.log; exit $regen_status`
  exits 0 and prints no diff.
- A deterministic Node check proves all 11 upstream InputGroup example ids
  appear exactly once in `input-group-example-inventory.md`.
- A deterministic Node check proves every upstream InputGroup example row has a
  final outcome of `Covered` or `Intentional divergence`, and that no row keeps
  a `Partial` or `Missing` outcome.
- A deterministic Node check proves `resolved-clusters.json` includes an
  `examples` entry with `slug = "input-group"`, `status = "resolved"`, and
  evidence for Experiment 15, Experiment 16, and
  `input-group-example-inventory.md`.
- If `tokens.css` changes, a deterministic Node check proves
  `radcn/packages/radcn/src/styles/index.ts` is exactly
  `export const radcnStyles = ${JSON.stringify(tokensCss)}\n` for
  `radcn/packages/radcn/src/styles/tokens.css`.
- `rg -n "Example parity for input-group|Audit upstream examples for input-group" issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`
  exits 1 with no matches.
- Deterministic checks prove the new Input/InputGroupInput type support and any
  new InputGroupButton accessibility/read-only props are exported from both the
  relevant component files and the root
  `radcn/packages/radcn/src/index.ts` type surface.
- A positive documentation check proves
  `issues/0004-complete-shadcn-parity-and-docs/input-group-example-inventory.md`
  still records the intentional mappings for `useState`,
  `useCopyToClipboard`, `react-textarea-autosize`, and `asChild`.
- `rg -n "from ['\"]react['\"]|useState\\(|from ['\"][^'\"]*react-textarea-autosize|from ['\"][^'\"]*lucide-react|from ['\"][^'\"]*@tabler/icons-react|from ['\"](\\.\\./)*vendor/|from ['\"][^'\"]*vendor/|npm publish|pnpm publish|publishConfig" radcn/packages/radcn radcn/apps/docs radcn/fixtures/candidate-remix package.json`
  exits 1 with no matches.
- `git diff --check`
- `git status --short` shows only expected package, docs, fixture, test, issue,
  resolved-cluster, and generated-inventory changes before the result commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- InputGroup still lacks proof for any audited upstream example family.
- Email/password examples cannot render native non-text input types.
- Icon-only InputGroup buttons cannot expose accessible names.
- The implementation depends on React state, `asChild`, `useCopyToClipboard`,
  `react-textarea-autosize`, upstream icon packages, or vendor imports.
- Docs or fixtures imply InputGroup owns DropdownMenu, Popover, Tooltip,
  Spinner, ButtonGroup, Label, Separator, clipboard, favorite, or autosize
  state.
- The audit inventory marks `input-group` resolved while any upstream
  InputGroup example still lacks package/docs/fixture/test evidence or a
  documented intentional divergence.
- The regenerated parity inventory still recommends `input-group` as the first
  unresolved example cluster.

## Design Review

Reviewer: Beauvoir (`019e9a8b-11fe-7fc1-8f68-2fab192a85c0`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: the plan required docs and inventory to record mappings for
  `useState`, `useCopyToClipboard`, and `react-textarea-autosize`, but the
  verification hygiene command also scanned docs and the inventory for those
  exact strings and required no matches. Fixed by splitting the checks: the
  plan now has a positive inventory documentation check for those intentional
  mappings, while the negative hygiene scan is limited to import/dependency and
  publish patterns in code-bearing paths.
- Major: none.
- Minor: none.

Review result: not approved until the blocker is fixed. The finding above has
been addressed and requires re-review before the plan commit.

Re-review result: approved. Beauvoir confirmed the blocker is resolved because
the plan now separates positive documentation proof for the intentional
`useState`, `useCopyToClipboard`, `react-textarea-autosize`, and `asChild`
mappings from the negative import/dependency hygiene scan, which is limited to
code and package paths. No new blocker was found.
