import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export type CardSize = 'default' | 'sm'

// Tailwind utility classes copied verbatim from shadcn/ui v4
// (registry/new-york-v4/ui/card.tsx). See Issue 6, Experiment 17. The card
// header's action detection is adapted from shadcn's has-data-[slot=card-action]
// to RadCN's [data-radcn-card-action] attribute.
const cardClass = 'flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm'
const cardHeaderClass =
  '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-[[data-radcn-card-action]]:grid-cols-[1fr_auto] [.border-b]:pb-6'
const cardTitleClass = 'leading-none font-semibold'
const cardDescriptionClass = 'text-sm text-muted-foreground'
const cardActionClass = 'col-start-2 row-span-2 row-start-1 self-start justify-self-end'
const cardContentClass = 'px-6'
const cardFooterClass = 'flex items-center px-6 [.border-t]:pt-6'

export interface CardProps {
  children?: RemixNode
  class?: string
  size?: CardSize
  style?: string
}

export interface CardPartProps {
  children?: RemixNode
  class?: string
  style?: string
}

export function Card(handle: Handle<CardProps>) {
  return () => {
    // The `size` prop and `data-size` are retained for API compatibility and as
    // a non-visual hook, but no longer affect width: shadcn cards size to their
    // container, and the consumer controls width via the class/style props.
    let { children, class: className, size = 'default', style } = handle.props

    return (
      <div class={classes(cardClass, className)} data-radcn-card data-size={size} style={style}>
        {children}
      </div>
    )
  }
}

export function CardHeader(handle: Handle<CardPartProps>) {
  return () => cardPart(cardHeaderClass, 'data-radcn-card-header', handle.props)
}

export function CardTitle(handle: Handle<CardPartProps>) {
  return () => cardPart(cardTitleClass, 'data-radcn-card-title', handle.props)
}

export function CardDescription(handle: Handle<CardPartProps>) {
  return () => cardPart(cardDescriptionClass, 'data-radcn-card-description', handle.props)
}

export function CardAction(handle: Handle<CardPartProps>) {
  return () => cardPart(cardActionClass, 'data-radcn-card-action', handle.props)
}

export function CardContent(handle: Handle<CardPartProps>) {
  return () => cardPart(cardContentClass, 'data-radcn-card-content', handle.props)
}

export function CardFooter(handle: Handle<CardPartProps>) {
  return () => cardPart(cardFooterClass, 'data-radcn-card-footer', handle.props)
}

function cardPart(className: string, dataAttribute: string, props: CardPartProps) {
  let { children, class: extraClass, style } = props

  return (
    <div class={classes(className, extraClass)} {...{ [dataAttribute]: true }} style={style}>
      {children}
    </div>
  )
}
