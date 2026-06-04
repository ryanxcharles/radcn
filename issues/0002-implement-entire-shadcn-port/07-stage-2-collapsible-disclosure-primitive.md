# Experiment 7: Stage 2 Collapsible Disclosure Primitive

## Description

Continue Stage 2 by porting `collapsible` as the next bounded disclosure
primitive after accordion.

This experiment covers only:

- `collapsible`

It should not port `tabs`, `toggle`, `toggle-group`, `slider`, `avatar`,
`scroll-area`, or `hover-card`. It also should not revisit accordion except for
small shared documentation or style adjustments that are necessary because
collapsible reuses the same native disclosure strategy.

Experiment 6 proved that native `<details>/<summary>` can support RadCN
accordion's simple disclosure behavior, but also found important limits:

- server-rendered root state cannot propagate into arbitrary child items
  without a client/context strategy;
- server-rendered `data-state` is initial state only;
- live visual state should use native selectors such as `details[open]`;
- native `<details>` has no disabled attribute, so disabled disclosure must
  avoid focusable disclosure markup.

This experiment should decide whether `Collapsible` can reuse native details
directly, or whether a small client-state strategy is necessary even for this
single-panel disclosure primitive.

## Changes

Add RadCN source under `packages/radcn/src/components/collapsible.tsx`.

The exported component family should include:

- `Collapsible`
- `CollapsibleTrigger`
- `CollapsibleContent`

The public API should preserve shadcn/ui's author-facing shape where practical:

- `Collapsible` accepts `open` for initial open state;
- `Collapsible` accepts `disabled`;
- `CollapsibleTrigger` and `CollapsibleContent` expose slot hooks and children;
- `Collapsible` exposes stable state and disabled hooks for styling;
- if root-to-child state propagation cannot be implemented without context or
  client state, the experiment must document the exact divergence and use
  explicit props on the relevant child components instead of pretending the
  root controls them.

Update package exports in `packages/radcn/package.json` and public exports in
`packages/radcn/src/index.ts`.

Extend RadCN styles and tokens for:

- collapsible root, trigger, icon, content, and content inner hooks;
- open, closed, disabled, and customization states;
- stable `radcn-*` classes and `data-radcn-*` attributes;
- state attributes such as `data-state` and `data-disabled`;
- visible focus treatment for the interactive trigger.

The implementation should prefer native `<details>/<summary>` if it preserves
the required behavior:

- default closed state;
- default open state;
- pointer toggling;
- keyboard toggling;
- trigger and content semantics;
- disabled non-interactive behavior;
- customization hooks.

If native details cannot preserve the expected shadcn/ui behavior, add the
smallest client-state strategy needed and document why accordion and
collapsible differ.

Add candidate fixtures that import from `radcn`, not fixture-local
placeholders.

Add React Router reference fixtures with shadcn/ui-inspired local markup for
the same scenarios. The reference may use Radix if already available, or local
markup that preserves the visible and semantic surfaces needed for comparison.

Shared scenarios for this experiment should include:

- `collapsible/default`
- `collapsible/open`
- `collapsible/disabled`
- `collapsible/custom-token`

Add component-specific Playwright checks proving:

- the candidate app renders real RadCN collapsible source;
- default closed and default open states;
- pointer toggling behavior;
- keyboard toggling behavior;
- disabled behavior cannot be pointer- or keyboard-toggled;
- stable root/trigger/content/icon hooks;
- customization probes can override documented tokens or class hooks;
- any root-to-child propagation limitation is either solved or documented as an
  approved divergence.

Document approved divergences from upstream shadcn/ui/Radix behavior. At
minimum, the docs must answer:

- whether RadCN collapsible uses native `<details>/<summary>` or client state;
- how open, disabled, and trigger/content state map to Remix 3;
- how state attributes and open/closed styling work without React state;
- whether the accordion item-level state lessons apply directly;
- whether collapsible changes the plan for `tabs`.

Add issue-level learnings when the experiment discovers a reusable disclosure
strategy, native limitation, keyboard test pattern, or client-state rule.

## Verification

The experiment passes if:

1. RadCN source exists for the collapsible family.
2. `packages/radcn` exports collapsible from a package subpath and the root
   index.
3. The Remix 3 candidate app imports collapsible components from RadCN source.
4. Shared scenarios include `default`, `open`, `disabled`, and `custom-token`.
5. Reference and candidate fixture routes exist for every shared collapsible
   scenario.
6. `pnpm radcn:typecheck` passes.
7. `pnpm fixtures:candidate:typecheck` passes.
8. `pnpm fixtures:reference:typecheck` passes.
9. `pnpm fixtures:artifacts` passes and captures paired artifacts for all
   shared collapsible scenarios.
10. Component-specific checks prove disclosure semantics, keyboard/pointer
    interaction, disabled behavior, state hooks, and customization hooks.
11. Documentation explains the collapsible source shape, disclosure strategy,
    state hooks, native or client-state divergences, and remaining Stage 2
    questions.
12. Any reusable discovery needed by later disclosure components is added to
    the issue `## Learnings` section with evidence.
13. No files under `vendor/` are modified.
14. Independent completion review approves the result or findings are fixed and
    recorded.

This experiment does not complete Stage 2. It should close the simple
disclosure pair after accordion and clarify whether `tabs` needs a separate
client-state and roving-focus model.

## Design Review

Independent AI design review was performed by subagent `Ramanujan`, which
approved the design with no required fixes.

The review confirmed that the experiment is scoped only to `collapsible`, does
not design future experiments, builds directly on Experiment 6 disclosure
learnings, requires RadCN source and exports, candidate imports from `radcn`,
reference fixtures, scenarios, Playwright checks, documentation, issue
learnings, vendor cleanliness, and completion review, and frames the native
`<details>/<summary>` direction and root-to-child state propagation limitation
carefully enough for shadcn/Radix parity risks.

## Result

**Result:** Pass

Experiment 7 implemented the RadCN collapsible component family:

- `Collapsible`
- `CollapsibleTrigger`
- `CollapsibleContent`

RadCN source lives at `packages/radcn/src/components/collapsible.tsx`. The
package now exports `radcn/collapsible` and root exports for the component
family and types.

The implementation uses native `<details>` and `<summary>` for enabled
collapsibles. Unlike accordion, a single-panel collapsible can map root `open`
directly to the native `open` attribute, so initial open behavior is real root
behavior. Live visual state still uses `details[open]`; server-rendered
`data-state` records initial state only.

Disabled collapsibles use explicit disabled props at each affected layer
because native `<details>` has no disabled attribute and the root cannot
rewrite arbitrary children in this server-rendered shape. `Collapsible disabled`
renders non-details wrapper markup, `CollapsibleTrigger disabled` renders an
`aria-disabled` non-summary trigger, and `CollapsibleContent disabled` hides
content. Tests prove this disabled markup is non-interactive by pointer and
keyboard.

Shared collapsible scenarios now include:

- `collapsible/default`
- `collapsible/open`
- `collapsible/disabled`
- `collapsible/custom-token`

Verification commands:

```bash
pnpm radcn:typecheck
pnpm fixtures:candidate:typecheck
pnpm fixtures:reference:typecheck
pnpm playwright test -c fixtures/playwright.config.ts fixtures/tests/collapsible.spec.ts
pnpm fixtures:artifacts
```

All verification commands passed. `pnpm fixtures:artifacts` ran 199 Playwright
tests successfully.

The generated artifact manifest contains:

- 170 screenshot entries;
- 85 shared scenarios;
- 4 collapsible scenarios;
- paired `reference` and `candidate` artifacts;
- reference app on port 4601 and candidate app on port 4602.

No files under `vendor/` were modified.

## Completion Review

Independent AI completion review was performed by subagent `Aquinas`.

The first review result was **Fail**. Required findings were:

- disabled root behavior was overstated because root `disabled` did not
  automatically rewrite trigger/content children;
- disabled keyboard non-interaction was not proven;
- docs and result text were too broad about disabled behavior;
- the Issue 2 experiment index still marked Experiment 7 as `Designed` before
  completion approval.

Those findings were fixed:

- docs and result notes now state that disabled behavior is explicit at the
  root, trigger, and content layers in the current server-rendered shape;
- tests now prove enabled Space toggling and disabled Enter/Space
  non-interaction;
- the issue index will be updated to `Pass` only after completion re-review
  approval.

Independent AI completion re-review by subagent `Aquinas` approved the fixed
result with **Pass** and no remaining required fixes.

## Conclusion

Experiment 7 closes the simple native disclosure pair after accordion.
Collapsible can reuse native details while avoiding accordion's root-to-item
state propagation problem because a single root owns the native `open` state.

Tabs should not reuse this strategy directly. They need a separate state and
keyboard model for tablist semantics, roving focus, selected tab state, and
panel relationships.
