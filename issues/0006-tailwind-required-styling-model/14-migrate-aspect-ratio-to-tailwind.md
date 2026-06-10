# Experiment 14: Migrate AspectRatio to Tailwind utilities

## Description

Migrate AspectRatio off bespoke `radcn-aspect-ratio` CSS. shadcn v4's
AspectRatio is an unstyled Radix wrapper; RadCN's documented equivalent is
"dependency-free CSS aspect-ratio markup" (docs say
`Radix AspectRatio maps to dependency-free CSS aspect-ratio markup`). So the
faithful RadCN AspectRatio is a `<div>` that sets `aspect-ratio` inline (its
existing behavior) and is otherwise UNSTYLED — appearance (radius, background,
overflow, sizing) is consumer-owned via the `class`/`style` props, exactly as
shadcn expects.

Today RadCN's component adds a `radcn-aspect-ratio` class whose bespoke CSS
provides `display:block; width:100%; overflow:hidden; border-radius; background;`
plus a `> * { width:100%; height:100% }` child rule. The consumers
(fixtures/docs) already supply radius/background via `rounded-lg bg-muted`
classes, width via inline `style`, and child sizing via the image's inline
`width/height:100%`. The two base-provided properties NOT already consumer-set
are `overflow: hidden` (asserted in both suites) and `width: 100%` (every usage
overrides it with an inline width). So the migration removes the bespoke CSS,
makes the component unstyled, and moves `overflow-hidden` to the consumer call
sites where it is asserted.

This is a multi-file but precisely scoped migration (component, tokens, one
fixture, one fixture test assertion, the docs preview, and the docs example
source string).

## Why both suites stay green (with documented consumer/test edits)

Fixture demo assertions (`static-display.spec.ts:71-82`):

- `toHaveClass(/radcn-aspect-ratio/)` (line 75): the migrated component emits no
  such class. This assertion is REMOVED; the root is still located by
  `[data-radcn-aspect-ratio]` (retained), and the `rounded-lg`/`bg-muted` class
  assertions remain (consumer classes).
- `rounded-lg` / `bg-muted` / `width: 420px` / `background-color:
  rgb(39,39,42)` / `border-radius: 6px`: from consumer classes + inline width —
  unaffected.
- `height: 236.25px`: from the inline `aspect-ratio: 16 / 9` (still set by the
  component) + width 420 — unaffected.
- `overflow: hidden` (line 80): currently from the base. The fixture demo
  AspectRatio class gains `overflow-hidden`, so it still computes `hidden`.

Docs assertions (`coverage.spec.ts:765-778`): same shape — `overflow: hidden`
(line 768) is preserved by adding `overflow-hidden` to the docs preview
AspectRatio class; all other assertions are on consumer classes / the image and
are unaffected.

No `--radcn-aspect-ratio*` custom token exists. No raw `radcn-aspect-ratio`
class string is used as a styling hook beyond the component's own emission.

## Changes

- `radcn/packages/radcn/src/components/aspect-ratio.tsx`: drop the
  `radcn-aspect-ratio` base class — emit `classes(className)` (unstyled; only
  consumer classes). Keep `data-radcn-aspect-ratio`, the inline
  `aspect-ratio:${ratio}` style merge, `ratio`, `style`, and children.
- `radcn/packages/radcn/src/styles/tokens.css`: remove `.radcn-aspect-ratio`
  and `.radcn-aspect-ratio > *` (replace with a migration comment, no literal
  selector).
- `radcn/packages/radcn/src/styles/index.ts`: regenerate via the standard
  formula.
- `radcn/fixtures/candidate-remix/app/fixtures/static-display.tsx`: add
  `overflow-hidden` to the demo AspectRatio class string (the only fixture
  asserting overflow).
- `radcn/fixtures/tests/static-display.spec.ts`: remove the
  `toHaveClass(/radcn-aspect-ratio/)` assertion (line 75).
- `radcn/apps/docs/app/content/components.tsx`: add `overflow-hidden` to the
  rendered docs preview AspectRatio class (the `radcn-docs-aspect-ratio-demo`
  one), AND to the user-facing `aspectRatioDemoSource` example string, so the
  documented example stays correct under the now-unstyled component.

Expected git status: those six files plus this experiment file and the Issue 6
README index + Learnings. Both generated CSS untracked.

## Verification

1. Both `styles:build` exit 0.
2. All three typechecks pass.
3. `index.ts` byte-identical to `tokens.css`; no `.radcn-aspect-ratio` rule
   remains; the component emits no `radcn-aspect-ratio` class.
4. Docs suite green (11), run twice — incl. the aspect-ratio `overflow: hidden`
   and image assertions.
5. Fixture suite green (1191), run twice — incl. the aspect-ratio demo
   assertions (with the class-presence assertion removed and `overflow: hidden`
   now from the consumer class).
6. `git diff --check` clean; `vendor/` untouched; generated CSS untracked; only
   the expected files changed.

Pass criteria: AspectRatio is unstyled (no `radcn-aspect-ratio` class/CSS);
`data-radcn-aspect-ratio` + inline aspect-ratio intact; both suites green and
stable; the `overflow: hidden` assertions pass via consumer `overflow-hidden`;
`tokens.css`/`index.ts` byte-identical; the docs example source string stays
consistent with the rendered preview.

Fail criteria: any aspect-ratio assertion regresses beyond the removed
class-presence one; a usage relying on the base `width:100%`/child-sizing
breaks; `tokens.css`/`index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given `AGENTS.md`, the issue README, this experiment file,
and read access to referenced sources)

Findings: two Minor (advisory), no Blocker/Major.

- Minor (advisory): explicitly confirm `overflow-hidden` generates in both
  Tailwind pipelines. Covered by verification step 1 (`styles:build` + the
  suite assertions); `overflow-hidden` is a Tailwind default utility and the
  `@source` scanning (Exp 4/6) covers both consumer call sites.

The reviewer confirmed: `classes(className)` with undefined className yields a
valid (empty) class attribute; `.radcn-aspect-ratio`/`> *` have no
cross-component dependents; ALL aspect-ratio usages set width inline (base
`width:100%` removal safe) and child sizing is inline/own-CSS (base `> *`
removal safe); every fixture+docs assertion survives except the removed
`toHaveClass(/radcn-aspect-ratio/)` (line 75), with `overflow: hidden`
preserved by adding `overflow-hidden` to the fixture demo and docs preview
classes; the component still sets the inline `aspect-ratio` (so `height:
236.25px` holds); the docs `radcn-docs-aspect-ratio-demo` class is a docs
fixture class (retained), not the component's; and no test asserts the
`aspectRatioDemoSource` string content (so updating the user-facing example is
safe and correct). Verdict: APPROVED.

Approval result: approved with no blockers (advisory minors covered by
verification).
