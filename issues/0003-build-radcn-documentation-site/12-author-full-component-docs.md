# Experiment 12: Author full component docs

## Description

Experiment 11 made every RadCN package export routable in the docs site, but it
left most exported pages as honest draft registry entries. That is useful
infrastructure, but it does not satisfy Issue 3's goal of a polished
component-library reference that shows every component, helper, recipe, and
block disposition.

This experiment converts the complete registry into authored documentation:
every exported RadCN component/helper surface gets at least one live RadCN
example, user-facing source snippet, accessibility notes, customization notes,
and Remix 3 divergence notes. The three known non-exported Issue 3 block
dispositions (`form`, `date-picker`, and `data-table`) remain clearly marked as
`not-shipped-yet`; they may show recipe sketches, but must not pretend to be
importable package APIs.

Installation guidance remains aspirational. This experiment must not publish to
npm, make packages public, or make install snippets work for external users.

## Changes

- `radcn/apps/docs/app/content/components.tsx`
  - Replace generated draft docs for every exported package subpath with
    explicit authored metadata and at least one live example rendered from
    RadCN package imports.
  - Keep the existing rich examples for Button, Badge, Input, Dialog, Tabs, and
    Sonner, but move them into the same authored-docs model used by the rest of
    the registry if that reduces drift.
  - Add the RadCN package imports needed for live examples. Use exported package
    subpaths such as `radcn/accordion`, never fixture-local copies and never
    `vendor/`.
  - Use simple server-rendered examples for broad coverage. For overlays and
    interactive surfaces, pin preview-only content visible when needed while
    keeping source snippets representative of real app usage.
  - Keep `form`, `date-picker`, and `data-table` as non-exported block
    dispositions with aspirational recipe copy and no `radcn/<slug>` import
    claim.
- `radcn/apps/docs/app/ui/docs-pages.tsx`
  - Remove or visually downgrade draft-only messaging for exported package
    pages once they are authored.
  - Preserve category navigation, status badges, aspirational install copy,
    mobile layout constraints, and theme support.
- `radcn/apps/docs/tests/coverage.spec.ts`
  - Strengthen coverage so every exported package subpath has a docs route that
    is not a draft page, has at least one example, includes an import snippet,
    keeps aspirational install wording, and renders a live RadCN preview hook.
  - Keep explicit checks that `form`, `date-picker`, and `data-table` are
    honest `not-shipped-yet` pages.
  - Add representative checks across static display, form/native controls,
    overlay, composite, navigation, application shell, helper, and recipe/block
    categories.
- `issues/0003-build-radcn-documentation-site/README.md`
  - Add learnings needed by later documentation or component work, especially
    any component APIs that need preview-only treatment or cannot yet support a
    richer live docs example.

## Verification

Pass criteria:

- No exported package subpath docs page is rendered or tested as a generic
  draft registry page.
- Every exported package subpath except `.`, `./styles`, and `./package.json`
  has a routed page, at least one example, an import snippet, aspirational
  install copy, accessibility notes, customization notes, and Remix 3
  divergence notes.
- Every exported component/helper page renders a live RadCN package preview
  that can be found by a stable public `data-radcn-*` hook or equivalent public
  role/label when the component intentionally renders native markup.
- `form`, `date-picker`, and `data-table` remain documented as
  `not-shipped-yet` block dispositions and do not show fake `radcn/<slug>`
  package imports.
- The docs site remains polished enough for the current issue: no obvious
  horizontal overflow on desktop or a 390px mobile viewport for a representative
  ready page and a representative non-shipped page.
- No npm publishing command, package-public change, or dependency on `vendor/`
  is introduced.

Commands:

- `pnpm --dir radcn/apps/docs typecheck`
- `pnpm radcn:typecheck`
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts`
- `git diff --check`
- `git -C vendor/shadcn-ui status --short`
- `git -C vendor/remix status --short`
- `git -C vendor/react-router status --short`
- Scope grep:
  - `git diff --name-only HEAD -- radcn package.json pnpm-workspace.yaml pnpm-lock.yaml | rg '(^|/)vendor(/|$)'`
    returns no output.
  - `git diff HEAD -- radcn package.json pnpm-workspace.yaml pnpm-lock.yaml | rg 'npm publish|pnpm publish|publishConfig|"private": false|vendor/'`
    returns no output.

Manual checks:

- Run `pnpm dev` from the repository root and inspect at least:
  - desktop home page;
  - one static display page;
  - one native form/control page;
  - one overlay page;
  - one composite/navigation page;
  - one non-shipped block page;
  - a 390px mobile viewport for one authored page and one non-shipped page.

## Design Review

Reviewer: Darwin (`019e9817-51bb-75d1-8526-d777ef6cc5a9`)

Fresh context: Yes (`fork_context: false`)

Findings:

- Blocker: None
- Major: None
- Minor: The scope grep was described as a requirement but not written as an
  executable command.

Fixes:

- Replaced the prose scope grep with concrete `git diff`/`rg` commands that
  check changed workspace paths for vendor references, publishing commands,
  `publishConfig`, and package-public changes.

Reviewer approval: Approved; no blockers remained.

## Result

**Result:** Pass

Converted the generated exported registry pages from draft entries into authored
docs pages. Every exported RadCN package subpath now resolves to a page with
`ready` status, a package import snippet, aspirational install copy, a live
RadCN package preview, accessibility notes, customization notes, and Remix 3
divergence notes. Existing rich examples for Button, Badge, Input, Dialog,
Tabs, and Sonner remain intact.

Added an authored preview dispatcher that renders compact examples for every
remaining exported surface, including display, input/native control, overlay,
composite, navigation, layout, feedback, helper, utility, and recipe surfaces.
Overlay and composite examples use preview-pinned content where necessary so
the package parts are visible in the docs without requiring a browser
interaction first. Source snippets are now concrete component usage examples
rather than placeholder containers.

Kept `form`, `date-picker`, and `data-table` as `not-shipped-yet` block
dispositions. Their preview section now says `Planned block disposition`, and
their import snippets remain comments rather than fake package imports.

Strengthened `radcn/apps/docs/tests/coverage.spec.ts` so every exported package
subpath must render an expected public RadCN preview hook and must not fall back
to a generic draft preview. The test also checks that non-exported block pages
do not use the `Live package example` heading.

Verification run:

- `pnpm --dir radcn/apps/docs typecheck` — Pass
- `pnpm radcn:typecheck` — Pass
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts` — Pass
  (10 tests)
- `git diff --check` — Pass
- `git -C vendor/shadcn-ui status --short` — Pass, no output
- `git -C vendor/remix status --short` — Pass, no output
- `git -C vendor/react-router status --short` — Pass, no output
- `git diff --name-only HEAD -- radcn package.json pnpm-workspace.yaml pnpm-lock.yaml | rg '(^|/)vendor(/|$)'`
  — Pass, no output
- `git diff HEAD -- radcn package.json pnpm-workspace.yaml pnpm-lock.yaml | rg 'npm publish|pnpm publish|publishConfig|"private": false|vendor/'`
  — Pass, no output

Manual visual and viewport checks:

- Ran `pnpm dev` from the repository root.
- Inspected desktop home, desktop Accordion, desktop Popover, mobile Input OTP,
  mobile Navigation Menu, and mobile Data Table pages.
- Captured screenshots under `/tmp/radcn-issue3-*.png`.
- Overflow probes reported:
  - desktop home: `scrollWidth = clientWidth = 1440`
  - desktop Accordion: `scrollWidth = clientWidth = 1440`
  - desktop Popover: `scrollWidth = clientWidth = 1440`
  - mobile Input OTP: `scrollWidth = clientWidth = 390`
  - mobile Navigation Menu: `scrollWidth = clientWidth = 390`
  - mobile Data Table: `scrollWidth = clientWidth = 390`
- Rechecked mobile Data Table after the non-shipped heading fix; the page
  reported `Planned block disposition` and `scrollWidth = clientWidth = 390`.

## Conclusion

Issue 3's remaining documentation-content gap is closed for the current RadCN
package surface. The docs site now covers every exported component/helper and
the known non-shipped block dispositions with routes, navigation, package-backed
examples where APIs exist, aspirational install copy, customization and
accessibility notes, Remix 3 divergence notes, and regression coverage.

## Completion Review

Reviewer: Mill (`019e9822-e5e2-7b23-b939-9b226909d6b9`)

Fresh context: Yes (`fork_context: false`)

Findings:

- Blocker: None
- Major: None
- Minor: None

Reviewer approval: Approved. The reviewer confirmed that the implementation
matches the approved scope, the issue README status and learnings are updated,
non-shipped blocks use comment-only import examples, the UI labels those pages
as planned block dispositions, the strengthened coverage tests enforce exported
authored pages and honest block pages, verification commands passed, vendor
checks and scope greps were clean, and the result commit had not been made
before review.
