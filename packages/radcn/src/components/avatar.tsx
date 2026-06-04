import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export type AvatarSize = 'default' | 'sm' | 'lg'

export interface AvatarProps {
  children?: RemixNode
  class?: string
  size?: AvatarSize
  style?: string
}

export interface AvatarImageProps {
  alt?: string
  class?: string
  height?: number | string
  loading?: 'eager' | 'lazy'
  src?: string
  style?: string
  width?: number | string
}

export interface AvatarFallbackProps {
  ariaHidden?: boolean
  children?: RemixNode
  class?: string
  style?: string
}

export interface AvatarPartProps {
  ariaLabel?: string
  children?: RemixNode
  class?: string
  style?: string
}

export function Avatar(handle: Handle<AvatarProps>) {
  return () => {
    let { children, class: className, size = 'default', style } = handle.props

    return (
      <span
        class={classes('radcn-avatar', `radcn-avatar--${size}`, className)}
        data-radcn-avatar
        data-size={size}
        style={style}
      >
        {children}
      </span>
    )
  }
}

export function AvatarImage(handle: Handle<AvatarImageProps>) {
  return () => {
    let { alt = '', class: className, height, loading = 'lazy', src, style, width } = handle.props

    return (
      <img
        alt={alt}
        class={classes('radcn-avatar-image', className)}
        data-radcn-avatar-image
        height={height}
        loading={loading}
        src={src}
        style={style}
        width={width}
      />
    )
  }
}

export function AvatarFallback(handle: Handle<AvatarFallbackProps>) {
  return () => {
    let { ariaHidden, children, class: className, style } = handle.props

    return (
      <span
        aria-hidden={ariaHidden ? 'true' : undefined}
        class={classes('radcn-avatar-fallback', className)}
        data-radcn-avatar-fallback
        style={style}
      >
        {children}
      </span>
    )
  }
}

export function AvatarBadge(handle: Handle<AvatarPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <span aria-hidden="true" class={classes('radcn-avatar-badge', className)} data-radcn-avatar-badge style={style}>
        {children}
      </span>
    )
  }
}

export function AvatarGroup(handle: Handle<AvatarPartProps>) {
  return () => {
    let { ariaLabel, children, class: className, style } = handle.props

    return (
      <div aria-label={ariaLabel} class={classes('radcn-avatar-group', className)} data-radcn-avatar-group style={style}>
        {children}
      </div>
    )
  }
}

export function AvatarGroupCount(handle: Handle<AvatarPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes('radcn-avatar-group-count', className)} data-radcn-avatar-group-count style={style}>
        {children}
      </div>
    )
  }
}
