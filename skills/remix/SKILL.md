---
name: remix
description: Build and review Remix 3 apps in RadCN, especially the documentation site, using the `remix` npm package, `remix/*` subpath imports, `remix/ui`, route/controller structure, browser assets, hydration, navigation, and tests.
---

# Remix 3 for RadCN

Provenance: adapted for RadCN from
`vendor/remix/.agents/skills/remix/SKILL.md` in the vendored Remix source on
2026-06-05. The reference files in `skills/remix/references/` were copied from
that vendored skill so RadCN-local skills do not depend on the ignored
`vendor/` checkout.

Use this skill when building or reviewing Remix 3 application code in RadCN,
especially `radcn/apps/docs`.

## RadCN Defaults

- The docs app should consume `radcn/packages/radcn` through package imports, not
  fixture-local component copies.
- Use the Issue 3 experiment workflow before broad docs-site implementation.
- Prefer real RadCN examples over static screenshots when live rendering is
  feasible.
- Keep docs app code in the narrowest owner first; promote shared UI only when
  it is reused across routes.
- Use RadCN repo commands and Playwright coverage, not upstream Remix
  maintainer workflow commands, unless a later experiment explicitly adds
  them.

## What Remix 3 Is

Remix 3 is a server-first web framework built on Web APIs such as `Request`,
`Response`, `URL`, and `FormData`. Packages ship from the single `remix`
package and are imported via subpath. Do not import application APIs from a
top-level `remix` barrel.

A Remix 3 app has four main pieces:

- `app/routes.ts` defines typed URLs and powers `href()` generation.
- `app/actions` implements route controllers and returns `Response` objects.
- middleware composes request lifecycle behavior and typed context.
- `remix/ui` components render UI without React. A component receives a
  `handle`, reads `handle.props`, and returns a zero-argument render function.

## Load Only Relevant References

Use the smallest useful reference set:

| Task involves... | Start with |
| --- | --- |
| URLs, controllers, actions, responses | `references/routing-and-controllers.md` |
| Middleware, server wiring | `references/middleware-and-server.md` |
| Browser modules, asset namespaces, preloads | `references/assets-and-browser-modules.md` |
| Data parsing, validation, schemas | `references/data-and-validation.md` |
| Auth, sessions, protected areas | `references/auth-and-sessions.md` |
| Remix UI components, state, lifecycle | `references/component-model.md` |
| Events, styles, refs, DOM behavior | `references/mixins-styling-events.md` |
| `clientEntry`, `run`, frames, navigation | `references/hydration-frames-navigation.md` |
| Router/component tests | `references/testing-patterns.md` |
| Animations and transitions | `references/animate-elements.md` |
| Custom mixins | `references/create-mixins.md` |

For the RadCN docs site, the most likely first references are:

- `routing-and-controllers.md`
- `assets-and-browser-modules.md`
- `component-model.md`
- `hydration-frames-navigation.md`
- `testing-patterns.md`

## Default Workflow

1. Classify whether the change is routing, controller/response behavior,
   browser assets, shared UI, component examples, or tests.
2. Start from the server contract. Add or update routes before wiring handlers
   or navigation.
3. Make the server route correct before adding browser behavior.
4. Hydrate only when necessary. Prefer server-rendered UI and small client
   entries for real browser interactivity.
5. Validate input at route/controller boundaries.
6. Test the narrowest meaningful layer. Use route/controller tests for server
   behavior and Playwright only for rendered browser behavior.
7. Finish with RadCN verification commands documented in the active experiment.

## Project Layout Guidance

For a RadCN docs app, prefer:

```text
radcn/apps/docs/
├── app/
│   ├── actions/
│   ├── assets/
│   ├── content/
│   ├── routes.ts
│   ├── router.ts
│   └── ui/
```

Use:

- `app/actions/` for response-rendering route code;
- `app/assets/` for browser entrypoints and browser-owned behavior;
- `app/content/` for docs registry/content data;
- `app/ui/` for shared docs UI;
- `app/utils/` only for pure helpers with no clearer home.

Avoid:

- `app/lib/` as a dumping ground;
- `app/components/` as a second shared UI bucket when `app/ui/` exists;
- React patterns such as hooks, implicit rerenders, JSX components that expect
  React runtime behavior, or non-serializable `clientEntry` props.

## Core Rules

- Import from `remix/<subpath>`, not from top-level `remix`.
- Treat `app/routes.ts` as the URL source of truth.
- Controllers should return explicit `Response` objects.
- Remix UI components are not React components. Use
  `function Name(handle: Handle<Props>) { return () => ... }`.
- Use host-element mixins for reusable behavior and styling when appropriate.
- Hydrated `clientEntry(...)` props must be serializable.
- Keep RadCN component examples pointed at `radcn` package imports.

## Verification

Use the active RadCN experiment as the source of truth for commands. Likely
docs-site checks include:

```sh
cd radcn
pnpm --dir apps/docs typecheck
pnpm --dir apps/docs build
pnpm playwright test -c apps/docs/playwright.config.ts
```

Do not assume upstream Remix repo commands such as `pnpm run test:changed` or
package-filtered maintainer scripts exist in RadCN.
