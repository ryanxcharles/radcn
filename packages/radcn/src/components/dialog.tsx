import type { Handle, RemixNode } from 'remix/ui'

import { classes } from '../utils/classes.ts'

export interface DialogProps {
  children?: RemixNode
  class?: string
  defaultOpen?: boolean
  dismissible?: boolean
  id?: string
  style?: string
}

export interface DialogPartProps {
  children?: RemixNode
  class?: string
  style?: string
}

export interface DialogButtonProps extends DialogPartProps {
  ariaLabel?: string
}

export interface DialogContentProps extends DialogPartProps {
  ariaLabel?: string
  showCloseButton?: boolean
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

let openDialogs: HTMLElement[] = []
let previousBodyOverflow = ''

function safeDialogId(value: string | undefined) {
  return String(value || 'dialog').replace(/[^a-zA-Z0-9_-]/g, '-')
}

function portalHost(scope: HTMLElement | null) {
  let host = scope?.querySelector<HTMLElement>('[data-radcn-portal-root]') || document.querySelector<HTMLElement>('[data-radcn-portal-root]')
  if (host) return host

  host = document.createElement('div')
  host.dataset.radcnPortalRoot = ''
  ;(scope || document.body).append(host)
  return host
}

function focusableElements(content: HTMLElement) {
  return Array.from(content.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
    if (element.hasAttribute('disabled')) return false
    if (element.getAttribute('aria-hidden') === 'true') return false
    return element.offsetParent !== null || element === document.activeElement
  })
}

function lockScroll() {
  if (openDialogs.length > 0) return
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

function unlockScroll() {
  if (openDialogs.length > 0) return
  document.body.style.overflow = previousBodyOverflow
}

function setState(root: HTMLElement, portal: HTMLElement, state: 'open' | 'closed') {
  root.dataset.state = state
  root.dataset.open = state === 'open' ? 'true' : 'false'
  portal.dataset.state = state
  portal.hidden = state !== 'open'
  portal.querySelectorAll<HTMLElement>('[data-radcn-dialog-overlay], [data-radcn-dialog-content]').forEach((part) => {
    part.dataset.state = state
    part.hidden = state !== 'open'
  })
  root.querySelectorAll<HTMLElement>('[data-radcn-dialog-trigger]').forEach((trigger) => {
    trigger.dataset.state = state
  })
}

function setupDialog(root: HTMLElement) {
  if (root.dataset.radcnDialogReady === 'true') return

  let dialogId = root.id || `radcn-dialog-${Math.random().toString(36).slice(2)}`
  root.id = dialogId

  let portal = root.querySelector<HTMLElement>('[data-radcn-dialog-portal]')
  let content = root.querySelector<HTMLElement>('[data-radcn-dialog-content]')
  if (!portal || !content) return
  let dialogPortal = portal
  let dialogContent = content

  let trigger = root.querySelector<HTMLElement>('[data-radcn-dialog-trigger]')
  let title = dialogContent.querySelector<HTMLElement>('[data-radcn-dialog-title]')
  let description = dialogContent.querySelector<HTMLElement>('[data-radcn-dialog-description]')
  let dismissible = root.dataset.dismissible !== 'false'
  let lastFocused: HTMLElement | null = null

  dialogPortal.dataset.dialogId = dialogId
  dialogContent.id = dialogContent.id || `${dialogId}-content`
  dialogContent.setAttribute('role', 'dialog')
  dialogContent.setAttribute('aria-modal', 'true')
  dialogContent.tabIndex = -1

  if (title) {
    title.id = title.id || `${dialogId}-title`
    dialogContent.setAttribute('aria-labelledby', title.id)
  }

  if (description) {
    description.id = description.id || `${dialogId}-description`
    dialogContent.setAttribute('aria-describedby', description.id)
  }

  portalHost(root.closest<HTMLElement>('[data-fixture-stage]')).append(dialogPortal)

  function open() {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    lockScroll()
    if (!openDialogs.includes(root)) openDialogs.push(root)
    setState(root, dialogPortal, 'open')
    let first = focusableElements(dialogContent)[0]
    ;(first || dialogContent).focus()
  }

  function close(restoreFocus = true) {
    openDialogs = openDialogs.filter((dialog) => dialog !== root)
    setState(root, dialogPortal, 'closed')
    unlockScroll()
    if (restoreFocus) (lastFocused || trigger)?.focus()
  }

  root.addEventListener('click', (event) => {
    let target = event.target
    if (!(target instanceof Element)) return

    let triggerButton = target.closest<HTMLElement>('[data-radcn-dialog-trigger]')
    if (triggerButton && root.contains(triggerButton)) {
      event.preventDefault()
      open()
    }
  })

  dialogPortal.addEventListener('click', (event) => {
    let target = event.target
    if (!(target instanceof Element)) return

    if (target.closest('[data-radcn-dialog-close]')) {
      event.preventDefault()
      close()
      return
    }

    if (dismissible && target.closest('[data-radcn-dialog-overlay]')) {
      close()
    }
  })

  dialogPortal.addEventListener('keydown', (event) => {
    if (dialogPortal.hidden) return

    if (event.key === 'Escape' && dismissible) {
      event.preventDefault()
      close()
      return
    }

    if (event.key !== 'Tab') return

    let focusable = focusableElements(dialogContent)
    if (focusable.length === 0) {
      event.preventDefault()
      dialogContent.focus()
      return
    }

    let first = focusable[0]
    let last = focusable[focusable.length - 1]
    let active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  })

  if (root.dataset.defaultOpen === 'true') open()
  else setState(root, dialogPortal, 'closed')

  root.dataset.radcnDialogReady = 'true'
}

export function enhanceDialog(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-radcn-dialog]').forEach(setupDialog)
}

export function Dialog(handle: Handle<DialogProps>) {
  return () => {
    let { children, class: className, defaultOpen, dismissible = true, id, style } = handle.props

    return (
      <div
        class={classes('radcn-dialog', className)}
        data-default-open={defaultOpen ? 'true' : undefined}
        data-dismissible={dismissible ? 'true' : 'false'}
        data-open={defaultOpen ? 'true' : 'false'}
        data-radcn-dialog
        data-state={defaultOpen ? 'open' : 'closed'}
        id={id}
        style={style}
      >
        {children}
      </div>
    )
  }
}

export function DialogTrigger(handle: Handle<DialogButtonProps>) {
  return () => {
    let { ariaLabel, children, class: className, style } = handle.props

    return (
      <button
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        class={classes('radcn-dialog-trigger', className)}
        data-radcn-dialog-trigger
        data-state="closed"
        style={style}
        type="button"
      >
        {children}
      </button>
    )
  }
}

export function DialogPortal(handle: Handle<DialogPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes('radcn-dialog-portal', className)} data-radcn-dialog-portal data-state="closed" hidden style={style}>
        {children}
      </div>
    )
  }
}

export function DialogOverlay(handle: Handle<DialogPartProps>) {
  return () => {
    let { class: className, style } = handle.props

    return <div class={classes('radcn-dialog-overlay', className)} data-radcn-dialog-overlay data-state="closed" hidden style={style} />
  }
}

export function DialogContent(handle: Handle<DialogContentProps>) {
  return () => {
    let { ariaLabel, children, class: className, showCloseButton = true, style } = handle.props

    return (
      <div
        aria-label={ariaLabel}
        class={classes('radcn-dialog-content', className)}
        data-radcn-dialog-content
        data-state="closed"
        hidden
        style={style}
      >
        {children}
        {showCloseButton && (
          <button aria-label="Close" class="radcn-dialog-close" data-radcn-dialog-close type="button">
            <span aria-hidden="true">x</span>
          </button>
        )}
      </div>
    )
  }
}

export function DialogClose(handle: Handle<DialogButtonProps>) {
  return () => {
    let { ariaLabel, children, class: className, style } = handle.props

    return (
      <button aria-label={ariaLabel} class={classes('radcn-dialog-close', className)} data-radcn-dialog-close style={style} type="button">
        {children}
      </button>
    )
  }
}

export function DialogHeader(handle: Handle<DialogPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes('radcn-dialog-header', className)} data-radcn-dialog-header style={style}>
        {children}
      </div>
    )
  }
}

export function DialogFooter(handle: Handle<DialogPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <div class={classes('radcn-dialog-footer', className)} data-radcn-dialog-footer style={style}>
        {children}
      </div>
    )
  }
}

export function DialogTitle(handle: Handle<DialogPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <h2 class={classes('radcn-dialog-title', className)} data-radcn-dialog-title style={style}>
        {children}
      </h2>
    )
  }
}

export function DialogDescription(handle: Handle<DialogPartProps>) {
  return () => {
    let { children, class: className, style } = handle.props

    return (
      <p class={classes('radcn-dialog-description', className)} data-radcn-dialog-description style={style}>
        {children}
      </p>
    )
  }
}
