import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export type ScrollBarOrientation = 'vertical' | 'horizontal'

// ScrollArea surfaces as Tailwind utilities (Issue 6, Experiment 33). Token-
// referencing arbitrary values reproduce RadCN's exact values and keep the
// custom-scroll-area fixture tokens working. The orientation-dependent thumb
// min-size (a child of the oriented scrollbar) stays a bespoke rule in
// tokens.css keyed on [data-orientation].
const scrollAreaClass =
  'relative w-[min(100%,24rem)] h-[var(--radcn-scroll-area-height,12rem)] overflow-hidden rounded-md border border-[var(--radcn-scroll-area-border,var(--radcn-border))] bg-[var(--radcn-scroll-area-bg,var(--radcn-background))] text-[var(--radcn-scroll-area-fg,var(--radcn-foreground))]'
const scrollAreaViewportClass =
  'size-full overflow-auto rounded-[inherit] p-4 outline-none [scrollbar-color:var(--radcn-scroll-area-thumb-bg,var(--radcn-border))_transparent] [scrollbar-width:thin] focus-visible:shadow-[inset_0_0_0_3px_color-mix(in_srgb,var(--radcn-ring)_35%,transparent)]'
const scrollbarBaseClass =
  'absolute flex rounded-[999px] bg-[var(--radcn-scroll-area-scrollbar-bg,transparent)] p-0.5 pointer-events-none'
const scrollbarOrientationClass: Record<ScrollBarOrientation, string> = {
  vertical: 'top-1 right-1 bottom-1 w-2.5',
  horizontal: 'right-1 bottom-1 left-1 h-2.5',
}
const scrollAreaThumbClass = 'block flex-1 rounded-[inherit] bg-[var(--radcn-scroll-area-thumb-bg,var(--radcn-border))]'
const scrollAreaCornerClass =
  'absolute right-1 bottom-1 size-2.5 rounded-[999px] bg-[var(--radcn-scroll-area-corner-bg,var(--radcn-border))] pointer-events-none'

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
      <div class={classes(scrollAreaClass, className)} data-radcn-scroll-area style={style}>
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
        class={classes(scrollAreaViewportClass, className)}
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
        class={classes(scrollbarBaseClass, scrollbarOrientationClass[orientation], className)}
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
      <div class={classes(scrollAreaThumbClass, className)} data-radcn-scroll-area-thumb style={style}>
        {children}
      </div>
    )
  }
}

export function ScrollAreaCorner(handle: Handle<ScrollAreaPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div aria-hidden="true" class={classes(scrollAreaCornerClass, className)} data-radcn-scroll-area-corner style={style}>
        {children}
      </div>
    )
  }
}
