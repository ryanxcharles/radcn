import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

// Tailwind utility classes copied verbatim from shadcn/ui v4
// (registry/new-york-v4/ui/kbd.tsx). See Issue 6, Experiment 8. The
// [[data-slot=tooltip-content]_&] variants are inert in RadCN (its tooltips
// emit data-radcn-tooltip-content); kept for fidelity / future alignment.
const kbdClass =
  "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3 [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10"

const kbdGroupClass = 'inline-flex items-center gap-1'

export interface KbdProps {
  children?: RemixNode
  class?: string
  style?: string
}

export interface KbdGroupProps {
  children?: RemixNode
  class?: string
  style?: string
}

export function Kbd(handle: Handle<KbdProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <kbd class={classes(kbdClass, className)} data-radcn-kbd style={style}>
        {children}
      </kbd>
    )
  }
}

export function KbdGroup(handle: Handle<KbdGroupProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes(kbdGroupClass, className)} data-radcn-kbd-group style={style}>
        {children}
      </div>
    )
  }
}
