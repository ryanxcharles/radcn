import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

// Tailwind utility classes copied verbatim from shadcn/ui v4
// (registry/new-york-v4/ui/label.tsx), plus a RadCN adaptation: RadCN's Label
// has a `disabled` prop that sets data-disabled on the element itself, so the
// self `data-[disabled=true]:*` variants provide the disabled styling. shadcn's
// group-data / peer-disabled variants are kept verbatim (inert in RadCN's
// usage, which has no group/peer ancestor). See Issue 6, Experiment 11.
const labelClass =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50'

export interface LabelProps {
  children?: RemixNode
  class?: string
  disabled?: boolean
  for?: string
  style?: string
}

export function Label(handle: Handle<LabelProps>) {
  return () => {
    let { children, class: className, disabled, for: htmlFor, style } = handle.props

    return (
      <label
        class={classes(labelClass, className)}
        data-disabled={disabled ? 'true' : undefined}
        data-radcn-label
        for={htmlFor}
        style={style}
      >
        {children}
      </label>
    )
  }
}
