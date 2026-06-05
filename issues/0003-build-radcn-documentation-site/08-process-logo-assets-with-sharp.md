# Experiment 8: Process Logo Assets with Sharp

## Description

Replace the docs site's code-native SVG logo with generated raster assets from
the raw RadCN logo image.

The raw source logo is:

```text
raw-icons/radcn-1.png
```

Local inspection found it is a square `1254 x 1254` RGBA PNG, which is suitable
as the source for deterministic resized docs assets.

This experiment should add a small Sharp-based image pipeline, generate WebP
logo assets for the docs site, generate a PNG favicon at `128 x 128` while
keeping the requested filename `favicon.ico`, and update the docs UI to use
the generated assets. All docs images from this pipeline should be WebP except
for the favicon, which should be PNG bytes at `radcn/apps/docs/public/favicon.ico`.

The plan is based on existing local Sharp pipelines:

- `~/dev/termsurf/website/scripts/process-icons.ts`
- `~/dev/rxc/homepage/process-icons.ts`
- `~/dev/artintellica/ts/www-artintellica-com/process-icons.ts`
- `~/dev/id/webapp/process-icons.ts`

The reusable pattern from those projects is:

- keep source PNGs in `raw-icons/`;
- process with `sharp`;
- emit resized public assets under `public/images`;
- generate a small typed helper for valid image paths;
- handle favicon separately from normal image outputs.

Do not use `png-to-ico` in RadCN for this experiment. The favicon should retain
the path `/favicon.ico`, but its file contents should be a normal 128x128 PNG.

## Changes

- `package.json`
  - Add an `icons` script that runs the image pipeline from the repository root.
  - Add the smallest necessary dev dependency for the pipeline, expected to be
    `sharp`.
  - Do not add `png-to-ico`.
- `pnpm-lock.yaml`
  - Update through `pnpm install` from the repository root after adding `sharp`.
  - Preserve the root workspace boundary from Experiment 7.
  - Do not introduce any `vendor/` dependency resolution.
- `pnpm-workspace.yaml`
  - Update only if pnpm 11 requires a build approval policy for Sharp or one of
    its native dependencies.
  - Preserve explicit workspace globs:
    - `radcn/apps/*`
    - `radcn/packages/*`
    - `radcn/fixtures/*`
  - Do not add broad globs or `vendor/**`.
- `scripts/process-icons.mjs`
  - Add a repo-root image generation script based on the local Sharp patterns.
  - Use a runnable ESM JavaScript script so the root `icons` command does not
    require adding a TypeScript script runner.
  - Read source PNGs from `raw-icons/`.
  - Generate WebP logo images into `radcn/apps/docs/public/images/`.
  - Generate only WebP image outputs for normal image assets.
  - Generate `radcn/apps/docs/public/favicon.ico` as a 128x128 PNG file using
    Sharp's PNG output.
  - Generate a typed image helper for docs code, likely
    `radcn/apps/docs/app/ui/images.ts`, with allowed `/images/...webp` paths.
  - Use deterministic output names based on the source filename, such as
    `radcn-1-32.webp`.
- `raw-icons/radcn-1.png`
  - Commit this source image if it is still untracked.
  - Do not move it under `vendor/` or into the docs app.
- `radcn/apps/docs/public/images/`
  - Add generated WebP assets for useful docs logo sizes:
    - `radcn-1-32.webp`
    - `radcn-1-64.webp`
    - `radcn-1-96.webp`
    - `radcn-1-128.webp`
    - `radcn-1-180.webp`
    - `radcn-1-200.webp`
    - `radcn-1-300.webp`
    - `radcn-1-400.webp`
- `radcn/apps/docs/public/favicon.ico`
  - Generate a 128x128 PNG file at this path.
  - The filename remains `.ico` by request, but file inspection should show PNG
    bytes and `128 x 128`.
- `radcn/apps/docs/public/favicon.svg`
  - Remove it if the docs app no longer references it.
- `radcn/apps/docs/app/ui/logo.tsx`
  - Replace the hard-coded SVG robot with an `<img>` using generated WebP
    assets.
  - Keep the existing `RadcnLogo` component API if practical so the docs shell
    and homepage do not need broad rewrites.
  - Use a smaller asset for top navigation and a larger asset for the homepage
    hero.
  - Preserve `data-radcn-logo` hooks used by existing checks.
- `radcn/apps/docs/app/ui/document.tsx`
  - Point the favicon link at `/favicon.ico`.
  - Use `type="image/png"` even though the filename is `favicon.ico`.
- `issues/0003-build-radcn-documentation-site/README.md`
  - Record learnings about the image pipeline, generated formats, and favicon
    filename/content mismatch.
- `issues/0003-build-radcn-documentation-site/08-process-logo-assets-with-sharp.md`
  - Record result, verification, screenshot paths, conclusion, and completion
    review after implementation.

Do not redesign the docs identity in this experiment. The goal is to replace
the current hand-coded SVG logo with generated assets from the selected raw
logo, not to revisit the broader visual system.

## Verification

The experiment passes when all of these are true:

- `raw-icons/radcn-1.png` is present and committed as the source logo.
- `pnpm icons` runs from `/Users/ryan/dev/radcn` and regenerates the docs image
  assets.
- All normal generated docs logo images are WebP files.
- `radcn/apps/docs/public/favicon.ico` exists, has PNG file contents, and is
  exactly `128 x 128`.
- The docs document links `/favicon.ico` with `type="image/png"`.
- The docs logo component renders an `<img>` backed by generated WebP assets,
  not a hand-coded SVG.
- The top navigation logo renders cleanly in light and dark mode.
- The homepage hero logo renders cleanly in light and dark mode.
- No generated image asset overflows, blurs badly, or causes layout shift in
  the nav or hero.
- `pnpm install` passes from the repository root after adding the image
  pipeline dependency.
- `pnpm --dir radcn/apps/docs typecheck` passes.
- `pnpm radcn:typecheck` passes.
- `pnpm list -r --depth -1` still lists only the root workspace and RadCN
  packages under `radcn/apps/*`, `radcn/packages/*`, and `radcn/fixtures/*`.
- `pnpm-lock.yaml` does not resolve any dependency from `vendor/`.
- `git diff --check` passes.
- `git status --short -- vendor` produces no output.
- A separate AI agent reviews the completed experiment result before the result
  commit or any next experiment design.

Suggested verification commands:

```sh
pnpm install
pnpm icons
file raw-icons/radcn-1.png
file radcn/apps/docs/public/images/radcn-1-300.webp
file radcn/apps/docs/public/favicon.ico
sips -g pixelWidth -g pixelHeight radcn/apps/docs/public/favicon.ico
find radcn/apps/docs/public/images -type f | sort
find radcn/apps/docs/public/images -type f ! -name '*.webp'
rg '/favicon.ico|image/png|favicon.svg' radcn/apps/docs/app radcn/apps/docs/public
rg '<svg|<img|data-radcn-logo|radcn-1-' radcn/apps/docs/app/ui/logo.tsx
pnpm --dir radcn/apps/docs typecheck
pnpm radcn:typecheck
pnpm list -r --depth -1
rg -n "vendor/|\\.\\./vendor|link:.*vendor|file:.*vendor" pnpm-lock.yaml package.json pnpm-workspace.yaml
git diff --check
git status --short -- vendor
PORT=5175 pnpm dev
curl -s -o /dev/null -w 'home %{http_code}\n' http://localhost:5175/ | rg '^home 200$'
curl -s -o /dev/null -w 'logo %{http_code}\n' http://localhost:5175/images/radcn-1-300.webp | rg '^logo 200$'
curl -s -o /dev/null -w 'favicon %{http_code}\n' http://localhost:5175/favicon.ico | rg '^favicon 200$'
```

Capture and inspect screenshots after implementation:

```sh
pnpm exec playwright screenshot --viewport-size=1440,1000 http://localhost:5175/ /tmp/radcn-exp8-home-light-desktop.png
pnpm exec playwright screenshot --viewport-size=390,844 http://localhost:5175/ /tmp/radcn-exp8-home-light-mobile.png
```

Use Playwright to switch to dark mode, then capture:

```text
/tmp/radcn-exp8-home-dark-desktop.png
/tmp/radcn-exp8-home-dark-mobile.png
```

Inspect the screenshots for nav fit, hero logo clarity, dark/light contrast,
and absence of incoherent overlap.

## Design Review

Fresh-context design review was performed by Codex subagent `Parfit`
(`019e97d9-63fb-7322-9514-2dffc8f55131`) on 2026-06-05 with
`fork_context: false`.

Findings:

- **Blocker:** The experiment lacked a `Design Review` section to record the
  required review result before implementation.
- **Major:** The plan called for `scripts/process-icons.ts` while adding only
  `sharp`; the root workspace has no TypeScript runner for arbitrary scripts.

Resolution:

- Added this `Design Review` section with reviewer identity, fresh-context
  status, findings, fixes, and approval result.
- Changed the planned pipeline file to `scripts/process-icons.mjs`, a runnable
  ESM JavaScript script that only needs `sharp` as the image-processing
  dependency.

Result:

- Parfit approved the design after re-review with no blockers, major findings,
  or minor findings remaining.
