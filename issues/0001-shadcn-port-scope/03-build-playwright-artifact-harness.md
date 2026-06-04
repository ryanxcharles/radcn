# Experiment 3: Build Playwright Artifact Harness

## Description

Build the first automated browser harness for the paired fixture apps. The
harness should start the React Router reference app and the Remix 3 candidate
app on their fixed default ports, visit every shared proof-set route, assert the
fixture shell contract, and capture paired artifacts for later comparison.

This experiment should not attempt to prove exact component parity. In
particular, it should not compare exact DOM trees. RadCN components may use
different internal markup from shadcn/ui as long as the rendered component looks
the same to users and exposes an equivalent customization surface to authors.

The goal is to create a reliable artifact pipeline that future experiments can
use to define and enforce the parity model.

## Changes

Add Playwright-based test infrastructure under `fixtures/`:

```text
fixtures/
├── artifacts/                  # ignored generated output
├── playwright.config.ts
├── tests/
│   └── fixture-artifacts.spec.ts
└── scenarios/
    ├── index.ts
    └── types.ts
```

The exact file split may change if implementation finds a cleaner shape, but
the harness must stay scoped to the fixture apps and shared scenarios.

Update project metadata:

- add root scripts for artifact capture, for example
  `pnpm fixtures:artifacts`;
- add Playwright as a workspace dependency if it is not already installed;
- keep generated artifacts ignored in `.gitignore`;
- document the harness in `fixtures/README.md`.

### Harness Behavior

Use Playwright's `webServer` support or an equivalent deterministic startup
mechanism to run both apps:

- Reference React Router app: `http://localhost:4601`
- Candidate Remix 3 app: `http://localhost:4602`

The harness should use the shared scenario registry, not a duplicated hard-coded
route list, so future scenarios only need to be added once.

For each scenario, visit both app URLs:

```text
http://localhost:4601/fixtures/{component}/{scenario}
http://localhost:4602/fixtures/{component}/{scenario}
```

Assert only the stable fixture shell contract:

- `data-fixture-app="reference|candidate"`
- `data-component="{component}"`
- `data-scenario="{scenario}"`
- `[data-fixture-stage]` exists

Capture screenshots of `[data-fixture-stage]`, not the whole page, so fixture
chrome does not become part of component comparison. Use deterministic viewport
settings and start with the light/default theme only.

Write generated artifacts under an ignored directory such as:

```text
fixtures/artifacts/
├── manifest.json
├── reference/
│   └── button/default.png
└── candidate/
    └── button/default.png
```

The manifest should include at least:

- generation timestamp;
- app URLs and ports;
- viewport;
- scenario list;
- screenshot paths for each `{app, component, scenario}` pair;
- test status for each scenario route.

### Non-Goals

Do not add pass/fail pixel diffs yet.

Do not require exact DOM equivalence between shadcn/ui and RadCN. The DOM may
differ if the user-visible output and author customization model remain
equivalent.

Do not build the full parity policy in this experiment. The next experiment
should use the captured artifacts to define the visual, accessibility,
behavioral, and customization parity bar.

## Verification

The experiment passes if:

1. `pnpm fixtures:artifacts` starts or reuses both fixture apps on ports `4601`
   and `4602`.
2. The harness visits every scenario from `fixtures/scenarios/`.
3. The harness asserts the fixture shell attributes for both apps on every
   scenario route.
4. The harness captures paired `[data-fixture-stage]` screenshots for every
   scenario.
5. The harness writes a manifest describing the run and generated artifacts.
6. Generated artifacts remain ignored by git.
7. `fixtures/README.md` documents how to run the harness and where artifacts
   are written.
8. No files under `vendor/` are modified.
9. The result section records exact commands, generated artifact paths, and any
   limitations discovered while running Playwright.

The experiment does not need to prove that reference and candidate screenshots
match. It only needs to prove that the artifact pipeline is reliable enough for
the next experiment to define comparison rules.

## Design Review

Independent AI design review was performed by subagent `Pauli`, which approved
the design.

The review found no blocking issues. It verified that the experiment is narrowly
scoped to artifact capture, explicitly avoids exact DOM parity as a primary
goal, uses the paired fixture apps on fixed ports `4601` and `4602`, uses the
shared scenario registry rather than a duplicated route list, and has concrete
verification criteria.

Residual risks:

- Allowing the harness to reuse existing servers is practical locally, but CI
  should prefer deterministic startup to avoid accidentally testing stale
  listeners.
- This experiment intentionally defers pixel diff and parity rules, so it will
  not close the issue by itself.

## Result

**Result:** Pass

Implemented the Playwright artifact harness:

- `fixtures/playwright.config.ts` starts or reuses the React Router reference
  app on `http://localhost:4601` and the Remix 3 candidate app on
  `http://localhost:4602`.
- `fixtures/tests/fixture-artifacts.spec.ts` reads scenarios from
  `fixtures/scenarios/`, visits both apps for each scenario, asserts the stable
  fixture shell contract, captures `[data-fixture-stage]` screenshots, and
  writes `fixtures/artifacts/manifest.json`.
- `pnpm fixtures:artifacts` runs the harness from the repository root.
- `fixtures/README.md` documents the command and artifact output directory.
- `.gitignore` keeps generated artifacts and Playwright output out of git.

Verification commands run from the repository root:

```bash
pnpm install
pnpm fixtures:reference:typecheck
pnpm fixtures:candidate:typecheck
pnpm fixtures:artifacts
node <<'JS'
const manifest = require('./fixtures/artifacts/manifest.json')
const expected = manifest.scenarios.length * Object.keys(manifest.apps).length
const screenshots = manifest.entries.map((entry) => `fixtures/artifacts/${entry.screenshot}`)
console.log(`expected=${expected}`)
console.log(`entries=${manifest.entries.length}`)
console.log(`apps=${Object.keys(manifest.apps).join(',')}`)
console.log(`viewport=${manifest.viewport.width}x${manifest.viewport.height}`)
console.log(`first=${screenshots[0]}`)
console.log(`last=${screenshots[screenshots.length - 1]}`)
JS
find fixtures/artifacts -type f -name '*.png' | wc -l | tr -d ' '
git check-ignore -v fixtures/artifacts/manifest.json \
  fixtures/artifacts/reference/button/default.png \
  fixtures/test-results
git status --short -- vendor
```

Both fixture typechecks passed. `pnpm fixtures:artifacts` passed with 20
Playwright tests for 10 shared scenarios across 2 apps. The generated manifest
contains 10 scenarios and 20 screenshot entries with viewport `1280x900`. The
artifact directory contains 20 PNG screenshots plus `manifest.json`.

Generated paths:

```text
fixtures/artifacts/manifest.json
fixtures/artifacts/reference/{component}/{scenario}.png
fixtures/artifacts/candidate/{component}/{scenario}.png
```

`git check-ignore` confirmed that `fixtures/artifacts/manifest.json`,
`fixtures/artifacts/reference/button/default.png`, and `fixtures/test-results`
are ignored. `git status --short -- vendor` reported no vendor modifications.

Playwright emitted environment warnings about `NO_COLOR` being ignored because
`FORCE_COLOR` is set, and Node emitted a `DEP0205` warning about
`module.register()`. These warnings did not prevent the harness from starting
the apps, visiting routes, or capturing artifacts.

Independent AI completion review was performed by subagent `Helmholtz`, which
approved the result. The review found no blocking issues. Residual risks were
that `reuseExistingServer: true` is practical locally but CI should eventually
prefer deterministic startup, and that the harness captures artifacts only:
parity rules and pixel diffs remain intentionally deferred.

## Conclusion

The artifact pipeline is now in place. Future experiments can run
`pnpm fixtures:artifacts` to produce paired screenshots and a manifest for every
shared scenario without relying on exact DOM equivalence or premature pixel
diffs. The next experiment should use these artifacts to define the actual
RadCN parity model: visual review rules, customization probes, accessibility
checks, interaction checks, and the rules for acceptable Remix 3 divergence from
React shadcn/ui.
