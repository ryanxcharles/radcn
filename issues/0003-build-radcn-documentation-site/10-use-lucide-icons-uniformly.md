# Experiment 10: Use Lucide icons uniformly

## Description

The docs app currently mixes icon strategies. The theme mode control uses text
only, and `radcn/apps/docs/app/assets/prompt-button.tsx` contains a hand-written
copy SVG. That makes icon usage harder to scale as the docs site grows.

This experiment installs Lucide's plain SVG package and establishes one
docs-local icon pattern that works with Remix 3's non-React UI model. The goal
is not to add decoration everywhere. The goal is to use icons where they clarify
compact controls and commands, while keeping visible labels where text is needed
for scanning.

Use `lucide-static`, not `lucide-react`, because RadCN docs are built with
Remix UI instead of React components. The implementation should use only the
individual icons needed by the docs app.

## Changes

- `pnpm-workspace.yaml`
  - Add `lucide-static` to the root catalog.
  - Resolve the actual version at implementation time with
    `pnpm view lucide-static version`, then record the selected range in the
    catalog.

- `radcn/apps/docs/package.json`
  - Add `lucide-static` as a docs app dependency using the catalog protocol.
  - Do not add any dependency on `vendor/`, and do not use vendored source as a
    package dependency.

- `pnpm-lock.yaml`
  - Update through `pnpm install` after the catalog and docs dependency are
    added.

- `radcn/apps/docs/app/ui/icons.tsx`
  - Create a docs-local icon module that exposes a small named set of icons
    needed now, starting with:
    - `MonitorIcon` or `LaptopIcon` for System mode;
    - `SunIcon` for Light mode;
    - `MoonIcon` for Dark mode;
    - `CopyIcon` for copy actions.
  - Prefer a uniform Remix UI component wrapper with shared props for accessible
    label, decorative mode, size, stroke width, and class/style hooks.
  - Keep icons as inline SVG in rendered HTML so they inherit `currentColor` and
    can be styled consistently in buttons.
  - During implementation, first prove the best `lucide-static` consumption
    path in this app:
    - preferred: import individual SVG assets from
      `lucide-static/icons/{name}.svg` only if Remix's asset pipeline and
      TypeScript expose inline/raw SVG markup that the wrapper can render as
      SVG elements;
    - rejected: URL or `<img>` style SVG imports, because they do not satisfy
      the `currentColor` inheritance and inline accessibility goals;
    - fallback: generate or maintain a tiny checked-in icon map from
      `lucide-static` SVG strings for only the icons RadCN docs uses.
  - Do not introduce a global sprite or icon font.

- `radcn/apps/docs/app/ui/docs-pages.tsx`
  - Update the theme mode segmented control so each option contains a Lucide
    icon plus an accessible text label.
  - Keep the three-option `role="radiogroup"` semantics from Experiment 9.
  - Use the shared icon styles instead of one-off SVG sizing.
  - Add icons only where they make command/navigation affordances clearer; do
    not turn every nav link, heading, or badge into an icon row.

- `radcn/apps/docs/app/assets/prompt-button.tsx`
  - Replace the hand-written copy SVG with the shared `CopyIcon`.
  - Preserve the existing hydrated clipboard behavior and visual layout.

- `radcn/apps/docs/tests/theme-mode.spec.ts`
  - Extend the theme control assertions to verify the three mode buttons still
    expose accessible names `System`, `Light`, and `Dark` after icons are added.
  - Assert that the stale binary toggle remains absent.

- `issues/0003-build-radcn-documentation-site/README.md`
  - After implementation, record the chosen Lucide consumption pattern in
    `## Learnings` so future docs work knows whether to import SVG assets
    directly or use the local generated/icon-map wrapper.

## Verification

- Dependency and workspace checks:
  - `pnpm install`
  - `pnpm list lucide-static --filter docs`
  - confirm `vendor/` remains outside workspace dependencies and no vendor
    source is referenced by `package.json`, `pnpm-lock.yaml`, or app imports.

- Static checks:
  - `pnpm --dir radcn/apps/docs typecheck`
  - `pnpm radcn:typecheck`
  - `git diff --check`

- Browser checks:
  - `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts`
  - the theme control still has exactly three accessible options: `System`,
    `Light`, and `Dark`;
  - the theme buttons render icons without replacing their accessible names;
  - selecting System, Light, and Dark still updates `data-radcn-theme-mode` and
    resolved `data-radcn-theme` as in Experiment 9;
  - the prompt copy button still renders and can be clicked without console
    errors.

- Visual inspection:
  - theme-control icons are legible in resolved light and dark themes;
  - icons align with labels in the compact header at desktop and mobile widths;
  - copy/action icons inherit `currentColor` and do not introduce off-palette
    fills;
  - no text or icon overlaps in the top bar.

## Design Review

Reviewer: Gauss (`019e97f7-7e2b-7d73-8730-8659bffd484d`)

Fresh context: Yes (`fork_context: false`)

Findings:

- Blocker: None
- Major: Direct SVG asset imports might resolve to URLs instead of inline SVG
  markup, which would fail the experiment's `currentColor` and inline
  accessibility goals.
- Minor: None

Fixes:

- Clarified that direct SVG imports are acceptable only if Remix and TypeScript
  expose inline/raw SVG markup usable by the wrapper.
- Explicitly rejected URL or `<img>` style SVG imports.
- Kept the generated or checked-in icon-map fallback as the required path if
  raw inline SVG imports are not available.

Reviewer approval: Approved after the major clarification.
