import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

// NativeSelect surfaces as Tailwind utilities (Issue 6, Experiment 43). The
// conflicting min-height/padding-left/font-size live ONLY in the size Record
// (the base sets none) so the sizes do not collide. The select retains the
// radcn-native-select--{size} class as a style-less marker because the fixture
// suite asserts it via toHaveClass; its styling moved to the Record. Comments
// here stay plain ASCII with no bracketed tokens (the source is scanned).
const nativeSelectWrapperClass =
  'relative inline-flex w-fit min-w-[14rem] items-center [font-family:var(--radcn-font)] has-[select:disabled]:opacity-50'
const nativeSelectBaseClass =
  'w-full appearance-none border border-[var(--radcn-native-select-border,var(--radcn-input))] rounded-md bg-[var(--radcn-native-select-bg,var(--radcn-background))] text-[var(--radcn-native-select-fg,var(--radcn-foreground))] pr-9 py-0 font-normal leading-[1.35] outline-none transition-[border-color,box-shadow] focus-visible:border-[var(--radcn-ring)] focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--radcn-ring)_35%,transparent)] disabled:cursor-not-allowed aria-invalid:border-[var(--radcn-native-select-invalid,var(--radcn-destructive))] aria-invalid:shadow-[0_0_0_3px_color-mix(in_srgb,var(--radcn-native-select-invalid,var(--radcn-destructive))_20%,transparent)]'
const nativeSelectSizeClass: Record<NativeSelectSize, string> = {
  default: 'min-h-[var(--radcn-control-height)] pl-3 text-[0.875rem]',
  sm: 'min-h-8 pl-2.5 text-[0.8125rem]',
}
const nativeSelectIconClass =
  'pointer-events-none absolute right-3 text-muted-foreground text-[0.75rem] font-semibold leading-none [font-family:var(--radcn-font)]'
const nativeSelectOptionClass = 'bg-[Canvas] text-[CanvasText]'

export type NativeSelectSize = 'default' | 'sm'

export interface NativeSelectProps {
  ariaDescribedBy?: string
  ariaInvalid?: boolean
  children?: RemixNode
  class?: string
  disabled?: boolean
  id?: string
  name?: string
  required?: boolean
  size?: NativeSelectSize
  style?: string
}

export interface NativeSelectOptionProps {
  children?: RemixNode
  class?: string
  disabled?: boolean
  selected?: boolean
  value?: string
}

export interface NativeSelectOptGroupProps {
  children?: RemixNode
  class?: string
  disabled?: boolean
  label: string
}

export function NativeSelect(handle: Handle<NativeSelectProps>) {
  return () => {
    let {
      ariaDescribedBy,
      ariaInvalid,
      children,
      class: className,
      disabled,
      id,
      name,
      required,
      size = 'default',
      style,
    } = handle.props

    return (
      <div
        class={classes(nativeSelectWrapperClass, className)}
        data-radcn-native-select-wrapper
        data-size={size}
        style={style}
      >
        <select
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid ? 'true' : undefined}
          class={classes(nativeSelectBaseClass, nativeSelectSizeClass[size], `radcn-native-select--${size}`)}
          data-radcn-native-select
          data-size={size}
          disabled={disabled}
          id={id}
          name={name}
          required={required}
        >
          {children}
        </select>
        <span aria-hidden="true" class={nativeSelectIconClass} data-radcn-native-select-icon>
          v
        </span>
      </div>
    )
  }
}

export function NativeSelectOption(handle: Handle<NativeSelectOptionProps>) {
  return () => {
    let { children, class: className, disabled, selected, value } = handle.props

    return (
      <option
        class={classes(nativeSelectOptionClass, className)}
        data-radcn-native-select-option
        disabled={disabled}
        selected={selected}
        value={value}
      >
        {children}
      </option>
    )
  }
}

export function NativeSelectOptGroup(handle: Handle<NativeSelectOptGroupProps>) {
  return () => {
    let { children, class: className, disabled, label } = handle.props

    return (
      <optgroup class={classes(nativeSelectOptionClass, className)} data-radcn-native-select-optgroup disabled={disabled} label={label}>
        {children}
      </optgroup>
    )
  }
}
