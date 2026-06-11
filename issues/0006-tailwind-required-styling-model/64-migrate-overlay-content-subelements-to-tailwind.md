# Experiment 64: Migrate overlay-family content sub-elements to Tailwind utilities

## Description

The first batch of the genuine remaining debt recorded in the README "Migration Status
Audit": the overlay family's CONTENT sub-elements (header / footer / title /
description) + the AlertDialog media badge. These are pure layout/typography
(grid/flex/gap/margin/font), component-emitted ONLY (verified: zero raw-class sites in
fixtures/docs — no Button-style blast radius), and have NO computed (`toHaveCSS`)
assertions (only class-presence + structure). Triggers and close buttons are EXCLUDED
(they couple to the deferred Button keystone, `radcn-button--{variant}`) — a later
Button-coupled experiment.

The marker classes (`radcn-dialog-header`, etc.) are KEPT alongside the utility consts
(zero dropped-class risk; a few are referenced as raw-class hooks elsewhere, e.g.
Command's dialog-header).

### Exact utility mapping

Dialog + Sheet (identical):
- header: `grid gap-1.5`.
- footer: `flex flex-row-reverse gap-2`.
- title: `m-0 font-semibold text-[1.125rem] leading-[1.25] [font-family:var(--radcn-font)]`.
- description: `m-0 text-muted-foreground text-[0.875rem] leading-[1.5] [font-family:var(--radcn-font)]`.

Drawer:
- header: `grid gap-1.5 [padding:1rem_1rem_0.5rem] text-center`.
- footer: `grid gap-2 mt-auto p-4`.
- title: `m-0 text-[var(--radcn-drawer-title-fg,var(--radcn-foreground))] font-semibold
  text-[1.125rem] leading-[1.2] [font-family:var(--radcn-font)]`.
- description: `m-0 text-muted-foreground text-[0.875rem] leading-[1.4] [font-family:var(--radcn-font)]`.

Popover:
- header: `grid gap-1`.
- title: `m-0 font-semibold text-[0.9375rem] leading-[1.3] [font-family:var(--radcn-font)]`.
- description: `m-0 text-muted-foreground text-[0.8125rem] leading-[1.45] [font-family:var(--radcn-font)]`.

AlertDialog (header/footer/title/description share Sheet's COMBINED rules
`.radcn-alert-dialog-header, .radcn-sheet-header { … }` — so they are migrated TOO,
with the SAME values as Dialog/Sheet, emitted on `alert-dialog.tsx`; the marker
classes are kept so the kept `[data-radcn-alert-dialog-content][data-size="sm"]
.radcn-alert-dialog-footer { display: grid; grid-template-columns: 1fr 1fr }` cascade
still matches and reliably overrides the migrated footer's `flex` — unlayered
`radcnStyles` beats `@layer utilities`, probed in Exp 63):
- media: `grid w-10 h-10 place-items-center rounded-[999px]
  bg-[var(--radcn-alert-dialog-media-bg,var(--radcn-secondary))]
  text-[var(--radcn-alert-dialog-media-fg,var(--radcn-foreground))] font-bold text-base
  leading-none [font-family:var(--radcn-font)]`.

(`gap-1.5`=0.375rem, `gap-1`=0.25rem, `gap-2`=0.5rem, `w-10/h-10`=2.5rem, `p-4`=1rem,
`text-base`=1rem.)

## Why both suites stay green

These sub-elements have no `toHaveCSS` assertions; the suites assert their
class-presence + structural visibility, which the kept marker classes + the utilities
preserve. The values map 1:1 to the removed CSS.

## Changes

- `dialog.tsx`, `sheet.tsx`, `drawer.tsx`, `popover.tsx`, `alert-dialog.tsx`: emit
  utility-const strings for header/footer/title/description (+ media for alert-dialog),
  keeping the marker classes. ASCII/token-free comments.
- `radcn/packages/radcn/src/styles/tokens.css`: remove the migrated rules — the
  Dialog standalone `{header,footer,title,description}`, the Drawer standalone
  `{header,footer,title,description}`, the Popover `{header,title,description}`, the
  `.radcn-alert-dialog-media`, AND the four COMBINED `.radcn-alert-dialog-X,
  .radcn-sheet-X` header/footer/title/description rules. KEEP the
  `[data-radcn-alert-dialog-content][data-size="sm"] .radcn-alert-dialog-footer`
  grid cascade (alert-dialog footer keeps its marker).
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the node formula.

## Verification

1. Both `styles:build` exit 0; the `[padding:1rem_1rem_0.5rem]`, `rounded-[999px]`,
   `text-[1.125rem]`, `bg-[var(--radcn-alert-dialog-media-bg,…)]` utilities compile;
   no junk ellipsis.
2. All three typechecks pass.
3. `index.ts` byte-identical; the 16 migrated rules removed.
4. Docs suite green (11) ×2.
5. Fixture suite green (1191) ×2 — incl. `dialog.spec.ts`, `sheet.spec.ts` (via
   `positioned-overlays`/app shells), `drawer.spec.ts`, the popover + alert-dialog
   specs (titles/descriptions render, structure intact).
6. `git diff --check` clean; `vendor/` untouched; only the expected files changed.

Pass criteria: the overlay content sub-elements render from Tailwind utilities;
structure + class markers hold; BOTH suites green; byte-identical. Reduces the genuine
visual-debt from 39 toward the Button-coupled remainder.

Fail criteria: an overlay spec regresses; a sub-element utility doesn't compile;
`tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool). Fresh
context: yes.

Findings: APPROVED, no Blocker/Major. The reviewer verified all 16 rules map 1:1 to
the proposed utilities (gap/flex/font/margin/place-items/rounded values exact); CRUX 2
— the classes are component-emitted ONLY (zero raw-class sites in fixtures/docs; no
Button-style blast radius; Command's dialog-header is a separate sr-only utility const,
not a reference); CRUX 3 — NO `toHaveCSS` assertions on any of these sub-elements
(specs assert class-presence/visibility/text only), so the suites hold. It confirmed
the Sheet + AlertDialog header/footer/title/description share COMBINED selector rules
— so migrating them covers AlertDialog too (the design was updated to emit the
utilities on `alert-dialog.tsx` as well and keep the `[data-size=sm]
.radcn-alert-dialog-footer` grid cascade bespoke, which reliably overrides the
migrated footer's flex per the Exp-63 unlayered-beats-layer probe). The marker classes
are kept (zero dropped-class risk).

Approval result: approved — the layout/typography mappings are exact, no blast radius,
no computed assertions; the combined Sheet/AlertDialog rules are migrated on both
components with the size-state footer cascade kept.
