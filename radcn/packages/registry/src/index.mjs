export const registryItems = {
  'theme': {
    name: 'theme',
    type: 'registry:style',
    files: [
      {
        target: 'app/styles/radcn-theme.css',
        content: `@custom-variant dark (&:where([data-radcn-theme='dark'], [data-radcn-theme='dark'] *));

@layer base {
  *,
  ::before,
  ::after {
    border-color: var(--border);
  }
}

:root {
  --background: #ffffff;
  --foreground: #18181b;
  --primary: #18181b;
  --primary-foreground: #fafafa;
  --secondary: #f4f4f5;
  --secondary-foreground: #18181b;
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  --border: #e4e4e7;
  --ring: #a1a1aa;
  --radius: 0.375rem;
}

[data-radcn-theme='dark'] {
  --background: #09090b;
  --foreground: #fafafa;
  --primary: #fafafa;
  --primary-foreground: #18181b;
  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  --destructive: #ef4444;
  --destructive-foreground: #fafafa;
  --border: #3f3f46;
  --ring: #71717a;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --radius-md: calc(var(--radius) * 0.8);
}
`,
      },
    ],
  },
  'utils/classes': {
    name: 'utils/classes',
    type: 'registry:lib',
    files: [
      {
        targetAlias: 'utils',
        path: 'classes.ts',
        content: `export function classes(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}
`,
      },
    ],
  },
  'button': {
    name: 'button',
    type: 'registry:ui',
    registryDependencies: ['theme', 'utils/classes'],
    files: [
      {
        targetAlias: 'ui',
        path: 'button.tsx',
        content: `import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../../lib/utils/classes.ts'

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md border border-transparent font-medium leading-none whitespace-nowrap outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50'

const buttonVariantClass: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border-border bg-background text-foreground',
  ghost: 'bg-transparent text-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  link: 'h-auto border-transparent bg-transparent p-0 text-primary underline underline-offset-2',
}

const buttonSizeClass: Record<ButtonSize, string> = {
  default: 'min-h-9 px-4 py-2 text-sm',
  sm: 'min-h-8 px-3 py-1.5 text-[0.8125rem]',
  lg: 'min-h-11 px-5 py-2.5 text-base',
  icon: 'size-9 p-0',
}

export interface ButtonProps {
  ariaDisabled?: boolean
  ariaLabel?: string
  children?: RemixNode
  class?: string
  disabled?: boolean
  href?: string
  name?: string
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  value?: string
  variant?: ButtonVariant
}

export function Button(handle: Handle<ButtonProps>) {
  return () => {
    let {
      ariaDisabled,
      ariaLabel,
      children,
      class: className,
      disabled,
      href,
      name,
      size = 'default',
      type = 'button',
      value,
      variant = 'default',
    } = handle.props
    let mergedClass = classes(
      buttonBase,
      buttonVariantClass[variant],
      buttonSizeClass[size],
      'radcn-button',
      className,
    )

    if (href) {
      return (
        <a
          class={mergedClass}
          data-radcn-button
          data-size={size}
          data-variant={variant}
          href={href}
          aria-disabled={ariaDisabled ? 'true' : undefined}
          aria-label={ariaLabel}
        >
          {children}
        </a>
      )
    }

    return (
      <button
        class={mergedClass}
        data-radcn-button
        data-size={size}
        data-variant={variant}
        disabled={disabled}
        name={name}
        type={type}
        value={value}
        aria-disabled={ariaDisabled ? 'true' : undefined}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    )
  }
}
`,
      },
    ],
  },
}
