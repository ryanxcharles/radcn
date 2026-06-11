import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export interface AspectRatioProps {
  children?: RemixNode
  class?: string
  ratio?: string
  style?: string
}

export function AspectRatio(handle: Handle<AspectRatioProps>) {
  return () => {
    let { children, class: className, ratio = '16 / 9', style } = handle.props
    let mergedStyle = style ? `aspect-ratio:${ratio};${style}` : `aspect-ratio:${ratio}`

    // Unstyled (Issue 6, Experiment 14): the only intrinsic behavior is the
    // inline CSS aspect-ratio (RadCN's dependency-free equivalent of shadcn's
    // Radix AspectRatio). Appearance (radius, background, overflow, sizing) is
    // consumer-owned via the class/style props, as shadcn expects.
    return (
      <div class={classes(className)} data-radcn-aspect-ratio style={mergedStyle}>
        {children}
      </div>
    )
  }
}
