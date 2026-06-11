import type { Handle } from 'remix/ui'

import { classes } from '../utils/classes.ts'

// Slider surfaces as Tailwind utilities (Issue 6, Experiment 40). A custom-
// rendered range (hidden native input + visual track/range/thumb); the JS sets
// --radcn-slider-percent inline on the wrapper, which the range width + thumb
// left read. Self-contained (no shared rules). The :has(:focus-visible) thumb
// focus ring stays a bespoke parent-state->child rule in tokens.css.
const sliderWrapperClass =
  'relative block w-[min(100%,20rem)] h-5 text-[var(--radcn-slider-fg,var(--radcn-primary))] data-[disabled=true]:opacity-50'
const sliderInputClass = 'absolute inset-0 z-[2] size-full m-0 opacity-0 cursor-pointer disabled:cursor-not-allowed'
const sliderTrackClass =
  'absolute top-1/2 left-0 right-0 block h-2 overflow-hidden rounded-[999px] bg-[var(--radcn-slider-track-bg,var(--radcn-secondary))] -translate-y-1/2'
const sliderRangeClass =
  'block w-[var(--radcn-slider-percent,0%)] h-full rounded-[inherit] bg-[var(--radcn-slider-range-bg,var(--radcn-primary))]'
const sliderThumbClass =
  'absolute top-1/2 left-[var(--radcn-slider-percent,0%)] z-[1] size-4 border-2 border-[var(--radcn-slider-thumb-border,var(--radcn-primary))] rounded-[999px] bg-[var(--radcn-slider-thumb-bg,var(--radcn-background))] shadow-[0_1px_2px_rgb(0_0_0_/_0.12)] pointer-events-none -translate-x-1/2 -translate-y-1/2'

export interface SliderProps {
  ariaLabel?: string
  class?: string
  defaultValue?: number
  disabled?: boolean
  id?: string
  max?: number
  min?: number
  name?: string
  step?: number
  style?: string
  value?: number
}

function sliderPercent(input: HTMLInputElement) {
  let min = Number(input.min || 0)
  let max = Number(input.max || 100)
  let value = Number(input.value || min)
  if (max <= min) return 0
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
}

function syncSlider(root: HTMLElement, input: HTMLInputElement) {
  if (input.disabled) return
  root.dataset.value = input.value
  root.style.setProperty('--radcn-slider-percent', `${sliderPercent(input)}%`)
}

function setupSlider(root: HTMLElement) {
  if (root.dataset.radcnSliderReady === 'true') return

  let input = root.querySelector<HTMLInputElement>('[data-radcn-slider-input]')
  if (!input) return

  if (!input.disabled) syncSlider(root, input)
  root.dataset.radcnSliderReady = 'true'

  input.addEventListener('input', () => syncSlider(root, input))
  input.form?.addEventListener('reset', () => {
    requestAnimationFrame(() => syncSlider(root, input))
  })
}

export function enhanceSlider(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-radcn-slider]').forEach(setupSlider)
}

export function Slider(handle: Handle<SliderProps>) {
  return () => {
    let {
      ariaLabel = 'Slider',
      class: className,
      defaultValue,
      disabled,
      id,
      max = 100,
      min = 0,
      name,
      step = 1,
      style,
      value,
    } = handle.props
    let currentValue = value ?? defaultValue ?? min
    let percent = max <= min ? 0 : Math.max(0, Math.min(100, ((currentValue - min) / (max - min)) * 100))

    return (
      <span
        class={classes(sliderWrapperClass, className)}
        data-disabled={disabled ? 'true' : undefined}
        data-max={String(max)}
        data-min={String(min)}
        data-orientation="horizontal"
        data-radcn-slider
        data-step={String(step)}
        data-value={String(currentValue)}
        style={`--radcn-slider-percent:${percent}%;${style ?? ''}`}
      >
        <input
          aria-label={ariaLabel}
          class={sliderInputClass}
          data-radcn-slider-input
          defaultValue={value === undefined ? currentValue : undefined}
          disabled={disabled}
          id={id}
          max={max}
          min={min}
          name={name}
          step={step}
          type="range"
          value={value}
        />
        <span aria-hidden="true" class={sliderTrackClass} data-radcn-slider-track>
          <span class={sliderRangeClass} data-radcn-slider-range />
        </span>
        <span aria-hidden="true" class={sliderThumbClass} data-radcn-slider-thumb />
      </span>
    )
  }
}
