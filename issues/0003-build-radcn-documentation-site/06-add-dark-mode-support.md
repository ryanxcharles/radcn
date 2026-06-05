# Experiment 6: Add Dark Mode Support

## Description

Add first-class dark mode support to RadCN and the RadCN docs site.

Experiment 5 proved the docs registry and page renderer across representative
components. It also made clear that the current component previews and docs
shell are light-only. RadCN itself is token-based, so components can be themed,
but the package currently ships only light default tokens and the docs site
hardcodes light color-scheme metadata and light brand tokens.

This experiment should make dark mode a supported product behavior, not a
docs-only visual trick:

- RadCN package styles should include dark theme token values that a consuming
  app can activate.
- The docs site should expose a usable light/dark control and render the docs
  shell plus live RadCN package previews correctly in both modes.
- Verification should prove representative components have dark computed
  colors and that the docs pages remain readable on desktop and mobile.

The implementation should keep the scope narrow. Do not redesign the site or
rework the component registry. Do not add broad theme customization,
multi-palette support, system preference persistence, or a full theme editor.

## Changes

- `radcn/packages/radcn/src/styles/tokens.css`
  - Add RadCN dark token support using an explicit selector such as
    `[data-radcn-theme="dark"]`.
  - Keep light defaults compatible with the current `:root` behavior.
  - Cover every base token used by package components, including background,
    foreground, primary, secondary, muted, border, input, ring, destructive,
    popover, accent, card, and any other root-level tokens referenced by
    components.
  - Prefer token overrides over component-specific dark CSS unless a component
    has a concrete contrast bug that cannot be solved by tokens.
- `radcn/packages/radcn/src/styles/index.ts`
  - Keep `radcnStyles` synchronized with `tokens.css`.
  - If the project already has or needs a tiny generation helper, record that
    in the result; otherwise keep this experiment focused and update the string
    module directly.
- `radcn/apps/docs/app/ui/brand.ts`
  - Add a dark docs-brand palette or a theme-aware brand token model.
  - Preserve the Experiment 4 RadCN identity: robot mark, high-energy accent,
    grid, hard-shadow attitude, and neutral component preview surfaces.
- `radcn/apps/docs/app/ui/document.tsx`
  - Update color-scheme metadata so the document can support both light and
    dark rendering.
  - Add the initial theme attribute needed by the docs shell and RadCN tokens.
- `radcn/apps/docs/app/ui/docs-pages.tsx`
  - Add a small theme control in the existing docs chrome.
  - The control should be a real UI control, not a marketing note. It should
    allow switching between light and dark in the browser without a full page
    rebuild.
  - Apply the theme attribute so both docs shell styles and RadCN package
    component previews switch together.
  - Keep page layout, navigation, registry rendering, and component examples
    otherwise unchanged.
- `radcn/apps/docs/app/assets/`
  - Add the smallest browser entry needed for the theme switch.
  - Store user choice in `localStorage` if practical.
  - Avoid adding a framework or global state system for this experiment.
- `radcn/apps/docs/app/content/components.tsx`
  - Update documentation text only if needed to mention dark-mode token usage.
  - Do not add new component pages in this experiment.
- `issues/0003-build-radcn-documentation-site/README.md`
  - Record learnings about the theme selector, token scope, docs-shell theming,
    and whether `radcnStyles` synchronization needs a future generator.
- `issues/0003-build-radcn-documentation-site/06-add-dark-mode-support.md`
  - Record implementation result, verification output, screenshot paths,
    conclusion, and completion review.

If implementation discovers that a package component uses an undefined token
such as `--radcn-popover` or `--radcn-card`, define that token at the root in
both light and dark themes instead of patching only the affected component.

## Verification

The experiment passes when all of these are true:

- RadCN package styles expose a documented dark theme selector.
- Light mode remains the default when no theme selector is present.
- Applying the dark theme selector changes package component computed colors for
  representative components such as `button`, `input`, `badge`, `dialog`,
  `tabs`, and `sonner`.
- The docs site has a visible theme control in the existing chrome.
- The theme control switches the document, docs shell, and RadCN component
  previews between light and dark without navigation.
- The selected theme persists across reloads if localStorage is available.
- The docs document advertises support for both light and dark color schemes.
- Existing component routes still render from the shared registry and continue
  to return `200`.
- Unknown component slugs still return `404`.
- Desktop and mobile screenshots in both light and dark show readable text,
  visible focus/control affordances, readable code blocks, and no incoherent
  overlap.
- The dark docs palette still reads as RadCN: energetic accent, robot mark,
  grid texture, and neutral preview panels.
- The implementation does not modify vendor checkouts.
- `pnpm --dir apps/docs typecheck` passes.
- `pnpm radcn:typecheck` passes.
- `git diff --check` passes.
- A separate AI agent reviews the completed experiment result before the result
  commit or any next experiment design.

Suggested verification commands:

```sh
cd radcn
pnpm --dir apps/docs typecheck
pnpm radcn:typecheck
PORT=5175 pnpm --dir apps/docs start
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5175/ | rg '^200$'
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5175/docs/components/button | rg '^200$'
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5175/docs/components/badge | rg '^200$'
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5175/docs/components/input | rg '^200$'
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5175/docs/components/dialog | rg '^200$'
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5175/docs/components/tabs | rg '^200$'
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5175/docs/components/sonner | rg '^200$'
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5175/docs/components/not-a-component | rg '^404$'
curl -s http://localhost:5175/ | rg 'color-scheme|data-radcn-theme|Theme|data-radcn-logo'
pnpm exec playwright screenshot --viewport-size=1440,1000 http://localhost:5175/ /tmp/radcn-exp6-home-light-desktop.png
pnpm exec playwright screenshot --viewport-size=390,844 http://localhost:5175/ /tmp/radcn-exp6-home-light-mobile.png
pnpm exec playwright screenshot --viewport-size=1440,1000 http://localhost:5175/docs/components/dialog /tmp/radcn-exp6-dialog-light-desktop.png
pnpm exec playwright screenshot --viewport-size=390,844 http://localhost:5175/docs/components/dialog /tmp/radcn-exp6-dialog-light-mobile.png
pnpm exec playwright screenshot --viewport-size=1440,1000 http://localhost:5175/docs/components/tabs /tmp/radcn-exp6-tabs-light-desktop.png
pnpm exec playwright screenshot --viewport-size=390,844 http://localhost:5175/docs/components/tabs /tmp/radcn-exp6-tabs-light-mobile.png
# Use Playwright or DevTools emulation to switch the theme control, then capture:
# /tmp/radcn-exp6-home-dark-desktop.png
# /tmp/radcn-exp6-home-dark-mobile.png
# /tmp/radcn-exp6-dialog-dark-desktop.png
# /tmp/radcn-exp6-dialog-dark-mobile.png
# /tmp/radcn-exp6-tabs-dark-desktop.png
# /tmp/radcn-exp6-tabs-dark-mobile.png
git -C .. diff --check
git -C .. status --short -- vendor
```

Add a focused Playwright or Node-based computed-style check if practical. It
should verify that applying `[data-radcn-theme="dark"]` changes at least these
observable values:

- page background;
- page foreground text;
- `button` default background/foreground;
- `input` background/border/foreground;
- `badge` outline foreground/border;
- `dialog` content background/foreground;
- `tabs` trigger/content background;
- `sonner` toast background/foreground.

During screenshot inspection, explicitly check:

- top navigation and theme-control fit;
- sidebar category readability;
- homepage hero and robot mark in both themes;
- neutral preview-panel contrast in both themes;
- source-code block contrast in both themes;
- overlay and composite previews in both themes;
- mobile header, nav, and page-title fit.

## Design Review

Fresh-context design review was performed by Codex subagent `Huygens` on
2026-06-05 with `fork_context: false`.

Findings:

- **Minor:** `radcn/package.json` had an unrelated uncommitted pnpm
  `packageManager` bump in the worktree, but this experiment does not include
  `radcn/package.json` in scope. The plan commit must exclude that unrelated
  change, commit it separately, or explicitly add it to scope.

Resolution:

- Kept the pnpm `radcn/package.json` change out of Experiment 6 scope. The plan
  commit must stage only the Issue 3 README and Experiment 6 plan file.

Result:

- Huygens approved the experiment design with no blockers or major findings.

## Result

**Result:** Pass

Implemented dark mode support for both the RadCN package and the RadCN docs
site.

Package changes:

- `radcn/packages/radcn/src/styles/tokens.css` now keeps light tokens as the
  default `:root` values and adds `[data-radcn-theme="dark"]` dark token
  overrides.
- The dark selector covers shared base tokens used across the package,
  including background, foreground, card, popover, primary, secondary, muted,
  accent, border, input, ring, and destructive values.
- `radcn/packages/radcn/src/styles/index.ts` was regenerated from
  `tokens.css` so `radcnStyles` remains synchronized with the package CSS
  consumed by the docs app.

Docs changes:

- `radcn/apps/docs/app/ui/brand.ts` now exposes docs color values through CSS
  variables and defines light plus dark docs palettes.
- `radcn/apps/docs/app/ui/document.tsx` now renders
  `data-radcn-theme="light"` by default, advertises `color-scheme` support for
  `light dark`, injects the docs theme styles, and sets the initial theme from
  `localStorage` before the page paints.
- `radcn/apps/docs/app/ui/docs-pages.tsx` adds a visible theme control to the
  existing top chrome and adds a Theming section to component pages documenting
  `data-radcn-theme="dark"`.
- `radcn/apps/docs/app/assets/entry.ts` initializes the theme control, toggles
  the document theme without navigation, updates ARIA state and labels, and
  persists the selected theme to `localStorage`.
- `radcn/apps/docs/app/assets.ts` maps
  `/assets/node_modules/.pnpm/*path` to the workspace virtual store at
  `../../node_modules/.pnpm/*path`.

The asset-server change fixes a root browser-entry issue found during
verification. Remix's asset transform emitted a dependency URL under
`/assets/node_modules/.pnpm/...`, but the docs app only mapped
`node_modules/*path` to the app-local `node_modules`. The app-local
`node_modules` has package symlinks but no `.pnpm` virtual store, so the
transformed import returned `404` even though the allow list included the real
workspace store. Adding the explicit `.pnpm` fileMap entry makes the normal
browser entry run; no separate theme workaround script is used.

Verification run from `radcn/` on 2026-06-05:

```sh
pnpm --dir apps/docs typecheck
# Pass: tsc --noEmit

pnpm radcn:typecheck
# Pass: packages/radcn tsc

entry=$(curl -s http://localhost:5175/assets/app/assets/entry.ts | sed -n '1p' | sed -E 's/^import \{ run \} from "([^"]+)";.*/\1/')
curl -s -o /dev/null -w "entry-dependency %{http_code}\n" "http://localhost:5175${entry}" | rg '^entry-dependency 200$'
# Pass

curl -s -o /dev/null -w 'home %{http_code}\n' http://localhost:5175/ | rg '^home 200$'
curl -s -o /dev/null -w 'button %{http_code}\n' http://localhost:5175/docs/components/button | rg '^button 200$'
curl -s -o /dev/null -w 'badge %{http_code}\n' http://localhost:5175/docs/components/badge | rg '^badge 200$'
curl -s -o /dev/null -w 'input %{http_code}\n' http://localhost:5175/docs/components/input | rg '^input 200$'
curl -s -o /dev/null -w 'dialog %{http_code}\n' http://localhost:5175/docs/components/dialog | rg '^dialog 200$'
curl -s -o /dev/null -w 'tabs %{http_code}\n' http://localhost:5175/docs/components/tabs | rg '^tabs 200$'
curl -s -o /dev/null -w 'sonner %{http_code}\n' http://localhost:5175/docs/components/sonner | rg '^sonner 200$'
curl -s -o /dev/null -w 'missing %{http_code}\n' http://localhost:5175/docs/components/not-a-component | rg '^missing 404$'
# Pass

curl -s http://localhost:5175/ | rg 'color-scheme|data-radcn-theme|Light|data-radcn-logo'
curl -s http://localhost:5175/docs/components/button | rg 'Theming|data-radcn-theme="dark"|Switch to dark theme'
# Pass

git -C .. diff --check
# Pass

git -C .. status --short -- vendor
# Pass: no output
```

Browser computed-style verification used Playwright through
`pnpm exec node` and confirmed:

- the visible theme control starts in light mode;
- clicking the control sets `data-radcn-theme="dark"`;
- the control updates `aria-pressed`, accessible label, and visible label;
- the selected theme persists in `localStorage`;
- reloading restores dark mode;
- no browser request failures or page errors occurred;
- computed colors changed between light and dark for the page shell, default
  button, input, outline badge, dialog content, tabs content, and sonner toast.

Screenshot artifacts captured and inspected:

- `/tmp/radcn-exp6-home-light-desktop.png`
- `/tmp/radcn-exp6-home-light-mobile.png`
- `/tmp/radcn-exp6-dialog-light-desktop.png`
- `/tmp/radcn-exp6-dialog-light-mobile.png`
- `/tmp/radcn-exp6-tabs-light-desktop.png`
- `/tmp/radcn-exp6-tabs-light-mobile.png`
- `/tmp/radcn-exp6-home-dark-desktop.png`
- `/tmp/radcn-exp6-home-dark-mobile.png`
- `/tmp/radcn-exp6-dialog-dark-desktop.png`
- `/tmp/radcn-exp6-dialog-dark-mobile.png`
- `/tmp/radcn-exp6-tabs-dark-desktop.png`
- `/tmp/radcn-exp6-tabs-dark-mobile.png`

Inspection found readable top navigation and theme controls, readable sidebar
categories, preserved robot/grid/accent identity, neutral preview panels,
readable code blocks, and no incoherent overlap in the inspected light and dark
desktop/mobile captures.

Notes:

- The existing uncommitted `radcn/package.json` pnpm `packageManager` bump is
  unrelated to this experiment and was intentionally left out of the Experiment
  6 implementation scope.
- The untracked `raw-icons/` directory is unrelated to this experiment and was
  left unstaged.

## Conclusion

Experiment 6 establishes the RadCN dark-mode contract: light tokens are the
default, and consumers can opt into dark mode with
`data-radcn-theme="dark"` on an ancestor. The docs app uses the same selector
for the docs shell and live package previews, so the website now demonstrates
the supported package behavior instead of simulating it with docs-only CSS.

The most important implementation learning is that browser behavior in the
nested pnpm workspace depends on correct asset-server mapping for pnpm's
virtual store. Future browser-entry failures should be treated as asset
pipeline bugs first, not worked around with duplicate scripts.

The manual `tokens.css` to `radcnStyles` synchronization is now more costly.
Future style-heavy experiments should add a small generator or check that keeps
the CSS file and exported string synchronized.

## Completion Review

Fresh-context completion review was performed by Codex subagent `Faraday`
(`019e97c1-7d82-7fa1-86b0-c9405d2eb20f`) on 2026-06-05 with
`fork_context: false`.

Findings:

- **Minor:** `radcn/apps/docs/app/ui/document.tsx` used
  `docsBrand.color.accent` for `<meta name="theme-color">` after
  `docsBrand.color.accent` became `var(--docs-accent)`. Browsers may ignore CSS
  variables in `theme-color` metadata.

Resolution:

- Replaced the single CSS-variable `theme-color` value with literal
  media-aware light and dark values:
  `#ff2d20` for `(prefers-color-scheme: light)` and `#ff4a3d` for
  `(prefers-color-scheme: dark)`.
- Reran the focused docs typecheck, metadata curl, pnpm virtual-store asset
  curl, route checks, `git diff --check`, vendor cleanliness check, and
  Playwright theme toggle persistence check after the fix.

Result:

- Faraday approved the completed experiment with no blockers or major findings.
  The real minor finding was fixed before the result commit.
