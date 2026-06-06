# Dialog Example Inventory

## Summary

Upstream shadcn/ui New York v4 has two active Dialog examples:
`dialog-demo` and `dialog-close-button`. RadCN already ships `radcn/dialog`
with the core modal behavior needed for both examples, but current docs,
fixtures, and Playwright tests do not yet prove the named upstream example
compositions.

**Audit outcome:** Partial.

The next experiment should add named docs, candidate fixture routes, and
Playwright coverage for `dialog-demo` and `dialog-close-button`. No package API
change is clearly required by this audit: `asChild` maps to RadCN's native
button trigger/close parts plus author styling, while Button, Input, Label,
native forms, read-only inputs, and share-link behavior remain composed
surfaces.

## Examples

| Example | Upstream behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `dialog-demo` | Trigger styled as outline Button with text `Open Dialog`; modal content constrained to `sm:max-w-[425px]`; title `Edit profile`; description `Make changes to your profile here. Click save when you're done.`; native form shell; labelled `Name` and `Username` inputs with default values `Pedro Duarte` and `@peduarte`; footer with outline `Cancel` close action and submit `Save changes` button. | `radcn/dialog` supports root, trigger, portal, overlay, content, header, footer, title, description, close action, default close button control, modal ARIA relationships, focus movement/trap/restoration, Escape/outside dismissal, scroll lock, default open, public hooks, classes/styles/tokens, and composition with native form controls. Existing docs and candidate fixtures prove generic `Project settings` dialog behavior, but do not render this named upstream form composition, exact copy, labels, default values, cancel/save footer, or max-width evidence. | Partial | Add named docs and candidate fixture evidence for `dialog-demo`; cover trigger styling, title/description copy, form shell, labelled inputs/default values, footer actions, submit button type, close behavior, ARIA/focus behavior, public hooks, and mapping copy. |
| `dialog-close-button` | Trigger styled as outline Button with text `Share`; modal content constrained to `sm:max-w-md`; title `Share link`; description `Anyone who has this link will be able to view this.`; visually hidden `Link` label; read-only input with value `https://ui.shadcn.com/docs/installation`; left-aligned footer; secondary `Close` close action. | `radcn/dialog` supports explicit close controls, default close button suppression, custom content/footer styling, modal behavior, public hooks, and composition with Label/Input. Existing `close-button` candidate fixture proves an explicit close action and hidden default close button behavior generically, but does not render the named share-link composition, sr-only label, read-only input, exact URL, secondary close styling, or footer alignment evidence. | Partial | Add named docs and candidate fixture evidence for `dialog-close-button`; cover share trigger, title/description copy, sr-only label, read-only URL input, footer alignment, secondary close action, close/focus restoration behavior, public hooks, and mapping copy. |

## Capability Mapping

| Surface | Decision |
| --- | --- |
| Dialog root, trigger, portal, overlay, content | Supported by `radcn/packages/radcn/src/components/dialog.tsx` with public `data-radcn-dialog*` hooks, package classes, `class`, and `style`. Existing generic candidate tests prove opening and portal movement. |
| Header, footer, title, description | Supported. Current docs and fixtures use the parts generically; named upstream copy still needs docs/fixture/test proof. |
| Close action | Supported. `DialogClose` renders a native close button, and `DialogContent showCloseButton` controls the default close button. Existing tests prove explicit close and default close focus behavior generically. |
| Default close button and `XIcon` | Mapped. Upstream renders a lucide `XIcon` with sr-only text. RadCN renders an accessible default close button with text `x` and `aria-label="Close"` without depending on `lucide-react`. Visual icon choice can be improved by styling or future icon strategy, but the active examples do not inspect the default close icon. |
| `DialogContent showCloseButton` | Supported by RadCN and upstream. Existing candidate fixtures use it to suppress the default close button for the generic close-button scenario. |
| `DialogFooter showCloseButton` | Upstream package API exists but the two active examples do not use it. RadCN can compose `DialogClose` manually in the footer; this audit does not require a package change unless later example/block evidence needs the prop. |
| Modal role and ARIA relationships | Supported. Browser enhancement assigns `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`; candidate Playwright tests cover these generic relationships. |
| Focus movement, focus trap, restoration, Escape dismissal, outside dismissal, scroll lock | Supported by `setupModal`/`enhanceDialog` and covered by generic candidate Playwright tests. Named examples still need coverage that these behaviors hold in the upstream compositions. |
| Default open | Supported and covered generically. The active upstream Dialog examples do not render default-open dialogs. |
| Custom classes, styles, and tokens | Supported by `class`, `style`, part classes, and CSS variables. Existing generic custom-token fixture proves token styling; named examples need max-width/footer-alignment evidence. |
| Button composition | App-owned/package composition. Upstream `DialogTrigger asChild` and `DialogClose asChild` avoid nested buttons while styling with shadcn Button. RadCN trigger/close parts are already native buttons and can take Button classes or equivalent author styling without an `asChild` dependency. |
| Input and Label composition | Separate package surfaces. The named examples should compose RadCN Input and Label, but Dialog should not own field semantics. |
| Native form submission | App-owned composition. `dialog-demo` uses a native form shell and submit button; Dialog should not own validation or submission state. |
| `sr-only` labels | Label/author styling composition. The `dialog-close-button` example needs visible proof that the accessible label exists while visual hiding remains app/docs fixture styling. |
| Read-only input | Input/native input behavior. Dialog only composes the read-only input inside modal content. |
| Share-link and copy-to-clipboard behavior | The upstream `dialog-close-button` example displays a share link but does not implement clipboard copying. RadCN should not add clipboard behavior for this row. |
| React props, Radix `DialogPrimitive`, controlled `open`, `onOpenChange`, `asChild`, `className`, `data-slot`, `cn`, Tailwind utilities | Implementation details or React/Tailwind mechanics from shadcn/ui. RadCN maps these to Remix UI props, browser enhancement, `class`, public `data-radcn-*` hooks, package CSS, and CSS variable/custom style hooks. They are not RadCN dependencies. |
| Vendor source | Reference only. No RadCN package, docs, fixture, or test code should depend on `vendor/`. |

## Evidence Reviewed

- Issue inventory:
  `issues/0004-complete-shadcn-parity-and-docs/parity-inventory.md`.
- Upstream package source:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/dialog.tsx`.
- Upstream example source:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/dialog-demo.tsx`
  and
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/dialog-close-button.tsx`.
- Upstream registry metadata:
  `vendor/shadcn-ui/apps/v4/public/r/styles/new-york-v4/dialog.json`,
  `dialog-demo.json`, and `dialog-close-button.json`.
- Current RadCN package source:
  `radcn/packages/radcn/src/components/dialog.tsx`.
- Current RadCN styles:
  `radcn/packages/radcn/src/styles/index.ts`.
- Current docs evidence:
  `radcn/apps/docs/app/content/components.tsx` has a generic Dialog rich docs
  page and static preview for `Publish component docs?`, but no named
  `dialog-demo` or `dialog-close-button` docs examples.
- Current fixture evidence:
  `radcn/fixtures/candidate-remix/app/fixtures/dialog.tsx` covers generic
  default, default-open, close-button, outside-dismiss, and custom-token
  scenarios, but not named upstream Dialog examples.
- Current Playwright evidence:
  `radcn/fixtures/tests/dialog.spec.ts` covers generic modal semantics,
  relationships, focus trap, focus restoration, scroll lock, Escape close,
  explicit close, outside dismissal, default open, and custom tokens.
  `radcn/apps/docs/tests/coverage.spec.ts` only asserts generic Dialog docs
  visibility.

## Decision

The Dialog example cluster is not resolved yet. RadCN has the core package
behavior needed for both upstream examples, and no mandatory React, Radix,
`asChild`, Tailwind, `cn`, `lucide-react`, clipboard, form-state, or vendor
dependency was identified. The missing proof is named parity depth: docs,
candidate fixtures, and Playwright should render and test `dialog-demo` and
`dialog-close-button` with exact copy, form/input/label composition, read-only
share-link input, footer actions, public hooks, custom sizing/alignment, and
modal behavior in those compositions.
