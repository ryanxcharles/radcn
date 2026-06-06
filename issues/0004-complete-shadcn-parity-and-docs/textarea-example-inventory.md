# Textarea Example Parity Inventory

Experiment 37 audits the 10 upstream shadcn/ui New York v4 textarea-related
examples against the current RadCN `Textarea` package, docs, fixtures, prior
Issue 4 inventories, and Playwright evidence. This is an audit only; it does
not implement Textarea changes.

## Summary

RadCN `Textarea` renders a native `<textarea>` with `data-radcn-textarea`,
disabled, placeholder, rows, value, `aria-describedby`, and `aria-invalid`
support. Existing fixtures prove default and disabled native textarea behavior,
and prior Form, Field, and InputGroup experiments prove several composed
textarea outcomes.

Textarea example parity is not complete at the named plain Textarea example
level. Current proof is strongest for Field, InputGroup, and Form compositions,
but the Textarea docs and fixture routes do not yet cover the 5 plain upstream
Textarea examples as named examples: demo, disabled, with Button, with Label,
and with helper text.

## Current RadCN Evidence

| Surface | Evidence | Current coverage |
| --- | --- | --- |
| Package API | `radcn/packages/radcn/src/components/textarea.tsx` | Native textarea with class/style hooks, placeholder, disabled, rows, value, id/name, required, `aria-describedby`, and `aria-invalid` |
| Package styles | `radcn/packages/radcn/src/styles/tokens.css` | Textarea sizing, border, radius, muted placeholder, disabled state, invalid state, focus ring, and token-driven colors |
| Docs | `radcn/apps/docs/app/content/components.tsx` | Seed Textarea docs route with one generic live Textarea preview; Form, Field, and InputGroup rich docs include composed textarea examples |
| Candidate fixtures | `radcn/fixtures/candidate-remix/app/fixtures/textarea.tsx` | Default Label + Textarea + FieldDescription route and disabled Textarea route |
| Candidate fixture scenarios | `radcn/fixtures/scenarios/index.ts` | `textarea/default`, `textarea/disabled`, plus Field/Form/InputGroup textarea routes |
| Playwright | `radcn/fixtures/tests/native-controls.spec.ts`; `radcn/fixtures/tests/form-input-cluster.spec.ts` | Disabled textarea state, Field textarea label wiring, InputGroupTextarea toolbar proof, and Form textarea ARIA description proof |
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
| `textarea-demo` | Plain textarea with placeholder text `Type your message here.` | React `Textarea` with `placeholder`; Tailwind package styling and `data-slot`. | RadCN `Textarea` supports placeholder and the docs seed renders a generic placeholder example, but no named `textarea-demo` docs/fixture/Playwright proof exists. | Partial | Add named docs/fixture/Playwright proof for the plain demo placeholder. |
| `textarea-disabled` | Disabled textarea with placeholder text. | React `Textarea` with `disabled`; Tailwind disabled opacity/cursor styling. | Candidate route `textarea/disabled` and Playwright prove disabled textarea state; docs do not show named disabled Textarea example parity yet. | Partial | Add named docs evidence and keep fixture evidence tied to the upstream example id. |
| `textarea-with-button` | Textarea stacked with a `Send message` Button. | Tailwind grid wrapper with `Textarea` and `Button`. | RadCN has Button and Textarea primitives, and Form/Field/InputGroup examples compose textareas with buttons, but there is no named plain Textarea + Button docs/fixture/Playwright proof. | Partial | Add named docs/fixture/Playwright proof for Textarea plus Button composition. |
| `textarea-with-label` | Label `Your message` wired to a textarea by id. | `Label htmlFor` plus `Textarea id`; Tailwind grid wrapper. | Candidate `textarea/default` composes Label + Textarea and `native-controls.spec.ts` covers broader label wiring, but no named upstream label example proof exists. | Partial | Add named docs/fixture/Playwright proof for Label + Textarea composition with accessible name. |
| `textarea-with-text` | Label, textarea, and helper prose explaining the submitted message. | `Label`, `Textarea`, and a muted paragraph helper text. | Candidate `textarea/default` has Label + Textarea + FieldDescription, and Field/Form docs show helper text, but no named plain Textarea helper-text example proof exists. | Partial | Add named docs/fixture/Playwright proof for helper text and description styling around Textarea. |
| `field-textarea` | FieldSet/FieldGroup wrapping a textarea with label and description. | Field primitives compose `FieldLabel`, `Textarea`, and `FieldDescription`. | `field-example-inventory.md` marks `field-textarea` Covered; candidate route `field/textarea`, Field docs, and Playwright verify label wiring and FieldGroup composition. | Covered | None. |
| `input-group-textarea` | Textarea code editor with block-start file toolbar, block-end status/action toolbar, refresh/copy/run buttons, and icon text. | `InputGroupTextarea`, block-start/block-end `InputGroupAddon`, buttons, text parts, and Tabler icons. | `input-group-example-inventory.md` marks `input-group-textarea` Covered; Experiment 16 docs/fixtures/tests prove block-start and block-end toolbar rows, status text, and action buttons, with icons app-owned. | Covered | None. |
| `form-rhf-textarea` | Card form with textarea field, helper text, validation errors, reset, submit, and toast result. | React Hook Form `Controller`, Zod resolver, Sonner toast, Card layout, Field primitives, and Textarea. | `form-example-inventory.md` marks this Covered by RadCN Form textarea examples and Textarea primitives; Experiment 6 records React Hook Form/Zod/toast as app-owned mappings. | Covered | None. |
| `form-tanstack-textarea` | Card form with textarea field, helper/error text, reset, submit, and toast result using TanStack Form. | TanStack Form, Zod validation, Sonner toast, Card layout, Field primitives, and Textarea. | `form-example-inventory.md` marks this Covered by RadCN Form textarea examples and Textarea primitives; Experiment 6 records TanStack Form/Zod/toast as app-owned mappings. | Covered | None. |
| `form-formisch-textarea` | Card form with textarea field, helper/error text, reset, submit, and toast result using Formisch. | Formisch, Valibot validation, Sonner toast, Card layout, Field primitives, and Textarea. | `form-example-inventory.md` marks this Covered by RadCN Form textarea examples and Textarea primitives; Experiment 6 records Formisch/Valibot/toast as app-owned mappings. | Covered | None. |

## Outcome

Textarea example parity is not complete.

The next implementation cluster should be **Textarea example parity depth** for
the 5 plain Textarea examples: `textarea-demo`, `textarea-disabled`,
`textarea-with-button`, `textarea-with-label`, and `textarea-with-text`. That
implementation should add named docs examples, candidate fixture routes, and
Playwright coverage while preserving Textarea as a native control primitive and
leaving Button, Label, Field, InputGroup, Form, Card, validation, toast, icons,
and autosize behavior with their owning packages/apps.
