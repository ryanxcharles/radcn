# shadcn/ui Component Inventory

## Sources Audited

Primary shadcn/ui sources:

- `vendor/shadcn-ui/apps/v4/lib/components.ts` — canonical list of 60 UI
  component names.
- `vendor/shadcn-ui/apps/v4/registry.json` — registry metadata, install
  dependencies, registry dependencies, and file paths.
- `vendor/shadcn-ui/apps/v4/registry/bases/radix/ui/` — current direct UI
  implementations for most components.
- `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/form.tsx` — current form
  implementation; no `bases/radix/ui/form.tsx` exists in this checkout.
- `vendor/shadcn-ui/apps/v4/registry/bases/radix/blocks/dashboard-01/components/data-table.tsx`
  — representative data table block implementation.
- `vendor/shadcn-ui/apps/v4/registry/bases/radix/blocks/sidebar-12/components/date-picker.tsx`
  — representative date picker block implementation.
- `vendor/shadcn-ui/apps/v4/registry/bases/radix/examples/sonner-example.tsx`
  — representative toast usage; the direct reusable primitive is `sonner`.
- `vendor/shadcn-ui/apps/v4/registry/bases/radix/examples/demo.tsx` and
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/typography-*.tsx` —
  typography examples; there is no direct `typography.tsx` primitive.
- `vendor/shadcn-ui/apps/v4/content/docs/components/base/meta.json` — confirms
  the documented component set includes components without direct UI files.

Primary Remix 3 UI sources:

- `vendor/remix/packages/ui/README.md` — runtime UI overview, server rendering,
  first-party components, `mix`, and theme token contract.
- `vendor/remix/packages/ui/docs/component.md` — component lifecycle,
  `clientEntry`, `Handle`, manual `handle.update()`, server rendering, and
  frames.
- `vendor/remix/packages/ui/docs/composition.md` — props, children, refs, and
  keys.
- `vendor/remix/packages/ui/docs/events.md` and
  `vendor/remix/packages/ui/docs/interactions.md` — real DOM events through
  `on()`, `addEventListeners()`, and reusable event mixins.
- `vendor/remix/packages/ui/docs/styling.md` — `css(...)` mixin, cascade layers,
  pseudo-selectors, attribute selectors, and dynamic `style`.
- `vendor/remix/packages/ui/docs/hydration.md` — targeted hydration and
  serializable client-entry props.
- `vendor/remix/packages/ui/src/theme/README.md` — `createTheme`, `theme`, and
  built-in theme/glyph contracts.
- `vendor/remix/packages/ui/src/index.ts` — exported primitives: `run`,
  `clientEntry`, `Frame`, `createMixin`, `on`, `ref`, `attrs`, `css`, and
  navigation helpers.

## Classification Model

Behavior classes:

- `static` — mostly visual markup, links, or layout with no component-owned
  interaction.
- `form-control` — participates directly in native forms or validation.
- `disclosure` — expands, collapses, switches, or toggles bounded content.
- `overlay` — portals or positions floating content, modal content, or layered
  UI.
- `composite-widget` — ARIA widget with roving focus, typeahead, selection, or
  multi-part keyboard behavior.
- `collection` — renders or manages a list/grid/table of records or options.
- `data-display` — visualizes structured data without owning complex input
  behavior.
- `feedback` — transient or status UI such as progress, loading, skeleton, or
  notifications.
- `application-shell` — large composed layout/controller component.

Remix 3 mapping hypotheses:

- `native-html-css` — use semantic HTML plus RadCN styles and possibly native
  form behavior.
- `server-rendered` — render as static or server-composed UI without hydration.
- `progressive-enhancement` — native behavior first; add small hydration only
  for richer behavior.
- `remix-ui-primitive` — implement using Remix UI component state, `clientEntry`,
  `on`, `ref`, `css`, custom mixins, and theme tokens.
- `small-client-script` — localized imperative browser script is likely simpler
  than a full component runtime primitive.
- `needs-design` — interaction or architecture needs a dedicated design
  experiment before porting.
- `defer` — do not include in the first RadCN component milestone.

Parity check codes:

- `screenshot` — static visual comparison across variants, states, themes, and
  viewports.
- `DOM` — element structure, attributes, classes, and data attributes.
- `a11y-tree` — roles, names, relationships, live regions, and disabled/invalid
  states.
- `keyboard` — focus order, roving focus, shortcut keys, typeahead, escape,
  tabbing, and selection.
- `pointer` — hover, press, click, drag, resize, outside click, and gesture
  behavior.
- `form` — native submission, constraint validation, labels, names, values, and
  reset behavior.
- `animation` — enter/exit, loading, motion, transition duration, and reduced
  motion.
- `responsive` — viewport, container, mobile/desktop, and RTL/layout changes.
- `theme` — CSS variables, dark/light themes, tokens, icons, and variant
  styling.

Risk levels:

- `low` — mostly static or native HTML; likely first-pass portable.
- `medium` — interactive but bounded, or dependent on one primitive family.
- `high` — composite keyboard behavior, portals, third-party React-specific
  libraries, drag/drop, charts, or application-level state.

## Component Inventory

| Component | Source | Registry deps | Package deps | React surface | Radix/Base surface | Visual surface | Behavior | Remix 3 mapping | Parity checks | Risk | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| accordion | `registry/bases/radix/ui/accordion.tsx` | none | `@radix-ui/react-accordion` / `radix-ui` | client component, component props | Radix Accordion parts | `cn`, data/ARIA state, motion classes | disclosure | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, theme | medium | Good first interactive candidate; bounded keyboard behavior. |
| alert | `registry/bases/radix/ui/alert.tsx` | none | `class-variance-authority` | component props only | none | `cva`, `cn`, semantic alert variants | static | `server-rendered` | screenshot, DOM, a11y-tree, theme | low | Pure visual/semantic component. |
| alert-dialog | `registry/bases/radix/ui/alert-dialog.tsx` | button | `@radix-ui/react-alert-dialog` / `radix-ui` | client component, portal | Radix AlertDialog parts | `cn`, data state, overlay/content styles | overlay | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, responsive, theme | high | Needs modal focus trap, escape, outside interaction, and portal strategy. |
| aspect-ratio | `registry/bases/radix/ui/aspect-ratio.tsx` | none | `@radix-ui/react-aspect-ratio` / `radix-ui` | client wrapper only | Radix AspectRatio | intrinsic ratio styling | static | `native-html-css` | screenshot, DOM, responsive | low | Can probably use plain CSS `aspect-ratio`. |
| avatar | `registry/bases/radix/ui/avatar.tsx` | none | `@radix-ui/react-avatar` / `radix-ui` | client component | Radix Avatar image/fallback | `cn`, data slots, image/fallback styles | feedback | `progressive-enhancement` | screenshot, DOM, a11y-tree, responsive, theme | medium | Image fallback timing may need small client behavior. |
| badge | `registry/bases/radix/ui/badge.tsx` | none | `@radix-ui/react-slot`, `class-variance-authority` | component props | Slot/as-child pattern | `cva`, `cn`, variants | static | `server-rendered` | screenshot, DOM, a11y-tree, theme | low | Tests should cover `asChild` replacement decision. |
| breadcrumb | `registry/bases/radix/ui/breadcrumb.tsx` | none | `@radix-ui/react-slot`, `lucide-react` | component props | Slot/as-child pattern | `cn`, ARIA nav/list, separator icon | static | `native-html-css` | screenshot, DOM, a11y-tree, responsive, theme | low | Mostly semantic nav plus icon strategy. |
| button | `registry/bases/radix/ui/button.tsx` | none | `@radix-ui/react-slot`, `class-variance-authority` | component props | Slot/as-child pattern | `cva`, `cn`, variants, focus/disabled classes | form-control | `native-html-css` | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme | low | Best first visual/form candidate; must preserve native button behavior. |
| button-group | `registry/bases/radix/ui/button-group.tsx` | button, separator | `class-variance-authority` | component props | Slot/as-child pattern | `cva`, `cn`, grouped border/radius classes | static | `server-rendered` | screenshot, DOM, a11y-tree, responsive, theme | low | Mostly layout and variant propagation. |
| calendar | `registry/bases/radix/ui/calendar.tsx` | button | `react-day-picker`, `date-fns` | client component, effects, refs, events | none | dense calendar classes, data attrs, icons | composite-widget | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, form, responsive, theme | high | Third-party React calendar should not be copied blindly. |
| card | `registry/bases/radix/ui/card.tsx` | none | none | component props only | none | `cn`, data slots, section spacing | static | `server-rendered` | screenshot, DOM, responsive, theme | low | Straight static container set. |
| carousel | `registry/bases/radix/ui/carousel.tsx` | button | `embla-carousel-react` | client component, state, effects, callbacks, context | none | `cn`, ARIA, buttons, overflow layout | composite-widget | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, responsive, animation, theme | high | React-specific Embla wrapper; needs a separate interaction strategy. |
| chart | `registry/bases/radix/ui/chart.tsx` | card | `recharts`, `lucide-react` | client component, memo, id, context, CSSProperties | none | CSS variables, chart theme config, tooltip styles | data-display | `defer` | screenshot, DOM, a11y-tree, responsive, theme | high | Recharts is React-specific; likely not first milestone. |
| checkbox | `registry/bases/radix/ui/checkbox.tsx` | none | `@radix-ui/react-checkbox` / `radix-ui`, icons | client component | Radix Checkbox | `cn`, checked/indeterminate icon, state classes | form-control | `progressive-enhancement` | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme | medium | Native checkbox hidden/styled approach may be preferable. |
| collapsible | `registry/bases/radix/ui/collapsible.tsx` | none | `@radix-ui/react-collapsible` / `radix-ui` | client wrapper | Radix Collapsible | minimal | disclosure | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, animation | medium | Simpler than accordion; useful behavior primitive. |
| combobox | `registry/bases/radix/ui/combobox.tsx` | input-group, button, popover-like parts | `@base-ui/react`, icons | client component, refs, portal | Base UI Combobox parts | `cn`, data attrs, chips, popup sizing | composite-widget | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, form, responsive, theme | high | Large ARIA combobox surface; should follow after menu/listbox primitives. |
| command | `registry/bases/radix/ui/command.tsx` | dialog | `cmdk`, icons | client component | cmdk parts | `cn`, data attrs, command list/item styles | composite-widget | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, responsive, theme | high | cmdk is React-specific; likely built from RadCN listbox/dialog primitives later. |
| context-menu | `registry/bases/radix/ui/context-menu.tsx` | none | `@radix-ui/react-context-menu` / `radix-ui`, icons | client component, portal | Radix ContextMenu | `cn`, portal, menu item states | overlay | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, theme | high | Needs contextmenu event, roving focus, submenus, collision/portal behavior. |
| data-table | `registry/bases/radix/blocks/dashboard-01/components/data-table.tsx` | table, button, checkbox, dropdown-menu, drawer, select, tabs, chart pieces | `@tanstack/react-table`, `@dnd-kit/*`, `zod`, `sonner`, `recharts` | client component, state, memo, ids, events | composed shadcn/Radix pieces | data attrs, drag handles, responsive drawer | collection | `defer` | screenshot, DOM, a11y-tree, keyboard, pointer, form, responsive, theme | high | This is an example/block pattern, not a primitive component. |
| date-picker | `registry/bases/radix/blocks/sidebar-12/components/date-picker.tsx` | calendar, popover, button | calendar/picker deps through composed parts | client state/events | composed popover/calendar | trigger, calendar popup, responsive layout | composite-widget | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, form, responsive, theme | high | Depends on the calendar and popover decisions. |
| dialog | `registry/bases/radix/ui/dialog.tsx` | none | `@radix-ui/react-dialog` / `radix-ui`, icons | client component, portal | Radix Dialog | `cn`, overlay/content, close button | overlay | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, responsive, theme | high | Core overlay primitive; needs focus trap and scroll lock. |
| direction | `registry/bases/radix/ui/direction.tsx` | none | `@radix-ui/react-direction` / `radix-ui` | client wrapper | DirectionProvider | direction context | static | `server-rendered` | DOM, responsive, theme | low | RadCN can likely use `dir` attributes and logical CSS; provider may be unnecessary. |
| drawer | `registry/bases/radix/ui/drawer.tsx` | none | `vaul`, `@radix-ui/react-dialog` | client component, portal | Vaul Drawer | direction data attrs, overlay/content, handle | overlay | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, responsive, theme | high | Gesture/direction behavior is not just dialog. |
| dropdown-menu | `registry/bases/radix/ui/dropdown-menu.tsx` | none | `@radix-ui/react-dropdown-menu` / `radix-ui`, icons | client component, portal | Radix DropdownMenu | `cn`, item states, submenu, shortcuts | overlay | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, theme | high | Good later primitive after popover/menu positioning. |
| empty | `registry/bases/radix/ui/empty.tsx` | none | `class-variance-authority` | component props | none | `cva`, `cn`, icon/content slots | static | `server-rendered` | screenshot, DOM, responsive, theme | low | Static layout component. |
| field | `registry/bases/radix/ui/field.tsx` | label, separator | `class-variance-authority` | client component, memo | none | `cva`, `cn`, data state, label/help/error layout | form-control | `native-html-css` | screenshot, DOM, a11y-tree, form, responsive, theme | medium | Must define how errors/descriptions connect to controls. |
| form | `registry/new-york-v4/ui/form.tsx` | button, label | `react-hook-form`, `zod`, `@hookform/resolvers`, Radix Label/Slot | client component, context, id | Label/Slot | `cn`, ARIA describedby/message wiring | form-control | `needs-design` | DOM, a11y-tree, keyboard, form, theme | high | React Hook Form API does not map directly; Remix native forms should lead. |
| hover-card | `registry/bases/radix/ui/hover-card.tsx` | none | `@radix-ui/react-hover-card` / `radix-ui` | client component, portal | Radix HoverCard | `cn`, content positioning, animation | overlay | `remix-ui-primitive` | screenshot, DOM, a11y-tree, pointer, animation, responsive, theme | medium | Pointer/focus delay and positioning are key. |
| input | `registry/bases/radix/ui/input.tsx` | none | none | component props | none | `cn`, native input states | form-control | `native-html-css` | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme | low | Best first native form component with Button. |
| input-group | `registry/bases/radix/ui/input-group.tsx` | button, input, textarea | `class-variance-authority` | client component, events | none | `cva`, `cn`, grouped adornment layout | form-control | `progressive-enhancement` | screenshot, DOM, a11y-tree, keyboard, pointer, form, responsive, theme | medium | Event wrappers and nested controls need careful semantics. |
| input-otp | `registry/bases/radix/ui/input-otp.tsx` | none | `input-otp`, icons | client component, context | third-party OTP parts | slots, fake caret, separator | composite-widget | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme | high | React-specific third-party package and complex input behavior. |
| item | `registry/bases/radix/ui/item.tsx` | separator | `class-variance-authority`, Slot | component props | Slot/as-child pattern | `cva`, `cn`, media/title/description/actions | static | `server-rendered` | screenshot, DOM, a11y-tree, responsive, theme | low | Static composition primitive. |
| kbd | `registry/bases/radix/ui/kbd.tsx` | none | none | component props | none | `cn`, inline key styling | static | `server-rendered` | screenshot, DOM, a11y-tree, theme | low | Pure semantic/visual text component. |
| label | `registry/bases/radix/ui/label.tsx` | none | `@radix-ui/react-label` / `radix-ui` | client wrapper | Radix Label | `cn`, disabled state | form-control | `native-html-css` | screenshot, DOM, a11y-tree, form, theme | low | Native `<label>` should be enough unless Radix behavior is required. |
| menubar | `registry/bases/radix/ui/menubar.tsx` | none | `@radix-ui/react-menubar` / `radix-ui`, icons | client component, portal | Radix Menubar | `cn`, menu states, submenus | composite-widget | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, responsive, theme | high | Roving focus, nested menus, and orientation semantics are complex. |
| native-select | `registry/bases/radix/ui/native-select.tsx` | none | icons | component props | none | `cn`, select wrapper/icon | form-control | `native-html-css` | screenshot, DOM, a11y-tree, keyboard, pointer, form, responsive, theme | low | Good native-control candidate; browser rendering varies. |
| navigation-menu | `registry/bases/radix/ui/navigation-menu.tsx` | none | `@radix-ui/react-navigation-menu`, `class-variance-authority`, icons | client component | Radix NavigationMenu | `cva`, viewport, indicators, animation attrs | composite-widget | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, responsive, theme | high | Complex layout/viewport animation and keyboard behavior. |
| pagination | `registry/bases/radix/ui/pagination.tsx` | button | none | component props | none | `cn`, ARIA nav, links | static | `server-rendered` | screenshot, DOM, a11y-tree, keyboard, responsive, theme | low | Mostly semantic links/buttons. |
| popover | `registry/bases/radix/ui/popover.tsx` | none | `@radix-ui/react-popover` / `radix-ui` | client component, portal | Radix Popover | `cn`, positioned content, animation | overlay | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, responsive, theme | high | Fundamental overlay primitive; collision/positioning matters. |
| progress | `registry/bases/radix/ui/progress.tsx` | none | `@radix-ui/react-progress` / `radix-ui` | client component | Radix Progress | `cn`, transform style, state | feedback | `native-html-css` | screenshot, DOM, a11y-tree, animation, theme | low | Native `<progress>` or ARIA div approach needs decision. |
| radio-group | `registry/bases/radix/ui/radio-group.tsx` | none | `@radix-ui/react-radio-group` / `radix-ui`, icons | client component | Radix RadioGroup | `cn`, item indicator | form-control | `progressive-enhancement` | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme | medium | Native radios can handle form semantics; roving focus styling may need script. |
| resizable | `registry/bases/radix/ui/resizable.tsx` | none | `react-resizable-panels`, icons | client component | none | `cn`, handle icon | application-shell | `defer` | screenshot, DOM, a11y-tree, keyboard, pointer, responsive, theme | high | Third-party React layout behavior; outside initial component library core. |
| scroll-area | `registry/bases/radix/ui/scroll-area.tsx` | none | `@radix-ui/react-scroll-area` / `radix-ui` | client component | Radix ScrollArea | `cn`, viewport/bar/thumb | static | `small-client-script` | screenshot, DOM, pointer, responsive, theme | medium | Native scrollbars may be acceptable; custom scrollbars need client behavior. |
| select | `registry/bases/radix/ui/select.tsx` | none | `@radix-ui/react-select` / `radix-ui`, icons | client component, portal | Radix Select | `cn`, trigger/content/item states | composite-widget | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, form, animation, responsive, theme | high | Native select and custom select may need separate RadCN components. |
| separator | `registry/bases/radix/ui/separator.tsx` | none | `@radix-ui/react-separator` / `radix-ui` | client wrapper | Radix Separator | `cn`, orientation | static | `native-html-css` | screenshot, DOM, a11y-tree, responsive, theme | low | Plain element with role/separator may be enough. |
| sheet | `registry/bases/radix/ui/sheet.tsx` | none | `@radix-ui/react-dialog` / `radix-ui`, icons | client component, portal | Dialog-based sheet | side variants, overlay/content animation | overlay | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, responsive, theme | high | Depends on dialog primitive plus side-position variants. |
| sidebar | `registry/bases/radix/ui/sidebar.tsx` | button, separator, sheet, tooltip, input, use-mobile, skeleton | `@radix-ui/react-slot`, `class-variance-authority`, icons | client component, state, effects, callbacks, context, CSSProperties | Slot/as-child, composed primitives | CSS vars, responsive/mobile, keyboard shortcut | application-shell | `needs-design` | screenshot, DOM, a11y-tree, keyboard, pointer, responsive, theme | high | Application shell component, not first primitive milestone. |
| skeleton | `registry/bases/radix/ui/skeleton.tsx` | none | none | component props | none | `cn`, pulse animation | feedback | `server-rendered` | screenshot, DOM, animation, theme | low | Static loading placeholder. |
| slider | `registry/bases/radix/ui/slider.tsx` | none | `@radix-ui/react-slider` / `radix-ui` | client component, memo | Radix Slider | `cn`, track/range/thumb | form-control | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme | medium | Native range can cover some cases; multi-thumb needs custom primitive. |
| sonner | `registry/bases/radix/ui/sonner.tsx` | none | `sonner`, `next-themes` | client component, CSSProperties | none | toast CSS vars/classes, theme bridging | feedback | `defer` | screenshot, DOM, a11y-tree, keyboard, animation, responsive, theme | high | React-specific notification system; RadCN may need its own toaster. |
| spinner | `registry/bases/radix/ui/spinner.tsx` | none | icons | component props | none | icon animation, ARIA | feedback | `server-rendered` | screenshot, DOM, a11y-tree, animation, theme | low | Pure visual/status component. |
| switch | `registry/bases/radix/ui/switch.tsx` | none | `@radix-ui/react-switch` / `radix-ui` | client component | Radix Switch | `cn`, thumb/track, checked state | form-control | `progressive-enhancement` | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme | medium | Native checkbox with switch role may be best. |
| table | `registry/bases/radix/ui/table.tsx` | none | none | client marker, component props | none | `cn`, semantic table sections | data-display | `server-rendered` | screenshot, DOM, a11y-tree, responsive, theme | low | Static semantic table pieces. |
| tabs | `registry/bases/radix/ui/tabs.tsx` | none | `@radix-ui/react-tabs`, `class-variance-authority` | client component | Radix Tabs | `cva`, `cn`, active state | composite-widget | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, responsive, theme | medium | Good second interactive candidate after accordion. |
| textarea | `registry/bases/radix/ui/textarea.tsx` | none | none | component props | none | `cn`, native textarea states | form-control | `native-html-css` | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme | low | Native control; useful with input/field proof. |
| toast | `registry/bases/radix/examples/sonner-example.tsx` | sonner | `sonner` | client event usage | none | toast variants through sonner | feedback | `defer` | screenshot, DOM, a11y-tree, keyboard, animation, theme | high | Documented component maps to sonner examples, not a separate primitive. |
| toggle | `registry/bases/radix/ui/toggle.tsx` | none | `@radix-ui/react-toggle`, `class-variance-authority` | client component | Radix Toggle | `cva`, `cn`, pressed state | disclosure | `progressive-enhancement` | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme | medium | Could be native button with `aria-pressed`. |
| toggle-group | `registry/bases/radix/ui/toggle-group.tsx` | toggle | `@radix-ui/react-toggle-group`, `class-variance-authority` | client component, context, CSSProperties | Radix ToggleGroup | group variants, item variants | composite-widget | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme | medium | Roving focus and single/multiple state. |
| tooltip | `registry/bases/radix/ui/tooltip.tsx` | none | `@radix-ui/react-tooltip` / `radix-ui` | client component, portal | Radix Tooltip | positioned content, animation | overlay | `remix-ui-primitive` | screenshot, DOM, a11y-tree, keyboard, pointer, animation, theme | medium | Needs hover/focus delay, escape, and accessible description semantics. |
| typography | examples under `registry/new-york-v4/examples/typography-*.tsx` | none | none | examples only | none | prose element classes | static | `server-rendered` | screenshot, DOM, a11y-tree, responsive, theme | low | Not a primitive file; likely docs/style recipes or tokenized prose styles. |

## Dependency Clusters

### Static and Mostly Visual

`alert`, `aspect-ratio`, `badge`, `breadcrumb`, `button-group`, `card`, `empty`,
`item`, `kbd`, `pagination`, `separator`, `skeleton`, `spinner`, `table`, and
`typography` can mostly render on the server with semantic HTML and RadCN styles.
Many still use `Slot` or `cva` upstream, but neither requires React semantics in
RadCN.

### Native Form Controls

`button`, `field`, `input`, `label`, `native-select`, `progress`, `textarea`,
and parts of `checkbox`, `radio-group`, `switch`, `slider`, and `toggle` should
start from native HTML semantics. The key product question is where RadCN allows
styled native controls to diverge from Radix's fully custom DOM.

### Radix-Backed Disclosure and Overlay Components

`accordion`, `collapsible`, `alert-dialog`, `context-menu`, `dialog`,
`dropdown-menu`, `hover-card`, `popover`, `sheet`, `tooltip`, and `drawer` depend
on Radix or Vaul behavior. These need Remix UI client entries, DOM event mixins,
refs, focus management, portal/positioning strategy, and animation-state data
attributes.

### Composite Keyboard Widgets

`calendar`, `carousel`, `combobox`, `command`, `menubar`, `navigation-menu`,
`select`, `tabs`, and `toggle-group` require strong keyboard and ARIA parity.
Several use React-only third-party packages today. They should not be first-pass
ports until RadCN has a repeatable keyboard-flow harness.

### Data and Display Helpers

`chart`, `data-table`, and `table` split into two groups. `table` is a static
semantic primitive and low risk. `chart` and `data-table` are high risk because
their reference implementations use React-specific charting/table/drag packages
and look more like application recipes than base primitives.

### Feedback and Application Shell

`avatar`, `progress`, `skeleton`, and `spinner` are bounded feedback components.
`sonner`, `toast`, `resizable`, and `sidebar` are larger systems with third-party
behavior or app-level state and should be deferred until core primitives exist.

### Third-Party React-Only or React-Heavy Libraries

High-risk dependencies include `react-day-picker`, `embla-carousel-react`,
`recharts`, `cmdk`, `@tanstack/react-table`, `@dnd-kit/*`, `react-resizable-panels`,
`input-otp`, `sonner`, `next-themes`, and `react-hook-form`. Each needs either a
native web replacement, a Remix UI rewrite, or an explicit defer decision.

## Remix 3 Mapping Strategies

### What Maps Directly

Static shadcn pieces map naturally to server-rendered Remix UI components:
component functions can render semantic HTML, class names, and child slots
without hydration. Styling can be translated either to stable authored CSS or
Remix UI `css(...)` mixins. Theme-dependent values should move toward Remix UI's
`createTheme()` and `theme.*` token contract rather than hard-coded Tailwind
tokens.

Native form controls should keep native behavior first. `button`, `input`,
`textarea`, `label`, and `native-select` should preserve real form submission,
constraint validation, labels, names, values, disabled state, and reset behavior
before adding any client enhancement.

### What Needs a Remix UI Primitive

Radix-backed interactions map to Remix UI through targeted hydration:

- `clientEntry` marks only interactive components for hydration.
- Local mutable state lives in component setup scope, with explicit
  `handle.update()`.
- `on()` attaches real DOM events and supports abortable async handlers.
- `ref()` provides DOM access for focus, measurement, and positioning.
- `createMixin()` can package reusable keyboard, pointer, hover, outside-click,
  focus-trap, scroll-lock, and typeahead behavior.
- Portal and overlay behavior needs a RadCN-owned strategy because Radix's React
  portal/component tree semantics do not transfer directly.

### What Does Not Map Directly

The following shadcn/ui assumptions need design work:

- React hooks, contexts, refs, and portals are pervasive in interactive
  components; Remix UI has analogous concepts but different lifecycle rules.
- `asChild`/Slot composition relies on React element replacement. RadCN needs an
  explicit alternative for polymorphic rendering or should drop `asChild` where
  native HTML is clearer.
- Radix primitives provide large amounts of ARIA, focus, collision, portal, and
  keyboard behavior. RadCN must either reimplement that behavior or deliberately
  choose native browser controls.
- Third-party React packages cannot be treated as portable dependencies.
- Tailwind class strings and `class-variance-authority` variants are portable as
  data, but RadCN should decide whether final components expose Tailwind classes,
  generated CSS mixins, or both.
- Client-entry props must be serializable. Functions, class instances, and
  React-specific render props cannot cross the server/client boundary.
- Remix UI updates are explicit; patterns that assume React re-rendering from
  `setState` need a new shape.

## Parity Requirements

The harness should not rely on screenshots alone. The inventory suggests this
minimum parity matrix:

| Component class | Required checks |
| --- | --- |
| Static/server-rendered | screenshot, DOM, a11y-tree, responsive, theme |
| Native form controls | screenshot, DOM, a11y-tree, keyboard, pointer, form, theme |
| Disclosure | screenshot, DOM, a11y-tree, keyboard, pointer, animation, theme |
| Overlay | screenshot, DOM, a11y-tree, keyboard, pointer, animation, responsive, theme |
| Composite widget | screenshot, DOM, a11y-tree, keyboard, pointer, form when applicable, responsive, theme |
| Data display | screenshot, DOM, a11y-tree, responsive, theme |
| Feedback | screenshot, DOM, a11y-tree, animation, theme |
| Application shell | screenshot, DOM, a11y-tree, keyboard, pointer, responsive, theme |

The first harness should render paired scenarios for upstream shadcn/ui and
RadCN, then compare:

- deterministic screenshots for default, variant, state, dark/light, and
  viewport scenarios;
- DOM attributes and data-state attributes where relevant;
- accessibility tree and focus order;
- keyboard flows for at least one interactive component;
- native form behavior for at least one form control.

## Recommended First Proof Set

The smallest useful first proof set should be:

1. `button` — low-risk native form component that stresses variants, disabled
   state, focus-visible styling, `asChild`/polymorphic decision, and form
   behavior.
2. `input` plus `field` — native control and label/help/error composition,
   proving form and accessibility assertions beyond screenshots.
3. `accordion` — bounded interactive component with keyboard behavior and
   data-state-driven styling, without the full complexity of portals.

This set covers one low-risk form component, one theme/variant-heavy component,
and one interactive keyboard component. It intentionally avoids portals,
positioning, drag/drop, charts, and React-only third-party libraries until the
comparison harness exists.

## Next Experiment

Build a minimal parity harness for the proof set above. The harness should run
paired upstream shadcn/ui and RadCN fixtures for `button`, `input`/`field`, and
`accordion`, using Playwright for screenshots plus DOM, accessibility, keyboard,
and native form assertions.
