import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

// Item surfaces as Tailwind utilities (Issue 6, Experiment 41). A composition/
// layout primitive (group/item/media/content/title/description/actions/header/
// footer/separator). Variant + size + media-variant map to Records (the elements
// emit data-variant/data-size). The descendant <img> styling stays a bespoke
// rule in tokens.css (consumer content), keyed on the data attributes.
const itemGroupClass = 'flex w-[min(100%,34rem)] flex-col gap-1 [font-family:var(--radcn-font)]'
// NOTE: padding lives ONLY in the size Record (NOT the base) — a base `p-3.5`
// plus a variant `p-2.5`/`px-2 py-1.5` are conflicting `padding` utilities whose
// winner is Tailwind's source order, not the class-attribute order, so the base
// would override the smaller sizes (default/sm/xs would all render the same).
const itemBaseClass = 'flex w-full flex-wrap items-center gap-3 border border-transparent rounded-md text-foreground'
const itemVariantClass: Record<ItemVariant, string> = { default: '', outline: 'border-border', muted: 'bg-secondary' }
const itemSizeClass: Record<ItemSize, string> = { default: 'p-3.5', sm: 'p-2.5', xs: 'px-2 py-1.5 text-[0.8125rem]' }
const itemLinkClass =
  'flex min-w-0 grow basis-full flex-wrap items-center gap-[inherit] text-inherit no-underline focus-visible:outline-2 focus-visible:outline-[var(--radcn-ring)] focus-visible:outline-offset-2'
const itemMediaClass =
  'flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground font-semibold'
const itemMediaVariantClass: Record<ItemMediaVariant, string> = { default: '', icon: 'size-8 rounded-[999px]', image: 'overflow-hidden' }
const itemContentClass = 'flex min-w-0 grow flex-col gap-1'
const itemTitleClass = 'text-sm font-semibold leading-[1.3] [font-family:var(--radcn-font)]'
const itemDescriptionClass = 'm-0 text-muted-foreground text-[0.8125rem] leading-[1.4] [font-family:var(--radcn-font)]'
const itemActionsClass = 'flex items-center gap-2'
const itemHeaderClass = 'flex items-stretch gap-2 basis-full justify-between'
const itemFooterClass = 'flex items-center gap-2 basis-full justify-between'
const itemSeparatorClass = 'h-px w-full bg-border'

export type ItemVariant = 'default' | 'outline' | 'muted'
export type ItemSize = 'default' | 'sm' | 'xs'
export type ItemMediaVariant = 'default' | 'icon' | 'image'

export interface ItemGroupProps {
  children?: RemixNode
  class?: string
  style?: string
}

export interface ItemProps {
  children?: RemixNode
  class?: string
  href?: string
  rel?: string
  rmxDocument?: boolean
  size?: ItemSize
  style?: string
  target?: string
  variant?: ItemVariant
}

export interface ItemPartProps {
  children?: RemixNode
  class?: string
  style?: string
}

export interface ItemMediaProps extends ItemPartProps {
  variant?: ItemMediaVariant
}

export function ItemGroup(handle: Handle<ItemGroupProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes(itemGroupClass, className)} data-radcn-item-group role="list" style={style}>
        {children}
      </div>
    )
  }
}

export function Item(handle: Handle<ItemProps>) {
  return () => {
    let {
      children,
      class: className,
      href,
      rel,
      rmxDocument,
      size = 'default',
      style,
      target,
      variant = 'default',
    } = handle.props
    let itemClass = classes(itemBaseClass, itemVariantClass[variant], itemSizeClass[size], className)

    if (href) {
      return (
        <div
          class={itemClass}
          data-radcn-item
          data-size={size}
          data-variant={variant}
          role="listitem"
          style={style}
        >
          <a
            class={itemLinkClass}
            data-radcn-item-link
            href={href}
            rel={rel}
            rmx-document={rmxDocument ? '' : undefined}
            target={target}
          >
            {children}
          </a>
        </div>
      )
    }

    return (
      <div
        class={itemClass}
        data-radcn-item
        data-size={size}
        data-variant={variant}
        role="listitem"
        style={style}
      >
        {children}
      </div>
    )
  }
}

export function ItemMedia(handle: Handle<ItemMediaProps>) {
  return () => {
    let { children, class: className, style, variant = 'default' } = handle.props

    return (
      <div
        class={classes(itemMediaClass, itemMediaVariantClass[variant], className)}
        data-radcn-item-media
        data-variant={variant}
        style={style}
      >
        {children}
      </div>
    )
  }
}

export function ItemContent(handle: Handle<ItemPartProps>) {
  return () => itemPart(itemContentClass, 'data-radcn-item-content', handle.props)
}

export function ItemTitle(handle: Handle<ItemPartProps>) {
  return () => itemPart(itemTitleClass, 'data-radcn-item-title', handle.props)
}

export function ItemDescription(handle: Handle<ItemPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <p class={classes(itemDescriptionClass, className)} data-radcn-item-description style={style}>
        {children}
      </p>
    )
  }
}

export function ItemActions(handle: Handle<ItemPartProps>) {
  return () => itemPart(itemActionsClass, 'data-radcn-item-actions', handle.props)
}

export function ItemHeader(handle: Handle<ItemPartProps>) {
  return () => itemPart(itemHeaderClass, 'data-radcn-item-header', handle.props)
}

export function ItemFooter(handle: Handle<ItemPartProps>) {
  return () => itemPart(itemFooterClass, 'data-radcn-item-footer', handle.props)
}

export function ItemSeparator(handle: Handle<ItemPartProps>) {
  return () => {
    let { class: className, style } = handle.props

    return <div class={classes(itemSeparatorClass, className)} data-radcn-item-separator role="separator" style={style} />
  }
}

function itemPart(className: string, dataAttribute: string, props: ItemPartProps) {
  let { children, class: extraClass, style } = props

  return (
    <div class={classes(className, extraClass)} {...{ [dataAttribute]: true }} style={style}>
      {children}
    </div>
  )
}
