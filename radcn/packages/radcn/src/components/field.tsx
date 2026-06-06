import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export type FieldOrientation = 'vertical' | 'horizontal' | 'responsive'
export type FieldLegendVariant = 'default' | 'label'

export interface FieldProps {
  children?: RemixNode
  class?: string
  invalid?: boolean
  orientation?: FieldOrientation
  style?: string
}

export interface FieldPartProps {
  children?: RemixNode
  class?: string
  id?: string
  style?: string
}

export interface FieldLabelProps extends FieldPartProps {
  disabled?: boolean
  for?: string
}

export interface FieldLegendProps extends FieldPartProps {
  variant?: FieldLegendVariant
}

export interface FieldDescriptionProps {
  children?: RemixNode
  class?: string
  id?: string
  style?: string
}

export interface FieldErrorProps {
  children?: RemixNode
  class?: string
  id?: string
  style?: string
}

export function Field(handle: Handle<FieldProps>) {
  return () => {
    let { children, class: className, invalid, orientation = 'vertical', style } = handle.props

    return (
      <div
        class={classes('radcn-field', `radcn-field--${orientation}`, className)}
        data-invalid={invalid ? 'true' : undefined}
        data-orientation={orientation}
        data-radcn-field
        style={style}
      >
        {children}
      </div>
    )
  }
}

export function FieldLabel(handle: Handle<FieldLabelProps>) {
  return () => {
    let { children, class: className, disabled, for: htmlFor, id, style } = handle.props

    return (
      <label
        class={classes('radcn-field-label', className)}
        data-disabled={disabled ? 'true' : undefined}
        data-radcn-field-label
        for={htmlFor}
        id={id}
        style={style}
      >
        {children}
      </label>
    )
  }
}

export function FieldSet(handle: Handle<FieldPartProps>) {
  return () => {
    let { children, class: className, id, style } = handle.props

    return (
      <fieldset class={classes('radcn-field-set', className)} data-radcn-field-set id={id} style={style}>
        {children}
      </fieldset>
    )
  }
}

export function FieldLegend(handle: Handle<FieldLegendProps>) {
  return () => {
    let { children, class: className, id, style, variant = 'default' } = handle.props

    return (
      <legend class={classes('radcn-field-legend', `radcn-field-legend--${variant}`, className)} data-radcn-field-legend data-variant={variant} id={id} style={style}>
        {children}
      </legend>
    )
  }
}

export function FieldGroup(handle: Handle<FieldPartProps>) {
  return () => {
    let { children, class: className, id, style } = handle.props

    return (
      <div class={classes('radcn-field-group', className)} data-radcn-field-group id={id} style={style}>
        {children}
      </div>
    )
  }
}

export function FieldContent(handle: Handle<FieldPartProps>) {
  return () => {
    let { children, class: className, id, style } = handle.props

    return (
      <div class={classes('radcn-field-content', className)} data-radcn-field-content id={id} style={style}>
        {children}
      </div>
    )
  }
}

export function FieldTitle(handle: Handle<FieldPartProps>) {
  return () => {
    let { children, class: className, id, style } = handle.props

    return (
      <div class={classes('radcn-field-title', className)} data-radcn-field-title id={id} style={style}>
        {children}
      </div>
    )
  }
}

export function FieldSeparator(handle: Handle<FieldPartProps>) {
  return () => {
    let { class: className, id, style } = handle.props

    return (
      <hr aria-hidden="true" class={classes('radcn-field-separator', className)} data-radcn-field-separator id={id} style={style} />
    )
  }
}

export function FieldDescription(handle: Handle<FieldDescriptionProps>) {
  return () => {
    let { children, class: className, id, style } = handle.props

    return (
      <p class={classes('radcn-field-description', className)} data-radcn-field-description id={id} style={style}>
        {children}
      </p>
    )
  }
}

export function FieldError(handle: Handle<FieldErrorProps>) {
  return () => {
    let { children, class: className, id, style } = handle.props

    return (
      <p class={classes('radcn-field-error', className)} data-radcn-field-error id={id} style={style}>
        {children}
      </p>
    )
  }
}
