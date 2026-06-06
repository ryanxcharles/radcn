# Experiment 28: Implement carousel example parity depth

## Description

Experiment 27 found that Carousel has strong package primitives and fixture
coverage, but lacks full example-depth coverage for the 6 upstream shadcn/ui
Carousel examples: `carousel-api`, `carousel-demo`, `carousel-orientation`,
`carousel-plugin`, `carousel-size`, and `carousel-spacing`.

This experiment implements that depth across the docs site, candidate fixtures,
Playwright tests, and issue evidence. The goal is equivalent user-facing
behavior, accessibility, visual behavior, and author-facing modifiability, not
React, Embla, or DOM equivalence. React state/effects/context, Embla,
`setApi`, `opts`, `plugins`, `embla-carousel-autoplay`, lucide icons, Tailwind
utilities, and vendor code must not become RadCN dependencies.

## Changes

- Prefer existing Carousel package behavior unless implementation proves a
  narrow package gap.
  - Keep `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`,
    `CarouselNext`, and `enhanceCarousel` as the core behavior owners.
  - Use existing public `data-current`, `data-count`, `data-index`,
    `radcn-carousel-select`, and `radcn-carousel-scroll` hooks for API-style
    status examples.
  - Implement autoplay/plugin parity as app-owned browser enhancement in the
    fixture/docs example layer unless a package-level hook is proven necessary.
- Update `radcn/packages/radcn/src/styles/tokens.css` and regenerate
  `radcn/packages/radcn/src/styles/index.ts` if style tokens change.
  - Add or refine public classes needed for shadcn-style Carousel example
    parity: Card slide sizing, status text, responsive half/third item sizing,
    vertical content height, compact spacing, and autoplay/plugin example
    hooks.
  - Keep styling modifiable through classes, inline styles, or CSS variables.
- Update `radcn/apps/docs/app/content/components.tsx`.
  - Replace the seed-only Carousel docs with a rich Carousel entry and live
    preview covering all six upstream example families.
  - Add source snippets that use RadCN imports, Card composition, package-owned
    control glyphs, public data hooks, and app-owned status/autoplay behavior.
  - Document intentional mappings: React state/effects/context and `setApi` to
    public data hooks/events plus app-owned browser state; Embla/`opts`/
    `plugins`/autoplay to RadCN enhancement or app-owned behavior; lucide
    arrows to package/app-owned glyphs; Tailwind utilities to RadCN
    classes/styles/CSS variables.
- Update `radcn/fixtures/scenarios/index.ts`,
  `radcn/fixtures/candidate-remix/app/fixtures/carousel.tsx`, and
  `radcn/fixtures/candidate-remix/app/assets/entry.ts`.
  - Add named Carousel scenarios for all upstream ids:
    `api`, `demo`, `orientation`, `plugin`, `size`, and `spacing`.
  - Preserve existing routes `default`, `initial-slide`, `vertical`,
    `multiple-visible`, `spacing`, `disabled-boundaries`, `keyboard`, and
    `custom-token` as compatibility or primitive coverage routes.
  - Implement Card slide composition for demo, size, spacing, orientation, API,
    and plugin examples.
  - Implement visible API status text such as `Slide 1 of 5` with app-owned
    browser enhancement that reads public Carousel data hooks and listens for
    `radcn-carousel-select`/`radcn-carousel-scroll`.
  - Implement deterministic autoplay/plugin parity with app-owned browser
    enhancement, public fixture attributes, a short test-safe delay, and hover
    pause/resume behavior. Do not add Embla or `embla-carousel-autoplay`.
- Update `radcn/fixtures/tests/carousel.spec.ts`.
  - Add Playwright assertions for all six upstream Carousel example families.
  - Verify region/slide semantics, Card slide composition, visible numbered
    slides, controls and disabled boundaries, current/count status text,
    status updates after movement, vertical orientation and keyboard behavior,
    responsive multi-slide sizing at medium/large viewports, compact spacing,
    deterministic autoplay movement, and hover pause/resume.
- Update `issues/0004-complete-shadcn-parity-and-docs/carousel-example-inventory.md`.
  - Change each row to `Covered` once docs/fixture/test evidence exists.
  - Record stable divergences for React/Embla/plugin/lucide/Tailwind mechanics.
  - Add a resolution section for Carousel.
- Update `issues/0004-complete-shadcn-parity-and-docs/resolved-clusters.json`.
  - Add `carousel` with evidence for Experiments 27 and 28 plus the inventory
    file once all six rows are covered.
- Run `node scripts/audit-shadcn-parity.mjs` and update
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`.
- Update Issue 4 `README.md` learnings with the completed Carousel outcome and
  the next recommended cluster from the regenerated inventory.

## Verification

Pass criteria:

- Type checks pass:
  ```text
  pnpm radcn:typecheck
  pnpm --dir radcn/apps/docs typecheck
  pnpm fixtures:candidate:typecheck
  ```
- Carousel fixture tests pass:
  ```text
  pnpm exec playwright test -c radcn/fixtures/playwright.config.ts carousel.spec.ts
  ```
- Docs coverage tests pass:
  ```text
  pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts
  ```
- The parity audit passes and regenerates the inventory:
  ```text
  node scripts/audit-shadcn-parity.mjs
  ```
- The parity audit is idempotent after regeneration:
  ```text
  tmp=$(mktemp) && cp issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md "$tmp" && node scripts/audit-shadcn-parity.mjs >/tmp/radcn-parity-regen.log && diff -u "$tmp" issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md; regen_status=$?; rm "$tmp"; cat /tmp/radcn-parity-regen.log; exit $regen_status
  ```
- Deterministic checks prove:
  - all 6 upstream Carousel example ids appear exactly once in
    `carousel-example-inventory.md`;
  - all 6 Carousel example rows have final outcome `Covered`;
  - `resolved-clusters.json` includes `slug = "carousel"`,
    `status = "resolved"`, and evidence for Experiment 27, Experiment 28, and
    `carousel-example-inventory.md`;
  - `radcn/packages/radcn/src/styles/index.ts` exactly matches
    `tokens.css` if styles changed;
  - `carousel` is absent from unresolved example clusters in
    `parity-inventory.md` and the first recommended cluster has advanced;
  - docs contain labels/copy for `API`, `Demo`, `Orientation`, `Plugin`,
    `Size`, and `Spacing`;
  - docs and fixtures contain no imports from React, Embla, Radix, lucide,
    vendor paths, or npm publishing configuration.
- Playwright assertions specifically cover:
  - `carousel-demo`: five Card-like numbered slides, controls, and selected
    slide state;
  - `carousel-size`: responsive multi-slide item sizing at medium and large
    viewport widths;
  - `carousel-spacing`: compact spacing plus responsive multi-slide sizing;
  - `carousel-orientation`: vertical layout, vertical height, controls, and
    axis-specific keyboard movement;
  - `carousel-api`: visible `Slide n of m` status text initialized from public
    data hooks and updated after control movement;
  - `carousel-plugin`: deterministic autoplay movement plus hover pause and
    resume behavior.
- Dependency-policy check passes with no matches:
  ```text
  rg -n "from ['\"]react['\"]|from ['\"][^'\"]*embla|from ['\"][^'\"]*radix-ui|from ['\"][^'\"]*@radix-ui|from ['\"][^'\"]*lucide-react|from ['\"](\\.\\./)*vendor/|from ['\"][^'\"]*vendor/|npm publish|pnpm publish|publishConfig" radcn/packages/radcn radcn/apps/docs radcn/fixtures/candidate-remix package.json
  ```
- Manifest dependency-policy check passes with no matches in RadCN package,
  docs, workspace, and candidate Remix manifests. The reference React Router
  fixture is intentionally excluded because it is the React comparison app.
  ```text
  rg -n '"(react|embla[^"]*|radix-ui|@radix-ui[^"]*|lucide-react|tailwindcss)"|publishConfig|npm publish|pnpm publish' package.json radcn/packages/radcn/package.json radcn/apps/docs/package.json radcn/fixtures/candidate-remix/package.json
  ```
- `git diff --check`
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  prints no output.

Failure criteria:

- Any of the six upstream Carousel examples remains `Partial` or `Missing`.
- The implementation adds React, Embla, `embla-carousel-autoplay`, Radix,
  lucide, Tailwind, vendor, or publishing dependencies to RadCN
  package/docs/fixture source or manifests.
- API parity is claimed without visible current/count status text and a
  Playwright assertion that it updates after Carousel movement.
- Plugin parity is claimed without deterministic Playwright evidence for
  autoplay movement and hover pause/resume behavior.
- The experiment changes unrelated component clusters or starts the next
  cluster before Carousel result review and result commit.

## Design Review

Reviewer: Lorentz (`019e9b11-43a4-7f42-b2c6-323e1caa9500`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: none.
- Major: none.
- Minor: none.

Approval result: approved. Lorentz confirmed the issue README links Experiment
28 as `Designed`, the experiment has the required sections, the scope is
coherent for one implementation experiment, implementation has not started
before the plan commit, verification includes concrete pass/fail criteria,
repo hygiene checks, vendor cleanliness checks, parity audit idempotence, and
dependency-policy checks for source and manifests.

## Result

**Result:** Pass

Implemented Carousel example parity depth for all 6 upstream shadcn/ui
Carousel examples: `carousel-api`, `carousel-demo`, `carousel-orientation`,
`carousel-plugin`, `carousel-size`, and `carousel-spacing`.

Package and style changes:

- `radcn/packages/radcn/src/styles/tokens.css` now includes public Carousel
  example hooks for responsive size/spacing, vertical example height, status
  text, example stacks, and plugin notes.
- `radcn/packages/radcn/src/styles/index.ts` was regenerated from
  `tokens.css`.
- No Carousel package dependency or runtime package API was added. API status
  and plugin-style autoplay are app-owned examples over existing public
  Carousel data hooks, events, and controls.

Docs, fixtures, and tests:

- `radcn/apps/docs/app/content/components.tsx` now has a rich Carousel docs
  entry and live/source examples for API, Demo, Orientation, Plugin, Size, and
  Spacing families.
- `radcn/fixtures/scenarios/index.ts`,
  `radcn/fixtures/candidate-remix/app/fixtures/carousel.tsx`,
  `radcn/fixtures/candidate-remix/app/assets/entry.ts`, and
  `radcn/fixtures/README.md` now expose named Carousel scenarios for all six
  upstream examples while preserving the existing primitive routes.
- `radcn/fixtures/tests/carousel.spec.ts` now asserts Card slide composition,
  visible numbered slides, current/count status text, status updates after
  movement, responsive medium/large multi-slide sizing, compact spacing,
  vertical orientation and keyboard behavior, deterministic autoplay movement,
  and hover pause/resume.
- `carousel-example-inventory.md`, `resolved-clusters.json`, and the
  regenerated `parity-inventory.md` now mark `carousel` resolved. The next
  first recommended cluster is `Example parity for chart`.

Verification run:

- `pnpm radcn:typecheck` passed.
- `pnpm --dir radcn/apps/docs typecheck` passed.
- `pnpm fixtures:candidate:typecheck` passed.
- `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts carousel.spec.ts`
  passed: 5 passed.
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts`
  passed: 5 passed.
- `node scripts/audit-shadcn-parity.mjs` passed and regenerated
  `parity-inventory.md`.
- The parity inventory idempotence check passed:
  ```text
  tmp=$(mktemp) && cp issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md "$tmp" && node scripts/audit-shadcn-parity.mjs >/tmp/radcn-parity-regen.log && diff -u "$tmp" issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md; regen_status=$?; rm "$tmp"; cat /tmp/radcn-parity-regen.log; exit $regen_status
  ```
  Output:
  ```text
  wrote issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md
  ```
- Deterministic Node checks confirmed:
  - all 6 upstream Carousel example ids appear exactly once in
    `carousel-example-inventory.md`;
  - all 6 Carousel example rows have final outcome `Covered`;
  - `resolved-clusters.json` includes `slug = "carousel"`,
    `status = "resolved"`, and evidence for Experiment 27, Experiment 28, and
    `carousel-example-inventory.md`;
  - `radcn/packages/radcn/src/styles/index.ts` exactly matches
    `tokens.css`;
  - `carousel` is absent from unresolved example clusters in
    `parity-inventory.md` and the first recommended cluster is
    `Example parity for chart`;
  - Carousel docs contain labels/copy for `API`, `Demo`, `Orientation`,
    `Plugin`, `Size`, and `Spacing`.
- Dependency-policy checks passed:
  ```text
  rg -n "from ['\"]react['\"]|from ['\"][^'\"]*embla|from ['\"][^'\"]*radix-ui|from ['\"][^'\"]*@radix-ui|from ['\"][^'\"]*lucide-react|from ['\"](\\.\\./)*vendor/|from ['\"][^'\"]*vendor/|npm publish|pnpm publish|publishConfig" radcn/packages/radcn radcn/apps/docs radcn/fixtures/candidate-remix package.json
  rg -n '"(react|embla[^"]*|radix-ui|@radix-ui[^"]*|lucide-react|tailwindcss)"|publishConfig|npm publish|pnpm publish' package.json radcn/packages/radcn/package.json radcn/apps/docs/package.json radcn/fixtures/candidate-remix/package.json
  ```
  Both exited 1 with no matches, as expected.
- `git diff --check` passed with no output.
- `for d in vendor/shadcn-ui vendor/remix vendor/react-router; do git -C "$d" status --short; done`
  printed no output.

## Conclusion

Carousel example parity is resolved. The existing package data hooks and
events were sufficient for API-style status text, and deterministic autoplay
could stay app-owned over public controls. No React, Embla,
`embla-carousel-autoplay`, lucide, Tailwind, vendor, or publishing dependency
was needed. The next experiment should follow the regenerated recommendation
and audit example parity for `chart`.

## Completion Review

Reviewer: Poincare (`019e9b19-8ba7-7681-8036-c0977ee0404a`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: none.
- Major: the Carousel docs source snippet initially omitted the spacing and
  plugin/autoplay examples, even though the live preview rendered them and the
  approved scope required source snippets for all six upstream families.
- Minor: none.

Fix: updated `carouselSource` to include Demo, API, Size, Spacing,
Orientation, and Plugin-style examples, and to explicitly show app-owned
`enhanceCarouselStatus` and `enhanceCarouselAutoplay` browser helpers.

Re-review result: approved. Poincare confirmed `carouselSource` now covers all
six upstream Carousel families and shows app-owned status/autoplay mapping via
`radcn-carousel-select`, `radcn-carousel-scroll`, public next controls, and
hover pause/resume. No new blocker was introduced, and docs typecheck passed.

Review result: approved. Poincare also confirmed typechecks passed; Carousel
fixture Playwright passed with 5 tests; docs coverage Playwright passed with 5
tests; parity audit idempotence passed; dependency-policy checks found no
React, Embla, Radix, lucide, Tailwind, vendor, or publishing matches in the
checked RadCN/package/docs/candidate scopes; vendor checkouts were clean; and
the result commit had not been made before review.
