# Context Menu Example Inventory

## Summary

Upstream shadcn/ui New York v4 exposes one direct Context Menu example:
`context-menu-demo`.

RadCN already ships `radcn/context-menu` with ContextMenu,
ContextMenuTrigger, ContextMenuPortal, ContextMenuContent, ContextMenuGroup,
ContextMenuLabel, ContextMenuItem, ContextMenuCheckboxItem,
ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator,
ContextMenuShortcut, ContextMenuSub, ContextMenuSubTrigger,
ContextMenuSubContent, and `enhanceContextMenu` exports. Current package,
fixture, and Playwright evidence proves dependency-free menu overlay behavior,
right-click opening, keyboard ContextMenu and Shift+F10 opening, portal
placement, menu roles, focus restoration, roving/highlight behavior, typeahead,
disabled item skipping, checkbox state mutation, radio group item state,
submenus, collision handling, public hooks, and custom tokens.

Experiment 90 covers the named upstream example in docs, candidate fixtures,
and Playwright. The exact 300 by 150 dashed trigger labelled `Right click
here`, `w-52` content, inset Back / disabled Forward / Reload items with
shortcuts, More Tools submenu with `w-44` content and exact items, separators,
checked and unchecked checkbox rows, People radio group with `Pedro Duarte`
selected, destructive Delete item, and React/Radix/`data-slot`/`className`/
Tailwind/lucide mapping are now recorded as RadCN docs and fixture evidence.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `context-menu-demo` | Root `ContextMenu` wraps a `ContextMenuTrigger` with `className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"` and visible text `Right click here`. `ContextMenuContent className="w-52"` contains inset items `Back`, disabled `Forward`, and `Reload` with `ContextMenuShortcut` values `⌘[`, `⌘]`, and `⌘R`; a `ContextMenuSub` with inset trigger `More Tools`; `ContextMenuSubContent className="w-44"` containing `Save Page...`, `Create Shortcut...`, `Name Window...`, a separator, `Developer Tools`, another separator, and destructive `Delete`; a separator; checked `ContextMenuCheckboxItem` `Show Bookmarks`; unchecked `ContextMenuCheckboxItem` `Show Full URLs`; another separator; `ContextMenuRadioGroup value="pedro"` containing inset label `People`, selected radio item `Pedro Duarte`, and unselected radio item `Colm Tuite`. Upstream UI uses a React client component marker, React component props, Radix Context Menu primitives, Radix Portal/Content/Sub/CheckboxItem/RadioGroup/RadioItem mechanics, `data-slot`, `className`, `cn`, lucide `CheckIcon`, `ChevronRightIcon`, and `CircleIcon`, Tailwind sizing/layout/border/typography/animation/focus/inset utilities, disabled state, checkbox/radio indicators, destructive variant styling, and shortcut layout. | `radcn/apps/docs/app/content/components.tsx` renders a rich Context Menu docs page with stable `data-radcn-docs-context-menu-family="context-menu-demo"` evidence, exact trigger text/classes/computed size, `w-52` main content with explicit 13rem width/min-width, exact items/shortcuts/separators/checkbox/radio/label/destructive Delete content, `w-44` subcontent with explicit 11rem width/min-width, app-owned indicator/caret evidence, public hook evidence, and mapping copy for React client components, Radix Context Menu primitives, portal/content/submenu mechanics, `data-slot`, `className`, `cn`, Tailwind utilities, lucide icons, native menu-overlay behavior, custom tokens, and vendor source. `radcn/apps/docs/app/assets.ts` now allows browser assets to import `radcn/packages/radcn/src/**`, and `radcn/apps/docs/app/assets/entry.ts` calls `enhanceContextMenu()` so docs exercise the same package runtime behavior as fixtures. `radcn/apps/docs/tests/coverage.spec.ts` verifies the docs page, portal-relocated content, 208px/176px widths, submenu hover opening, checked/radio states, destructive styling, hooks, and required mapping copy. `radcn/fixtures/scenarios/index.ts` registers `context-menu/demo`. `radcn/fixtures/candidate-remix/app/fixtures/menu-overlays.tsx` renders the named upstream composition with the same explicit content/subcontent width constraints. `radcn/fixtures/tests/menu-overlays.spec.ts` verifies right-click, ContextMenu key, Shift+F10, trigger text/classes/computed dimensions, content and subcontent widths, all exact items/shortcuts/labels, disabled Forward behavior, inset evidence, separator count, checked and unchecked checkbox state, selected/unselected radio state, destructive Delete, public hooks, submenu hover/keyboard behavior, caret/indicator evidence, closing behavior, and no React/Radix DOM-equivalence dependency. | Covered | None. |

## Decisions

- RadCN should keep Context Menu dependency-free over `enhanceContextMenu` and
  the shared menu overlay utility. Radix Context Menu primitives are not needed
  as RadCN dependencies for this example.
- Upstream right-click behavior maps to `enhanceContextMenu` handling the
  browser contextmenu event on `ContextMenuTrigger`.
- Upstream keyboard context-menu activation maps to the same enhancer handling
  the ContextMenu key and Shift+F10 on the trigger.
- Upstream Portal, Content, Sub, SubTrigger, and SubContent map to explicit
  RadCN portal/content/sub parts with public `data-radcn-context-menu*` hooks.
- Upstream `data-slot` maps to public `data-radcn-context-menu*` and shared
  `data-radcn-menu-*` hooks.
- Upstream `className` and `cn` map to `class`, `style`, CSS variables, and
  explicit class composition.
- Upstream trigger sizing and dashed-border Tailwind utilities map to app/docs
  class/style on `ContextMenuTrigger`; the package should not bake a 300 by
  150 trigger into the primitive.
- Upstream `w-52` and `w-44` content widths map to class/style or
  `--radcn-menu-width` on `ContextMenuContent` and `ContextMenuSubContent`.
  Because package menu content has a default min-width, exact shadcn width
  parity requires overriding both `width` and `min-width` in examples where the
  upstream width is narrower than the package default.
- Docs examples that need package browser enhancement must allow the RadCN
  package source in the docs asset server and call the package enhancer from
  `app/assets/entry.ts`; once enhanced, menu portals may move outside the docs
  preview wrapper, so tests should scope content by stable portal/content ids
  rather than assuming wrapper-local DOM.
- Upstream item `inset` maps to `inset` props and `radcn-menu-item--inset` /
  `radcn-menu-label--inset` package classes.
- Upstream disabled item behavior maps to `disabled`, `aria-disabled`, and
  `data-disabled`; disabled items must not receive highlight or close the menu
  when clicked.
- Upstream checkbox and radio indicators map to package-owned indicator spans;
  the exact lucide `CheckIcon` and `CircleIcon` remain presentation details.
- Upstream `ChevronRightIcon` maps to the package-owned submenu caret or an
  app-owned presentation glyph; lucide-react must not become a dependency.
- Upstream destructive variant maps to `variant="destructive"` and public
  destructive styling hooks.
- Upstream shortcuts remain visible text in `ContextMenuShortcut`; the package
  owns shortcut layout but not platform shortcut behavior.
- The exact user-facing texts from `context-menu-demo` are content parity
  requirements for the named example.
- Vendor source remains read-only evidence and should not be imported or
  committed into RadCN.
