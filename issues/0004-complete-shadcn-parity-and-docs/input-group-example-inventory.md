# InputGroup Example Inventory

Generated during Experiment 15 on 2026-06-05.

## Sources

- Upstream registry:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
- Upstream examples:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/input-group-*.tsx`
- Upstream package:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/input-group.tsx`
- RadCN packages:
  `radcn/packages/radcn/src/components/input-group.tsx`
  `radcn/packages/radcn/src/components/input.tsx`
  `radcn/packages/radcn/src/components/textarea.tsx`
  `radcn/packages/radcn/src/components/button-group.tsx`
  `radcn/packages/radcn/src/components/dropdown-menu.tsx`
  `radcn/packages/radcn/src/components/popover.tsx`
  `radcn/packages/radcn/src/components/tooltip.tsx`
  `radcn/packages/radcn/src/components/spinner.tsx`
  `radcn/packages/radcn/src/components/label.tsx`
  `radcn/packages/radcn/src/components/separator.tsx`
- RadCN docs:
  `radcn/apps/docs/app/content/components.tsx`
- RadCN fixtures:
  `radcn/fixtures/scenarios/index.ts`
  `radcn/fixtures/candidate-remix/app/fixtures/input-group.tsx`
  `radcn/fixtures/tests/form-input-cluster.spec.ts`

## Summary

InputGroup example parity is complete after Experiment 16. RadCN exports
`InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`,
`InputGroupInput`, and `InputGroupTextarea`. Fixtures and docs prove core
package behavior plus the upstream example depth: default text input, native
email/password/url/tel text-like input types, read-only inputs, inline start/end
addons, nested submit and icon buttons, textarea controls, disabled and invalid
state, native submit/reset, block start/end addons, custom tokens, addon
click-to-focus, ButtonGroup composition, DropdownMenu, Popover, Tooltip,
Spinner, Label, Separator, text addons, and textarea toolbar rows.

RadCN intentionally does not add React state, `useCopyToClipboard`,
`react-textarea-autosize`, shadcn `asChild`, or upstream icon packages as
package dependencies. Those behaviors map to explicit RadCN composition,
server/default state, route state, native submitted values, app-owned browser
enhancement, or documented customization hooks.

## Example Map

| Upstream id | User-facing behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `input-group-button` | Input groups with copy icon button, Popover info button, favorite icon button, and search submit button. Uses `useCopyToClipboard`, `useState`, `asChild` Popover trigger, read-only input, and icon-sized InputGroupButton. | Experiment 16 adds docs and fixture proof for read-only input, accessible icon-sized copy/favorite buttons, explicit PopoverTrigger composition, and native form submit behavior. Copy/favorite state remains app-owned. | Covered | No follow-up. |
| `input-group-button-group` | ButtonGroup wraps ButtonGroupText label, InputGroup, inline-end icon addon, and trailing ButtonGroupText suffix. | Experiment 16 composes ButtonGroupText, Label, InputGroup, icon text, and suffix text in docs and fixtures with Playwright proof. | Covered | No follow-up. |
| `input-group-custom` | Custom autosizing textarea control inside InputGroup with block-end Submit button, implemented upstream with `react-textarea-autosize`. | Experiment 16 proves native InputGroupTextarea with block-end submit toolbar and records autosize as app-owned dependency-free enhancement rather than a RadCN dependency. | Intentional divergence | Do not add `react-textarea-autosize` to RadCN. |
| `input-group-demo` | Full composition: search with icon and result count, URL field with tooltip, textarea command bar with dropdown, separator, percentage text, disabled send action, and verified handle field. | Experiment 16 adds docs and fixture proof for the mixed composition: search-style text input, URL input, Tooltip, DropdownMenu, Separator, textarea toolbar, disabled send action, status text, and verified handle field. | Covered | No follow-up. |
| `input-group-dropdown` | Input groups with dropdown action button and dropdown search-scope selector. | Experiment 16 adds DropdownMenu composition proof with explicit RadCN triggers inside inline-end InputGroup addons. | Covered | No follow-up. |
| `input-group-icon` | Icon addons for search, email, credit-card, check, star, and info icons; includes non-text `type="email"`. | Experiment 16 adds icon-addon and icon-button proof using presentation glyphs, accessible names, and native `type="email"` support. | Covered | No follow-up. |
| `input-group-label` | Label elements inside inline and block addons, plus tooltip help button in a block-start addon. | Experiment 16 proves Label inside inline and block InputGroupAddon compositions, including block-start label plus Tooltip help. | Covered | No follow-up. |
| `input-group-spinner` | Disabled/loading InputGroups with Spinner in inline-start and inline-end addons, saving text, and dual addon layout. | Experiment 16 proves Spinner in inline-start and inline-end addons with disabled/loading input groups. | Covered | No follow-up. |
| `input-group-text` | Text addons for currency, URL prefix/suffix, domain suffix, and textarea character count. | Experiment 16 proves representative currency, URL prefix/suffix, domain suffix, and textarea character-count text addons. | Covered | No follow-up. |
| `input-group-textarea` | Textarea code editor with block-start file toolbar, block-end status/action toolbar, refresh/copy/run buttons, and icon text. | Experiment 16 updates the textarea fixture and docs with block-start and block-end toolbar rows, action buttons, and status text. | Covered | No follow-up. |
| `input-group-tooltip` | Password and email/API-key input groups with tooltip help buttons, including non-text `type="password"` and tooltip trigger wrapped around addon/button. | Experiment 16 proves InputGroup-specific Tooltip composition plus native `type="password"` and `type="email"` support. | Covered | No follow-up. |

## Mapping Decisions

- RadCN should not port shadcn's `asChild` trigger pattern. InputGroup examples
  should use explicit RadCN `PopoverTrigger`, `DropdownMenuTrigger`, and
  `TooltipTrigger` components or package-supported button/addon composition.
- React `useState` and `useCopyToClipboard` are not InputGroup package
  requirements. RadCN should map copy/favorite/live toggles to server/default
  state, native submitted state, route state, or app-owned dependency-free
  enhancement.
- `react-textarea-autosize` is not a package dependency candidate for RadCN
  InputGroup. Autosizing textarea behavior should be app-owned or mapped to
  native `InputGroupTextarea` plus documented customization hooks unless a later
  implementation experiment proves a reusable dependency-free behavior is
  needed.
- Icon packages are presentation details. InputGroup parity should verify icon
  addon layout and accessible icon buttons without depending on upstream icon
  packages.
- Non-text input types are a real parity gap to resolve. Upstream examples use
  email and password inputs. Experiment 16 resolved this with typed
  `InputType = 'text' | 'email' | 'password' | 'tel' | 'url'` and pass-through
  support in `InputGroupInput`.
- Remix UI's accessible input typings do not currently accept `type="search"`
  for this package's textbox branch. Search-style examples use labeled text
  inputs while preserving user-facing search behavior.
- InputGroup should remain a layout and control-shell primitive. Dropdown,
  popover, tooltip, spinner, ButtonGroup, Label, Separator, Input, and Textarea
  behavior stays owned by those package primitives or by the app.
- The audit should not assume DOM equivalence. The implementation target is
  equivalent visual grouping, accessibility, and author-facing modifiability.

## Next Recommendation

The `input-group` example cluster is resolved. Regenerate
`parity-inventory.md` and move to the next generated unresolved example,
block, chart, or package outcome.
