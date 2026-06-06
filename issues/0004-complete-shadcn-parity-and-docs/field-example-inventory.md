# Field Example Inventory

Generated during Experiment 11 on 2026-06-05. Updated by Experiment 12 on
2026-06-05 after Field parity depth implementation.

## Sources

- Upstream registry:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
- Upstream examples:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/field-*.tsx`
- RadCN packages:
  `radcn/packages/radcn/src/components/field.tsx`
  `radcn/packages/radcn/src/components/form.tsx`
  `radcn/packages/radcn/src/components/label.tsx`
- RadCN docs:
  `radcn/apps/docs/app/content/components.tsx`
- RadCN fixtures:
  `radcn/fixtures/scenarios/index.ts`
  `radcn/fixtures/candidate-remix/app/fixtures/field.tsx`
  `radcn/fixtures/candidate-remix/app/fixtures/form.tsx`
  `radcn/fixtures/tests/native-controls.spec.ts`
  `radcn/fixtures/tests/form-input-cluster.spec.ts`

## Summary

Field example parity is resolved. RadCN now exports `Field`, `FieldLabel`,
`FieldSet`, `FieldLegend`, `FieldGroup`, `FieldSeparator`, `FieldContent`,
`FieldTitle`, `FieldDescription`, and `FieldError`, with vertical, horizontal,
and responsive orientations.

The package, docs, fixtures, and Playwright coverage now prove the upstream
Field example surface:

- semantic `fieldset`, `legend`, and `label` elements;
- grouped controls and section separators;
- horizontal and responsive field orientations;
- choice-card composition with nested titles, descriptions, and radio controls;
- checkbox, radio, switch, select, textarea, slider, input, and button
  compositions;
- a web-first slider range/value-display strategy based on native range inputs
  and server-provided defaults instead of React `useState`.

## Example Map

| Upstream id | User-facing behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `field-demo` | Full payment form using FieldGroup, FieldSet, FieldLegend, FieldSeparator, nested fields, select, checkbox, textarea, and action buttons. | `radcn/field` exports all required composition parts; `radcn/fixtures/candidate-remix/app/fixtures/field.tsx` has `demo`; docs `FieldPreview` shows checkout-like grouped controls; Playwright verifies select/button/group proof. | Covered | None. |
| `field-input` | FieldSet and FieldGroup wrapping username/password fields with labels and descriptions before/after controls. | Candidate fixture `field/input` uses `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldLabel`, `Input`, and `FieldDescription`; Playwright verifies labels and group semantics. | Covered | None. |
| `field-textarea` | FieldSet/FieldGroup wrapping a textarea with label and description. | Candidate fixture `field/textarea` and docs `FieldPreview` compose `Textarea` with FieldSet/FieldGroup/FieldLabel; Playwright verifies label wiring. | Covered | None. |
| `field-fieldset` | Semantic address fieldset with legend, description, grouped fields, and two-column layout. | `FieldSet` renders `fieldset`, `FieldLegend` renders `legend`, and candidate fixture `field/fieldset` verifies horizontal grouped address fields. | Covered | None. |
| `field-radio` | FieldSet with group label/description and horizontal radio options. | Candidate fixture `field/radio` composes `RadioGroup`, `RadioGroupItem`, `FieldLabel`, `FieldGroup`, and horizontal Field orientation; Playwright verifies checked state and orientation hooks. | Covered | None. |
| `field-checkbox` | FieldLegend, grouped checkbox rows, separator, and FieldContent wrapping label/description. | Candidate fixture `field/checkbox` and docs `FieldPreview` compose checkbox rows with `FieldContent` and `FieldSeparator`; Playwright verifies the public hooks and checked state. | Covered | None. |
| `field-switch` | Horizontal field with FieldContent label/description on one side and Switch on the other. | Candidate fixture `field/switch` and docs `FieldPreview` use horizontal Field orientation with `Switch`, `FieldLabel`, `FieldContent`, and `FieldDescription`; Playwright verifies role and checked state. | Covered | None. |
| `field-slider` | FieldTitle/FieldDescription with live value text and Slider range control. | Candidate fixture `field/slider` and docs `FieldPreview` use `FieldTitle`, descriptions, and two native Slider controls for min/max submitted values with server-provided defaults. | Intentional divergence | RadCN does not port React `useState` live value text; apps can add browser enhancement if live text is required. |
| `field-select` | Field with label, Select trigger/content/items, and description. | Candidate fixture `field/select` and docs `FieldPreview` compose `FieldLabel`, `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectViewport`, and items; Playwright verifies hidden native value. | Covered | None. |
| `field-choice-card` | Radio options rendered as card-like Fields with FieldContent, FieldTitle, description, and nested labels. | Candidate fixture `field/choice-card` and docs `FieldPreview` use `.radcn-field--choice-card`, `FieldContent`, `FieldTitle`, descriptions, and radio items; Playwright verifies titles and checked radio semantics. | Covered | None. |
| `field-group` | Multiple FieldSet sections separated by FieldSeparator with checkbox groups and inline link copy. | Candidate fixture `field/group` uses multiple FieldSet sections, `FieldSeparator`, horizontal checkbox rows, `FieldContent`, labels, and descriptions; Playwright verifies section and separator counts. | Covered | None. |
| `field-responsive` | Responsive Field orientation with FieldContent, input/textarea controls, separators, and action buttons. | Candidate fixture `field/responsive` and docs `FieldPreview` use `orientation="responsive"` with `FieldContent`, inputs, textarea, separator, and action buttons; Playwright verifies responsive data hooks. | Covered | None. |

## Mapping Decisions

- RadCN should not treat the existing `radcn/form` API as complete Field
  parity. Form helpers solve server/action wiring; upstream Field examples
  expose reusable layout and grouping parts that belong in `radcn/field` if
  parity is implemented.
- `FieldLabel` can likely wrap or mirror `radcn/label`, but it needs a Field
  package export so examples can be authored against the Field API surface.
- `FieldSet` and `FieldLegend` should preserve real `fieldset` and `legend`
  semantics rather than generic wrappers.
- `FieldGroup`, `FieldContent`, `FieldTitle`, and `FieldSeparator` are layout
  and content composition parts. They should remain dependency-free host
  elements.
- Horizontal and responsive orientation should be expressed with explicit props
  and data attributes, not React context.
- The upstream slider example's React `useState` behavior should be mapped to a
  Remix/web-first pattern: native range/form state, server-provided default
  values, or a small dependency-free enhancement if live value text is required.

## Next Recommendation

Mark `field` resolved in `resolved-clusters.json`, regenerate
`parity-inventory.md`, and move to the next generated unresolved example,
block, or chart cluster after Experiment 12 completion review.
