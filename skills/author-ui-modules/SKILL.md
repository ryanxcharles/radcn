---
name: author-ui-modules
description: Author or review Remix UI-style modules and RadCN docs examples that use `remix/ui`, host-element behavior, mixins, explicit state ownership, and package-imported RadCN components.
---

# Author UI Modules for RadCN

Provenance: adapted for RadCN from
`vendor/remix/.agents/skills/author-ui-modules/SKILL.md` in the vendored Remix
source on 2026-06-05. This is not a verbatim copy; Remix-internal package
guidance was narrowed for RadCN component examples and docs-site UI.

Use this skill when authoring or reviewing:

- reusable docs app UI built with `remix/ui`;
- RadCN component examples that need small browser behavior;
- docs-site preview wrappers, tabs, navigation controls, or example shells;
- RadCN components or examples that coordinate multiple roles.

## RadCN Ownership Rules

- The RadCN package owns component source in `packages/radcn`.
- The docs app should import from `radcn` and should not fork component
  implementations.
- Fixture scenarios are test assets. Reuse their lessons, but create
  user-facing docs examples when fixture markup is too test-oriented.
- Prefer server-rendered UI first. Add browser behavior only when the example
  or docs shell genuinely needs it.

## Preferred Shapes

Prefer one of these shapes:

1. A small server-rendered wrapper:
   - owns markup and styling hooks;
   - imports RadCN components;
   - has no client entry when static output is enough.

2. A small enhanced module:
   - server markup renders usable content;
   - a browser entry adds tabs, copy buttons, navigation, or preview state;
   - enhancement owns only the browser behavior it needs.

3. A composed control:
   - wrapper owns rendered state;
   - role-specific helpers own local DOM behavior;
   - shared state is explicit and scoped to the module.

## State And Context

Do not force all state into one abstraction.

Prefer:

- route/controller state for server-selected content;
- wrapper state for rendered preview/code toggles;
- mixin-local or enhancement-local state for one host node;
- explicit DOM events for browser-only communication;
- package examples that remain understandable when copied by users.

Use Remix UI context only when descendants truly need scoped coordination. Keep
the context shape plain and small. Avoid event emitters or controller classes
unless a real complexity justifies them.

## Role Helpers

When a docs module needs roles such as tabs, listbox, menu, or disclosure:

- preserve semantic HTML and ARIA;
- keep keyboard behavior local and explicit;
- make focus movement deterministic;
- derive state hooks from public attributes;
- expose stable `data-radcn-docs-*` or existing `data-radcn-*` hooks for tests;
- avoid hidden React-style state assumptions.

## Example Quality

Docs examples should be:

- small enough to read;
- realistic enough to teach;
- rendered with real RadCN imports;
- paired with source snippets that match the visible output;
- accessible by default;
- styled through public RadCN hooks or docs-site tokens.

Avoid:

- examples that only exist to satisfy tests;
- one-off component forks inside `apps/docs`;
- internal fixture helpers leaking into public docs;
- decorative wrappers that obscure the actual component.

## Verification

For docs UI modules, run the smallest relevant checks from the active
experiment. Typical checks are:

```sh
pnpm --dir apps/docs typecheck
pnpm --dir apps/docs build
pnpm playwright test -c apps/docs/playwright.config.ts
```

When changing `packages/radcn`, also run the package and fixture checks required
by that experiment.
