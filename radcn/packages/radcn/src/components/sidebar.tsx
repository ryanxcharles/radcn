import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

// Sidebar surfaces as Tailwind utilities (Issue 6, Experiment 62). The collapse
// width/margin are the sidebar's OWN data-variants (the enhancer sets data-collapsible
// to the mode only when collapsed, so data-[collapsible=icon] implies collapsed): the
// sidebar READS a var and the variant SETS it (no flex-basis/margin conflict, Exp 41).
// Two genuinely descendant cascades stay bespoke in tokens.css, repointed to the kept
// data attributes (reliable here because each target has no conflicting base utility):
// the collapse-hide (display:none on the menu-button label span / input / group-label)
// and the inner floating/inset add-ons. The group-label keeps its class as a marker for
// that hide; the menu-button keeps data-radcn-sidebar-menu-button + its style-less
// --variant/--size markers. Comments here are ASCII; no bracketed class-like tokens.
const sidebarProviderClass =
  '[--radcn-sidebar-width:16rem] [--radcn-sidebar-width-icon:3.5rem] flex w-[min(100%,48rem)] min-h-80 border border-[var(--radcn-sidebar-border,var(--radcn-border))] rounded-md overflow-hidden bg-background text-foreground [font-family:var(--radcn-font)]'
const sidebarClass =
  'relative flex-[0_0_var(--radcn-sidebar-cur-width,var(--radcn-sidebar-width))] [border-inline-end:1px_solid_var(--radcn-sidebar-border,var(--radcn-border))] bg-[var(--radcn-sidebar-bg,var(--radcn-muted))] text-[var(--radcn-sidebar-fg,var(--radcn-foreground))] [transition:flex-basis_160ms_ease,margin_160ms_ease] [margin-inline-start:var(--radcn-sidebar-mis,0)] [margin-inline-end:var(--radcn-sidebar-mie,0)] data-[side=right]:order-2 data-[side=right]:[border-inline-end:0] data-[side=right]:[border-inline-start:1px_solid_var(--radcn-sidebar-border,var(--radcn-border))] data-[collapsible=icon]:[--radcn-sidebar-cur-width:var(--radcn-sidebar-width-icon)] data-[collapsible=offcanvas]:[--radcn-sidebar-mis:calc(var(--radcn-sidebar-width)*-1)] data-[collapsible=offcanvas]:data-[side=right]:[--radcn-sidebar-mis:0] data-[collapsible=offcanvas]:data-[side=right]:[--radcn-sidebar-mie:calc(var(--radcn-sidebar-width)*-1)]'
const sidebarColumnClass = 'flex min-h-full flex-col'
const sidebarSectionClass = 'grid gap-2 p-3'
const sidebarGroupLabelClass = 'radcn-sidebar-group-label text-muted-foreground text-[0.75rem] font-semibold'
const sidebarMenuClass = 'grid m-0 p-0 gap-1 list-none'
const sidebarMenuItemClass = 'relative'
const sidebarMenuButtonBase =
  'flex w-full items-center gap-2 border-0 rounded-[calc(var(--radcn-radius)-0.125rem)] bg-transparent text-inherit p-2 text-left no-underline font-medium text-[0.875rem] leading-[1.2] [font-family:var(--radcn-font)] data-[active=true]:bg-[var(--radcn-sidebar-accent,var(--radcn-accent))] data-[active=true]:text-[var(--radcn-sidebar-accent-fg,var(--radcn-accent-foreground))]'
const sidebarMenuButtonClass = `${sidebarMenuButtonBase} hover:bg-[var(--radcn-sidebar-accent,var(--radcn-accent))] hover:text-[var(--radcn-sidebar-accent-fg,var(--radcn-accent-foreground))] disabled:opacity-50 aria-disabled:opacity-50`
const sidebarMenuSubButtonClass = sidebarMenuButtonBase
const sidebarChrome =
  'border border-[var(--radcn-sidebar-border,var(--radcn-border))] rounded-[calc(var(--radcn-radius)-0.125rem)] bg-background text-inherit cursor-pointer'
const sidebarTriggerClass = sidebarChrome
const sidebarMenuActionClass = `absolute top-1.5 right-1.5 ${sidebarChrome}`
const sidebarMenuBadgeClass = 'absolute top-1.5 right-1.5'
const sidebarRailClass = `${sidebarChrome} absolute inset-y-0 [inset-inline-end:-0.25rem] w-2 p-0`
const sidebarInputClass =
  'w-full border border-[var(--radcn-sidebar-border,var(--radcn-border))] rounded-[calc(var(--radcn-radius)-0.125rem)] bg-background p-2'
const sidebarSeparatorClass = 'h-px m-2 bg-[var(--radcn-sidebar-border,var(--radcn-border))]'
const sidebarInsetClass = 'flex-1 min-w-0 p-4 bg-background'
const sidebarSkeletonClass =
  'h-8 rounded-[calc(var(--radcn-radius)-0.125rem)] [background:linear-gradient(90deg,var(--radcn-muted),var(--radcn-border),var(--radcn-muted))] text-transparent'

export type SidebarSide = 'left' | 'right'
export type SidebarVariant = 'sidebar' | 'floating' | 'inset'
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none'
export type SidebarState = 'expanded' | 'collapsed'

export interface SidebarProviderProps {
  children?: RemixNode
  class?: string
  defaultOpen?: boolean
  id?: string
  shortcut?: string
  style?: string
}

export interface SidebarProps {
  children?: RemixNode
  class?: string
  collapsible?: SidebarCollapsible
  side?: SidebarSide
  style?: string
  variant?: SidebarVariant
}

export interface SidebarPartProps {
  children?: RemixNode
  class?: string
  style?: string
}

export interface SidebarButtonProps extends SidebarPartProps {
  ariaLabel?: string
  disabled?: boolean
  href?: string
  isActive?: boolean
  size?: 'sm' | 'default' | 'lg'
  tooltip?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'outline'
}

export interface SidebarInputProps {
  ariaLabel?: string
  class?: string
  disabled?: boolean
  id?: string
  name?: string
  placeholder?: string
  style?: string
  value?: string
}

function setupSidebarProvider(provider: HTMLElement) {
  if (provider.dataset.radcnSidebarReady === 'true') return
  let shortcut = (provider.dataset.shortcut || 'b').toLowerCase()

  function setState(state: SidebarState, emit = false) {
    provider.dataset.state = state
    provider.querySelectorAll<HTMLElement>('[data-radcn-sidebar]').forEach((sidebar) => {
      sidebar.dataset.state = state
      sidebar.dataset.collapsible = state === 'collapsed' ? sidebar.dataset.collapsibleMode || '' : ''
    })
    if (emit) {
      provider.dispatchEvent(new CustomEvent('radcn-sidebar-change', { bubbles: true, detail: { state } }))
    }
  }

  function toggle() {
    setState(provider.dataset.state === 'collapsed' ? 'expanded' : 'collapsed', true)
  }

  provider.addEventListener('click', (event) => {
    let target = event.target
    if (!(target instanceof Element)) return
    if (target.closest('[data-radcn-sidebar-trigger], [data-radcn-sidebar-rail]')) {
      event.preventDefault()
      toggle()
    }
  })

  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === shortcut && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      toggle()
    }
  })

  setState(provider.dataset.state === 'collapsed' ? 'collapsed' : 'expanded')
  provider.dataset.radcnSidebarReady = 'true'
}

export function enhanceSidebar(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-radcn-sidebar-provider]').forEach(setupSidebarProvider)
}

export function SidebarProvider(handle: Handle<SidebarProviderProps>) {
  return () => {
    let { children, class: className, defaultOpen = true, id, shortcut = 'b', style } = handle.props
    let state = defaultOpen ? 'expanded' : 'collapsed'
    return (
      <div class={classes(sidebarProviderClass, className)} data-radcn-sidebar-provider data-shortcut={shortcut} data-state={state} id={id} style={style}>
        {children}
      </div>
    )
  }
}

export function Sidebar(handle: Handle<SidebarProps>) {
  return () => {
    let { children, class: className, collapsible = 'offcanvas', side = 'left', style, variant = 'sidebar' } = handle.props
    return (
      <aside class={classes(sidebarClass, className)} data-collapsible-mode={collapsible} data-radcn-sidebar data-side={side} data-variant={variant} style={style}>
        <div class={sidebarColumnClass} data-radcn-sidebar-inner>{children}</div>
      </aside>
    )
  }
}

export function SidebarTrigger(handle: Handle<SidebarButtonProps>) {
  return () => {
    let { ariaLabel = 'Toggle Sidebar', children = '☰', class: className, disabled, style, type = 'button' } = handle.props
    return <button aria-label={ariaLabel} class={classes(sidebarTriggerClass, className)} data-radcn-sidebar-trigger disabled={disabled} style={style} type={type}>{children}</button>
  }
}

export function SidebarRail(handle: Handle<SidebarPartProps>) {
  return () => {
    let { class: className, style } = handle.props
    return <button aria-label="Toggle Sidebar" class={classes(sidebarRailClass, className)} data-radcn-sidebar-rail style={style} type="button" />
  }
}

export function SidebarInset(handle: Handle<SidebarPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props
    return <main class={classes(sidebarInsetClass, className)} data-radcn-sidebar-inset style={style}>{children}</main>
  }
}

function part(tag: 'div' | 'header' | 'footer' | 'nav' | 'ul' | 'li', base: string, data: string, handle: Handle<SidebarPartProps>) {
  let { children, class: className, style } = handle.props
  let props = { class: classes(base, className), [`data-radcn-${data}`]: '', style }
  if (tag === 'header') return <header {...props}>{children}</header>
  if (tag === 'footer') return <footer {...props}>{children}</footer>
  if (tag === 'nav') return <nav {...props}>{children}</nav>
  if (tag === 'ul') return <ul {...props}>{children}</ul>
  if (tag === 'li') return <li {...props}>{children}</li>
  return <div {...props}>{children}</div>
}

export function SidebarHeader(handle: Handle<SidebarPartProps>) { return () => part('header', sidebarSectionClass, 'sidebar-header', handle) }
export function SidebarFooter(handle: Handle<SidebarPartProps>) { return () => part('footer', sidebarSectionClass, 'sidebar-footer', handle) }
export function SidebarContent(handle: Handle<SidebarPartProps>) { return () => part('div', sidebarColumnClass, 'sidebar-content', handle) }
export function SidebarGroup(handle: Handle<SidebarPartProps>) { return () => part('div', sidebarSectionClass, 'sidebar-group', handle) }
export function SidebarGroupLabel(handle: Handle<SidebarPartProps>) { return () => part('div', sidebarGroupLabelClass, 'sidebar-group-label', handle) }
export function SidebarGroupAction(handle: Handle<SidebarButtonProps>) {
  return () => {
    let { ariaLabel, children = '+', class: className, disabled, style, type = 'button' } = handle.props
    return <button aria-label={ariaLabel} class={classes(sidebarMenuActionClass, className)} data-radcn-sidebar-group-action disabled={disabled} style={style} type={type}>{children}</button>
  }
}
export function SidebarGroupContent(handle: Handle<SidebarPartProps>) { return () => part('div', 'radcn-sidebar-group-content', 'sidebar-group-content', handle) }
export function SidebarMenu(handle: Handle<SidebarPartProps>) { return () => part('ul', sidebarMenuClass, 'sidebar-menu', handle) }
export function SidebarMenuItem(handle: Handle<SidebarPartProps>) { return () => part('li', sidebarMenuItemClass, 'sidebar-menu-item', handle) }
export function SidebarMenuSub(handle: Handle<SidebarPartProps>) { return () => part('ul', sidebarMenuClass, 'sidebar-menu-sub', handle) }
export function SidebarMenuSubItem(handle: Handle<SidebarPartProps>) { return () => part('li', 'radcn-sidebar-menu-sub-item', 'sidebar-menu-sub-item', handle) }

export function SidebarMenuButton(handle: Handle<SidebarButtonProps>) {
  return () => {
    let { ariaLabel, children, class: className, disabled, href, isActive, size = 'default', style, tooltip, type = 'button', variant = 'default' } = handle.props
    let classValue = classes(sidebarMenuButtonClass, `radcn-sidebar-menu-button--${variant}`, `radcn-sidebar-menu-button--${size}`, className)
    if (href) {
      return <a aria-label={ariaLabel} aria-disabled={disabled ? 'true' : undefined} class={classValue} data-active={isActive ? 'true' : 'false'} data-radcn-sidebar-menu-button data-size={size} data-tooltip={tooltip} data-variant={variant} href={href} style={style}>{children}</a>
    }
    return <button aria-label={ariaLabel} class={classValue} data-active={isActive ? 'true' : 'false'} data-radcn-sidebar-menu-button data-size={size} data-tooltip={tooltip} data-variant={variant} disabled={disabled} style={style} type={type}>{children}</button>
  }
}

export function SidebarMenuAction(handle: Handle<SidebarButtonProps>) {
  return () => {
    let { ariaLabel, children = '⋯', class: className, disabled, style, type = 'button' } = handle.props
    return <button aria-label={ariaLabel} class={classes(sidebarMenuActionClass, className)} data-radcn-sidebar-menu-action disabled={disabled} style={style} type={type}>{children}</button>
  }
}

export function SidebarMenuBadge(handle: Handle<SidebarPartProps>) { return () => part('div', sidebarMenuBadgeClass, 'sidebar-menu-badge', handle) }
export function SidebarMenuSkeleton(handle: Handle<SidebarPartProps>) { return () => part('div', sidebarSkeletonClass, 'sidebar-menu-skeleton', handle) }
export function SidebarMenuSubButton(handle: Handle<SidebarButtonProps>) {
  return () => {
    let { ariaLabel, children, class: className, disabled, href, isActive, size = 'default', style, tooltip, type = 'button', variant = 'default' } = handle.props
    let classValue = classes(sidebarMenuSubButtonClass, `radcn-sidebar-menu-sub-button--${size}`, className)
    if (href) {
      return <a aria-label={ariaLabel} aria-disabled={disabled ? 'true' : undefined} class={classValue} data-active={isActive ? 'true' : 'false'} data-radcn-sidebar-menu-sub-button data-size={size} data-tooltip={tooltip} data-variant={variant} href={href} style={style}>{children}</a>
    }
    return <button aria-label={ariaLabel} class={classValue} data-active={isActive ? 'true' : 'false'} data-radcn-sidebar-menu-sub-button data-size={size} data-tooltip={tooltip} data-variant={variant} disabled={disabled} style={style} type={type}>{children}</button>
  }
}
export function SidebarInput(handle: Handle<SidebarInputProps>) {
  return () => {
    let { ariaLabel, class: className, disabled, id, name, placeholder, style, value } = handle.props
    return <input aria-label={ariaLabel} class={classes(sidebarInputClass, className)} data-radcn-sidebar-input disabled={disabled} id={id} name={name} placeholder={placeholder} style={style} value={value} />
  }
}
export function SidebarSeparator(handle: Handle<SidebarPartProps>) { return () => <div class={classes(sidebarSeparatorClass, handle.props.class)} data-radcn-sidebar-separator role="separator" style={handle.props.style} /> }
