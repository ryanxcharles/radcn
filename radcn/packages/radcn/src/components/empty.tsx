import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export type EmptyMediaVariant = 'default' | 'icon'

// Tailwind utility classes copied verbatim from shadcn/ui v4
// (registry/new-york-v4/ui/empty.tsx). See Issue 6, Experiment 10.
const emptyClass =
  'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12'
const emptyHeaderClass = 'flex max-w-sm flex-col items-center gap-2 text-center'
const emptyTitleClass = 'text-lg font-medium tracking-tight'
const emptyDescriptionClass =
  'text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'
const emptyContentClass = 'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance'
const emptyMediaBase = 'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0'
const emptyMediaVariants: Record<EmptyMediaVariant, string> = {
  default: 'bg-transparent',
  icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",
}

export interface EmptyProps {
  children?: RemixNode
  class?: string
  style?: string
}

export interface EmptyPartProps {
  children?: RemixNode
  class?: string
  style?: string
}

export interface EmptyMediaProps extends EmptyPartProps {
  variant?: EmptyMediaVariant
}

export function Empty(handle: Handle<EmptyProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes(emptyClass, className)} data-radcn-empty style={style}>
        {children}
      </div>
    )
  }
}

export function EmptyHeader(handle: Handle<EmptyPartProps>) {
  return () => emptyPart(emptyHeaderClass, 'data-radcn-empty-header', handle.props)
}

export function EmptyTitle(handle: Handle<EmptyPartProps>) {
  return () => emptyPart(emptyTitleClass, 'data-radcn-empty-title', handle.props)
}

export function EmptyDescription(handle: Handle<EmptyPartProps>) {
  return () => emptyPart(emptyDescriptionClass, 'data-radcn-empty-description', handle.props)
}

export function EmptyContent(handle: Handle<EmptyPartProps>) {
  return () => emptyPart(emptyContentClass, 'data-radcn-empty-content', handle.props)
}

export function EmptyMedia(handle: Handle<EmptyMediaProps>) {
  return () => {
    let { children, class: className, style, variant = 'default' } = handle.props

    return (
      <div
        class={classes(emptyMediaBase, emptyMediaVariants[variant], className)}
        data-radcn-empty-media
        data-variant={variant}
        style={style}
      >
        {children}
      </div>
    )
  }
}

function emptyPart(className: string, dataAttribute: string, props: EmptyPartProps) {
  let { children, class: extraClass, style } = props

  return (
    <div class={classes(className, extraClass)} {...{ [dataAttribute]: true }} style={style}>
      {children}
    </div>
  )
}
