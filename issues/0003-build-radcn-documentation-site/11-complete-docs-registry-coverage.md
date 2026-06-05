# Experiment 11: Complete docs registry coverage

## Description

Issue 3 cannot close while the docs site only covers the representative batch
from Experiment 5. The RadCN package now exports every ported component family,
helper, and recipe surface from `radcn/packages/radcn/package.json`, but the
docs registry only contains six pages: Button, Badge, Input, Dialog, Tabs, and
Sonner.

This experiment expands the docs registry so every public RadCN package subpath
has a route, navigation entry, import snippet, intended install guidance,
disposition, and at least one rendered documentation surface. Rich examples can
stay focused for the already representative pages; newly covered pages may use
a simpler draft documentation template when a full live scenario would be too
large for one experiment.

The install guidance is aspirational. It should describe the intended future
package usage, but this issue must not publish RadCN to npm and must not make
those installation instructions actually work for external consumers.

## Changes

- `radcn/apps/docs/app/content/components.tsx`
  - Extend the docs data model to distinguish:
    - `component` for normal component families;
    - `helper` for event/helper surfaces such as `toast`;
    - `recipe` for recipe-like surfaces such as `typography`;
    - `block` for block or block-disposition pages such as the future
      `data-table` documentation.
  - Add a `disposition` or equivalent field that can record `ready`, `draft`,
    `recipe`, `helper`, `block`, or `not-shipped-yet` without confusing it with
    visual status badges.
  - Add docs entries for every package subpath currently exported by
    `radcn/packages/radcn/package.json`, excluding `.` , `./styles`, and
    `./package.json`.
  - Add explicit non-exported disposition pages for the known Issue 3 recipe and
    block surfaces that are not currently package subpaths:
    - `form`;
    - `date-picker`;
    - `data-table`.
  - Mark those non-exported pages as `not-shipped-yet` or equivalent, with copy
    that explains they are intended docs dispositions and not importable package
    APIs today.
  - Keep existing rich examples for Button, Badge, Input, Dialog, Tabs, and
    Sonner.
  - For newly added component families, provide at minimum:
    - title;
    - category;
    - disposition/status;
    - summary;
    - import path;
    - import snippet;
    - aspirational install command;
    - accessibility notes;
    - customization/token notes;
    - Remix 3 divergence notes;
    - a simple rendered docs surface or a clear draft preview that does not
      pretend to be full live parity.

- `radcn/apps/docs/app/ui/docs-pages.tsx`
  - Render the new disposition metadata on component pages.
  - Update installation copy to make the aspirational nature explicit, for
    example: "Intended future install command; RadCN is not published yet."
  - Keep navigation readable with the larger component list.
  - Avoid adding npm-publish behavior, registry calls, generated package
    install tooling, or claims that `pnpm add radcn` works today.

- `radcn/apps/docs/tests/coverage.spec.ts`
  - Add a docs coverage test that reads `radcn/packages/radcn/package.json` and
    asserts every exported component/helper/recipe subpath has a docs registry
    entry and route.
  - Assert the known non-exported Issue 3 dispositions `form`, `date-picker`,
    and `data-table` also have docs entries and routes.
  - Assert docs routes return successful responses for every entry.
  - Assert install copy uses aspirational wording and does not claim RadCN is
    already published.
  - Assert representative pages still render live RadCN examples.

- `radcn/apps/docs/tests/theme-mode.spec.ts`
  - Keep the existing theme/icon/copy coverage passing after the navigation and
    registry expansion.

- `issues/0003-build-radcn-documentation-site/README.md`
  - Record the full-coverage registry strategy in `## Learnings`, especially
    the rule that Issue 3 docs may document intended installation but must not
    implement publishing or external package installation.

## Verification

- Coverage checks:
  - `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts`
  - a new coverage test proves every public component/helper/recipe subpath in
    `radcn/packages/radcn/package.json` has a docs entry;
  - every docs entry route returns a successful page;
  - representative rich-example pages still render live RadCN components;
  - install guidance is explicitly aspirational and does not claim published
    npm availability.

- Static checks:
  - `pnpm --dir radcn/apps/docs typecheck`
  - `pnpm radcn:typecheck`
  - `git diff --check`

- Manual inspection:
  - run `pnpm dev`;
  - inspect the home page and at least one page from each expanded category:
    display, inputs, overlays, composite, navigation, feedback, recipe, helper,
    and block/disposition;
  - confirm the sidebar remains scannable with the complete list;
  - confirm draft pages are honest and do not look like missing/broken routes;
  - confirm no text or controls overlap at desktop and mobile widths.

- Scope checks:
  - no npm publish command is added;
  - no package is renamed or made public;
  - no `vendor/` dependency references are added;
  - nested vendor checkouts remain clean:
    - `git -C vendor/shadcn-ui status --short`;
    - `git -C vendor/remix status --short`;
    - `git -C vendor/react-router status --short`;
  - no generated docs claim that `pnpm add radcn` works today.

## Design Review

Reviewer: Arendt (`019e9809-df2e-7810-9c43-21e3d6be33cd`)

Fresh context: Yes (`fork_context: false`)

Findings:

- Blocker: None
- Major: Package exports alone would miss Issue 3's known non-exported
  recipe/block dispositions such as `form`, `date-picker`, and `data-table`.
- Major: Scope checks did not explicitly verify ignored nested vendor checkouts
  stayed clean.
- Minor: None

Fixes:

- Added explicit non-exported disposition coverage for `form`, `date-picker`,
  and `data-table`.
- Added coverage-test requirements for those non-exported disposition routes.
- Added nested vendor cleanliness commands for `vendor/shadcn-ui`,
  `vendor/remix`, and `vendor/react-router`.

Reviewer approval: Approved; no blockers remained.

## Result

**Result:** Pass

Expanded the docs registry from six representative pages to complete coverage
for every public RadCN package subpath in `radcn/packages/radcn/package.json`,
excluding `.`, `./styles`, and `./package.json`. Added explicit non-exported
Issue 3 disposition pages for `form`, `date-picker`, and `data-table`, marked
as `not-shipped-yet` blocks so the docs are honest about current package
availability.

The content model now records `kind` and `disposition` separately from the
existing visual `status`. Existing rich examples for Button, Badge, Input,
Dialog, Tabs, and Sonner were preserved. Newly covered surfaces get draft
registry pages with route, category, summary, import snippet, aspirational
install snippet, accessibility notes, customization notes, Remix 3 divergence
notes, and a draft preview surface.

The component page renderer now shows category, status, kind, and disposition
badges. Installation copy explicitly says RadCN is private and not published to
npm yet, and install snippets use `pnpm add radcn # intended future package`.
Mobile sidebar and code-block layout were tightened so the complete registry
does not create horizontal overflow on narrow viewports.

Added `radcn/apps/docs/tests/coverage.spec.ts` to verify route coverage from
the package export map, the three non-exported disposition pages, aspirational
install copy, and representative live RadCN examples.

Verification run:

- `pnpm --dir radcn/apps/docs typecheck` — Pass
- `pnpm radcn:typecheck` — Pass
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts` — Pass
  (9 tests)
- `git diff --check` — Pass
- `git -C vendor/shadcn-ui status --short` — Pass, no output
- `git -C vendor/remix status --short` — Pass, no output
- `git -C vendor/react-router status --short` — Pass, no output
- Scope grep — Pass; no npm publish command, package-public change, or
  `vendor/` dependency reference was added. Install snippets are marked as
  intended future package usage.
- Manual visual inspection — Pass; desktop home and Accordion screenshots kept
  the expanded sidebar and top bar readable. Mobile Data Table inspection found
  and fixed sidebar/content overflow; final 390px-wide probe reported
  `scrollWidth === clientWidth`.

## Conclusion

The docs site now has complete registry route coverage for the current RadCN
package surface plus the known non-shipped Issue 3 block dispositions. This does
not finish the issue by itself, because draft pages still need richer content
and the broader site may need final polish, but it closes the largest structural
coverage gap and gives future experiments a tested coverage floor.

## Completion Review

Reviewer: Cicero (`019e9813-6b7c-7e61-9d9a-e29acd8009e6`)

Fresh context: Yes (`fork_context: false`)

Findings:

- Blocker: None
- Major: None
- Minor: None

Reviewer approval: Approved. The reviewer confirmed that every current package
export, excluding `.`, `./styles`, and `./package.json`, is represented in the
docs registry or rich docs, that `form`, `date-picker`, and `data-table` have
explicit non-exported dispositions, that the issue README and experiment result
records are in good shape, and that the verification commands passed locally.
