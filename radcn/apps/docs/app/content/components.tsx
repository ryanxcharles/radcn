import type { RemixNode } from 'remix/ui'
import { css } from 'remix/ui'
import { Button } from 'radcn/button'

export type ComponentStatus = 'ready' | 'draft'

export interface ComponentExample {
  slug: string
  title: string
  description: string
  source: string
  preview: RemixNode
}

export interface ComponentDoc {
  slug: string
  title: string
  category: string
  status: ComponentStatus
  summary: string
  importPath: string
  install: string
  examples: ComponentExample[]
  accessibility: string[]
  customization: string[]
  divergence: string[]
}

const buttonSource = `import { Button } from 'radcn/button'

export function ButtonPreview() {
  return (
    <div class="button-preview">
      <Button>Deploy site</Button>
      <Button variant="secondary">Preview</Button>
      <Button variant="outline">View docs</Button>
    </div>
  )
}`

function ButtonPreview() {
  return () => (
    <div
      mix={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.75rem',
      })}
    >
      <Button>Deploy site</Button>
      <Button variant="secondary">Preview</Button>
      <Button variant="outline">View docs</Button>
    </div>
  )
}

export const componentDocs: ComponentDoc[] = [
  {
    slug: 'button',
    title: 'Button',
    category: 'Inputs',
    status: 'ready',
    summary:
      'A native button and link primitive with RadCN variants, sizing, disabled states, and token-driven styling.',
    importPath: 'radcn/button',
    install: 'pnpm add radcn',
    examples: [
      {
        slug: 'default',
        title: 'Variants',
        description:
          'Use the same Button component for actions, secondary choices, and link-style navigation.',
        source: buttonSource,
        preview: <ButtonPreview />,
      },
    ],
    accessibility: [
      'Renders a native button by default, preserving keyboard and form behavior without client JavaScript.',
      'Renders an anchor when href is provided, so link semantics remain real links.',
      'Supports disabled and aria-disabled states for unavailable actions.',
    ],
    customization: [
      'The component is styled through RadCN CSS variables such as --radcn-primary, --radcn-radius, and --radcn-control-height.',
      'Variants and sizes are expressed as data attributes and class names so app-level CSS can extend the visual system.',
    ],
    divergence: [
      'The Remix 3 port does not wrap React components. It returns host elements from remix/ui and keeps behavior close to the platform.',
      'Composition favors explicit props and package imports instead of a generated component copy inside the consuming app.',
    ],
  },
]

export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return componentDocs.find((component) => component.slug === slug)
}
