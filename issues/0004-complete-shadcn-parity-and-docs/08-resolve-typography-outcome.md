# Experiment 8: Resolve typography outcome

## Description

Experiment 7 updated the generated parity inventory so resolved clusters no
longer steer future work. The first unresolved recommendation is now the
`typography` package outcome.

`typography` is a RadCN package export without an upstream shadcn `ui/`
component counterpart. Upstream shadcn presents typography as examples:
headings, paragraphs, blockquote, lists, inline code, lead/large/small/muted
text, a demo composition, and a table example. RadCN already ships typography
package parts and has docs/fixture coverage for article copy, inline styles,
and custom tokens. The remaining task is to make the outcome explicit and fill
any small proof gap, especially the upstream `typography-table` example if it
is not already covered by existing table/typography docs.

This experiment resolves the `typography` package outcome. It should not add a
new dependency or publish anything.

## Changes

- Audit upstream typography examples:
  - `typography-demo`
  - `typography-h1`
  - `typography-h2`
  - `typography-h3`
  - `typography-h4`
  - `typography-p`
  - `typography-blockquote`
  - `typography-list`
  - `typography-inline-code`
  - `typography-lead`
  - `typography-large`
  - `typography-small`
  - `typography-muted`
  - `typography-table`
- Update `issues/0004-complete-shadcn-parity-and-docs/typography-outcome.md`.
  - Record the upstream example map.
  - Record the RadCN outcome: package-backed recipe/API with semantic host
    elements and token hooks.
  - Record any intentional divergence from upstream utility-class snippets.
- If the audit finds missing proof, update:
  - `radcn/fixtures/candidate-remix/app/fixtures/navigation-collection.tsx`
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/tests/navigation-collection.spec.ts`
  - `radcn/apps/docs/app/content/components.tsx`
  to add table-oriented typography proof or richer docs examples.
- Update `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Mark `typography` as a resolved package outcome.
  - Mark the `typography` example cluster as resolved if all 14 upstream
    examples have documented RadCN outcomes.
- Regenerate `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`.
- Update Issue 4 learnings with the final Typography outcome and next generated
  recommendation.

## Verification

Pass criteria:

- `pnpm radcn:typecheck`
- `pnpm --dir radcn/apps/docs typecheck`
- `pnpm fixtures:candidate:typecheck`
- `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts navigation-collection.spec.ts`
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts`
- `node scripts/audit-shadcn-parity.mjs`
- `tmp=$(mktemp) && cp issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md "$tmp" && node scripts/audit-shadcn-parity.mjs >/tmp/radcn-parity-regen.log && diff -u "$tmp" issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md; regen_status=$?; rm "$tmp"; cat /tmp/radcn-parity-regen.log; exit $regen_status`
  exits 0 and prints no diff.
- `rg -n "Package outcome decisions: typography|Resolve or document the typography package outcome" issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`
  exits 1 with no matches.
- `node -e "const fs=require('node:fs'); const data=JSON.parse(fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json','utf8')); if (!data.packageOutcomes.some((item)=>item.slug==='typography')) process.exit(1); if (!data.examples.some((item)=>item.slug==='typography')) process.exit(2)"`
  exits 0.
- `node -e "const fs=require('node:fs'); const text=fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/typography-outcome.md','utf8'); for (const id of ['typography-demo','typography-h1','typography-h2','typography-h3','typography-h4','typography-p','typography-blockquote','typography-list','typography-inline-code','typography-lead','typography-large','typography-small','typography-muted','typography-table']) if (!text.includes(id)) { console.error(id); process.exit(1) }"`
  exits 0 and proves all 14 upstream example ids are present.
- `node -e "const fs=require('node:fs'); const text=fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/README.md','utf8'); if (!/Typography outcome/.test(text)) process.exit(1); if (!/next generated recommendation/i.test(text)) process.exit(2)"`
  exits 0 after the README learnings are updated.
- `rg -n "from ['\"](\\.\\./)*vendor/|from ['\"][^'\"]*vendor/|from ['\"]react['\"]|npm publish|pnpm publish|publishConfig" radcn/packages/radcn radcn/apps/docs radcn/fixtures/candidate-remix package.json`
  exits 1 with no matches.
- `git diff --check`
- `git status --short` shows only expected docs, fixture, test, issue,
  resolved-cluster, and inventory changes before the result commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- `typography` remains an unresolved package outcome in the regenerated
  inventory.
- The outcome ignores `typography-table`.
- The docs or fixtures imply Typography is an upstream `ui/` component instead
  of a RadCN package-backed recipe/API outcome.
- The implementation imports from `vendor/` or adds unrelated dependencies.

## Design Review

Reviewer: Averroes (`019e9a3a-c520-7c81-bcb8-98ba920c9e89`)
Fresh context: yes (`fork_context: false`)

Findings:

- Major: the original typography example verification used one `rg`
  alternation, which would pass if any one upstream id was present. Fixed by
  adding a deterministic Node check that fails on each missing id.
- Minor: the original verification required README learnings in prose but did
  not verify them. Fixed by adding a README grep for the Typography outcome and
  next generated recommendation.

Re-review result: approved with no blockers. The major finding was resolved.
The README verification was further tightened after re-review so the Typography
outcome and next generated recommendation are checked independently.

## Result

**Result:** Pass

Experiment 8 resolved the Typography package outcome and example cluster.
`typography-outcome.md` maps all 14 upstream typography examples to RadCN
outcomes, records Typography as a package-backed recipe/API rather than an
upstream `ui/` component port, and documents `typography-table` as composition
with `radcn/table`.

The candidate fixture app now includes `/fixtures/typography/table`, and
`navigation-collection.spec.ts` verifies the Typography heading, semantic table,
column header, and table cell. `resolved-clusters.json` marks `typography` as
resolved in both `examples` and `packageOutcomes`, and the regenerated
inventory advances the next recommendation to `button` example parity.

Verification run:

- `pnpm radcn:typecheck` passed.
- `pnpm --dir radcn/apps/docs typecheck` passed.
- `pnpm fixtures:candidate:typecheck` passed.
- `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts navigation-collection.spec.ts`
  passed: 6 tests.
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts`
  passed: 5 tests.
- `node scripts/audit-shadcn-parity.mjs` regenerated
  `parity-inventory.md`.
- The parity inventory regeneration diff check exited 0 and printed no diff.
- The Typography package-outcome recommendation grep exited 1 with no matches.
- The resolved-cluster JSON check exited 0.
- The 14-id Typography outcome check exited 0.
- The README learning check exited 0.
- The no-vendor/no-React/no-publish scope grep exited 1 with no matches.
- `git diff --check` passed.
- Vendor status checks for shadcn/ui, Remix, and React Router printed no
  output.

## Conclusion

Typography is no longer an unresolved Issue 4 package outcome or example
cluster. It is a RadCN package-backed typography API with an explicit upstream
example map and a tested table-composition fixture. The next Issue 4 experiment
should follow the generated inventory recommendation and audit upstream
`button` example parity depth.

## Completion Review

Reviewer: Nietzsche (`019e9a40-3c80-7cb3-9309-9c859f9f8b77`)
Fresh context: yes (`fork_context: false`)

Result: approved with no blockers.

Findings:

- Non-blocking note: `parity-inventory.md` was generated with date
  `2026-06-06`, while `typography-outcome.md` records Experiment 8 on
  `2026-06-05`. This appears to be generated-file date behavior and does not
  affect the result.

Approval evidence:

- The experiment result matches the design and pass criteria.
- All 14 upstream typography IDs are explicitly mapped.
- `typography` is resolved in both `examples` and `packageOutcomes`.
- The first generated recommendation is now `button`.
- `typography-table` has fixture and Playwright proof using `radcn/table`.
- README learnings and experiment status are consistent.
- `git diff --check`, vendor status, and no-vendor/no-React/no-publish checks
  pass.
