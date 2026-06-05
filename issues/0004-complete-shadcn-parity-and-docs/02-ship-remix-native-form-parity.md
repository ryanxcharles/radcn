# Experiment 2: Ship Remix-native form parity

## Description

Experiment 1 found that `form` is the only upstream shadcn/ui v4 New York
registry UI item missing from RadCN package exports. This experiment turns that
gap into a Remix-native package surface and docs page.

The upstream `ui/form.tsx` implementation is a React Hook Form adapter. It
exports `Form`, `FormField`, `useFormField`, `FormItem`, `FormLabel`,
`FormControl`, `FormDescription`, and `FormMessage`, and uses React context,
`React.useId()`, `Slot`, `Controller`, `FormProvider`, `useFormContext`, and
`useFormState` to connect labels, controls, descriptions, validation messages,
and field errors.

RadCN should not port those React-only mechanics literally. The Remix 3 outcome
should preserve the user-facing capability: native form submission, explicit
label/control/error wiring, accessible description and message IDs,
server/action error display, invalid styling, customization hooks, and docs
recipes for the shadcn form example families. The implementation should favor
explicit IDs and host-element components over hidden React context.

This experiment is narrow to the `form` parity cluster. It does not implement
`date-picker`, `data-table`, charts, blocks, external installation, or npm
publishing.

## Changes

- Add `radcn/packages/radcn/src/components/form.tsx`.
  - Export Remix UI host-element components analogous to the shadcn form parts:
    `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`,
    `FormDescription`, and `FormMessage`.
  - Export helper utilities for explicit accessible wiring, such as a field ID
    helper and/or control attribute helper, so callers can connect RadCN inputs,
    selects, textareas, and composite controls without React context.
  - Support invalid state, description/message IDs, native form attributes,
    class/style customization, and `data-radcn-*` hooks.
  - Do not add `react-hook-form`, `zod`, `@hookform/resolvers`, React, Radix
    Slot, or any dependency copied from `vendor/`.
- Add the `./form` public subpath to `radcn/packages/radcn/package.json`.
- Export the form components and types from `radcn/packages/radcn/src/index.ts`.
- Reuse existing field tokens where possible. If new form CSS hooks are needed,
  update both the source token stylesheet and the exported `radcnStyles` string
  so docs and consumers receive the same CSS.
- Update candidate fixtures in `radcn/fixtures/candidate-remix/` so form
  scenarios use `radcn/form` instead of docs-only field recipes.
- Update fixture tests in `radcn/fixtures/tests/` so the form cluster asserts:
  - `./form` is exported;
  - React Hook Form and validation-library dependencies are still absent;
  - native validation, server errors, action-state text, reset/submit behavior,
    invalid ARIA, and custom token hooks still work.
- Update `radcn/apps/docs/app/content/components.tsx`.
  - Move the Form page from `not-shipped-yet` to a ready package API page.
  - Add a live docs preview backed by `radcn/form`.
  - Include source snippets for native validation, server/action errors, and
    explicit accessible wiring.
  - Explain the divergence from shadcn's React Hook Form wrapper and document
    the intended Remix 3 approach.
  - Keep installation copy aspirational and do not claim RadCN is published.
- Update docs tests if they currently treat `form` as a non-exported
  disposition.
- Re-run `node scripts/audit-shadcn-parity.mjs` and commit the regenerated
  `parity-inventory.md`.
- Add learnings to the issue README, including:
  - the final `radcn/form` API decision;
  - why React Hook Form/context semantics were not ported;
  - any reusable form/accessibility patterns needed by later `date-picker`,
    `data-table`, block, or example work.

## Verification

Pass criteria:

- `pnpm radcn:typecheck`
- `pnpm --dir radcn/apps/docs typecheck`
- `pnpm fixtures:candidate:typecheck`
- `pnpm fixtures:reference:typecheck`
- `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts form-input-cluster.spec.ts`
  runs the focused form/input browser coverage. The config owns the separate
  reference and candidate fixture servers on ports 4601 and 4602.
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts`
  proves every package export has a docs route and live preview hook, including
  the new `form` export.
- `node scripts/audit-shadcn-parity.mjs`
- A temporary regeneration check proves `parity-inventory.md` is current after
  the audit script.
- `git diff --check`
- `git status --short` shows only expected RadCN source, docs, fixture, issue,
  inventory, and test changes before the result commit.
- Vendor cleanliness check confirms nested vendor repos were not modified.
- Scope checks confirm:
  - no RadCN package/app code imports from `vendor/`;
  - no `react-hook-form`, `zod`, `@hookform/resolvers`, React, or Radix Slot
    dependency was added for form parity;
  - no package publishing or external install machinery was added.

Failure criteria:

- `form` remains a docs-only gap in the parity inventory.
- The form API depends on React-only context/hook behavior.
- The docs page claims external npm installation works today.
- Fixture or docs tests only prove DOM existence without checking native form,
  ARIA, invalid-state, and customization behavior.

## Design Review

Reviewer: Aquinas (`019e99f4-0965-7e70-b893-3a9360d07690`)
Fresh context: yes (`fork_context: false`)

Findings:

- Blocker: the original verification used non-existent pnpm workspace filters
  for docs and fixture packages. Fixed by replacing them with concrete commands:
  `pnpm --dir radcn/apps/docs typecheck`,
  `pnpm fixtures:candidate:typecheck`, and
  `pnpm fixtures:reference:typecheck`.
- Major: the original browser verification described focused coverage without
  exact commands. Fixed by naming the exact fixture and docs Playwright commands.

Re-review result: approved with no blocker, major, or minor findings.

## Result

**Result:** Pass

Implemented `radcn/form` as a Remix-native package API and moved the docs and
fixture form coverage from a docs-only recipe to an importable package surface.

Changed files:

- `radcn/packages/radcn/src/components/form.tsx`
  - Added `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`,
    `FormDescription`, `FormMessage`, `formFieldIds`, and
    `formControlAttributes`.
  - Kept form state explicit instead of adding React Hook Form, React context,
    Radix Slot, or schema-validation dependencies.
- `radcn/packages/radcn/package.json`
  - Added the `./form` public subpath.
- `radcn/packages/radcn/src/index.ts`
  - Exported the form components, helpers, and public types.
- `radcn/packages/radcn/src/styles/tokens.css`
  - Added form layout, field, label-error, and control hooks.
- `radcn/packages/radcn/src/styles/index.ts`
  - Regenerated `radcnStyles` from `tokens.css`.
- `radcn/fixtures/candidate-remix/app/fixtures/form.tsx`
  - Reworked the form fixture scenarios to use `radcn/form`.
- `radcn/fixtures/candidate-remix/app/assets.ts`
  - Fixed the candidate app's asset allowlist so root-workspace pnpm virtual
    store imports for `remix/ui` can load, matching the existing docs app
    strategy.
- `radcn/fixtures/tests/form-input-cluster.spec.ts`
  - Updated export, native validation, ARIA, server-error, and custom-token
    assertions for the package-backed form API.
- `radcn/apps/docs/app/content/components.tsx`
  - Added a ready Form docs page with a live package-backed preview, source
    snippet, accessibility notes, customization notes, and Remix 3 divergence
    notes.
- `radcn/apps/docs/tests/coverage.spec.ts`
  - Removed `form` from non-exported dispositions and added the form preview
    hook.
- `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`
  - Regenerated the parity inventory. It now reports `form` as package API and
    no missing upstream UI package APIs.

Verification:

- `pnpm radcn:typecheck` — Pass.
- `pnpm --dir radcn/apps/docs typecheck` — Pass.
- `pnpm fixtures:candidate:typecheck` — Pass.
- `pnpm fixtures:reference:typecheck` — Pass, with the existing React Router
  `module.register()` deprecation warning.
- `pnpm exec playwright test -c radcn/apps/docs/playwright.config.ts coverage.spec.ts`
  — Pass, 4 tests.
- `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts form-input-cluster.spec.ts`
  — Failed on the first run because the candidate fixture asset server rejected
  `remix/ui` from the root pnpm virtual store, so browser enhancement did not
  load for input-group and input-otp behavior.
- `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts form-input-cluster.spec.ts`
  after fixing the candidate asset allowlist — Pass, 6 tests.
- `node scripts/audit-shadcn-parity.mjs` — Pass.
- Temporary regeneration check for `parity-inventory.md` — Pass, no diff.
- `git diff --check` — Pass.
- `git status --short` — Shows only expected implementation, docs, fixture,
  inventory, issue, and test changes.
- Vendor cleanliness check for `vendor/shadcn-ui`, `vendor/remix`, and
  `vendor/react-router` — Pass, no nested checkout changes.
- Scope grep for vendor imports, React Hook Form, validation-library
  dependencies, React imports, Radix Slot, and package publishing machinery in
  RadCN package/app/fixture code — Pass, no matches.

## Conclusion

Form is no longer a docs-only gap. RadCN now has a package-backed Remix-native
form API that preserves the shadcn user-facing capability through native
submission, deterministic IDs, explicit ARIA, server/action error display,
invalid styling, and customization hooks.

The next Issue 4 experiment should move to the next docs-only parity gap:
`date-picker`. It is not an upstream `ui/` component, so the next pass should
decide whether RadCN needs a package recipe, docs recipe, or calendar/popover
composition that covers the shadcn date-picker examples.

## Completion Review

Reviewer: Banach (`019e99fc-7b45-7dc0-88f0-e93b078a479d`)
Fresh context: yes (`fork_context: false`)

Findings:

- Major: the first implementation had a dangling `aria-describedby` in the
  action-state form fixture. The input referenced
  `candidate-form-action-name-form-item-description`, while the description
  rendered as `candidate-form-action-state`. Fixed by rendering the description
  with `actionName.descriptionId` and adding a Playwright assertion for the
  action-state input and target text.
- Minor: the first form/input cluster test title still described form as a
  recipe disposition. Fixed by renaming it to package-source wording.

Fix verification:

- `pnpm fixtures:candidate:typecheck` — Pass.
- `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts form-input-cluster.spec.ts`
  — Pass, 6 tests.
- `git diff --check` — Pass.

Re-review result: approved with no blocker findings and no new blocker
introduced by the fixes.
