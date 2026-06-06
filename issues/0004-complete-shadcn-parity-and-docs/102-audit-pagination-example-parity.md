# Experiment 102: Audit pagination example parity

## Description

The regenerated parity inventory after Experiment 101 recommends `pagination`
as the next unresolved direct example cluster. Upstream shadcn/ui New York v4
has one direct Pagination example, `pagination-demo`, registered as an example
dependency on `pagination`.

RadCN already ships `radcn/pagination` with package exports, dependency-free
Pagination primitives, semantic navigation/list/link markup, active page state,
previous/next labels, ellipsis text, custom label fixtures, generic docs
coverage, candidate/reference fixtures, and Playwright coverage in
`navigation-collection.spec.ts`.

This experiment should audit whether that evidence covers the exact direct
upstream `pagination-demo`, or whether a named implementation experiment is
needed. The likely remaining gap is named docs/fixture/test evidence for the
full upstream sequence:

- `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationPrevious`,
  `PaginationLink`, `PaginationEllipsis`, and `PaginationNext`;
- previous link with accessible label `Go to previous page`;
- page links `1`, active `2`, and `3`;
- active page `2` with `aria-current="page"`;
- ellipsis with visible icon/ellipsis affordance and screen-reader text
  `More pages`;
- next link with accessible label `Go to next page`;
- upstream package mechanics: React component props, `buttonVariants`,
  `Button` size typing, lucide `ChevronLeftIcon`, `ChevronRightIcon`, and
  `MoreHorizontalIcon`, `className`, `cn`, `data-slot`, Tailwind utilities,
  button variant/size mapping, docs evidence, fixture evidence, Playwright
  evidence, custom labels, custom tokens, and vendor source.

The audit should not implement named parity yet.

## Changes

- Add
  `issues/0004-complete-shadcn-parity-and-docs/pagination-example-inventory.md`.
  - List direct upstream Pagination example rows found under
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
    with `type: "registry:example"` and
    `registryDependencies: ["pagination"]`, and cross-check those entries
    against `examples/pagination*.tsx` files.
  - Summarize upstream user-facing behavior from
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/pagination-demo.tsx`
    and upstream package mechanics from
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/pagination.tsx`.
  - Compare upstream behavior and mechanics with current RadCN package, docs,
    fixture, and Playwright evidence.
  - Mark `pagination-demo` as `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - If partial, record exact follow-up requirements for the next
    implementation experiment.
  - Record decisions for React non-dependency, lucide icon non-dependency,
    `buttonVariants`, `Button` size typing, all Pagination parts listed in
    Description, active state, previous/next labels, ellipsis screen-reader
    text, `className`, Tailwind utility mapping, `cn`, `data-slot`, docs
    evidence, fixture evidence, Playwright evidence, custom labels, custom
    tokens, and vendor source.
- Update Issue 4 `README.md`.
  - Add Experiment 102 to the experiments index as `Designed`.
  - Do not add final learnings until the experiment result is recorded.

No package, docs app, fixture, Playwright implementation,
`resolved-clusters.json`, or generated parity inventory changes should be made
in this audit experiment unless the audit itself proves the direct example is
already covered entirely from existing evidence. If that happens, keep the
change limited to issue documentation and required resolved-cluster/generated
inventory updates.

## Verification

Pass criteria:

- `pagination-example-inventory.md` exists and has:
  - `# Pagination Example Inventory`;
  - `## Summary`;
  - `## Examples`;
  - a table with exactly one direct upstream row, `pagination-demo`, using this
    header:
    `Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up`;
  - `## Decisions`.
- A deterministic check proves the direct upstream vendor Pagination example
  cluster count is exactly one by the direct pagination filename-prefix and
  `registryDependencies: ["pagination"]` rule used for this audit, the
  matching file-glob count is exactly one, and the inventory table contains
  exactly one matching row.

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const registry = fs.readFileSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts', 'utf8')
  const registryEntries = [...registry.matchAll(/\{\s*name: "([^"]+)",\s*type: "registry:example",\s*registryDependencies: \[([^\]]*)\],[\s\S]*?path: "examples\/([^"]+)"/g)]
    .filter((match) => match[1] === 'pagination' || match[1].startsWith('pagination-'))
    .map((match) => ({
      dependencies: [...match[2].matchAll(/"([^"]+)"/g)].map((dependency) => dependency[1]).sort(),
      name: match[1],
    }))
    .filter((entry) => entry.dependencies.length === 1 && entry.dependencies[0] === 'pagination')
    .map((entry) => entry.name)
    .sort()
  const files = fs.readdirSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples')
    .filter((file) => /^pagination.*\.tsx$/.test(file))
    .map((file) => file.replace(/\.tsx$/, ''))
    .sort()
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/pagination-example-inventory.md', 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)].map((match) => match[1]).sort()
  console.log(`registry: ${registryEntries.join(', ')}`)
  console.log(`files: ${files.join(', ')}`)
  console.log(`inventory: ${rows.join(', ')}`)
  if (registryEntries.length !== 1 || registryEntries[0] !== 'pagination-demo') process.exit(1)
  if (files.length !== 1 || files[0] !== 'pagination-demo') process.exit(1)
  if (rows.length !== 1 || rows[0] !== 'pagination-demo') process.exit(1)
  NODE
  ```

- A deterministic check proves the row outcome is one of `Covered`,
  `Partial`, `Missing`, or `Intentional divergence` and that any non-covered
  row has a non-empty follow-up:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/pagination-example-inventory.md', 'utf8')
  const row = text.match(/^\| `pagination-demo` \|([^\n]+)$/m)?.[0]
  if (!row) process.exit(1)
  const cells = row.split('|').map((cell) => cell.trim())
  const outcome = cells[4]
  const followUp = cells[5]
  console.log(`outcome: ${outcome}`)
  console.log(`follow-up: ${followUp}`)
  if (!['Covered', 'Partial', 'Missing', 'Intentional divergence'].includes(outcome)) process.exit(1)
  if (outcome !== 'Covered' && (!followUp || followUp === 'No follow-up.')) process.exit(1)
  NODE
  ```

- The audit explicitly mentions and classifies these upstream mechanics:
  React component props, `buttonVariants`, `Button` size typing,
  `ChevronLeftIcon`, `ChevronRightIcon`, `MoreHorizontalIcon`, all Pagination
  parts listed in Description, active page state, previous/next accessible
  labels, ellipsis screen-reader text, `className`, Tailwind utilities, `cn`,
  `data-slot`, button variant/size mapping, and vendor source.
- The audit explicitly mentions exact upstream user-facing text and states:
  `Previous`, `1`, active `2`, `3`, ellipsis/`More pages`, `Next`,
  `Go to previous page`, and `Go to next page`.
- The audit explicitly compares current RadCN evidence from:
  - `radcn/packages/radcn/src/components/pagination.tsx`;
  - `radcn/packages/radcn/src/styles/tokens.css`;
  - `radcn/packages/radcn/src/index.ts`;
  - `radcn/packages/radcn/package.json`;
  - `radcn/apps/docs/app/content/components.tsx`;
  - `radcn/apps/docs/tests/coverage.spec.ts`;
  - `radcn/fixtures/scenarios/index.ts`;
  - `radcn/fixtures/candidate-remix/app/fixtures/navigation-collection.tsx`;
  - `radcn/fixtures/reference-react-router/app/fixtures/navigation-collection.tsx`;
  - `radcn/fixtures/tests/navigation-collection.spec.ts`.
- The Issue 4 README `## Experiments` section links Experiment 102 with
  status `Designed`.
- After the audit result is recorded, the Issue 4 README `## Learnings`
  section records the Pagination audit outcome and next-step decision. A
  deterministic check finds both the experiment and inventory references:

  ```text
  rg -n "Experiment 102|pagination-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
  ```

- `git diff --check`
- `git status --short` shows only the new experiment file and the Issue 4
  README before the plan commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any exact upstream user-facing text or mechanics listed
  above.
- The audit marks `pagination-demo` covered without named docs, fixture, and
  Playwright evidence for the exact upstream sequence, unless existing
  evidence already proves the same sequence on the Pagination surface.
- The audit treats React/lucide DOM equivalence as required instead of
  user-facing behavior, accessibility, and author-facing modifiability.
- The audit modifies package, docs, fixture, Playwright, vendor, or lockfile
  implementation files without proving that the row is already covered and
  only issue documentation/bookkeeping is needed.

## Design Review

Reviewer: Lovelace the 3rd
(`019e9e4a-9759-7a01-9590-528ee37a398c`), fresh-context Codex subagent
(`fork_context: false`).

Findings:

- Blocker: none.
- Major: none.
- Minor: The initial deterministic count-check wording said it proved the
  count by the same filename-prefix rule used by `scripts/audit-shadcn-parity.mjs`,
  but the generator first checks known slug prefixes and then falls back to
  `registryDependencies[0]`. The check itself was appropriate for this direct
  `registryDependencies: ["pagination"]` audit, but the wording overstated
  exact parity with the generator. Fixed by describing the check as the direct
  pagination filename-prefix and `registryDependencies: ["pagination"]` rule
  used for this audit.

Approved. The reviewer confirmed the Issue 4 README links Experiment 102 with
status `Designed`, the experiment has the required sections, scope is
audit-only, verification is concrete, vendor hygiene is included, and
implementation has not started beyond the plan files.

## Result

**Result:** Partial

Experiment 102 added `pagination-example-inventory.md` and audited the single
direct upstream Pagination example cluster, `pagination-demo`.

The audit found that RadCN already has strong Pagination package and behavior
substrate: package exports for root, content, item, link, previous, next, and
ellipsis parts; semantic navigation/list/link markup; active page state;
accessible previous/next labels; visible previous/next text; ellipsis
screen-reader text; custom label support; generic docs; candidate/reference
fixtures; and Playwright coverage for active state, ellipsis presence, custom
labels, and previous accessible label.

The direct example remains partial because current docs and tests do not prove
a named upstream `pagination-demo` surface. The candidate `default` fixture
already renders the same user-facing sequence with active page `2`, but the
docs preview is generic and current Playwright coverage verifies active page
`3` and custom labels rather than the exact upstream sequence.

Verification passed:

```text
deterministic pagination registry/file/inventory count check
deterministic pagination outcome/follow-up check
rg -n "Experiment 102|pagination-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
git diff --check
vendor cleanliness check
```

## Conclusion

The direct Pagination example cluster needs a named implementation experiment.
The next Issue 4 experiment should implement `pagination-demo` in the docs and
candidate fixture/test surface, add exact Playwright coverage, and document the
React/lucide/`buttonVariants`/Button size/Tailwind/`cn`/`data-slot` mappings.

## Completion Review

**Reviewer:** Bernoulli the 3rd (`019e9e4e-806f-7923-a49e-77a0527b0ec2`)
**Fresh-context status:** fresh Codex subagent
**Result:** Approved

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

The reviewer confirmed that the `Partial` result is supported: upstream
`pagination-demo` is the exact `Previous`, `1`, active `2`, `3`, ellipsis, and
`Next` sequence; RadCN has the package substrate; the candidate default
fixture already renders the same active-`2` sequence; the docs preview remains
generic; and current Playwright coverage checks active page `3` and custom
labels rather than a named exact upstream demo.

The reviewer reran the deterministic count check, deterministic
outcome/follow-up check, README `rg` check, `git diff --check`, vendor
cleanliness check, and tracked-vendor-source check successfully. They also
confirmed the result commit had not been made before review.
