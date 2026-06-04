# Experiment 2: Build Paired Fixture Apps

## Description

Create the first browser-testable scaffold for comparing upstream shadcn/ui
against RadCN. This experiment builds two small fixture applications with a
shared route and scenario contract:

1. A React Router reference app that renders upstream shadcn/ui-compatible React
   fixtures.
2. A Remix 3 candidate app that renders RadCN/Remix UI fixtures.

This experiment should not attempt full visual parity for every component. Its
goal is to create the container apps and proof-set fixture routes that future
Playwright tests can use for screenshot, DOM, accessibility, keyboard, and form
comparisons.

Use these vendored references:

- `vendor/shadcn-ui/templates/react-router-app/` for the React Router app shape,
  route config, Vite config, Tailwind 4 setup, and root document.
- `vendor/react-router/` for current React Router package and route conventions.
- `vendor/remix/template/` for the Remix 3 app/server/router shape.
- `vendor/remix/packages/ui/` for Remix UI primitives, especially Button and
  Accordion.
- `issues/0001-shadcn-port-scope/component-inventory.md` for the proof set:
  `button`, `input`/`field`, and `accordion`.

The paired apps should be intentionally boring. They exist only to render stable
component scenarios in a browser.

The default development ports are fixed so browser tooling has stable targets:

- React Router reference app: `http://localhost:4601`
- Remix 3 candidate app: `http://localhost:4602`

Both ports may be overridden with environment variables, but Playwright and
manual verification should use these defaults unless there is a conflict.

## Changes

Create a test fixture workspace under `fixtures/`:

```text
fixtures/
├── README.md
├── scenarios/
│   ├── index.ts
│   └── types.ts
├── reference-react-router/
│   ├── package.json
│   ├── app/
│   │   ├── app.css
│   │   ├── root.tsx
│   │   ├── routes.ts
│   │   ├── routes/
│   │   │   ├── home.tsx
│   │   │   └── fixture.tsx
│   │   └── fixtures/
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       ├── field.tsx
│   │       └── index.ts
│   ├── react-router.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
└── candidate-remix/
    ├── package.json
    ├── server.ts
    ├── app/
    │   ├── actions/
    │   │   └── controller.tsx
    │   ├── assets.ts
    │   ├── assets/
    │   │   └── entry.ts
    │   ├── middleware/
    │   │   └── render.tsx
    │   ├── router.ts
    │   ├── routes.ts
    │   ├── ui/
    │   │   └── document.tsx
    │   └── fixtures/
    │       ├── accordion.tsx
    │       ├── button.tsx
    │       ├── field.tsx
    │       └── index.ts
    └── tsconfig.json
```

The exact file split can change if the implementation finds a simpler shape,
but the final result must preserve the shared route/scenario contract.

### Shared Fixture Contract

Define the proof-set scenarios in `fixtures/scenarios/` as data that both apps
consume. Start with:

- `button/default`
- `button/variants`
- `button/disabled`
- `button/as-child-or-link`
- `field/input-default`
- `field/input-invalid`
- `field/input-disabled`
- `accordion/single`
- `accordion/multiple`
- `accordion/disabled-item`

Each app must expose the same routes:

```text
/
/fixtures
/fixtures/:component
/fixtures/:component/:scenario
```

Each scenario page must render a stable shell:

```html
<main data-fixture-app="reference|candidate" data-component="button" data-scenario="default">
  <section data-fixture-stage>
    ...
  </section>
</main>
```

Use the same viewport-neutral shell styles in both apps:

- fixed max width;
- deterministic font stack;
- deterministic background and foreground colors;
- no marketing layout;
- no app navigation inside `data-fixture-stage`;
- enough padding to capture focus rings and popout content when applicable.

### React Router Reference App

The reference app should follow `vendor/shadcn-ui/templates/react-router-app/`
and render upstream-compatible React components for the proof-set scenarios.

For this experiment, the reference components may be local copies/adaptations of
the upstream proof-set component source into the fixture app, with only the
minimum import-path adjustments needed to run. Do not edit files under
`vendor/`.

The reference app should include enough shadcn styling infrastructure for the
proof-set components to render meaningfully:

- Tailwind 4 app stylesheet;
- shadcn CSS variables/theme tokens needed by the copied components;
- `cn` utility;
- component-local variants for Button;
- Accordion based on the upstream reference primitive.

### Remix 3 Candidate App

The candidate app should follow `vendor/remix/template/` and render RadCN
candidate fixtures for the same proof-set scenarios.

Because RadCN does not have a component library yet, this experiment may use
temporary fixture-local components under `fixtures/candidate-remix/app/fixtures/`
as placeholders for the future RadCN source layout. The placeholders should be
clearly named and constrained to the fixture app. They are scaffolding, not the
final library API.

Prefer Remix UI primitives where they already exist:

- `vendor/remix/packages/ui/src/components/button/` for button reference.
- `vendor/remix/packages/ui/src/components/accordion/` for accordion reference.
- native HTML plus Remix UI styling/mixins for input and field.

### Browser Smoke Test

Add a first Playwright smoke test only if it can be done without making the
experiment too broad. The minimum useful smoke test would:

1. start both fixture apps on separate ports;
2. visit every shared proof-set scenario in both apps;
3. assert the `data-fixture-app`, `data-component`, `data-scenario`, and
   `data-fixture-stage` attributes exist;
4. capture screenshots into ignored or test-output directories.

If Playwright setup becomes large, defer it to Experiment 3 and instead provide
manual commands plus route-level verification for Experiment 2.

## Verification

The experiment passes if:

1. `fixtures/README.md` documents how to run both apps and lists all shared
   proof-set routes.
2. The React Router reference app can install dependencies and start.
3. The Remix 3 candidate app can install dependencies and start.
4. Both apps expose the same proof-set routes:
   - `/fixtures/button/default`
   - `/fixtures/button/variants`
   - `/fixtures/button/disabled`
   - `/fixtures/button/as-child-or-link`
   - `/fixtures/field/input-default`
   - `/fixtures/field/input-invalid`
   - `/fixtures/field/input-disabled`
   - `/fixtures/accordion/single`
   - `/fixtures/accordion/multiple`
   - `/fixtures/accordion/disabled-item`
5. Every proof-set route renders the required stable shell attributes:
   `data-fixture-app`, `data-component`, `data-scenario`, and
   `data-fixture-stage`.
6. The reference app renders upstream-compatible shadcn scenarios for `button`,
   `input`/`field`, and `accordion`.
7. The candidate app renders corresponding Remix 3/RadCN placeholder scenarios
   for `button`, `input`/`field`, and `accordion`.
8. No files under `vendor/` are modified.
9. The result section records exact run commands, ports, and whether Playwright
   smoke coverage was implemented or deferred.

The experiment does not need to prove pixel parity. It only needs to prove that
the paired app scaffold and fixture contract are ready for the first real
browser comparison experiment.

## Result

**Result:** Pass

Implemented the paired fixture scaffold:

- `fixtures/scenarios/` defines the shared proof-set scenarios.
- `fixtures/reference-react-router/` runs a React Router reference app on
  `http://localhost:4601` by default.
- `fixtures/candidate-remix/` runs a Remix 3 candidate app on
  `http://localhost:4602` by default.
- `fixtures/README.md` documents install, run commands, ports, shared route
  contract, and all proof-set scenario URLs.
- Root workspace scripts expose the fixture commands.

Verification commands run from the repository root:

```bash
pnpm install
pnpm fixtures:reference:typecheck
pnpm fixtures:candidate:typecheck
pnpm fixtures:reference:dev
pnpm fixtures:candidate:dev
node <<'JS'
const paths = [
  '/fixtures/button/default',
  '/fixtures/button/variants',
  '/fixtures/button/disabled',
  '/fixtures/button/as-child-or-link',
  '/fixtures/field/input-default',
  '/fixtures/field/input-invalid',
  '/fixtures/field/input-disabled',
  '/fixtures/accordion/single',
  '/fixtures/accordion/multiple',
  '/fixtures/accordion/disabled-item',
]

for (const [port, app] of [[4601, 'reference'], [4602, 'candidate']]) {
  for (const path of paths) {
    const response = await fetch(`http://localhost:${port}${path}`)
    if (!response.ok) throw new Error(`${app} ${path} returned ${response.status}`)
    const html = await response.text()
    const [, , component, scenario] = path.split('/')
    for (const expected of [
      `data-fixture-app="${app}"`,
      `data-component="${component}"`,
      `data-scenario="${scenario}"`,
      'data-fixture-stage',
    ]) {
      if (!html.includes(expected)) throw new Error(`${app} ${path} missing ${expected}`)
    }
    console.log(`ok ${app} ${path}`)
  }
}
JS
git status --short -- vendor
```

Both typechecks passed. Both dev servers started successfully on the default
ports. The Node route probe passed for all ten proof-set routes in both apps,
covering twenty scenario URLs total. `git status --short -- vendor` reported no
vendor modifications.

An initial `curl` route probe was attempted, but this environment does not have
`curl` installed. The verification used Node's built-in `fetch` instead.

Playwright smoke coverage was deferred to the next experiment. Experiment 2
kept browser verification to manual server startup plus the Node route probe so
the paired fixture app scaffold could land without expanding into screenshot
harness design.

Independent AI completion review was performed by subagent `Turing`, which
approved the result. The review found no blocking issues. Residual risks were
that the reviewer observed already-running listeners on ports `4601` and `4602`
instead of freshly starting the servers, and that Playwright smoke coverage is
not present yet.

## Conclusion

The paired fixture app approach is viable. RadCN now has a React Router
reference app and a Remix 3 candidate app that expose the same scenario URLs on
separate fixed ports with stable shell attributes. The next experiment should
turn this scaffold into an automated Playwright smoke harness that starts both
apps, visits every scenario, asserts the contract, and captures first
comparison artifacts.
