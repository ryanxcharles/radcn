# Experiment 62: Migrate Sidebar to Tailwind utilities

## Description

Sidebar is standalone (no Button/Input coupling). Its parent-state→descendant
cascades migrate via two mechanisms, both reliable and using only proven primitives
(no Tailwind named-group / nested-in-group-data features):

1. **Own-state variants** for the sidebar's collapse width/margin. The enhancer
   (`sidebar.tsx:64`) sets the sidebar's `data-collapsible` to the mode (`icon`/
   `offcanvas`) ONLY when collapsed (`''` when expanded). So `data-[collapsible=icon]`
   ⟹ collapsed — the original `.provider[data-state=collapsed] .sidebar[data-collapsible=icon]`
   collapses to the sidebar's OWN `data-[collapsible=icon]:` variant. To avoid a
   flex-basis/margin CONFLICT (Exp-41), the sidebar READS a var and the variant SETS
   it: `flex-[0_0_var(--radcn-sidebar-cur-width,var(--radcn-sidebar-width))]` +
   `data-[collapsible=icon]:[--radcn-sidebar-cur-width:var(--radcn-sidebar-width-icon)]`;
   `[margin-inline-start:var(--radcn-sidebar-mis,0)]` +
   `data-[collapsible=offcanvas]:[--radcn-sidebar-mis:calc(var(--radcn-sidebar-width)*-1)]`
   + the side=right overrides via stacked `data-[collapsible=offcanvas]:data-[side=right]:[--…]`.
2. **Two small KEPT-bespoke cascades, repointed to the kept `data-*` attributes** —
   for the genuinely provider/sidebar-scoped descendant cascades. These are reliable
   here (unlike the Exp-47 OVERRIDE case) because each target has NO conflicting base
   utility: the hide sets `display:none` on elements/spans that have no display
   utility (a clean sole declaration, not an override), and the floating/inset
   cascade ADDS margin/border/rounded/bg to an inner that has none (a clean add):
   - collapse-hide: `.radcn-sidebar-provider[data-state="collapsed"]
     [data-radcn-sidebar-menu-button] span, …[data-radcn-sidebar-input],
     … .radcn-sidebar-group-label { display: none }` (the menu-button label is a
     child span of user `{children}`; the group-label keeps its `radcn-sidebar-group-label`
     class as a structural marker since it has no data attribute).
   - inner floating/inset: `.radcn-sidebar[data-variant="floating"]
     [data-radcn-sidebar-inner], .radcn-sidebar[data-variant="inset"]
     [data-radcn-sidebar-inner] { margin/border/border-radius/background }`.

The `radcn-sidebar--{variant}` marker (only the inner cascade used it, now repointed
to `data-variant`) is dropped. The sidebar keeps `data-variant`/`data-side`/
`data-collapsible`(+`-mode`)/`data-state` (the enhancer + tests use them). The
menu-button keeps its style-less `--{variant}`/`--{size}` markers.

### Exact utility mapping

- provider: `[--radcn-sidebar-width:16rem] [--radcn-sidebar-width-icon:3.5rem] flex
  w-[min(100%,48rem)] min-h-80 border
  border-[var(--radcn-sidebar-border,var(--radcn-border))] rounded-md overflow-hidden
  bg-background text-foreground [font-family:var(--radcn-font)]`.
- sidebar: `relative
  flex-[0_0_var(--radcn-sidebar-cur-width,var(--radcn-sidebar-width))]
  [border-inline-end:1px_solid_var(--radcn-sidebar-border,var(--radcn-border))]
  bg-[var(--radcn-sidebar-bg,var(--radcn-muted))]
  text-[var(--radcn-sidebar-fg,var(--radcn-foreground))]
  [transition:flex-basis_160ms_ease,margin_160ms_ease]
  [margin-inline-start:var(--radcn-sidebar-mis,0)]
  [margin-inline-end:var(--radcn-sidebar-mie,0)] data-[side=right]:order-2
  data-[side=right]:[border-inline-end:0]
  data-[side=right]:[border-inline-start:1px_solid_var(--radcn-sidebar-border,var(--radcn-border))]
  data-[collapsible=icon]:[--radcn-sidebar-cur-width:var(--radcn-sidebar-width-icon)]
  data-[collapsible=offcanvas]:[--radcn-sidebar-mis:calc(var(--radcn-sidebar-width)*-1)]
  data-[collapsible=offcanvas]:data-[side=right]:[--radcn-sidebar-mis:0]
  data-[collapsible=offcanvas]:data-[side=right]:[--radcn-sidebar-mie:calc(var(--radcn-sidebar-width)*-1)]`.
- inner: `flex min-h-full flex-col` (the floating/inset add-ons stay in the kept
  bespoke cascade above).
- content: `flex min-h-full flex-col`.
- header / footer / group: `grid gap-2 p-3`.
- group-label: KEEP the `radcn-sidebar-group-label` marker + `text-muted-foreground
  text-[0.75rem] font-semibold` (the collapse hide stays in the kept cascade).
- menu / menu-sub: `grid m-0 p-0 gap-1 list-none`.
- menu-button / menu-sub-button (shared base): `flex w-full items-center gap-2 border-0
  rounded-[calc(var(--radcn-radius)-0.125rem)] bg-transparent text-inherit p-2 text-left
  no-underline font-medium text-[0.875rem] leading-[1.2] [font-family:var(--radcn-font)]
  data-[active=true]:bg-[var(--radcn-sidebar-accent,var(--radcn-accent))]
  data-[active=true]:text-[var(--radcn-sidebar-accent-fg,var(--radcn-accent-foreground))]`.
  - menu-button adds: `hover:bg-[var(--radcn-sidebar-accent,var(--radcn-accent))]
    hover:text-[var(--radcn-sidebar-accent-fg,var(--radcn-accent-foreground))]
    disabled:opacity-50 aria-disabled:opacity-50`.
- menu-item: `relative`.
- menu-badge / menu-action / group-action (position): `absolute top-1.5 right-1.5`.
  - trigger / rail / menu-action / group-action (control chrome): `border
    border-[var(--radcn-sidebar-border,var(--radcn-border))]
    rounded-[calc(var(--radcn-radius)-0.125rem)] bg-background text-inherit
    cursor-pointer`.
- rail: + `absolute inset-y-0 [inset-inline-end:-0.25rem] w-2 p-0`.
- input: `w-full border border-[var(--radcn-sidebar-border,var(--radcn-border))]
  rounded-[calc(var(--radcn-radius)-0.125rem)] bg-background p-2` (the collapse hide
  stays in the kept cascade, targeting `[data-radcn-sidebar-input]`).
- separator: `h-px m-2 bg-[var(--radcn-sidebar-border,var(--radcn-border))]`.
- inset: `flex-1 min-w-0 p-4 bg-background`.
- menu-skeleton: `h-8 rounded-[calc(var(--radcn-radius)-0.125rem)]
  [background:linear-gradient(90deg,var(--radcn-muted),var(--radcn-border),var(--radcn-muted))]
  text-transparent`.

### Kept bespoke (repointed to data attrs / the group-label marker)

```css
.radcn-sidebar[data-variant="floating"] [data-radcn-sidebar-inner],
.radcn-sidebar[data-variant="inset"] [data-radcn-sidebar-inner] {
  margin: 0.5rem;
  border: 1px solid var(--radcn-sidebar-border, var(--radcn-border));
  border-radius: var(--radcn-radius);
  background: var(--radcn-sidebar-bg, var(--radcn-muted));
}

.radcn-sidebar-provider[data-state="collapsed"] [data-radcn-sidebar-menu-button] span,
.radcn-sidebar-provider[data-state="collapsed"] [data-radcn-sidebar-input],
.radcn-sidebar-provider[data-state="collapsed"] .radcn-sidebar-group-label {
  display: none;
}
```

Plus `.radcn-fixture-custom-sidebar` (unchanged).

## Why both suites stay green

- `application-shell.spec.ts` asserts the provider/sidebar `data-state`/`data-side`/
  `data-variant`/`data-collapsible` ATTRIBUTES (set by the enhancer JS — unchanged),
  `toBeVisible`/`toContainText`/`toBeDisabled`/`toHaveText` on the header/menu/badge/
  action/skeleton/sub (rendered visible by the base utilities) + `:174` provider
  `radcn-fixture-custom-sidebar` class (kept) + `:175` sidebar bg `rgb(240,253,250)`
  via `bg-[var(--radcn-sidebar-bg,…)]` reading the fixture token. No computed
  collapse-width/hide is asserted.
- The collapse width/margin (own-data-variants setting vars) + the two kept-bespoke
  descendant cascades (clean sole-declaration hide / clean add) reproduce the
  behavior reliably.

## Changes

- `radcn/packages/radcn/src/components/sidebar.tsx`: emit utility-const strings for
  all surfaces; drop the `radcn-sidebar--{variant}` marker; keep the
  `radcn-sidebar-group-label` marker + all data attributes + the menu-button
  `--{variant}`/`--{size}` markers. ASCII/token-free comments.
- `radcn/packages/radcn/src/styles/tokens.css`: remove the migrated `.radcn-sidebar*`
  rules; REPLACE with the two kept-bespoke cascades above (repointed to data attrs);
  KEEP `.radcn-fixture-custom-sidebar`.
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the node formula.

## Verification

1. Both `styles:build` exit 0; the `data-[collapsible=icon]:[--…]` var-sets, the
   `data-[collapsible=offcanvas]:data-[side=right]:[--…]` stacked variants, the
   `[border-inline-end:…]`/`[transition:…,margin_160ms_ease]`/`[background:linear-gradient(…)]`
   utilities compile; no junk ellipsis.
2. All three typechecks pass.
3. `index.ts` byte-identical; no migrated `.radcn-sidebar*` rule remains (only the
   two kept cascades + the fixture); fixture retained.
4. Docs suite green (11) ×2.
5. Fixture suite green (1191) ×2 — incl. `application-shell.spec.ts` (the sidebar
   custom class + bg, the data-state/side/variant/collapsible attributes, expand/
   collapse toggle, keyboard shortcut, the menu/header/footer/inset structure).
6. `git diff --check` clean; `vendor/` untouched; only the expected files changed.

Pass criteria: Sidebar renders from Tailwind utilities; the custom class + bg +
state attributes hold; the collapse (own-variants + the two kept cascades) +
floating/inset reproduce faithfully; BOTH suites green; byte-identical.

Fail criteria: a sidebar assertion regresses; the var-set/stacked variants don't
compile; the collapse/floating drifts; `tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool). Fresh
context: yes.

Findings: the SUBSTANTIVE checks all PASSED — CRUX 1 (the own-variant collapse: the
enhancer sets `data-collapsible`=mode only when collapsed, so `data-[collapsible=icon]`
⟹ collapsed; the var-read-+-variant-set avoids the Exp-41 conflict; the side=right
2-attr stacked variant wins by specificity; `--width`/`--width-icon` set on the
provider inherit to the sidebar), CRUX 3 (the surface mappings exact: `min-h-80`=20rem,
the logical borders, the `[transition:…]`, the menu-button active/hover sharing the
accent bg), CRUX 4 (all assertions are attribute/visibility/text + the bg `:175` via
the token read — unaffected; no computed collapse asserted; dropping the
`--{variant}` marker is safe). The reviewer raised ONE blocker: the FIRST design
relied on Tailwind named groups + a nested `[&_span]:hidden` inside a `group-data`
variant — an UNVERIFIED Tailwind v4 combination. RESOLUTION: the design was revised to
drop named groups entirely and instead keep the two genuinely descendant cascades
BESPOKE, repointed to the kept `data-*` attributes (+ the group-label class marker).
This is reliable precisely because each target has no conflicting base utility (the
hide is a sole `display:none` declaration, not an Exp-47 override; the floating/inset
is a clean add) — so it uses only proven primitives. The reviewer's other notes
(remove the `--{variant}` marker; `:hover`→`hover:`) are incorporated.

Approval result: approved (after the revision) — the own-variant collapse + the two
kept-bespoke descendant cascades (repointed to data attrs) avoid both the Exp-47
override risk and the unverified named-group feature; the mappings + assertions hold.
