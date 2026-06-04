# Stage 2 Audit

Stage 2 is complete as of Experiment 11.

This audit covers the Stage 2 list from the issue spine:

- `accordion`
- `collapsible`
- `tabs`
- `toggle`
- `toggle-group`
- `checkbox`
- `radio-group`
- `switch`
- `slider`
- `progress`
- `avatar`
- `scroll-area`
- `hover-card` disposition

## Component Evidence

| Component | Experiment | Source | Fixtures | Focused checks | Docs and notes |
| --- | --- | --- | --- | --- | --- |
| `checkbox` | [Experiment 5](05-stage-2-native-state-and-progress-primitives.md) | `packages/radcn/src/components/checkbox.tsx` | `fixtures/candidate-remix/app/fixtures/native-state.tsx`, `fixtures/reference-react-router/app/fixtures/native-state.tsx` | `fixtures/tests/native-state.spec.ts` | Native checkbox with stable visual hooks; indeterminate state is server-exposed through `aria-checked` and data hooks. |
| `radio-group` | [Experiment 5](05-stage-2-native-state-and-progress-primitives.md) | `packages/radcn/src/components/radio-group.tsx` | `fixtures/candidate-remix/app/fixtures/native-state.tsx`, `fixtures/reference-react-router/app/fixtures/native-state.tsx` | `fixtures/tests/native-state.spec.ts` | Native radio inputs own form and keyboard behavior. |
| `switch` | [Experiment 5](05-stage-2-native-state-and-progress-primitives.md) | `packages/radcn/src/components/switch.tsx` | `fixtures/candidate-remix/app/fixtures/native-state.tsx`, `fixtures/reference-react-router/app/fixtures/native-state.tsx` | `fixtures/tests/native-state.spec.ts` | Native checkbox with switch role and live CSS `:has(input:checked)` styling. |
| `progress` | [Experiment 5](05-stage-2-native-state-and-progress-primitives.md) | `packages/radcn/src/components/progress.tsx` | `fixtures/candidate-remix/app/fixtures/native-state.tsx`, `fixtures/reference-react-router/app/fixtures/native-state.tsx` | `fixtures/tests/native-state.spec.ts` | Native progress semantics with styled indicator hooks. |
| `accordion` | [Experiment 6](06-stage-2-accordion-disclosure-primitive.md) | `packages/radcn/src/components/accordion.tsx` | `fixtures/candidate-remix/app/fixtures/accordion.tsx`, `fixtures/reference-react-router/app/fixtures/accordion.tsx` | `fixtures/tests/accordion.spec.ts` | Native `<details>/<summary>` strategy; single exclusivity requires item-level shared `name`; disabled items use non-interactive markup. |
| `collapsible` | [Experiment 7](07-stage-2-collapsible-disclosure-primitive.md) | `packages/radcn/src/components/collapsible.tsx` | `fixtures/candidate-remix/app/fixtures/collapsible.tsx`, `fixtures/reference-react-router/app/fixtures/collapsible.tsx` | `fixtures/tests/collapsible.spec.ts` | Single-panel disclosure maps directly to native `<details open>`. |
| `tabs` | [Experiment 8](08-stage-2-tabs-state-and-keyboard-primitive.md) | `packages/radcn/src/components/tabs.tsx` | `fixtures/candidate-remix/app/fixtures/tabs.tsx`, `fixtures/reference-react-router/app/fixtures/tabs.tsx` | `fixtures/tests/tabs.spec.ts` | `enhanceTabs()` coordinates selected state, ARIA relationships, roving focus, disabled skipping, and manual/automatic activation. |
| `toggle` | [Experiment 9](09-stage-2-toggle-and-toggle-group-primitives.md) | `packages/radcn/src/components/toggle.tsx` | `fixtures/candidate-remix/app/fixtures/toggle.tsx`, `fixtures/reference-react-router/app/fixtures/toggle.tsx` | `fixtures/tests/toggle.spec.ts` | Native button with `enhanceToggle()` for live pressed state; not a form-submitting value. |
| `toggle-group` | [Experiment 9](09-stage-2-toggle-and-toggle-group-primitives.md) | `packages/radcn/src/components/toggle-group.tsx` | `fixtures/candidate-remix/app/fixtures/toggle.tsx`, `fixtures/reference-react-router/app/fixtures/toggle.tsx` | `fixtures/tests/toggle.spec.ts` | `enhanceToggleGroup()` coordinates single/multiple pressed state and roving focus. |
| `slider` | [Experiment 10](10-stage-2-slider-form-control-primitive.md) | `packages/radcn/src/components/slider.tsx` | `fixtures/candidate-remix/app/fixtures/slider.tsx`, `fixtures/reference-react-router/app/fixtures/slider.tsx` | `fixtures/tests/slider.spec.ts` | Native single-thumb horizontal range with `enhanceSlider()` for reflected value metadata; multi-thumb and vertical behavior deferred. |
| `avatar` | [Experiment 11](11-stage-2-avatar-scroll-area-and-hover-card-disposition.md) | `packages/radcn/src/components/avatar.tsx` | `fixtures/candidate-remix/app/fixtures/avatar.tsx`, `fixtures/reference-react-router/app/fixtures/avatar.tsx` | `fixtures/tests/avatar-scroll-area.spec.ts` | Server-rendered slots, sizes, badges, groups, and meaningful fallback markup; no client load/error state machine in Stage 2. |
| `scroll-area` | [Experiment 11](11-stage-2-avatar-scroll-area-and-hover-card-disposition.md) | `packages/radcn/src/components/scroll-area.tsx` | `fixtures/candidate-remix/app/fixtures/scroll-area.tsx`, `fixtures/reference-react-router/app/fixtures/scroll-area.tsx` | `fixtures/tests/avatar-scroll-area.spec.ts` | Native `overflow: auto` viewport with decorative scrollbar/thumb/corner hooks; draggable custom thumb behavior deferred. |
| `hover-card` | [Experiment 11](11-stage-2-avatar-scroll-area-and-hover-card-disposition.md) | Deferred to Stage 3 | No Stage 2 fixture by design | Stage 2 disposition reviewed in Experiment 11 | Moved to Stage 3 because it depends on portal, positioning, delay, dismissal, escape, and animation infrastructure shared with overlays. |

## Shared Verification Surface

Stage 2 scenarios are registered in `fixtures/scenarios/index.ts`, and the
artifact harness captures paired reference and candidate screenshots for each
scenario through `pnpm fixtures:artifacts`.

Stage 2 uses these focused Playwright files:

- `fixtures/tests/native-state.spec.ts`
- `fixtures/tests/accordion.spec.ts`
- `fixtures/tests/collapsible.spec.ts`
- `fixtures/tests/tabs.spec.ts`
- `fixtures/tests/toggle.spec.ts`
- `fixtures/tests/slider.spec.ts`
- `fixtures/tests/avatar-scroll-area.spec.ts`

## Approved Divergences and Deferrals

- Checkbox indeterminate state is server-exposed through `aria-checked="mixed"`
  and data hooks; the native runtime `indeterminate` property is not serialized
  in HTML.
- Accordion single exclusivity uses item-level shared native `name` attributes.
- Disabled accordion and collapsible states use explicit non-interactive markup
  because native `<details>` has no `disabled` attribute.
- Toggle and toggle-group pressed state does not submit form values without a
  future hidden-input adapter.
- Slider supports native single-thumb horizontal range behavior only in Stage 2;
  multi-thumb and vertical slider behavior are deferred.
- Avatar does not implement Radix's delayed fallback or image load/error state
  machine in Stage 2.
- Scroll area uses native scrolling; draggable custom scrollbar thumb
  measurement and position syncing are deferred.
- Hover card moves to Stage 3 with overlay primitives.

## Conclusion

Stage 2 is complete. The next experiment may begin Stage 3 by designing the
shared overlay, portal, positioning, dismissal, focus, scroll-lock, and
animation strategy before porting individual overlay components.
