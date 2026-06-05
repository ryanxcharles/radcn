import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export type AccordionType = 'single' | 'multiple'

export interface AccordionProps {
  children?: RemixNode
  class?: string
  collapsible?: boolean
  defaultValue?: string | string[]
  name?: string
  style?: string
  type?: AccordionType
}

export interface AccordionItemProps {
  children?: RemixNode
  class?: string
  disabled?: boolean
  name?: string
  open?: boolean
  style?: string
  value: string
}

export interface AccordionTriggerProps {
  children?: RemixNode
  class?: string
  disabled?: boolean
  style?: string
}

export interface AccordionContentProps {
  children?: RemixNode
  class?: string
  disabled?: boolean
  style?: string
}

export function Accordion(handle: Handle<AccordionProps>) {
  return () => {
    let {
      children,
      class: className,
      collapsible,
      defaultValue,
      name,
      style,
      type = 'single',
    } = handle.props
    let values = Array.isArray(defaultValue) ? defaultValue : defaultValue === undefined ? [] : [defaultValue]
    let groupName = type === 'single' ? name ?? 'radcn-accordion' : undefined

    return (
      <div
        class={classes('radcn-accordion', `radcn-accordion--${type}`, className)}
        data-collapsible={collapsible ? 'true' : undefined}
        data-default-value={values.join(' ')}
        data-radcn-accordion
        data-type={type}
        style={style}
        {...{ 'data-accordion-name': groupName }}
      >
        {children}
      </div>
    )
  }
}

export function AccordionItem(handle: Handle<AccordionItemProps>) {
  return () => {
    let { children, class: className, disabled, name, open, style, value } = handle.props
    let state = open ? 'open' : 'closed'

    if (disabled) {
      return (
        <div
          class={classes('radcn-accordion-item', 'radcn-accordion-item--disabled', className)}
          data-disabled="true"
          data-radcn-accordion-item
          data-state={state}
          data-value={value}
          style={style}
        >
          {children}
        </div>
      )
    }

    return (
      <details
        class={classes('radcn-accordion-item', className)}
        data-radcn-accordion-item
        data-state={state}
        data-value={value}
        name={name}
        open={open}
        style={style}
      >
        {children}
      </details>
    )
  }
}

export function AccordionTrigger(handle: Handle<AccordionTriggerProps>) {
  return () => {
    let { children, class: className, disabled, style } = handle.props
    let content = (
      <>
        <span class="radcn-accordion-trigger-text" data-radcn-accordion-trigger-text>
          {children}
        </span>
        <span aria-hidden="true" class="radcn-accordion-icon" data-radcn-accordion-icon>
          v
        </span>
      </>
    )

    if (disabled) {
      return (
        <div
          aria-disabled="true"
          class={classes('radcn-accordion-trigger', 'radcn-accordion-trigger--disabled', className)}
          data-disabled="true"
          data-radcn-accordion-trigger
          role="button"
          style={style}
        >
          {content}
        </div>
      )
    }

    return (
      <summary class={classes('radcn-accordion-trigger', className)} data-radcn-accordion-trigger style={style}>
        {content}
      </summary>
    )
  }
}

export function AccordionContent(handle: Handle<AccordionContentProps>) {
  return () => {
    let { children, class: className, disabled, style } = handle.props

    return (
      <div
        hidden={disabled ? true : undefined}
        class={classes('radcn-accordion-content', className)}
        data-radcn-accordion-content
        style={style}
      >
        <div class="radcn-accordion-content-inner" data-radcn-accordion-content-inner>
          {children}
        </div>
      </div>
    )
  }
}
