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

InputGroup example parity is not complete yet. RadCN currently exports
`InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`,
`InputGroupInput`, and `InputGroupTextarea`. Existing fixtures prove core
package behavior: default text input, inline start/end addons, nested submit
buttons, textarea control, disabled and invalid state, native submit/reset,
block start/end addons, custom tokens, and addon click-to-focus.

That coverage is strong at the primitive level, but it does not yet cover the
full upstream InputGroup example surface.

The missing InputGroup parity depth is:

- Popover composition through explicit RadCN trigger components;
- DropdownMenu composition through explicit RadCN trigger components;
- Tooltip composition beyond the current ButtonGroup-nested proof;
- Spinner/loading compositions inside addons;
- Label composition inside inline and block addons;
- ButtonGroup composition around InputGroup;
- icon-only addon and icon-button examples with accessible names;
- textarea toolbar composition with block-start and block-end action rows;
- custom autosizing textarea behavior, mapped away from `react-textarea-autosize`;
- non-text input type parity for email and password examples;
- copy/favorite React state mappings for upstream `useCopyToClipboard` and
  `useState`.

Do not mark the `input-group` example cluster resolved yet. The next experiment
should implement InputGroup example parity depth.

## Example Map

| Upstream id | User-facing behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `input-group-button` | Input groups with copy icon button, Popover info button, favorite icon button, and search submit button. Uses `useCopyToClipboard`, `useState`, `asChild` Popover trigger, read-only input, and icon-sized InputGroupButton. | Current fixtures prove basic nested submit button behavior in `input-group/buttons`, but do not prove copy/favorite mapping, read-only input behavior, Popover composition, or multiple button sizes inside InputGroup. | Partial | Add button-depth fixture/docs proof with copy/favorite as server/default or app-owned state, explicit PopoverTrigger, read-only support if needed, and icon-sized InputGroupButton tests. |
| `input-group-button-group` | ButtonGroup wraps ButtonGroupText label, InputGroup, inline-end icon addon, and trailing ButtonGroupText suffix. | ButtonGroup parity is complete and InputGroup exists, but no InputGroup fixture/docs proof composes ButtonGroupText-as-label, InputGroup, and suffix together. | Partial | Add ButtonGroup + InputGroup composition proof and map shadcn `asChild` label text to explicit Label/ButtonGroupText composition. |
| `input-group-custom` | Custom autosizing textarea control inside InputGroup with block-end Submit button, implemented upstream with `react-textarea-autosize`. | RadCN has `InputGroupTextarea` and block-end addon proof, but no autosizing/custom control mapping or submit toolbar proof for this exact example. | Partial | Record `react-textarea-autosize` as app-owned; add native textarea/custom-control proof using `InputGroupTextarea` or documented custom `data-radcn-input-group-control` slot. |
| `input-group-demo` | Full composition: search with icon and result count, URL field with tooltip, textarea command bar with dropdown, separator, percentage text, disabled send action, and verified handle field. | Current fixtures cover many primitives separately, but no single docs/fixture proof covers the full mixed composition with tooltip, dropdown, separator, textarea toolbar, disabled send, and icon/text addons. | Partial | Add full demo fixture/docs proof and Playwright coverage for each composed part. |
| `input-group-dropdown` | Input groups with dropdown action button and dropdown search-scope selector. | RadCN has DropdownMenu and InputGroup primitives, but no InputGroup-specific dropdown fixture/docs proof. | Missing | Add DropdownMenu composition proof with explicit trigger buttons in inline-end addon. |
| `input-group-icon` | Icon addons for search, email, credit-card, check, star, and info icons; includes non-text `type="email"`. | Current addon fixture uses text glyphs, not icon-only addons, and RadCN Input/InputGroupInput currently hardcode text input type. | Partial | Add icon addon proof and decide whether Input/InputGroupInput should support input type or record a documented divergence. |
| `input-group-label` | Label elements inside inline and block addons, plus tooltip help button in a block-start addon. | Existing fixtures label controls outside InputGroup, but do not prove Label inside InputGroupAddon or block-start label-plus-tooltip composition. | Missing | Add inline/block Label addon proof and tooltip help button proof. |
| `input-group-spinner` | Disabled/loading InputGroups with Spinner in inline-start and inline-end addons, saving text, and dual addon layout. | Current disabled fixture covers disabled input groups, but no Spinner composition proof exists for InputGroup examples. | Missing | Add Spinner addon proof for disabled/loading groups. |
| `input-group-text` | Text addons for currency, URL prefix/suffix, domain suffix, and textarea character count. | Current fixtures cover some text addons (`Search`, `⌘K`, `radcn.dev/`, `Terminal`, block-end text), but not the full currency/prefix/suffix/character-count set. | Partial | Add representative text addon matrix proof and mark repeated variants covered when equivalent. |
| `input-group-textarea` | Textarea code editor with block-start file toolbar, block-end status/action toolbar, refresh/copy/run buttons, and icon text. | Current textarea and block addon fixtures prove a textarea and block-start/block-end addons separately, but not a two-toolbar textarea composition with multiple actions. | Partial | Add textarea toolbar fixture/docs proof with block-start and block-end actions. |
| `input-group-tooltip` | Password and email/API-key input groups with tooltip help buttons, including non-text `type="password"` and tooltip trigger wrapped around addon/button. | Tooltip is proved in ButtonGroup context, but not InputGroup-specific tooltip composition; RadCN InputGroupInput currently hardcodes text input type. | Partial | Add tooltip fixture/docs proof and decide input type support or intentional divergence for password/email. |

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
  email and password inputs, while current RadCN `Input`/`InputGroupInput`
  hardcode `type="text"`.
- InputGroup should remain a layout and control-shell primitive. Dropdown,
  popover, tooltip, spinner, ButtonGroup, Label, Separator, Input, and Textarea
  behavior stays owned by those package primitives or by the app.
- The audit should not assume DOM equivalence. The implementation target is
  equivalent visual grouping, accessibility, and author-facing modifiability.

## Next Recommendation

Implement InputGroup example parity depth:

- add docs and candidate fixtures for all 11 upstream InputGroup examples;
- add focused Playwright coverage for buttons, icon buttons, popovers,
  dropdowns, tooltips, spinners, ButtonGroup composition, labels, text addons,
  textarea toolbars, custom textarea mapping, and non-text input types;
- update Input/InputGroupInput package props if non-text type support is chosen;
- update InputGroup styles if composition gaps appear;
- record intentional divergences for React state, copy hooks, `asChild`, icon
  packages, and autosizing textarea behavior;
- then mark `input-group` resolved in `resolved-clusters.json` and regenerate
  `parity-inventory.md`.
