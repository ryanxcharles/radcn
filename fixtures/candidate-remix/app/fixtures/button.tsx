import type { FixtureScenario } from '../../../scenarios/types.ts'

const baseButtonStyle = [
  'display:inline-flex',
  'align-items:center',
  'justify-content:center',
  'height:36px',
  'width:max-content',
  'border-radius:6px',
  'border:1px solid transparent',
  'padding:0 16px',
  'font:500 14px/1 ui-sans-serif,system-ui,sans-serif',
  'text-decoration:none',
].join(';')

const variantStyles = {
  default: 'background:#18181b;color:#fafafa',
  secondary: 'background:#f4f4f5;color:#18181b',
  outline: 'background:#fff;color:#18181b;border-color:#e4e4e7',
  ghost: 'background:transparent;color:#18181b',
  destructive: 'background:#dc2626;color:#fff',
  disabled: 'background:#18181b;color:#fafafa;opacity:.5;cursor:not-allowed',
}

function buttonStyle(variant: keyof typeof variantStyles) {
  return `${baseButtonStyle};${variantStyles[variant]}`
}

export function renderButtonFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'variants':
      return (
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
          <button style={buttonStyle('default')}>Default</button>
          <button style={buttonStyle('secondary')}>Secondary</button>
          <button style={buttonStyle('outline')}>Outline</button>
          <button style={buttonStyle('ghost')}>Ghost</button>
          <button style={buttonStyle('destructive')}>Destructive</button>
        </div>
      )
    case 'disabled':
      return (
        <div style="display:flex;gap:12px;align-items:center">
          <button disabled style={buttonStyle('disabled')}>
            Disabled
          </button>
          <button aria-disabled="true" style={buttonStyle('disabled')}>
            Aria Disabled
          </button>
        </div>
      )
    case 'as-child-or-link':
      return (
        <a href="/fixtures/button/default" style={buttonStyle('default')}>
          Link Button
        </a>
      )
    default:
      return <button style={buttonStyle('default')}>Button</button>
  }
}
