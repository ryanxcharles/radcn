import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export type AlertVariant = 'default' | 'destructive'

// Tailwind utility classes copied verbatim from shadcn/ui v4
// (registry/new-york-v4/ui/alert.tsx). See Issue 6, Experiment 19. The
// destructive variant's description selector is adapted from shadcn's
// *:data-[slot=alert-description] to RadCN's [data-radcn-alert-description].
const alertBaseClass =
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current'
const alertVariantClass: Record<AlertVariant, string> = {
  default: 'bg-card text-card-foreground',
  destructive: 'bg-card text-destructive *:data-[radcn-alert-description]:text-destructive/90 [&>svg]:text-current',
}
const alertTitleClass = 'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight'
const alertDescriptionClass = 'col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed'
// AlertAction is RadCN-only (shadcn has no equivalent); its sole bespoke
// property was margin-top: 0.25rem (= mt-1). col-start-2 aligns it with the
// title/description in the shadcn grid.
const alertActionClass = 'col-start-2 mt-1'

export interface AlertProps {
  children?: RemixNode
  class?: string
  style?: string
  variant?: AlertVariant
}

export interface AlertPartProps {
  children?: RemixNode
  class?: string
  style?: string
}

export function Alert(handle: Handle<AlertProps>) {
  return () => {
    let { children, class: className, style, variant = 'default' } = handle.props

    return (
      <div
        class={classes(alertBaseClass, alertVariantClass[variant], className)}
        data-radcn-alert
        data-variant={variant}
        role="alert"
        style={style}
      >
        {children}
      </div>
    )
  }
}

export function AlertTitle(handle: Handle<AlertPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes(alertTitleClass, className)} data-radcn-alert-title style={style}>
        {children}
      </div>
    )
  }
}

export function AlertDescription(handle: Handle<AlertPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes(alertDescriptionClass, className)} data-radcn-alert-description style={style}>
        {children}
      </div>
    )
  }
}

export function AlertAction(handle: Handle<AlertPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes(alertActionClass, className)} data-radcn-alert-action style={style}>
        {children}
      </div>
    )
  }
}
