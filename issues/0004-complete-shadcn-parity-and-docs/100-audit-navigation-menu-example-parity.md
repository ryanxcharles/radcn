# Experiment 100: Audit navigation-menu example parity

## Description

The regenerated parity inventory after Experiment 99 recommends
`navigation-menu` as the next unresolved direct example cluster. Upstream
shadcn/ui New York v4 has one direct Navigation Menu example,
`navigation-menu-demo`, registered as an example dependency on
`navigation-menu`.

RadCN already ships `radcn/navigation-menu` with package exports,
dependency-free Navigation Menu primitives, browser enhancement, viewport and
indicator parts, horizontal and vertical keyboard behavior, disabled state,
custom token hooks, generic docs coverage, candidate/reference fixtures, and
Playwright coverage in `menubar-navigation.spec.ts`.

This experiment should audit whether that evidence covers the exact direct
upstream `navigation-menu-demo`, or whether a named implementation experiment
is needed. The likely remaining gap is named docs/fixture/test evidence for
the full upstream demo composition:

- `"use client"`, React, Next `Link`, `useIsMobile`, Radix Navigation Menu,
  `cva`, lucide `ChevronDownIcon`, `CircleCheckIcon`, `CircleHelpIcon`, and
  `CircleIcon`;
- `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`,
  `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`,
  and `navigationMenuTriggerStyle` as the parts imported and rendered by the
  demo;
- top-level triggers/links `Home`, `Components`, `Docs`, `List`, `Simple`,
  and `With Icon`;
- Home panel copy and links: `shadcn/ui`, `Beautifully designed components
  built with Tailwind CSS.`, `Introduction`, `Re-usable components built using
  Radix UI and Tailwind CSS.`, `Installation`, `How to install dependencies
  and structure your app.`, `Typography`, and
  `Styles for headings, paragraphs, lists...etc`;
- Components panel items `Alert Dialog`, `Hover Card`, `Progress`,
  `Scroll-area`, `Tabs`, and `Tooltip` with their upstream descriptions;
- plain `Docs` link using `navigationMenuTriggerStyle()`;
- responsive `hidden md:block` sections `List`, `Simple`, and `With Icon`;
- List panel links `Components`, `Documentation`, and `Blog` with their
  descriptions;
- Simple panel links `Components`, `Documentation`, and `Blocks`;
- With Icon panel links `Backlog`, `To Do`, and `Done` with icon affordances;
- upstream root-rendered viewport behavior `viewport={isMobile}`,
  `NavigationMenuViewport` package mechanics, `NavigationMenuIndicator`
  package customization mechanics, list `flex-wrap`, panel widths, grid
  layouts, `asChild`, `className`, Tailwind utilities, `cn`, `data-slot`,
  active/open state, keyboard behavior, pointer/focus behavior, responsive
  behavior, docs evidence, fixture evidence, Playwright evidence, custom
  tokens, and vendor source.

The audit should not implement named parity yet.

## Changes

- Add
  `issues/0004-complete-shadcn-parity-and-docs/navigation-menu-example-inventory.md`.
  - List direct upstream Navigation Menu example rows found under
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
    with `type: "registry:example"` and
    `registryDependencies: ["navigation-menu"]`, and cross-check those entries
    against `examples/navigation-menu*.tsx` files.
  - Summarize upstream user-facing behavior from
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/navigation-menu-demo.tsx`
    and upstream package mechanics from
    `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/navigation-menu.tsx`.
  - Compare upstream behavior and mechanics with current RadCN package, docs,
    fixture, and Playwright evidence.
  - Mark `navigation-menu-demo` as `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - If partial, record exact follow-up requirements for the next
    implementation experiment.
  - Record decisions for React client components, Next `Link`, `useIsMobile`,
    Radix Navigation Menu non-dependency, `cva` non-dependency, lucide icon
    non-dependency, the demo-rendered Navigation Menu parts listed in
    Description, `navigationMenuTriggerStyle`, trigger/link/content mapping,
    root-rendered viewport mapping, indicator package capability evidence,
    responsive `viewport={isMobile}`, responsive hidden sections, grouped link
    panels, icon links, active/open state, keyboard/pointer/focus behavior,
    `className`, Tailwind utility mapping, `cn`, `data-slot`, docs evidence,
    fixture evidence, Playwright evidence, custom tokens, and vendor source.
- Update Issue 4 `README.md`.
  - Add Experiment 100 to the experiments index as `Designed`.
  - Do not add final learnings until the experiment result is recorded.

No package, docs app, fixture, Playwright implementation,
`resolved-clusters.json`, or generated parity inventory changes should be made
in this audit experiment unless the audit itself proves the direct example is
already covered entirely from existing evidence. If that happens, keep the
change limited to issue documentation and required resolved-cluster/generated
inventory updates.

## Verification

Pass criteria:

- `navigation-menu-example-inventory.md` exists and has:
  - `# Navigation Menu Example Inventory`;
  - `## Summary`;
  - `## Examples`;
  - a table with exactly one direct upstream row, `navigation-menu-demo`, using
    this header:
    `Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up`;
  - `## Decisions`.
- A deterministic check proves the direct upstream vendor Navigation Menu
  example cluster count is exactly one by the same filename-prefix rule used by
  `scripts/audit-shadcn-parity.mjs`, the matching file-glob count is exactly
  one, and the inventory table contains exactly one matching row.

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const registry = fs.readFileSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts', 'utf8')
  const registryEntries = [...registry.matchAll(/\{\s*name: "([^"]+)",\s*type: "registry:example",\s*registryDependencies: \[([^\]]*)\],[\s\S]*?path: "examples\/([^"]+)"/g)]
    .filter((match) => match[1] === 'navigation-menu' || match[1].startsWith('navigation-menu-'))
    .map((match) => ({
      dependencies: [...match[2].matchAll(/"([^"]+)"/g)].map((dependency) => dependency[1]).sort(),
      name: match[1],
    }))
    .filter((entry) => entry.dependencies.length === 1 && entry.dependencies[0] === 'navigation-menu')
    .map((entry) => entry.name)
    .sort()
  const files = fs.readdirSync('vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples')
    .filter((file) => /^navigation-menu.*\.tsx$/.test(file))
    .map((file) => file.replace(/\.tsx$/, ''))
    .sort()
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/navigation-menu-example-inventory.md', 'utf8')
  const examples = text.match(/## Examples[\s\S]*?(?=\n## |$)/)?.[0] ?? ''
  const rows = [...examples.matchAll(/^\| `([^`]+)` \|[^\n]+/gm)].map((match) => match[1]).sort()
  console.log(`registry: ${registryEntries.join(', ')}`)
  console.log(`files: ${files.join(', ')}`)
  console.log(`inventory: ${rows.join(', ')}`)
  if (registryEntries.length !== 1 || registryEntries[0] !== 'navigation-menu-demo') process.exit(1)
  if (files.length !== 1 || files[0] !== 'navigation-menu-demo') process.exit(1)
  if (rows.length !== 1 || rows[0] !== 'navigation-menu-demo') process.exit(1)
  NODE
  ```

- A deterministic check proves the row outcome is one of `Covered`,
  `Partial`, `Missing`, or `Intentional divergence` and that any non-covered
  row has a non-empty follow-up:

  ```text
  node - <<'NODE'
  const fs = require('fs')
  const text = fs.readFileSync('issues/0004-complete-shadcn-parity-and-docs/navigation-menu-example-inventory.md', 'utf8')
  const row = text.match(/^\| `navigation-menu-demo` \|([^\n]+)$/m)?.[0]
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
  `"use client"`, React, Next `Link`, `useIsMobile`, Radix Navigation Menu,
  `cva`, lucide `ChevronDownIcon`, `CircleCheckIcon`, `CircleHelpIcon`,
  `CircleIcon`, the demo-rendered Navigation Menu parts listed in Description,
  `navigationMenuTriggerStyle`, root/list/content layout, root-rendered
  viewport behavior, indicator package capability, responsive
  `viewport={isMobile}`, `hidden md:block`, icon links, grouped link panels,
  `asChild`, `className`, Tailwind utilities, `cn`, `data-slot`, keyboard
  behavior, pointer/focus behavior, responsive behavior, and vendor source.
- The audit explicitly mentions exact upstream user-facing trigger, link,
  title, description, and icon-link text listed in Description.
- The audit explicitly compares current RadCN evidence from:
  - `radcn/packages/radcn/src/components/navigation-menu.tsx`;
  - `radcn/packages/radcn/src/styles/tokens.css`;
  - `radcn/packages/radcn/src/index.ts`;
  - `radcn/packages/radcn/package.json`;
  - `radcn/apps/docs/app/content/components.tsx`;
  - `radcn/apps/docs/tests/coverage.spec.ts`;
  - `radcn/fixtures/scenarios/index.ts`;
  - `radcn/fixtures/candidate-remix/app/fixtures/navigation-menu.tsx`;
  - `radcn/fixtures/reference-react-router/app/fixtures/navigation-menu.tsx`;
  - `radcn/fixtures/tests/menubar-navigation.spec.ts`.
- The Issue 4 README `## Experiments` section links Experiment 100 with
  status `Designed`.
- After the audit result is recorded, the Issue 4 README `## Learnings`
  section records the Navigation Menu audit outcome and next-step decision. A
  deterministic check finds both the experiment and inventory references:

  ```text
  rg -n "Experiment 100|navigation-menu-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
  ```

- `git diff --check`
- `git status --short` shows only the new experiment file and the Issue 4
  README before the plan commit.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any exact upstream user-facing text or mechanics listed
  above.
- The audit marks `navigation-menu-demo` covered without named docs, fixture,
  and Playwright evidence for the exact upstream composition, unless existing
  evidence already proves the same composition on the Navigation Menu surface.
- The audit treats Radix/React DOM equivalence as required instead of
  user-facing behavior, accessibility, and author-facing modifiability.
- The audit modifies package, docs, fixture, Playwright, vendor, or lockfile
  implementation files without proving that the row is already covered and
  only issue documentation/bookkeeping is needed.

## Design Review

Reviewer: Carson the 3rd
(`019e9e30-3804-7e11-a1dc-724574121ffc`), fresh-context Codex subagent
(`fork_context: false`).

Findings:

- Blocker: none.
- Major: The initial plan overstated the exact upstream demo composition by
  listing `NavigationMenuViewport` and `NavigationMenuIndicator` as rendered
  demo parts. Fixed by limiting exact demo-rendered parts to
  `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`,
  `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, and
  `navigationMenuTriggerStyle`; classifying `NavigationMenuViewport` as
  root-rendered viewport/package mechanics; and classifying
  `NavigationMenuIndicator` as package customization/capability evidence.
- Minor: none.

Re-review approved the fix. The reviewer confirmed the issue README links
Experiment 100 with status `Designed`, the plan has the required sections, the
scope is audit-only and narrow enough for one experiment, implementation has
not started before the plan commit, verification includes concrete pass/fail
criteria and hygiene checks, vendor checkouts are clean, and the deterministic
count check is appropriate for the single upstream row with
`registryDependencies: ["navigation-menu"]`.

## Result

**Result:** Partial

Experiment 100 added `navigation-menu-example-inventory.md` and audited the
single direct upstream Navigation Menu example cluster, `navigation-menu-demo`.

The audit found that RadCN already has strong Navigation Menu package and
behavior substrate: package exports for root, list, item, trigger, content,
link, viewport, indicator, and `enhanceNavigationMenu`; dependency-free
browser behavior; viewport sizing; indicator state; roving focus; horizontal
and vertical keyboard movement; pointer/focus open behavior; disabled state;
custom-token hooks; generic docs coverage; candidate/reference fixtures; and
Playwright coverage.

The direct example remains partial because current docs and fixtures do not
prove the named upstream composition: exact `Home`, `Components`, `Docs`,
`List`, `Simple`, and `With Icon` controls; all upstream Home/Components/List/
Simple/With Icon panel copy; icon-link affordances; responsive `hidden
md:block` sections; `useIsMobile`/viewport mapping; or
`navigationMenuTriggerStyle` mapping.

Verification passed:

```text
deterministic navigation-menu registry/file/inventory count check
deterministic navigation-menu outcome/follow-up check
rg -n "Experiment 100|navigation-menu-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
git diff --check
vendor cleanliness check
```

## Conclusion

The direct Navigation Menu example cluster needs a named implementation
experiment. The next Issue 4 experiment should implement `navigation-menu-demo`
in the docs and candidate fixture, add exact Playwright coverage, document the
Remix 3 mappings, and decide whether `navigationMenuTriggerStyle` should become
a RadCN helper or stay a documented class/token equivalent.

## Completion Review

**Reviewer:** Gibbs the 3rd (`019e9e35-ac1d-7e41-880e-3dd48dcf7c5a`)
**Fresh-context status:** fresh Codex subagent
**Result:** Approved

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

The reviewer confirmed that the implementation matches the approved audit
scope, the `Partial` result is supported by the inventory evidence, the
experiment has `Result` and `Conclusion`, the issue README records matching
status and learnings, the prior `NavigationMenuViewport`/
`NavigationMenuIndicator` wording issue remains fixed, and the result commit
had not been made before review.

The reviewer reran the deterministic count check, outcome/follow-up check,
README `rg` check, `git diff --check`, and vendor cleanliness check
successfully. They also confirmed that vendor sources remain ignored/nested
only and `git ls-files vendor` contains only `vendor/.gitignore`.
