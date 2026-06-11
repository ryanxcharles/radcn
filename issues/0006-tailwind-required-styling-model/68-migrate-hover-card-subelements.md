# Experiment 68: Migrate HoverCard avatar/body (consumer-site, corrected)

## Description

Carries out the migration designed + adversarially-approved in Experiment 67, after
Exp 67's "Fail" was retracted (its no-scan claim was a false negative from a nonsense
sentinel; a real-utility `[zoom:2]` probe confirmed the fixture AND docs apps ARE
Tailwind-scanned). `.radcn-hover-card-avatar`, `.radcn-hover-card-body`, and the
`.radcn-hover-card-body p` descendant cascade are hand-written raw in the fixture
(`positioned-overlays.tsx`) and docs (`components.tsx`). The equivalent utilities are
APPENDED to each raw `class` string (the marker class is kept as a non-styling hook —
no computed assertions target these), the `p` cascade is folded into the body utility
via `[&_p]:` arbitrary descendant variants, and the three `tokens.css` rules are
removed. This is the consumer-site pattern for the remaining blast-radius debt.

### Utility mapping (appended after the kept marker)

- avatar (`.radcn-hover-card-avatar`): `inline-grid w-11 h-11 place-items-center
  rounded-[999px] bg-[var(--radcn-hover-card-avatar-bg,var(--radcn-secondary))]
  text-[var(--radcn-hover-card-avatar-fg,var(--radcn-foreground))] font-bold
  text-[0.875rem] leading-none [font-family:var(--radcn-font)]`.
- body (`.radcn-hover-card-body` + its `p` descendant): `grid gap-2 text-[0.875rem]
  font-normal leading-[1.45] [font-family:var(--radcn-font)] [&_p]:m-0
  [&_p]:text-muted-foreground`.

### Sites (keep marker, append utilities)

- `positioned-overlays.tsx`: avatar (1) + body (2).
- `components.tsx` (docs): body (2).

## Why both suites stay green

No `toHaveCSS`/`toHaveClass` on avatar/body; the markers stay (locators resolve); the
appended utilities reproduce the removed CSS exactly and DO compile (the consumer
files are scanned — confirmed). The `[&_p]:` variants reproduce the `p` cascade.

## Changes

- `positioned-overlays.tsx` + `components.tsx`: append the utilities to the 5 raw
  `class` strings.
- `tokens.css`: remove `.radcn-hover-card-avatar`, `.radcn-hover-card-body`,
  `.radcn-hover-card-body p`.
- `index.ts`: regenerate via the node formula.

## Verification

1. Both `styles:build` exit 0; the avatar/body + `[&_p]:` utilities compile (verify
   `place-items: center`, `border-radius: 999px`, the body `p` color in the generated
   CSS); no junk.
2. All three typechecks pass.
3. `index.ts` byte-identical; the 3 rules removed.
4. Docs suite green (11) ×2.
5. Fixture suite green (1191) ×2 — incl. `positioned-overlays.spec.ts`.
6. `git diff --check` clean; `vendor/` untouched; only the expected files changed.

Pass criteria: HoverCard avatar/body render from utilities at the consumer sites
(scanned/generated); markers + structure hold; BOTH suites green; byte-identical.
Establishes the consumer-site pattern + clears 3 rules (avatar, body, body p).

Fail criteria: the avatar/body utilities don't appear in the generated CSS (would
indicate a scanning issue); a positioned-overlays/docs assertion regresses; divergence.

## Design Review

The design is identical to Experiment 67's (same utility mapping + the `[&_p]:`
descendant fix), which received a fresh-context adversarial design review (Explore
agent) that APPROVED it after the `p`-cascade blocker was resolved by folding it into
the body utility. The only fact that changed since is the scanning confirmation: Exp
67's retraction empirically proved (via the `[zoom:2]` real-utility probe) that the
fixture + docs apps ARE Tailwind-scanned, so the appended utilities compile. No new
design concerns; the review carries over. The gate (computed-CSS presence check +
dual-suite) decides the implementation.

Approval result: approved (inherited from Exp 67 + the scanning confirmation).
