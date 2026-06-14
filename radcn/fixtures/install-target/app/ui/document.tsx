import type { Handle, RemixNode } from 'remix/ui'
import { css } from 'remix/ui'

import { routes } from '../routes.ts'

export interface DocumentProps {
  children?: RemixNode
  title?: string
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { children, title = 'RadCN Install Target' } = handle.props

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <link rel="stylesheet" href={routes.assets.href({ path: 'app/assets/tailwind.generated.css' })} />
        </head>
        <body mix={css({ margin: 0 })}>{children}</body>
      </html>
    )
  }
}
