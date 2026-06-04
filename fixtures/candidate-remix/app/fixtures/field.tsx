import type { FixtureScenario } from '../../../scenarios/types.ts'

const fieldStyle = 'display:grid;gap:8px;max-width:360px'
const labelStyle = 'font:500 14px/1.2 ui-sans-serif,system-ui,sans-serif;color:#18181b'
const descriptionStyle = 'font:400 13px/1.4 ui-sans-serif,system-ui,sans-serif;color:#71717a;margin:0'
const inputBaseStyle = [
  'height:36px',
  'border-radius:6px',
  'border:1px solid #e4e4e7',
  'padding:0 12px',
  'font:400 14px/1 ui-sans-serif,system-ui,sans-serif',
  'color:#18181b',
].join(';')

export function renderFieldFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'input-invalid':
      return (
        <div style={fieldStyle}>
          <label for="candidate-email-invalid" style={labelStyle}>
            Email
          </label>
          <input
            id="candidate-email-invalid"
            aria-invalid="true"
            aria-describedby="candidate-email-invalid-error"
            value="not-an-email"
            style={`${inputBaseStyle};border-color:#dc2626`}
          />
          <p id="candidate-email-invalid-error" style={`${descriptionStyle};color:#dc2626`}>
            Enter a valid email address.
          </p>
        </div>
      )
    case 'input-disabled':
      return (
        <div style={fieldStyle}>
          <label for="candidate-email-disabled" style={`${labelStyle};color:#71717a`}>
            Email
          </label>
          <input
            id="candidate-email-disabled"
            disabled
            placeholder="name@example.com"
            style={`${inputBaseStyle};background:#f4f4f5;color:#71717a`}
          />
          <p style={descriptionStyle}>This field is currently unavailable.</p>
        </div>
      )
    default:
      return (
        <div style={fieldStyle}>
          <label for="candidate-email" style={labelStyle}>
            Email
          </label>
          <input id="candidate-email" placeholder="name@example.com" style={inputBaseStyle} />
          <p style={descriptionStyle}>Use the email address for your account.</p>
        </div>
      )
  }
}
