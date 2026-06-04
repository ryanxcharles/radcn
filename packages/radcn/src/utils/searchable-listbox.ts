export interface SearchableListboxOptions {
  emptySelector?: string
  groupSelector?: string
  input: HTMLInputElement
  itemSelector: string
  list: HTMLElement
  root: HTMLElement
}

export interface SearchableListboxController {
  activeItem: () => HTMLElement | null
  filter: (query?: string) => HTMLElement[]
  highlight: (item: HTMLElement | null) => void
  move: (direction: 1 | -1) => void
  visibleItems: () => HTMLElement[]
}

function itemText(item: HTMLElement) {
  return [
    item.dataset.text,
    item.dataset.value,
    item.dataset.keywords,
    item.textContent,
  ].filter(Boolean).join(' ').trim().toLowerCase()
}

function isDisabled(item: HTMLElement) {
  return item.dataset.disabled === 'true' || item.getAttribute('aria-disabled') === 'true'
}

function visibleEnabledItems(list: HTMLElement, selector: string) {
  return Array.from(list.querySelectorAll<HTMLElement>(selector)).filter((item) => {
    if (item.hidden || isDisabled(item)) return false
    return !item.closest('[hidden]')
  })
}

export function setupSearchableListbox(options: SearchableListboxOptions): SearchableListboxController {
  let { emptySelector, groupSelector, input, itemSelector, list, root } = options

  function visibleItems() {
    return visibleEnabledItems(list, itemSelector)
  }

  function clearHighlight() {
    list.querySelectorAll<HTMLElement>(itemSelector).forEach((item) => {
      item.dataset.highlighted = 'false'
    })
    input.removeAttribute('aria-activedescendant')
  }

  function activeItem() {
    let activeId = input.getAttribute('aria-activedescendant')
    return activeId ? document.getElementById(activeId) as HTMLElement | null : null
  }

  function highlight(item: HTMLElement | null) {
    if (!item || item.hidden || isDisabled(item)) {
      clearHighlight()
      return
    }

    clearHighlight()
    item.id = item.id || `${root.id || 'radcn-searchable'}-item-${item.dataset.value || Math.random().toString(36).slice(2)}`
    item.dataset.highlighted = 'true'
    input.setAttribute('aria-activedescendant', item.id)
    item.scrollIntoView({ block: 'nearest' })
  }

  function move(direction: 1 | -1) {
    let items = visibleItems()
    if (items.length === 0) return
    let active = activeItem()
    let index = active ? items.indexOf(active) : -1
    highlight(items[(index + direction + items.length) % items.length])
  }

  function syncGroups() {
    if (!groupSelector) return
    list.querySelectorAll<HTMLElement>(groupSelector).forEach((group) => {
      let hasVisible = Array.from(group.querySelectorAll<HTMLElement>(itemSelector)).some((item) => !item.hidden)
      group.hidden = !hasVisible
    })
  }

  function syncEmpty(count: number) {
    root.dataset.empty = count === 0 ? 'true' : 'false'
    if (!emptySelector) return
    list.querySelectorAll<HTMLElement>(emptySelector).forEach((empty) => {
      empty.hidden = count !== 0
      empty.dataset.empty = count === 0 ? 'true' : 'false'
    })
  }

  function filter(query = input.value) {
    let normalized = query.trim().toLowerCase()
    let visibleCount = 0
    list.querySelectorAll<HTMLElement>(itemSelector).forEach((item) => {
      let visible = normalized.length === 0 || itemText(item).includes(normalized)
      item.hidden = !visible
      if (visible) visibleCount += 1
    })
    root.dataset.query = query
    input.dataset.query = query
    syncGroups()
    syncEmpty(visibleCount)
    let items = visibleItems()
    if (!items.includes(activeItem() as HTMLElement)) highlight(items[0] || null)
    return items
  }

  return {
    activeItem,
    filter,
    highlight,
    move,
    visibleItems,
  }
}
