# Experiment 3: Fix the dialog close-button positioning collision

## Description

Running the full fixture Playwright suite as a baseline for this issue
surfaced three deterministic failures (recorded in this issue's scope):

- `tests/dialog.spec.ts` — "edit profile" composition
- `tests/dialog.spec.ts` — "share link" composition
- `tests/drawer.spec.ts` — "desktop Dialog and mobile Drawer branches"

All three fail the same way: a footer close button ("Cancel"/"Close") never
receives the click. The Playwright actionability log is decisive — it is not a
stability/animation problem, it is pointer interception:

```
- element is visible, enabled and stable
- scrolling into view if needed
- done scrolling
- <span aria-hidden="true">x</span> from
  <button aria-label="Close" data-radcn-dialog-close
   class="radcn-dialog-close radcn-dialog-close--icon"> subtree intercepts pointer events
```

Root cause: the base class `.radcn-dialog-close` in
`radcn/packages/radcn/src/styles/tokens.css` carries icon-button-only
geometry — `position: absolute; top: 0.75rem; right: 0.75rem; width: 2rem;
height: 2rem` — and `DialogClose` always emits that base class. So a footer
`<DialogClose class="radcn-button radcn-button--outline">Cancel</DialogClose>`
is rendered as a 2rem square absolutely positioned at the content's top-right,
directly underneath the auto-rendered icon close button (which has the same
base class plus a `--icon` modifier that defines no rules of its own). The two
buttons occupy the same box; the later-painted icon button intercepts every
click intended for the footer button, and the test times out.

This is also a latent visual bug independent of the tests: any footer
`DialogClose` is mis-rendered as a transparent top-right square instead of the
button its author classes describe.

The sibling Sheet component already models the correct structure:

```css
.radcn-sheet-close { cursor: pointer; }
.radcn-sheet-close--icon { position: absolute; top: 0.75rem; right: 0.75rem;
  width: 2rem; height: 2rem; ... }
```

i.e. the base close class is a minimal behavior reset, and all icon geometry
lives on the `--icon` modifier. Sheet tests pass; dialog tests fail; the fix
is to bring the dialog close classes into parity with the sheet pattern.

Scope: this is a bespoke `radcn-*` styling correction, squarely inside Issue
6's mandate to fix and migrate RadCN's styling. It is intentionally a styling
fix only — no component markup, behavior, or API changes, and no Tailwind
migration of these components (that remains future work). It restores the
full fixture suite to green, a completion criterion for this issue.

## Background: the styles source of truth

`radcn/packages/radcn/src/styles/tokens.css` is the editable stylesheet.
`radcn/packages/radcn/src/styles/index.ts` exports `radcnStyles`, the string
the docs app and fixtures inject as an inline `<style>` on every page. The
two are byte-identical and kept in sync by hand (there is no build script):
`index.ts` content equals
`"export const radcnStyles = " + JSON.stringify(tokensCss) + "\n"`. Any edit
to `tokens.css` must be mirrored into `index.ts` by that exact formula, or the
runtime pages will not pick up the change. This experiment regenerates
`index.ts` programmatically from `tokens.css` to guarantee they stay
identical.

## Changes

- `radcn/packages/radcn/src/styles/tokens.css`:
  - Reduce `.radcn-dialog-close` to the minimal behavior reset, matching
    `.radcn-sheet-close`:

    ```css
    .radcn-dialog-close {
      cursor: pointer;
    }
    ```

  - Add a `.radcn-dialog-close--icon` rule carrying exactly the geometry and
    appearance that previously lived on the base, matching
    `.radcn-sheet-close--icon`:

    ```css
    .radcn-dialog-close--icon {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      display: inline-flex;
      width: 2rem;
      height: 2rem;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: var(--radcn-radius);
      background: transparent;
      color: var(--radcn-muted-foreground);
      font: 600 1rem/1 var(--radcn-font);
    }
    ```

  - Move the hover rule from base to the icon modifier:
    `.radcn-dialog-close:hover { ... }` becomes
    `.radcn-dialog-close--icon:hover { ... }` (same declarations).
  - Leave the existing focus-visible rule
    (`.radcn-dialog-trigger:focus-visible, .radcn-dialog-close:focus-visible`)
    unchanged: a focus ring on every close button, icon or footer, is correct.
- `radcn/packages/radcn/src/styles/index.ts`:
  - Regenerate from the edited `tokens.css` using the exact formula above, so
    the two files stay byte-identical.

No component source changes: `DialogContent` already renders the auto close
button with `class="radcn-dialog-close radcn-dialog-close--icon"`, so the icon
button keeps its positioning, and footer `DialogClose` buttons (base class
only, plus author `radcn-button` classes) drop back into normal flow and
render as their author classes intend.

- `radcn/fixtures/tests/dialog.spec.ts`:
  - In the "edit profile" test, add two explicit assertions after the dialog
    opens, proving the fix directly rather than only via click success
    (mirroring the sheet precedent at
    `tests/modal-variants.spec.ts:171`): the footer Cancel button
    (`[data-radcn-dialog-close].radcn-button`) has `position: static`, and
    the icon close button
    (`.radcn-fixture-dialog-demo-content > [data-radcn-dialog-close][aria-label="Close"]`)
    has `position: absolute` and class `radcn-dialog-close--icon` (no
    regression of the icon button). These assertions fail on the current code
    and pass after the fix.

Expected git status for the result commit: `tokens.css`, `index.ts`,
`radcn/fixtures/tests/dialog.spec.ts`, this experiment file, and the issue
README index line. No other files.

## Verification

From the repo root:

1. `pnpm radcn:typecheck` — passes (string-only change to `index.ts`).
2. Regeneration integrity check: a one-off node check confirms
   `index.ts === "export const radcnStyles = " + JSON.stringify(tokensCss) + "\n"`,
   proving the two style files are byte-identical after the edit.
3. `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts tests/dialog.spec.ts tests/drawer.spec.ts`
   — the three previously failing tests now pass, including the new explicit
   `position: static` (footer Cancel) and `position: absolute` (icon close)
   assertions, with no regression in the other dialog/drawer cases.
4. `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts tests/modal-variants.spec.ts tests/menu-overlays.spec.ts`
   — close-button-adjacent suites still pass. `modal-variants.spec.ts` is
   where the sheet close-button behavior is tested (it asserts the sheet icon
   close button stays `position: absolute` at line 171, guarding the
   untouched sheet pattern); `menu-overlays.spec.ts` also uses footer
   `DialogClose` buttons. (There is no `tests/sheet.spec.ts` in this repo.)
5. `pnpm exec playwright test -c radcn/fixtures/playwright.config.ts` — the
   FULL fixture suite is green (0 failures). This is the issue-level gate.
6. `git diff --check` — clean. 7. `git status --short vendor/` — empty.

Pass criteria (all must hold):

- The three named tests pass and the full fixture suite reports 0 failures.
- The footer Cancel/Close buttons are no longer absolutely positioned, proven
  explicitly by the new `toHaveCSS('position', 'static')` assertion (not only
  by the clicks landing), while the icon close button is still
  `position: absolute`.
- `tokens.css` and `index.ts` remain byte-identical.
- Typecheck clean; hygiene checks clean; no files outside the listed set
  change.

Fail criteria (any one fails the experiment):

- Any fixture spec fails after the change (a regression, e.g. the icon close
  button losing its position, or a previously passing dialog assertion about
  the footer button's box breaking).
- `tokens.css` and `index.ts` diverge.

## Design Review

Reviewer: fresh Claude subagent (Explore agent, spawned via the Agent tool by
the Claude implementation session)
Fresh context: yes (given only `AGENTS.md`, the issue README, and this
experiment file, plus read access to referenced repository sources)

Round 1 findings (REJECTED):

- Blocker: verification referenced `tests/sheet.spec.ts`, which does not exist
  in this repo. Fixed: sheet close-button behavior is tested in
  `tests/modal-variants.spec.ts` (which asserts the sheet icon close stays
  `position: absolute` at line 171); the command now lists
  `modal-variants.spec.ts` and `menu-overlays.spec.ts`, and notes no
  `sheet.spec.ts` exists.
- Minor: the "footer buttons no longer absolutely positioned" pass criterion
  rested only on clicks landing. Fixed: the design now adds explicit
  `toHaveCSS('position', 'static')` (footer Cancel) and
  `toHaveCSS('position', 'absolute')` + `radcn-dialog-close--icon` (icon
  close) assertions to `tests/dialog.spec.ts`, mirroring the modal-variants
  sheet precedent, and `dialog.spec.ts` is added to the expected changed
  files.

The reviewer independently verified every technical claim: the base
`.radcn-dialog-close` absolute geometry (tokens.css ~2596), the sheet split
(~2786), `DialogContent`'s `radcn-dialog-close radcn-dialog-close--icon` class
and footer `DialogClose`'s base-only class (dialog.tsx), the absence of any
existing `.radcn-dialog-close--icon` rule, the byte-identical
`tokens.css`/`index.ts` relationship and exact regeneration formula, and that
no currently-passing test asserts the footer button's box geometry (so the
fix regresses nothing).

Round 2 (re-review of the two fixes by a fresh Claude subagent): confirmed
both findings resolved and no new blockers. The reviewer verified the
replacement test files exist, that `modal-variants.spec.ts:171` guards the
sheet icon pattern, that the new dialog.spec.ts selectors match the rendered
markup, and that both new assertions are logically correct after the fix
(footer Cancel → `static`, icon close → `absolute`). Verdict: APPROVED.

Approval result: approved (round 2). No blocker findings remain.
