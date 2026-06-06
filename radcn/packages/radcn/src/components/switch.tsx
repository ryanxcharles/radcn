import type { Handle } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export type SwitchSize = 'default' | 'sm'

export interface SwitchProps {
  ariaDescribedBy?: string
  ariaInvalid?: boolean
  checked?: boolean
  class?: string
  disabled?: boolean
  id?: string
  name?: string
  required?: boolean
  size?: SwitchSize
  style?: string
  value?: string
}

function switchState(input: HTMLInputElement) {
  return input.checked ? 'checked' : 'unchecked'
}

function syncSwitch(root: HTMLElement, input: HTMLInputElement) {
  let state = switchState(input)
  root.dataset.state = state
  input.dataset.state = state
}

function setupSwitch(root: HTMLElement) {
  if (root.dataset.radcnSwitchReady === 'true') return

  let input = root.querySelector<HTMLInputElement>('[data-radcn-switch-input]')
  if (!input) return

  syncSwitch(root, input)
  root.dataset.radcnSwitchReady = 'true'

  input.addEventListener('input', () => syncSwitch(root, input))
  input.addEventListener('change', () => syncSwitch(root, input))
  input.form?.addEventListener('reset', () => {
    requestAnimationFrame(() => syncSwitch(root, input))
  })
}

export function enhanceSwitch(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-radcn-switch-wrapper]').forEach(setupSwitch)
}

export function Switch(handle: Handle<SwitchProps>) {
  return () => {
    let {
      ariaDescribedBy,
      ariaInvalid,
      checked,
      class: className,
      disabled,
      id,
      name,
      required,
      size = 'default',
      style,
      value = 'on',
    } = handle.props
    let state = checked ? 'checked' : 'unchecked'

    return (
      <span
        class={classes('radcn-switch-wrapper', `radcn-switch-wrapper--${size}`, `radcn-switch-wrapper--${state}`, className)}
        data-disabled={disabled ? 'true' : undefined}
        data-invalid={ariaInvalid ? 'true' : undefined}
        data-radcn-switch-wrapper
        data-size={size}
        data-state={state}
        style={style}
      >
        <input
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid ? 'true' : undefined}
          checked={checked}
          class="radcn-switch-input"
          data-radcn-switch-input
          data-size={size}
          data-state={state}
          disabled={disabled}
          id={id}
          name={name}
          required={required}
          role="switch"
          type="checkbox"
          value={value}
        />
        <span aria-hidden="true" class="radcn-switch-thumb" data-radcn-switch-thumb />
      </span>
    )
  }
}
