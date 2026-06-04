import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export type DirectionValue = 'ltr' | 'rtl'

export interface DirectionProviderProps {
  children?: RemixNode
  class?: string
  dir?: DirectionValue
  direction?: DirectionValue
  id?: string
  style?: string
}

export function DirectionProvider(handle: Handle<DirectionProviderProps>) {
  return () => {
    let { children, class: className, dir = 'ltr', direction, id, style } = handle.props
    let value = direction ?? dir

    return (
      <div class={classes('radcn-direction-provider', className)} data-direction={value} data-radcn-direction-provider dir={value} id={id} style={style}>
        {children}
      </div>
    )
  }
}

export const Direction = DirectionProvider
