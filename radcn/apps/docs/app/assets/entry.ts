import { run } from 'remix/ui'

const THEME_STORAGE_KEY = 'radcn-theme'
type RadcnTheme = 'light' | 'dark'

function safeStoredTheme(): RadcnTheme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function setTheme(theme: RadcnTheme) {
  document.documentElement.dataset.radcnTheme = theme
  document.querySelectorAll<HTMLButtonElement>('[data-radcn-theme-toggle]').forEach((button) => {
    let isDark = theme === 'dark'
    button.setAttribute('aria-pressed', isDark ? 'true' : 'false')
    button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme')

    let label = button.querySelector<HTMLElement>('[data-radcn-theme-toggle-label]')
    if (label) label.textContent = isDark ? 'Dark' : 'Light'

    let icon = button.querySelector<HTMLElement>('[data-radcn-theme-toggle-icon]')
    if (icon) icon.textContent = isDark ? 'Moon' : 'Sun'
  })

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Theme switching should still work when storage is unavailable.
  }
}

function setupThemeToggle() {
  setTheme(safeStoredTheme())

  document.addEventListener('click', (event) => {
    let target = event.target
    if (!(target instanceof Element)) return

    let button = target.closest<HTMLButtonElement>('[data-radcn-theme-toggle]')
    if (!button) return

    event.preventDefault()
    setTheme(document.documentElement.dataset.radcnTheme === 'dark' ? 'light' : 'dark')
  })
}

setupThemeToggle()

run({
  async loadModule(moduleUrl, exportName) {
    let mod = await import(moduleUrl)
    return mod[exportName]
  },
})
