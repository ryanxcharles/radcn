import { run } from 'remix/ui'
import { enhanceAlertDialog } from 'radcn/alert-dialog'
import { enhanceCalendar } from 'radcn/calendar'
import { enhanceCarousel } from 'radcn/carousel'
import { enhanceCombobox } from 'radcn/combobox'
import { enhanceCommand } from 'radcn/command'
import { enhanceContextMenu } from 'radcn/context-menu'
import { enhanceDatePicker } from 'radcn/date-picker'
import { enhanceDialog } from 'radcn/dialog'
import { enhanceDrawer } from 'radcn/drawer'
import { enhanceDropdownMenu } from 'radcn/dropdown-menu'
import { enhanceHoverCard } from 'radcn/hover-card'
import { enhanceInputGroup } from 'radcn/input-group'
import { enhanceInputOTP } from 'radcn/input-otp'
import { enhanceMenubar } from 'radcn/menubar'
import { enhanceNavigationMenu } from 'radcn/navigation-menu'
import { enhancePopover } from 'radcn/popover'
import { enhanceResizable } from 'radcn/resizable'
import { enhanceSelect } from 'radcn/select'
import { enhanceSheet } from 'radcn/sheet'
import { enhanceSidebar } from 'radcn/sidebar'
import { enhanceSlider } from 'radcn/slider'
import { enhanceToaster } from 'radcn/sonner'
import { enhanceTabs } from 'radcn/tabs'
import { enhanceToggle } from 'radcn/toggle'
import { enhanceToggleGroup } from 'radcn/toggle-group'
import { enhanceTooltip } from 'radcn/tooltip'

run({
  async loadModule(moduleUrl, exportName) {
    let mod = await import(moduleUrl)
    return mod[exportName]
  },
})

enhanceTabs()
enhanceDialog()
enhanceAlertDialog()
enhanceSheet()
enhanceDrawer()
enhanceSelect()
enhanceCalendar()
enhanceDatePicker()
enhanceCarousel()
enhanceCombobox()
enhanceCommand()
enhanceDropdownMenu()
enhanceContextMenu()
enhanceMenubar()
enhanceNavigationMenu()
enhancePopover()
enhanceTooltip()
enhanceHoverCard()
enhanceResizable()
enhanceSidebar()
enhanceSlider()
enhanceToaster()
enhanceToggle()
enhanceToggleGroup()
enhanceInputGroup()
enhanceInputOTP()

function enhanceFixtureCarouselStatus(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-fixture-carousel-example]').forEach((example) => {
    let carousel = example.querySelector<HTMLElement>('[data-radcn-carousel]')
    let status = example.querySelector<HTMLElement>('[data-fixture-carousel-status]')
    if (!carousel || !status || status.dataset.fixtureCarouselStatusReady === 'true') return

    let sync = () => {
      let current = carousel.dataset.current || '1'
      let count = carousel.dataset.count || String(carousel.querySelectorAll('[data-radcn-carousel-item]').length || 0)
      status.textContent = `Slide ${current} of ${count}`
    }

    carousel.addEventListener('radcn-carousel-select', sync)
    carousel.addEventListener('radcn-carousel-scroll', sync)
    new MutationObserver(sync).observe(carousel, {
      attributeFilter: ['data-current', 'data-count'],
      attributes: true,
    })
    status.dataset.fixtureCarouselStatusReady = 'true'
    sync()
  })
}

function enhanceFixtureCarouselAutoplay(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-fixture-carousel-autoplay="true"]').forEach((example) => {
    if (example.dataset.fixtureCarouselAutoplayReady === 'true') return
    let carousel = example.querySelector<HTMLElement>('[data-radcn-carousel]')
    let next = example.querySelector<HTMLButtonElement>('[data-radcn-carousel-next]')
    if (!carousel || !next) return

    let delay = Number(example.dataset.fixtureCarouselDelay || '2000')
    let timer: number | undefined

    let tick = () => {
      if (next.disabled) {
        carousel.focus()
        carousel.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Home' }))
      } else {
        next.click()
      }
    }

    let start = () => {
      window.clearInterval(timer)
      timer = window.setInterval(tick, delay)
      example.dataset.autoplay = 'running'
    }

    let stop = () => {
      window.clearInterval(timer)
      timer = undefined
      example.dataset.autoplay = 'paused'
    }

    example.addEventListener('mouseenter', stop)
    example.addEventListener('mouseleave', start)
    example.dataset.fixtureCarouselAutoplayReady = 'true'
    start()
  })
}

enhanceFixtureCarouselStatus()
enhanceFixtureCarouselAutoplay()
