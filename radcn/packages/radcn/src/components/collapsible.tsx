import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export interface CollapsibleProps {
  children?: RemixNode
  class?: string
  disabled?: boolean
  open?: boolean
  style?: string
}

export interface CollapsibleTriggerProps {
  children?: RemixNode
  class?: string
  disabled?: boolean
  style?: string
}

export interface CollapsibleContentProps {
  children?: RemixNode
  class?: string
  disabled?: boolean
  style?: string
}

export function Collapsible(handle: Handle<CollapsibleProps>) {
  return () => {
    let { children, class: className, disabled, open, style } = handle.props
    let state = open ? 'open' : 'closed'

    if (disabled) {
      return (
        <div
          class={classes('radcn-collapsible', 'radcn-collapsible--disabled', className)}
          data-disabled="true"
          data-radcn-collapsible
          data-state={state}
          style={style}
        >
          {children}
        </div>
      )
    }

    return (
      <details
        class={classes('radcn-collapsible', className)}
        data-radcn-collapsible
        data-state={state}
        open={open}
        style={style}
      >
        {children}
      </details>
    )
  }
}

export function CollapsibleTrigger(handle: Handle<CollapsibleTriggerProps>) {
  return () => {
    let { children, class: className, disabled, style } = handle.props
    let content = (
      <>
        <span class="radcn-collapsible-trigger-text" data-radcn-collapsible-trigger-text>
          {children}
        </span>
        <span aria-hidden="true" class="radcn-collapsible-icon" data-radcn-collapsible-icon>
          v
        </span>
      </>
    )

    if (disabled) {
      return (
        <div
          aria-disabled="true"
          class={classes('radcn-collapsible-trigger', 'radcn-collapsible-trigger--disabled', className)}
          data-disabled="true"
          data-radcn-collapsible-trigger
          role="button"
          style={style}
        >
          {content}
        </div>
      )
    }

    return (
      <summary class={classes('radcn-collapsible-trigger', className)} data-radcn-collapsible-trigger style={style}>
        {content}
      </summary>
    )
  }
}

export function CollapsibleContent(handle: Handle<CollapsibleContentProps>) {
  return () => {
    let { children, class: className, disabled, style } = handle.props

    return (
      <div
        hidden={disabled ? true : undefined}
        class={classes('radcn-collapsible-content', className)}
        data-radcn-collapsible-content
        style={style}
      >
        <div class="radcn-collapsible-content-inner" data-radcn-collapsible-content-inner>
          {children}
        </div>
      </div>
    )
  }
}
