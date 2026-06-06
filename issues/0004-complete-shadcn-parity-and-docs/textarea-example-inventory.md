# Textarea Example Parity Inventory

Experiment 37 audited the 10 upstream shadcn/ui New York v4 textarea-related
examples against the RadCN `Textarea` package, docs, fixtures, prior Issue 4
inventories, and Playwright evidence. Experiment 38 completed the missing
named plain Textarea example proof.

## Summary

RadCN `Textarea` renders a native `<textarea>` with `data-radcn-textarea`,
disabled, placeholder, rows, value, `aria-describedby`, and `aria-invalid`
support. Existing fixtures prove default and disabled native textarea behavior,
and prior Form, Field, and InputGroup experiments prove several composed
textarea outcomes.

Textarea example parity is complete for the 10 upstream New York v4
textarea-related examples. The Textarea package remains a native control
primitive, while docs, fixtures, and Playwright now prove the 5 plain Textarea
examples and prior inventories prove the Field, InputGroup, and Form textarea
variants.

## Current RadCN Evidence

| Surface | Evidence | Current coverage |
| --- | --- | --- |
| Package API | `radcn/packages/radcn/src/components/textarea.tsx` | Native textarea with class/style hooks, placeholder, disabled, rows, value, id/name, required, `aria-describedby`, and `aria-invalid` |
| Package styles | `radcn/packages/radcn/src/styles/tokens.css` | Textarea sizing, border, radius, muted placeholder, disabled state, invalid state, focus ring, and token-driven colors |
| Docs | `radcn/apps/docs/app/content/components.tsx` | Rich Textarea docs page with stable hooks for `textarea-demo`, `textarea-disabled`, `textarea-with-button`, `textarea-with-label`, and `textarea-with-text`; Form, Field, and InputGroup rich docs include composed textarea examples |
| Candidate fixtures | `radcn/fixtures/candidate-remix/app/fixtures/textarea.tsx` | Default route plus named routes for all 5 plain upstream Textarea examples |
| Candidate fixture scenarios | `radcn/fixtures/scenarios/index.ts` | `textarea/default`, `textarea/demo`, `textarea/disabled`, `textarea/with-button`, `textarea/with-label`, `textarea/with-text`, plus Field/Form/InputGroup textarea routes |
| Playwright | `radcn/fixtures/tests/native-controls.spec.ts`; `radcn/apps/docs/tests/coverage.spec.ts`; `radcn/fixtures/tests/form-input-cluster.spec.ts` | Fixture and docs coverage for all 5 plain Textarea examples, plus prior Field/InputGroup/Form textarea proof |
| Prior inventories | `form-example-inventory.md`; `field-example-inventory.md`; `input-group-example-inventory.md` | Form textarea library variants, `field-textarea`, and `input-group-textarea` are already covered by prior clusters |

## Mapping Decisions

- shadcn `data-slot="textarea"` maps to RadCN public `data-radcn-textarea`
  plus the `radcn-textarea` class; do not add upstream slot names as required
  public API.
- shadcn Tailwind layout and style utilities map to RadCN classes, CSS
  variables, fixture/docs layout wrappers, and inline styles where needed.
- React prop spreading maps to explicit Remix UI props on `Textarea`, such as
  `id`, `name`, `placeholder`, `disabled`, `rows`, `value`,
  `ariaDescribedBy`, and `ariaInvalid`.
- `field-sizing-content`, autosize behavior, and custom min-height examples are
  app-owned styling/enhancement choices unless a later experiment records a
  direct Textarea package need.
- Button, Label, Field, InputGroup, Form, Card, and toast behavior remain owned
  by those packages or the consuming app; Textarea remains a native control
  primitive.
- React Hook Form, TanStack Form, Formisch, Zod, Valibot, Sonner toast, and
  Tabler icons are not Textarea dependencies. Prior Form/InputGroup decisions
  map them to native forms, explicit ARIA wiring, app-owned validation state,
  server/action state, and app-owned icon presentation.

## Examples

| Example | User-facing behavior | Upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- | --- |
| `textarea-demo` | Plain textarea with placeholder text `Type your message here.` | React `Textarea` with `placeholder`; Tailwind package styling and `data-slot`. | Docs route, candidate fixture route, and Playwright coverage render a native RadCN Textarea with the upstream placeholder and public hook. | Covered | None. |
| `textarea-disabled` | Disabled textarea with placeholder text. | React `Textarea` with `disabled`; Tailwind disabled opacity/cursor styling. | Docs route, candidate fixture route, and Playwright coverage render disabled native Textarea behavior. | Covered | None. |
| `textarea-with-button` | Textarea stacked with a `Send message` Button. | Tailwind grid wrapper with `Textarea` and `Button`. | Docs route, candidate fixture route, and Playwright coverage render Textarea plus RadCN Button composition. | Covered | None. |
| `textarea-with-label` | Label `Your message` wired to a textarea by id. | `Label htmlFor` plus `Textarea id`; Tailwind grid wrapper. | Docs route, candidate fixture route, and Playwright coverage render Label + Textarea composition with accessible name wiring. | Covered | None. |
| `textarea-with-text` | Label, textarea, and helper prose explaining the submitted message. | `Label`, `Textarea`, and a muted paragraph helper text. | Docs route, candidate fixture route, and Playwright coverage render Label, Textarea, helper text, and explicit `aria-describedby` wiring. | Covered | None. |
| `field-textarea` | FieldSet/FieldGroup wrapping a textarea with label and description. | Field primitives compose `FieldLabel`, `Textarea`, and `FieldDescription`. | `field-example-inventory.md` marks `field-textarea` Covered; candidate route `field/textarea`, Field docs, and Playwright verify label wiring and FieldGroup composition. | Covered | None. |
| `input-group-textarea` | Textarea code editor with block-start file toolbar, block-end status/action toolbar, refresh/copy/run buttons, and icon text. | `InputGroupTextarea`, block-start/block-end `InputGroupAddon`, buttons, text parts, and Tabler icons. | `input-group-example-inventory.md` marks `input-group-textarea` Covered; Experiment 16 docs/fixtures/tests prove block-start and block-end toolbar rows, status text, and action buttons, with icons app-owned. | Covered | None. |
| `form-rhf-textarea` | Card form with textarea field, helper text, validation errors, reset, submit, and toast result. | React Hook Form `Controller`, Zod resolver, Sonner toast, Card layout, Field primitives, and Textarea. | `form-example-inventory.md` marks this Covered by RadCN Form textarea examples and Textarea primitives; Experiment 6 records React Hook Form/Zod/toast as app-owned mappings. | Covered | None. |
| `form-tanstack-textarea` | Card form with textarea field, helper/error text, reset, submit, and toast result using TanStack Form. | TanStack Form, Zod validation, Sonner toast, Card layout, Field primitives, and Textarea. | `form-example-inventory.md` marks this Covered by RadCN Form textarea examples and Textarea primitives; Experiment 6 records TanStack Form/Zod/toast as app-owned mappings. | Covered | None. |
| `form-formisch-textarea` | Card form with textarea field, helper/error text, reset, submit, and toast result using Formisch. | Formisch, Valibot validation, Sonner toast, Card layout, Field primitives, and Textarea. | `form-example-inventory.md` marks this Covered by RadCN Form textarea examples and Textarea primitives; Experiment 6 records Formisch/Valibot/toast as app-owned mappings. | Covered | None. |

## Outcome

Textarea example parity is complete.

Experiment 38 added named docs examples, candidate fixture routes, and
Playwright coverage for the 5 plain upstream Textarea examples while preserving
the prior covered outcomes for Field, InputGroup, and Form textarea variants.
Textarea remains a native control primitive, and Button, Label, Field,
InputGroup, Form, Card, validation, toast, icons, and autosize behavior remain
with their owning packages/apps.
