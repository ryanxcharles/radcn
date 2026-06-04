import type { FixtureScenario } from '../../../scenarios/types.ts'

const accordionStyle = 'display:grid;max-width:520px;border-top:1px solid #e4e4e7'
const itemStyle = 'border-bottom:1px solid #e4e4e7'
const summaryStyle = [
  'display:flex',
  'width:100%',
  'align-items:center',
  'justify-content:space-between',
  'padding:16px 0',
  'font:500 14px/1.2 ui-sans-serif,system-ui,sans-serif',
  'cursor:pointer',
].join(';')
const contentStyle = 'padding:0 0 16px;color:#71717a;font:400 14px/1.5 ui-sans-serif,system-ui,sans-serif'

export function renderAccordionFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'multiple':
      return (
        <div style={accordionStyle}>
          <details open style={itemStyle}>
            <summary style={summaryStyle}>Is it styled?</summary>
            <div style={contentStyle}>Yes. The placeholder keeps a stable accordion shape.</div>
          </details>
          <details open style={itemStyle}>
            <summary style={summaryStyle}>Can multiple items open?</summary>
            <div style={contentStyle}>This static fixture renders multiple open panels.</div>
          </details>
        </div>
      )
    case 'disabled-item':
      return (
        <div style={accordionStyle}>
          <details open style={itemStyle}>
            <summary style={summaryStyle}>Enabled item</summary>
            <div style={contentStyle}>The enabled item is visible for comparison.</div>
          </details>
          <div aria-disabled="true" style={`${itemStyle};opacity:.5`}>
            <div style={`${summaryStyle};cursor:not-allowed`}>Disabled item</div>
          </div>
        </div>
      )
    default:
      return (
        <div style={accordionStyle}>
          <details open style={itemStyle}>
            <summary style={summaryStyle}>What is RadCN?</summary>
            <div style={contentStyle}>
              RadCN is the Remix 3 candidate component library being compared against shadcn/ui.
            </div>
          </details>
        </div>
      )
  }
}
