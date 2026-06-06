# Experiment 27: Audit carousel example parity

## Description

The regenerated Issue 4 parity inventory now recommends example parity for
`carousel`. RadCN already exports `Carousel`, `CarouselContent`,
`CarouselItem`, `CarouselPrevious`, `CarouselNext`, and `enhanceCarousel`, and
existing fixtures prove region/slide semantics, initial state, controls,
disabled boundaries, keyboard movement, native scroll sync, vertical layout,
multiple visible slides, compact spacing, and custom token styling.

Upstream shadcn/ui has 6 Carousel examples that exercise a broader named
example surface: default card slides, responsive multi-slide sizing, compact
spacing, vertical orientation, API exposure for current/count state, and
Autoplay plugin behavior. The upstream implementation uses React context,
Embla, `setApi`, `plugins`, `opts`, React state/effects, Card composition,
lucide arrows, Tailwind utilities, and `embla-carousel-autoplay`.

This experiment audits the upstream Carousel example surface before
implementation. It should identify which examples are already covered, which
need package/docs/test depth, and which React-only, Embla, plugin,
icon-package, utility-class, event, or composition mechanics should map to
Remix 3 web-first behavior. It must not implement new package APIs.

## Changes

- Create
  `issues/0004-complete-shadcn-parity-and-docs/carousel-example-inventory.md`.
  - List all 6 upstream Carousel example ids:
    `carousel-api`, `carousel-demo`, `carousel-orientation`,
    `carousel-plugin`, `carousel-size`, and `carousel-spacing`.
  - For each example, record user-facing behavior, current RadCN evidence,
    outcome, and follow-up.
  - Use outcomes `Covered`, `Partial`, `Missing`, or
    `Intentional divergence`.
  - Record mapping decisions for Card composition, default slide layout,
    responsive multi-slide sizing, spacing, vertical orientation, keyboard
    behavior, current/count API state, `radcn-carousel-select` events,
    autoplay/plugin behavior, hover pause/resume, React state/effects,
    Embla/useEmblaCarousel, `setApi`, `plugins`, `opts`, lucide arrows,
    Tailwind utility classes, and current RadCN package/docs/fixture/
    Playwright evidence.
- Inspect these upstream references:
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/carousel.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/carousel-*.tsx`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
  - `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/_registry.ts`
- Inspect current RadCN evidence:
  - `radcn/packages/radcn/src/components/carousel.tsx`
  - `radcn/packages/radcn/src/components/card.tsx`
  - `radcn/packages/radcn/src/styles/tokens.css`
  - `radcn/apps/docs/app/content/components.tsx`
  - `radcn/fixtures/scenarios/index.ts`
  - `radcn/fixtures/candidate-remix/app/fixtures/carousel.tsx`
  - `radcn/fixtures/candidate-remix/app/assets/entry.ts`
  - `radcn/fixtures/tests/carousel.spec.ts`
- Update Issue 4 `README.md` learnings with the audit result and the next
  recommended implementation cluster.
- Do not change `radcn/packages/radcn`, docs app source, fixture app source, or
  tests in this experiment except for issue documentation.

## Verification

Pass criteria:

- `carousel-example-inventory.md` exists and contains exactly one table row for
  each upstream Carousel example id.
- A deterministic Node check proves all 6 upstream Carousel example ids appear
  exactly once in `carousel-example-inventory.md`.
  ```text
  node - <<'NODE'
  const fs = require('fs')
  const file = 'issues/0004-complete-shadcn-parity-and-docs/carousel-example-inventory.md'
  const text = fs.readFileSync(file, 'utf8')
  const ids = ['carousel-api','carousel-demo','carousel-orientation','carousel-plugin','carousel-size','carousel-spacing']
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
  - default Card slide carousel behavior;
  - responsive multi-slide sizing;
  - compact slide spacing;
  - vertical orientation and axis-specific keyboard behavior;
  - previous/next controls and boundary disabled state;
  - current/count API status text such as `Slide 1 of 5`;
  - `radcn-carousel-select` and scroll events as possible `setApi` mapping;
  - autoplay/plugin behavior, including hover pause/resume;
  - React state/effects mapping to browser enhancement or app-owned state;
  - Embla/useEmblaCarousel, `opts`, `plugins`, and `setApi` dependency mapping;
  - Card composition ownership;
  - lucide arrow package mapping;
  - Tailwind utility mapping to RadCN classes, styles, or CSS variables;
  - current RadCN package/docs/fixture/Playwright evidence.
- `issues/0004-complete-shadcn-parity-and-docs/README.md` records the audit
  conclusion and the next recommended experiment.
- `rg -n "carousel-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md`
  finds the new learning.
- `git diff --check`
- `git status --short` shows only expected issue documentation changes before
  the plan/result commits.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- The audit omits any upstream Carousel example id from the generated
  inventory.
- The audit treats React, Embla, `embla-carousel-autoplay`, lucide icons,
  Tailwind utility classes, Card composition, or vendor code as mandatory RadCN
  package dependencies instead of mapping them to equivalent user-facing
  behavior and application composition.
- The audit marks `carousel` resolved without package/docs/fixture/test
  evidence for the full upstream example surface.
- The experiment changes package, docs app, fixture, or test source instead of
  staying an audit.

## Design Review

Reviewer: Mencius (`019e9b0b-ae07-7bb3-8e2e-b99f103ab6a2`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval result: approved. Mencius confirmed the design is linked from the
Issue 4 README as `Designed`, has the required sections, stays audit-only,
includes concrete pass/fail checks, includes repo hygiene and vendor
cleanliness checks, records the need for README learnings, has not started
implementation before the plan commit, and lists six Carousel example ids that
exist in the vendored shadcn registry.

## Result

**Result:** Pass

Created
`issues/0004-complete-shadcn-parity-and-docs/carousel-example-inventory.md` as
an audit-only inventory for all 6 upstream Carousel examples: `carousel-api`,
`carousel-demo`, `carousel-orientation`, `carousel-plugin`, `carousel-size`,
and `carousel-spacing`.

The inventory records each example's user-facing behavior, current RadCN
evidence, outcome, and required follow-up. It does not mark `carousel`
resolved, because the examples need docs/fixture/Playwright depth beyond the
current primitive coverage, especially for visible API status text and
autoplay/plugin behavior.

Verification run:

```text
node - <<'NODE'
const fs = require('fs')
const file = 'issues/0004-complete-shadcn-parity-and-docs/carousel-example-inventory.md'
const text = fs.readFileSync(file, 'utf8')
const ids = ['carousel-api','carousel-demo','carousel-orientation','carousel-plugin','carousel-size','carousel-spacing']
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
carousel-api: 1
carousel-demo: 1
carousel-orientation: 1
carousel-plugin: 1
carousel-size: 1
carousel-spacing: 1
```

```text
rg -n 'Card|default|responsive|multi-slide|spacing|vertical|keyboard|previous|next|disabled|current/count|Slide 1 of 5|radcn-carousel-select|scroll|autoplay|plugin|hover|React|Embla|useEmblaCarousel|setApi|plugins|opts|lucide|Tailwind|Playwright' issues/0004-complete-shadcn-parity-and-docs/carousel-example-inventory.md
```

Confirmed that the inventory addresses all required examples and mapping
topics: default Card slide carousel behavior, responsive multi-slide sizing,
compact spacing, vertical orientation and axis-specific keyboard behavior,
previous/next controls, boundary disabled state, current/count status text,
`radcn-carousel-select`, scroll events, autoplay/plugin behavior, hover
pause/resume, React state/effects, Embla/useEmblaCarousel, `setApi`, `plugins`,
`opts`, Card composition ownership, lucide arrows, Tailwind utilities, and
current RadCN package/docs/fixture/Playwright evidence.

Additional verification:

```text
rg -n "carousel-example-inventory" issues/0004-complete-shadcn-parity-and-docs/README.md
git diff --check
git status --short
for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done
```

Observed output:

```text
issues/0004-complete-shadcn-parity-and-docs/README.md:448:  `carousel-example-inventory.md`. Carousel example parity is not complete yet:
 M issues/0004-complete-shadcn-parity-and-docs/27-audit-carousel-example-parity.md
 M issues/0004-complete-shadcn-parity-and-docs/README.md
?? issues/0004-complete-shadcn-parity-and-docs/carousel-example-inventory.md
```

`git diff --check` passed with no output. Vendor status printed no output.

## Conclusion

Carousel should be the next implementation cluster. The implementation should
add named docs and fixture coverage for all six upstream examples, prove
current/count status text and deterministic autoplay behavior in Playwright,
map React/Embla/plugin/lucide/Tailwind mechanics to Remix 3 and app-owned
composition, and only add package-level hooks if existing data hooks/events are
not enough.

## Completion Review

Reviewer: Ohm (`019e9b0e-7d06-7d93-a95b-61382f44530b`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Review result: approved. Ohm confirmed the completed experiment matches the
approved audit-only scope; only issue documentation plus the new inventory file
changed; no package, docs app, fixture, or test source files changed; the
experiment has `## Result` and `## Conclusion`; the Issue 4 README marks
Experiment 27 as `Pass` and records Carousel learnings plus the next cluster;
the inventory has exactly one row for each of the six upstream Carousel ids;
`git diff --check` passes; vendor status is clean; `git ls-files vendor` only
reports `vendor/.gitignore`; the plan commit exists; and the result commit had
not been made before review.
