import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export type ScrollBarOrientation = 'vertical' | 'horizontal'

export interface ScrollAreaProps {
  children?: RemixNode
  class?: string
  style?: string
}

export interface ScrollAreaViewportProps {
  ariaLabel?: string
  children?: RemixNode
  class?: string
  id?: string
  style?: string
  tabIndex?: number
}

export interface ScrollBarProps {
  children?: RemixNode
  class?: string
  orientation?: ScrollBarOrientation
  style?: string
}

export interface ScrollAreaPartProps {
  children?: RemixNode
  class?: string
  style?: string
}

export function ScrollArea(handle: Handle<ScrollAreaProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes('radcn-scroll-area', className)} data-radcn-scroll-area style={style}>
        {children}
      </div>
    )
  }
}

export function ScrollAreaViewport(handle: Handle<ScrollAreaViewportProps>) {
  return () => {
    let { ariaLabel, children, class: className, id, style, tabIndex = 0 } = handle.props

    return (
      <div
        aria-label={ariaLabel}
        class={classes('radcn-scroll-area-viewport', className)}
        data-radcn-scroll-area-viewport
        id={id}
        style={style}
        tabIndex={tabIndex}
      >
        {children}
      </div>
    )
  }
}

export function ScrollBar(handle: Handle<ScrollBarProps>) {
  return () => {
    let { children, class: className, orientation = 'vertical', style } = handle.props

    return (
      <div
        aria-hidden="true"
        class={classes('radcn-scroll-area-scrollbar', `radcn-scroll-area-scrollbar--${orientation}`, className)}
        data-orientation={orientation}
        data-radcn-scroll-area-scrollbar
        style={style}
      >
        {children}
      </div>
    )
  }
}

export function ScrollAreaThumb(handle: Handle<ScrollAreaPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes('radcn-scroll-area-thumb', className)} data-radcn-scroll-area-thumb style={style}>
        {children}
      </div>
    )
  }
}

export function ScrollAreaCorner(handle: Handle<ScrollAreaPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div aria-hidden="true" class={classes('radcn-scroll-area-corner', className)} data-radcn-scroll-area-corner style={style}>
        {children}
      </div>
    )
  }
}
