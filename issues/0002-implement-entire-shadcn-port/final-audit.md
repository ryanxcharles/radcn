# Final Audit

Issue 2 is complete after Experiment 26.

This audit checks the Issue 1 inventory against the current RadCN outcomes.
Every inventory row has one of these final dispositions:

- core source exported from `packages/radcn`;
- helper/event source exported from `packages/radcn`;
- recipe/block disposition with fixtures, tests, and docs;
- documented intentional divergence.

## Inventory Dispositions

| Component | Final disposition | Evidence |
| --- | --- | --- |
| `accordion` | Core source | Experiment 6, `packages/radcn/src/components/accordion.tsx`, `fixtures/tests/accordion.spec.ts` |
| `alert` | Core source | Experiment 2, `packages/radcn/src/components/alert.tsx`, `fixtures/tests/static-display.spec.ts` |
| `alert-dialog` | Core source | Experiment 13, `packages/radcn/src/components/alert-dialog.tsx`, `fixtures/tests/modal-variants.spec.ts` |
| `aspect-ratio` | Core source | Experiment 2, `packages/radcn/src/components/aspect-ratio.tsx`, `fixtures/tests/static-display.spec.ts` |
| `avatar` | Core source | Experiment 11, `packages/radcn/src/components/avatar.tsx`, `fixtures/tests/avatar-scroll-area.spec.ts` |
| `badge` | Core source | Experiment 2, `packages/radcn/src/components/badge.tsx`, `fixtures/tests/static-display.spec.ts` |
| `breadcrumb` | Core source | Experiment 3, `packages/radcn/src/components/breadcrumb.tsx`, `fixtures/tests/navigation-collection.spec.ts` |
| `button` | Core source | Experiment 1, `packages/radcn/src/components/button.tsx`, `fixtures/tests/native-controls.spec.ts` |
| `button-group` | Core source | Experiment 3, `packages/radcn/src/components/button-group.tsx`, `fixtures/tests/navigation-collection.spec.ts` |
| `calendar` | Core source | Experiment 20, `packages/radcn/src/components/calendar.tsx`, `fixtures/tests/calendar-date-picker.spec.ts` |
| `card` | Core source | Experiment 2, `packages/radcn/src/components/card.tsx`, `fixtures/tests/static-display.spec.ts` |
| `carousel` | Core source | Experiment 21, `packages/radcn/src/components/carousel.tsx`, `fixtures/tests/carousel.spec.ts` |
| `chart` | Core source | Experiment 23, `packages/radcn/src/components/chart.tsx`, `fixtures/tests/data-display.spec.ts` |
| `checkbox` | Core source | Experiment 5, `packages/radcn/src/components/checkbox.tsx`, `fixtures/tests/native-state.spec.ts` |
| `collapsible` | Core source | Experiment 7, `packages/radcn/src/components/collapsible.tsx`, `fixtures/tests/collapsible.spec.ts` |
| `combobox` | Core source | Experiment 18, `packages/radcn/src/components/combobox.tsx`, `fixtures/tests/combobox-command.spec.ts` |
| `command` | Core source | Experiment 18, `packages/radcn/src/components/command.tsx`, `fixtures/tests/combobox-command.spec.ts` |
| `context-menu` | Core source | Experiment 15, `packages/radcn/src/components/context-menu.tsx`, `fixtures/tests/menu-overlays.spec.ts` |
| `data-table` | Block/recipe disposition | Experiment 23, `docs/radcn-source.md`, `fixtures/tests/data-display.spec.ts` |
| `date-picker` | Recipe disposition | Experiment 20, `docs/radcn-source.md`, `fixtures/tests/calendar-date-picker.spec.ts` |
| `dialog` | Core source | Experiment 12, `packages/radcn/src/components/dialog.tsx`, `fixtures/tests/dialog.spec.ts` |
| `direction` | Core source | Experiment 26, `packages/radcn/src/components/direction.tsx`, `fixtures/tests/direction.spec.ts` |
| `drawer` | Core source | Experiment 16, `packages/radcn/src/components/drawer.tsx`, `fixtures/tests/drawer.spec.ts` |
| `dropdown-menu` | Core source | Experiment 15, `packages/radcn/src/components/dropdown-menu.tsx`, `fixtures/tests/menu-overlays.spec.ts` |
| `empty` | Core source | Experiment 2, `packages/radcn/src/components/empty.tsx`, `fixtures/tests/static-display.spec.ts` |
| `field` | Core source | Experiment 1, `packages/radcn/src/components/field.tsx`, `fixtures/tests/native-controls.spec.ts` |
| `form` | Recipe disposition | Experiment 22, `docs/radcn-source.md`, `fixtures/tests/form-input-cluster.spec.ts` |
| `hover-card` | Core source | Experiment 14, `packages/radcn/src/components/hover-card.tsx`, `fixtures/tests/positioned-overlays.spec.ts` |
| `input` | Core source | Experiment 1, `packages/radcn/src/components/input.tsx`, `fixtures/tests/native-controls.spec.ts` |
| `input-group` | Core source | Experiment 22, `packages/radcn/src/components/input-group.tsx`, `fixtures/tests/form-input-cluster.spec.ts` |
| `input-otp` | Core source | Experiment 22, `packages/radcn/src/components/input-otp.tsx`, `fixtures/tests/form-input-cluster.spec.ts` |
| `item` | Core source | Experiment 3, `packages/radcn/src/components/item.tsx`, `fixtures/tests/navigation-collection.spec.ts` |
| `kbd` | Core source | Experiment 2, `packages/radcn/src/components/kbd.tsx`, `fixtures/tests/static-display.spec.ts` |
| `label` | Core source | Experiment 1, `packages/radcn/src/components/label.tsx`, `fixtures/tests/native-controls.spec.ts` |
| `menubar` | Core source | Experiment 19, `packages/radcn/src/components/menubar.tsx`, `fixtures/tests/menubar-navigation.spec.ts` |
| `native-select` | Core source | Experiment 4, `packages/radcn/src/components/native-select.tsx`, `fixtures/tests/native-select.spec.ts` |
| `navigation-menu` | Core source | Experiment 19, `packages/radcn/src/components/navigation-menu.tsx`, `fixtures/tests/menubar-navigation.spec.ts` |
| `pagination` | Core source | Experiment 3, `packages/radcn/src/components/pagination.tsx`, `fixtures/tests/navigation-collection.spec.ts` |
| `popover` | Core source | Experiment 14, `packages/radcn/src/components/popover.tsx`, `fixtures/tests/positioned-overlays.spec.ts` |
| `progress` | Core source | Experiment 5, `packages/radcn/src/components/progress.tsx`, `fixtures/tests/native-state.spec.ts` |
| `radio-group` | Core source | Experiment 5, `packages/radcn/src/components/radio-group.tsx`, `fixtures/tests/native-state.spec.ts` |
| `resizable` | Core source | Experiment 25, `packages/radcn/src/components/resizable.tsx`, `fixtures/tests/application-shell.spec.ts` |
| `scroll-area` | Core source | Experiment 11, `packages/radcn/src/components/scroll-area.tsx`, `fixtures/tests/avatar-scroll-area.spec.ts` |
| `select` | Core source | Experiment 17, `packages/radcn/src/components/select.tsx`, `fixtures/tests/select.spec.ts` |
| `separator` | Core source | Experiment 2, `packages/radcn/src/components/separator.tsx`, `fixtures/tests/static-display.spec.ts` |
| `sheet` | Core source | Experiment 13, `packages/radcn/src/components/sheet.tsx`, `fixtures/tests/modal-variants.spec.ts` |
| `sidebar` | Core source | Experiment 25, `packages/radcn/src/components/sidebar.tsx`, `fixtures/tests/application-shell.spec.ts` |
| `skeleton` | Core source | Experiment 2, `packages/radcn/src/components/skeleton.tsx`, `fixtures/tests/static-display.spec.ts` |
| `slider` | Core source | Experiment 10, `packages/radcn/src/components/slider.tsx`, `fixtures/tests/slider.spec.ts` |
| `sonner` | Core source | Experiment 24, `packages/radcn/src/components/sonner.tsx`, `fixtures/tests/notifications.spec.ts` |
| `spinner` | Core source | Experiment 2, `packages/radcn/src/components/spinner.tsx`, `fixtures/tests/static-display.spec.ts` |
| `switch` | Core source | Experiment 5, `packages/radcn/src/components/switch.tsx`, `fixtures/tests/native-state.spec.ts` |
| `table` | Core source | Experiment 3, `packages/radcn/src/components/table.tsx`, `fixtures/tests/navigation-collection.spec.ts` |
| `tabs` | Core source | Experiment 8, `packages/radcn/src/components/tabs.tsx`, `fixtures/tests/tabs.spec.ts` |
| `textarea` | Core source | Experiment 1, `packages/radcn/src/components/textarea.tsx`, `fixtures/tests/native-controls.spec.ts` |
| `toast` | Helper/event source | Experiment 24, `packages/radcn/src/components/toast.ts`, `fixtures/tests/notifications.spec.ts` |
| `toggle` | Core source | Experiment 9, `packages/radcn/src/components/toggle.tsx`, `fixtures/tests/toggle.spec.ts` |
| `toggle-group` | Core source | Experiment 9, `packages/radcn/src/components/toggle-group.tsx`, `fixtures/tests/toggle.spec.ts` |
| `tooltip` | Core source | Experiment 14, `packages/radcn/src/components/tooltip.tsx`, `fixtures/tests/positioned-overlays.spec.ts` |
| `typography` | Recipe/source surface | Experiment 3, `packages/radcn/src/components/typography.tsx`, `fixtures/tests/navigation-collection.spec.ts` |

## Verification

- `pnpm radcn:typecheck` passed.
- `pnpm fixtures:candidate:typecheck` passed.
- `pnpm fixtures:reference:typecheck` passed with the existing React Router
  `module.register()` deprecation warning.
- `pnpm playwright test -c fixtures/playwright.config.ts fixtures/tests/direction.spec.ts`
  passed: 3 tests.
- `pnpm fixtures:artifacts` passed: 716 tests.
- `git status --short -- vendor` returned no output.

## Conclusion

Every Issue 1 inventory row now has a recorded Issue 2 outcome. Issue 2 can be
closed.
