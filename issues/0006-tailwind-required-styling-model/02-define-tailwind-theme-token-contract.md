# Experiment 2: Define the RadCN Tailwind theme/token contract

## Description

Experiment 1 proved the Tailwind v4 integration point for native Remix 3: a
standalone `@tailwindcss/cli` build whose output is served by
`createAssetServer()`. Component migration now needs a target vocabulary —
the semantic utilities (`bg-background`, `text-muted-foreground`,
`border-border`, `rounded-md`, ...) that shadcn/ui components are written in.
This experiment defines that contract and proves it end to end in the
candidate fixture.

The shadcn/ui v4 model is: the app's CSS defines plain theme variables
(`--background`, `--primary`, ...) for light and dark, and an
`@theme inline` block maps them into Tailwind token names
(`--color-background: var(--background)`) so semantic utilities exist. RadCN
adopts that model with two deliberate adaptations:

1. **Token names follow shadcn exactly** (bare `--background`, not
   `--radcn-background`). This lets shadcn component class strings port
   verbatim in later experiments and matches the registry payloads Issue 5
   will eventually write into consuming apps. The existing `--radcn-*`
   variables are untouched migration debt that keeps powering the bespoke CSS
   until components migrate off it.
2. **Dark mode stays on `[data-radcn-theme="dark"]`** (the mechanism the docs
   app and fixtures already use) instead of shadcn's `.dark` class. A
   `@custom-variant dark` declaration maps Tailwind's `dark:` variant onto
   that attribute, so ported component source that uses `dark:` utilities
   works unchanged. The variant body uses `:where(...)` deliberately: it is
   the exact pattern Tailwind v4's official documentation
   (<https://tailwindcss.com/docs/dark-mode>, "Using a data attribute")
   prescribes — `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`
   — with only the attribute name changed to `data-radcn-theme`. `:where()`'s
   zero specificity keeps `dark:` utilities at the same specificity as other
   utilities so author overrides keep working. shadcn's `(&:is(.dark *))`
   form predates that guidance and omits the attribute carrier itself;
   RadCN follows the Tailwind-documented form. (Verified against the live
   docs page during design review, since the shipped `tailwindcss` package
   contains only the media-query default variant.)

Token **values** are copied from the current RadCN palette in
`radcn/packages/radcn/src/styles/tokens.css` (hex, zinc-based), not from
shadcn's oklch values. The goal here is token plumbing, not a palette change;
hex values also compute to deterministic `rgb(...)` strings for Playwright
assertions. Adopting oklch values is a separate visual-parity decision for a
later experiment if wanted.

The canonical theme file lives in the radcn package and is exported as
`radcn/theme.css`, making the package the single source of truth that apps,
fixtures, and (later, via Issue 5) generated registry payloads consume.

Deliberate scope limits:

- No component migration yet. The probe page proves the contract with plain
  elements.
- No preflight (unchanged from Experiment 1).
- No removal of `--radcn-*` variables or bespoke CSS.
- No docs-app changes.

## Changes

- `radcn/packages/radcn/src/styles/theme.css` (new): the canonical contract:
  - `:root` light tokens and `[data-radcn-theme="dark"]` dark tokens using
    bare shadcn names (`--background`, `--foreground`, `--card`,
    `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`,
    `--primary-foreground`, `--secondary`, `--secondary-foreground`,
    `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`,
    `--destructive`, `--destructive-foreground`, `--border`, `--input`,
    `--ring`, `--radius`), values copied from the existing `--radcn-*`
    palette including `color-scheme`;
  - `@custom-variant dark (&:where([data-radcn-theme="dark"], [data-radcn-theme="dark"] *));`
  - `@theme inline` mapping each token to its Tailwind name
    (`--color-background: var(--background)`, ..., plus radius steps
    `--radius-sm: calc(var(--radius) * 0.6)`, `--radius-md: calc(var(--radius) * 0.8)`,
    `--radius-lg: var(--radius)`, `--radius-xl: calc(var(--radius) * 1.4)`,
    and `--font-sans` mapped from the existing `--radcn-font` stack).
    These are shadcn v4's exact current radius declarations, verified in both
    `vendor/shadcn-ui/apps/v4/app/globals.css` (lines 24–27) and the manual
    installation template
    `vendor/shadcn-ui/apps/v4/content/docs/installation/manual.mdx` (lines
    103–106) — the template Issue 5's generated config will emulate. The
    older subtraction-based formulas survive only in shadcn CLI test
    fixtures and are not used. `calc(var(...))` inside `@theme inline` is
    the canonical pattern; `@theme inline` exists precisely to emit the
    referenced expression rather than a static value.
- `radcn/packages/radcn/package.json`:
  - add export `"./theme.css": "./src/styles/theme.css"`.
- `radcn/fixtures/candidate-remix/app/styles/tailwind.css`:
  - add `@import 'radcn/theme.css';` above the utilities import. The package
    specifier is the primary approach: Tailwind v4 resolves CSS `@import` of
    bare package specifiers through node-module resolution including package
    `exports` maps (this is how ecosystem CSS packages such as
    `tw-animate-css` are consumed in shadcn v4 projects), and the fixture
    already depends on `radcn` as a workspace package so `node_modules/radcn`
    exists. If resolution nevertheless fails, verification step 1 fails
    loudly; the recorded fallback is the relative import
    `../../../../packages/radcn/src/styles/theme.css`, and using it must be
    recorded in the Result as a finding for the next experiment.
- `radcn/fixtures/candidate-remix/app/fixtures/tailwind-probe.tsx`:
  - add a semantic-token section with this exact structure (selectors are
    what the spec queries):

    ```tsx
    <section
      data-tailwind-semantic-light
      class="mt-8 w-full max-w-md rounded-md border border-border bg-background p-6 text-foreground dark:bg-[#223344]"
    >
      ...
    </section>
    <div data-radcn-theme="dark">
      <section
        data-tailwind-semantic-dark
        class="mt-8 w-full max-w-md rounded-md border border-border bg-background p-6 text-foreground dark:bg-[#223344]"
      >
        ...
      </section>
    </div>
    ```

    One class string, two contexts: outside the wrapper the semantic tokens
    resolve to light values and `dark:` does not fire; inside the
    `data-radcn-theme="dark"` wrapper the tokens re-bind via variable cascade
    and the `dark:` arbitrary utility overrides `bg-background`. Probe
    elements stay free of `style` attributes, `radcn-*` classes, and `css()`
    mixins.
- `radcn/fixtures/tests/tailwind-probe.spec.ts`:
  - assert the generated stylesheet defines the semantic mapping (contains
    `--color-background: var(--background)`), contains the dark token block
    selector `[data-radcn-theme="dark"]`, and contains the escaped `dark:`
    utility selector `.dark\:bg-\[\#223344\]` with `data-radcn-theme` in its
    condition;
  - assert computed styles on `[data-tailwind-semantic-light]`:
    `background-color: rgb(255, 255, 255)`, `color: rgb(24, 24, 27)`,
    `border-color: rgb(228, 228, 231)`, `border-radius: 4.8px`
    (`rounded-md` = `calc(var(--radius) * 0.8)` with `--radius: 0.375rem` =
    6px × 0.8);
  - assert computed styles on `[data-tailwind-semantic-dark]`:
    `background-color: rgb(34, 51, 68)` (the `dark:` arbitrary utility wins
    over `bg-background`, proving the custom variant), `color:
    rgb(250, 250, 250)`, `border-color: rgb(63, 63, 70)`;
  - the new arbitrary color `#223344` must not collide with the existing
    negative assertion, which uses `#445566` as the never-used marker — that
    marker stays unused;
  - keep all Experiment 1 assertions passing unchanged.

Expected git status for the result commit: only the files listed above plus
this experiment file and the issue README index line. No lockfile change is
expected (no new dependencies).

## Verification

From the repo root:

1. `pnpm --dir radcn/fixtures/candidate-remix styles:build` — exits 0; the
   generated CSS contains `--color-background: var(--background)`, the
   `[data-radcn-theme="dark"]` token block, and the `.dark\:bg-\[\#223344\]`
   utility rule conditioned on `data-radcn-theme`.
2. `pnpm radcn:typecheck` — passes (package.json export addition does not
   break the package).
3. `pnpm fixtures:candidate:typecheck` — passes.
4. `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts tests/tailwind-probe.spec.ts`
   — all probe assertions pass, old and new.
5. `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts tests/accordion.spec.ts tests/input.spec.ts`
   — representative existing specs still pass.
6. `git diff --check` — clean.
7. `git status --short vendor/` — empty.

Pass criteria (all must hold):

- Semantic utilities (`bg-background`, `text-foreground`, `border-border`,
  `rounded-md`) resolve through the package-exported theme file and compute
  to the RadCN palette values in light mode.
- The same utilities compute to dark palette values under
  `[data-radcn-theme="dark"]` purely via variable cascade.
- The `dark:` variant fires on the data attribute (custom variant works).
- The theme file is consumed via the `radcn/theme.css` package export (or the
  documented fallback, recorded as a finding for the next experiment).
- Typecheck and all listed Playwright specs pass; hygiene checks clean.

Fail criteria (any one fails the experiment):

- Tailwind cannot resolve the theme CSS through either the package export or
  the relative path.
- `@theme inline` tokens do not generate the semantic utilities.
- The custom dark variant does not match the data attribute.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given only `AGENTS.md`, the issue README, Experiment 1,
this experiment file, and read access to referenced repository sources)

Round 1 findings (REJECTED):

- Major: the `@custom-variant dark` body used `:where()` while the vendored
  shadcn v4 `globals.css` uses `:is(.dark *)`, with no justification. Fixed:
  the design now cites Tailwind v4's official dark-mode documentation, whose
  data-attribute pattern is exactly the `:where()` form used here, and
  explains the zero-specificity rationale.
- Major: the package-exports CSS `@import 'radcn/theme.css'` capability was
  asserted without documentation. Fixed: the design now documents Tailwind
  v4's node-module resolution of CSS imports (ecosystem precedent:
  `tw-animate-css` in shadcn v4 projects), notes the fixture's existing
  workspace dependency on `radcn`, and keeps the relative-path fallback with
  a recording requirement.
- Minor: probe structure was not explicit. Fixed: the design now shows the
  exact markup and `data-tailwind-semantic-light`/`-dark` selectors.
- Minor: the dark-variant CSS assertion was vague. Fixed: the design now
  names the exact escaped selector to assert.
- Minor: `calc()` inside `@theme inline` was unverified. Fixed: cited and
  verified against `vendor/shadcn-ui/apps/v4/app/globals.css`.

Round 2 (re-review by a second fresh Claude subagent): confirmed the calc()
citation against vendor source and the improved selector precision, but
REJECTED on the grounds that the designed changes (theme.css, package export,
probe markup, spec assertions) "are not implemented."

Lead-agent judgment on round 2: the not-implemented findings are rejected as
false positives — under `AGENTS.md`, design review happens before
implementation, and implementation must not begin until the design is
approved and the plan commit exists. A design review cannot require
implemented code. The remaining substantive finding from round 2 (the
Tailwind `:where()` documentation citation could not be verified from the
repo alone) was resolved with hard evidence: the live Tailwind v4 dark-mode
docs page was fetched during review and shows the exact data-attribute
`:where()` pattern; the design records this. With every code-level claim now
either verified in-repo or backed by the live-docs check, and all round-1
findings fixed, the design satisfies the review checklist.

Round 3 (re-review by a third fresh Claude subagent, properly framed as a
design-stage review): confirmed all five round-1 findings resolved in the
design text and the AGENTS.md design checklist satisfied, but REJECTED on one
new Major: the design cited shadcn v4's radius declarations as
subtraction-based (`calc(var(--radius) - 2px)` etc.) while the vendored
`globals.css` actually uses multiplication (`calc(var(--radius) * 0.8)`
etc.). Verified and fixed: the design now uses shadcn's exact
multiplication formulas, cites both `globals.css` (24–27) and the manual
installation template `manual.mdx` (103–106), notes the subtraction form
survives only in shadcn CLI test fixtures, and corrects the `rounded-md`
assertion to `4.8px` (6px × 0.8).

Round 4 (re-review by a fourth fresh Claude subagent, scoped to the round-3
fix): verified the design's radius formulas now match shadcn v4 exactly in
both cited vendor sources, verified the 4.8px assertion arithmetic, and
confirmed no new blockers. Verdict: APPROVED.

Approval result: approved (round 4). Round-1 findings all fixed and confirmed
by round 3; round-2's not-implemented findings were rejected by lead-agent
judgment as a workflow misreading (design review precedes implementation
under `AGENTS.md`), and its citation concern was resolved with the live
Tailwind docs evidence recorded above; round 3's radius-formula finding was
real and fixed; round 4 confirmed the fix. No blocker findings remain.

## Result

**Result:** Pass

The headline proof landed exactly as designed: `@import 'radcn/theme.css'`
resolved through the package `exports` map on the first try (no fallback
needed), `@theme inline` generated the semantic utilities, the
`[data-radcn-theme="dark"]` token block re-binds variables by cascade, and
the `dark:` custom variant fires on the data attribute. All verification
steps pass:

1. `styles:build` exits 0; the generated CSS contains the token blocks, the
   inlined semantic wiring, and the dark-variant utility rule
   (`.dark\:bg-\[\#223344\] { &:where([data-radcn-theme='dark'], ...)`).
2. `pnpm radcn:typecheck` passes with the new `./theme.css` export.
3. `pnpm fixtures:candidate:typecheck` passes.
4. `tests/tailwind-probe.spec.ts` passes (3/3) including the new semantic
   light/dark spec: light block computes
   `rgb(255, 255, 255)` / `rgb(24, 24, 27)` / `rgb(228, 228, 231)` / `4.8px`,
   dark block computes `rgb(34, 51, 68)` (the `dark:` utility beating
   `bg-background`) / `rgb(250, 250, 250)` / `rgb(63, 63, 70)`.
5. `tests/accordion.spec.ts` + `tests/input.spec.ts` pass (6/6).
6. `git diff --check` clean. 7. `vendor/` untouched.

Two assertion-level deviations from the design, both discovered by running
the verification and both recorded here as required:

- The design asserted the generated CSS contains the literal
  `--color-background: var(--background)`. In reality `@theme inline`
  substitutes the referenced expression directly into utilities — the
  emitted proof of the mapping is `background-color: var(--background)`
  inside the `.bg-background` rule, and no `--color-*` custom properties are
  emitted at all (that is precisely what `inline` means). The spec asserts
  the substituted form. Additionally, the asset server's CSS compiler
  normalizes attribute-selector quoting between the on-disk file and the
  served response, so the dark-block assertion matches with quoting left
  open (`/\[data-radcn-theme=.?dark.?\]/`).
- The design claimed "all Experiment 1 assertions pass unchanged." Wrong by
  design intent: the theme contract redefines the `--radius-*` scale
  (`--radius-lg: var(--radius)` = 0.375rem = 6px), so Experiment 1's
  `rounded-lg` assertion of Tailwind's default `8px` now correctly computes
  `6px`. The assertion was updated with a comment. This is the contract
  working as shadcn intends — `rounded-*` utilities across the whole app
  re-scale through the theme token — and it is exactly the kind of
  interaction later component-migration experiments must expect.

## Conclusion

The RadCN Tailwind theme/token contract exists and is proven end to end:
shadcn-named tokens (`--background` ... `--ring`, `--radius`) with RadCN's
current palette values, `@theme inline` mappings generating
`bg-background`-style semantic utilities, shadcn's exact radius scale, and a
`dark:` variant bound to `[data-radcn-theme="dark"]` per Tailwind's
documented data-attribute pattern. The contract is package-owned and consumed
via the `radcn/theme.css` export, which Issue 5's registry/config work can
reuse verbatim.

Learnings for later experiments:

- Consumers of the contract import three layers in order:
  `tailwindcss/theme`, `radcn/theme.css`, `tailwindcss/utilities`.
- `@theme inline` emits no `--color-*` variables; tests and tooling must
  look for the substituted `var(--token)` form in utility rules.
- Defining `--radius-*` re-scales every `rounded-*` utility application-wide.
  Component migration experiments must re-baseline any existing assertions
  that relied on Tailwind default radii (and similar care applies if the
  contract ever defines spacing or font tokens).
- The served CSS is not byte-identical to the CLI output (the asset server
  recompiles it); string assertions against served CSS must tolerate
  cosmetic normalization.

The natural next experiment: migrate one representative component (Button)
from bespoke `radcn-*` CSS to Tailwind utilities against this contract,
including `@source` scanning of the package source from the fixture's
Tailwind build, and decide the preflight question in that concrete context.

## Completion Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given only `AGENTS.md`, the issue README, this experiment
file, and read access to the working tree; not the implementer conversation)

Findings: none (no Blocker, Major, or Minor findings).

The reviewer re-ran `styles:build`, both typechecks, and the probe spec
independently (all passing), verified theme.css token names/values against
`tokens.css` and the radius formulas against the shadcn v4 vendor sources,
confirmed the package-export import resolved with no fallback, and assessed
both recorded deviations as legitimate documented Tailwind v4 behavior rather
than masked failures — explicitly noting the `rounded-lg` 8px→6px re-baseline
is the token contract working as shadcn intends. Hygiene verified: clean
`git diff --check`, vendor untouched, generated CSS untracked, plan commit
`f94d005` present, result commit absent at review time.

Approval result: approved with no blockers.
