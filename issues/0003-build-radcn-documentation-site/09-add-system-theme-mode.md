# Experiment 9: Add system theme mode

## Description

Experiment 6 added dark mode as a two-state light/dark toggle. That is the wrong
model for RadCN docs and for RadCN theming guidance. The default should be
`system`, users must be able to override to `light` or `dark`, and the control
must expose three modes instead of behaving like a binary toggle.

This experiment replaces the docs theme behavior with a two-layer contract:

- theme mode: the user preference, one of `system`, `light`, or `dark`;
- resolved theme: the actual visual theme applied to the document, one of
  `light` or `dark`.

The RadCN package CSS should continue to read the resolved document theme from
`data-radcn-theme="dark"` so existing token selectors stay simple. The docs app
should add `data-radcn-theme-mode="system|light|dark"` to record the active
preference and should resolve `system` through
`window.matchMedia('(prefers-color-scheme: dark)')`.

## Changes

- `radcn/apps/docs/app/ui/document.tsx`
  - Change the initial document markup from a hardcoded light-mode document to a
    system-mode document.
  - Replace the inline initial-theme script with a mode resolver that:
    - reads the stored preference;
    - treats missing, invalid, or unreadable storage as `system`;
    - migrates existing `radcn-theme` values of `light` or `dark` as explicit
      overrides;
    - resolves `system` from `prefers-color-scheme`;
    - sets both `data-radcn-theme-mode` and `data-radcn-theme` before the app
      visibly renders.

- `radcn/apps/docs/app/assets/entry.ts`
  - Replace the current `RadcnTheme = 'light' | 'dark'` toggle behavior with
    `RadcnThemeMode = 'system' | 'light' | 'dark'`.
  - Use a dedicated storage key such as `radcn-theme-mode`; continue reading the
    old `radcn-theme` key only for migration/backward compatibility.
  - Add a resolver that maps `system` to `light` or `dark` using
    `matchMedia('(prefers-color-scheme: dark)')`.
  - Listen for system color-scheme changes and update the resolved theme when
    the active mode is `system`.
  - Update all theme-mode controls whenever the active mode or resolved theme
    changes.

- `radcn/apps/docs/app/ui/docs-pages.tsx`
  - Replace the existing one-button theme toggle with a compact segmented
    control containing `System`, `Light`, and `Dark`.
  - Use accessible three-option semantics, preferably a `role="radiogroup"`
    container with three `role="radio"` buttons and `aria-checked`.
  - Remove the binary toggle attributes such as `data-radcn-theme-toggle` and
    `aria-pressed`.
  - Keep the control visually compact enough for the current header at desktop
    and mobile widths.

- `radcn/apps/docs/app/ui/docs-pages.tsx`
  - Add or adjust segmented-control styles for selected, unselected, hover,
    focus-visible, light, and dark states.
  - Ensure selected-state styles are driven by attributes such as
    `data-active="true"` or `aria-checked="true"` rather than by text content.
  - Update the theming documentation to describe RadCN's resolved-theme
    contract:
    - `data-radcn-theme="dark"` activates dark tokens;
    - apps that want system support should store a preference separately;
    - `system` should resolve through `prefers-color-scheme`;
    - explicit `light` and `dark` selections override the system preference.

- `radcn/packages/radcn/src/styles/tokens.css`
  - Keep package selectors based on resolved `data-radcn-theme="dark"` unless
    implementation discovers a concrete reason package tokens also need to know
    the preference mode.
  - Do not make package styles depend on docs-only control attributes.

- `issues/0003-build-radcn-documentation-site/README.md`
  - After implementation, record the theme-mode contract in `## Learnings` so
    later component and docs work knows that preference mode and resolved theme
    are intentionally separate.

## Verification

- Run static checks:
  - `pnpm radcn:typecheck`
  - `pnpm --dir radcn/apps/docs typecheck`
  - `git diff --check`

- Run docs app browser checks with Playwright or an equivalent browser script:
  - with no stored preference and emulated light system scheme, the document has
    `data-radcn-theme-mode="system"` and `data-radcn-theme="light"`;
  - with no stored preference and emulated dark system scheme, the document has
    `data-radcn-theme-mode="system"` and `data-radcn-theme="dark"`;
  - selecting `Light` under an emulated dark system scheme persists `light`,
    marks only the Light option as selected, and resolves
    `data-radcn-theme="light"` after reload;
  - selecting `Dark` under an emulated light system scheme persists `dark`,
    marks only the Dark option as selected, and resolves
    `data-radcn-theme="dark"` after reload;
  - selecting `System` after an explicit override persists `system`, marks only
    the System option as selected, and follows the emulated system scheme after
    reload;
  - while System mode is active, changing the emulated color scheme updates the
    resolved theme without changing the stored mode.

- Inspect the rendered UI:
  - the header exposes exactly three theme choices: `System`, `Light`, and
    `Dark`;
  - the control is not a binary toggle and does not use stale
    `data-radcn-theme-toggle` attributes;
  - focus-visible, hover, selected, light, and dark appearances are legible;
  - text and controls do not overlap at mobile and desktop widths.

- Confirm visual behavior:
  - representative docs surfaces, including buttons, cards, previews, code
    blocks, and navigation, visibly change between resolved light and dark
    themes;
  - package component styles still respond to the resolved
    `data-radcn-theme="dark"` attribute;
  - no dependency is added on any source under `vendor/`.

## Design Review

Not completed before implementation. The user directly requested implementation
after the experiment was designed, so this run proceeds with completion review
as the required fresh-context gate before any result commit.

## Result

**Result:** Pass

Implemented system-aware theme mode for the docs app. The default document mode
is now `system`; the browser entry resolves system preference through
`prefers-color-scheme`, persists explicit `system`, `light`, and `dark`
selections, migrates prior `radcn-theme` values, and keeps the resolved package
theme on `data-radcn-theme`.

The header theme control is now a three-option radiogroup with `System`,
`Light`, and `Dark` choices. The old binary `data-radcn-theme-toggle` control
was removed. The theming docs now describe the preference-mode versus
resolved-theme contract.

Added a docs Playwright config and a focused browser spec for system default,
explicit overrides, persistence after reload, stale toggle removal, and live
system color-scheme changes while System mode is active.

Verification run:

- `pnpm --dir radcn/apps/docs typecheck` — Pass
- `pnpm radcn:typecheck` — Pass
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts` — Pass
  (5 tests)
- `git diff --check` — Pass
- `git status --short --ignored vendor` — Pass; vendor checkouts remain ignored
  as `!! vendor/react-router/`, `!! vendor/remix/`, and `!! vendor/shadcn-ui/`

## Conclusion

Dark mode is no longer a binary docs toggle. RadCN docs now have a system-first
theme-mode model, user override support, and browser coverage for the expected
state transitions. Later docs and component work should treat
`data-radcn-theme-mode` as app-owned preference state and `data-radcn-theme` as
the package-owned resolved visual theme.

## Completion Review

Reviewer: Plato (`019e97f1-94b5-7452-8e13-d516b3f8658f`)

Fresh context: Yes (`fork_context: false`)

Findings:

- Blocker: None
- Major: None
- Minor: None

Reviewer approval: Approved.

Reviewer verification:

- `pnpm --dir radcn/apps/docs typecheck` — Pass
- `pnpm radcn:typecheck` — Pass
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts` — Pass
  (5 tests)
- `git diff --check` — Pass
- `git status --short --ignored vendor` — Pass; vendor checkouts remain ignored

Reviewer noted that the result commit has not been made yet.
