import type { FixtureScenario } from '../../../scenarios/types.ts'
import {
  Checkbox,
  Field,
  FieldDescription,
  FieldError,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Switch,
} from 'radcn'

const inlineControlStyle = 'display:flex;align-items:center;gap:10px'
const formStyle = 'display:grid;gap:12px;max-width:360px'
const buttonRowStyle = 'display:flex;gap:12px'
const radioRowStyle = 'display:flex;align-items:center;gap:10px'
const checkboxDescriptionStyle = 'margin:0;color:var(--radcn-muted-foreground);font-size:0.875rem;line-height:1.35'
const checkboxStackStyle = 'display:grid;gap:24px;max-width:420px'
const checkboxCardStyle = 'display:flex;align-items:flex-start;gap:12px;border:1px solid #2563eb;border-radius:8px;padding:12px;background:#eff6ff'

export function renderLabelFixture(_fixture: FixtureScenario) {
  return (
    <div>
      <div
        data-candidate-label-family="label-demo"
        data-candidate-label-layout="inline"
        style="display:flex;align-items:center;gap:8px"
      >
        <Checkbox id="terms" name="terms" />
        <Label for="terms">Accept terms and conditions</Label>
      </div>
    </div>
  )
}

export function renderCheckboxFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'demo':
      return (
        <div style={checkboxStackStyle}>
          <div style={inlineControlStyle}>
            <Checkbox id="candidate-checkbox-terms" name="terms" />
            <Label for="candidate-checkbox-terms">Accept terms and conditions</Label>
          </div>
          <div style="display:flex;align-items:flex-start;gap:12px">
            <Checkbox checked id="candidate-checkbox-terms-2" name="terms-2" />
            <div style="display:grid;gap:8px">
              <Label for="candidate-checkbox-terms-2">Accept terms and conditions</Label>
              <p style={checkboxDescriptionStyle}>By clicking this checkbox, you agree to the terms and conditions.</p>
            </div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:12px">
            <Checkbox disabled id="candidate-checkbox-toggle" name="toggle" />
            <Label disabled for="candidate-checkbox-toggle">Enable notifications</Label>
          </div>
          <label data-radcn-checkbox-demo-card style={checkboxCardStyle}>
            <Checkbox
              checked
              class="radcn-fixture-custom-checkbox"
              id="candidate-checkbox-toggle-2"
              name="toggle-2"
              style="--radcn-control-checked-bg:#2563eb;--radcn-control-border:#2563eb"
            />
            <div style="display:grid;gap:6px;font-weight:400">
              <span style="font-size:0.875rem;line-height:1;font-weight:500">Enable notifications</span>
              <p style={checkboxDescriptionStyle}>You can enable or disable notifications at any time.</p>
            </div>
          </label>
        </div>
      )
    case 'disabled-upstream':
      return (
        <div style={inlineControlStyle}>
          <Checkbox disabled id="candidate-checkbox-terms2" name="terms2" />
          <Label disabled for="candidate-checkbox-terms2">Accept terms and conditions</Label>
        </div>
      )
    case 'with-text':
      return (
        <div style="display:flex;align-items:flex-start;gap:8px">
          <Checkbox id="candidate-checkbox-terms1" name="terms1" />
          <div style="display:grid;gap:6px;line-height:1">
            <Label for="candidate-checkbox-terms1">Accept terms and conditions</Label>
            <p style={checkboxDescriptionStyle}>You agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      )
    case 'checked':
      return (
        <div style={inlineControlStyle}>
          <Checkbox checked id="candidate-checkbox-checked" name="notifications" value="email" />
          <Label for="candidate-checkbox-checked">Email notifications</Label>
        </div>
      )
    case 'disabled':
      return (
        <div style={inlineControlStyle}>
          <Checkbox disabled id="candidate-checkbox-disabled" name="notifications" value="push" />
          <Label disabled for="candidate-checkbox-disabled">Push notifications</Label>
        </div>
      )
    case 'invalid':
      return (
        <Field invalid>
          <div style={inlineControlStyle}>
            <Checkbox
              ariaDescribedBy="candidate-checkbox-error"
              ariaInvalid
              id="candidate-checkbox-invalid"
              name="terms"
              required
              value="accepted"
            />
            <Label for="candidate-checkbox-invalid">Accept terms</Label>
          </div>
          <FieldError id="candidate-checkbox-error">Accept the terms to continue.</FieldError>
        </Field>
      )
    case 'indeterminate':
      return (
        <div style={inlineControlStyle}>
          <Checkbox id="candidate-checkbox-mixed" indeterminate name="permissions" value="partial" />
          <Label for="candidate-checkbox-mixed">Some permissions selected</Label>
        </div>
      )
    case 'custom-token':
      return (
        <div style={inlineControlStyle}>
          <Checkbox checked class="radcn-fixture-custom-checkbox" id="candidate-checkbox-custom" name="custom" value="yes" />
          <Label for="candidate-checkbox-custom">Custom checkbox</Label>
        </div>
      )
    case 'form-submit-reset':
      return (
        <form action="/fixtures/checkbox/form-submit-reset" method="get" style={formStyle}>
          <div style={inlineControlStyle}>
            <Checkbox checked id="candidate-checkbox-form" name="agree" value="yes" />
            <Label for="candidate-checkbox-form">Agree to updates</Label>
          </div>
          <div style={buttonRowStyle}>
            <button name="intent" type="submit" value="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </form>
      )
    default:
      return (
        <div style={inlineControlStyle}>
          <Checkbox id="candidate-checkbox-default" name="notifications" value="email" />
          <Label for="candidate-checkbox-default">Email notifications</Label>
        </div>
      )
  }
}

export function renderRadioGroupFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'demo':
      return (
        <div data-candidate-radio-group-family="radio-group-demo">
          <RadioGroup name="radio-group-demo">
            <div class="flex items-center gap-3" data-candidate-radio-group-row style="display:flex;align-items:center;gap:0.75rem">
              <RadioGroupItem id="r1" name="radio-group-demo" value="default" />
              <Label for="r1">Default</Label>
            </div>
            <div class="flex items-center gap-3" data-candidate-radio-group-row style="display:flex;align-items:center;gap:0.75rem">
              <RadioGroupItem checked id="r2" name="radio-group-demo" value="comfortable" />
              <Label for="r2">Comfortable</Label>
            </div>
            <div class="flex items-center gap-3" data-candidate-radio-group-row style="display:flex;align-items:center;gap:0.75rem">
              <RadioGroupItem id="r3" name="radio-group-demo" value="compact" />
              <Label for="r3">Compact</Label>
            </div>
          </RadioGroup>
        </div>
      )
    case 'disabled':
      return (
        <RadioGroup name="priority">
          <div style={radioRowStyle}>
            <RadioGroupItem disabled id="candidate-radio-disabled-low" name="priority" value="low" />
            <Label disabled for="candidate-radio-disabled-low">Low</Label>
          </div>
          <div style={radioRowStyle}>
            <RadioGroupItem checked disabled id="candidate-radio-disabled-high" name="priority" value="high" />
            <Label disabled for="candidate-radio-disabled-high">High</Label>
          </div>
        </RadioGroup>
      )
    case 'invalid':
      return (
        <Field invalid>
          <RadioGroup ariaDescribedBy="candidate-radio-error" ariaInvalid name="plan">
            <div style={radioRowStyle}>
              <RadioGroupItem ariaInvalid id="candidate-radio-invalid-basic" name="plan" required value="basic" />
              <Label for="candidate-radio-invalid-basic">Basic</Label>
            </div>
            <div style={radioRowStyle}>
              <RadioGroupItem ariaInvalid id="candidate-radio-invalid-pro" name="plan" required value="pro" />
              <Label for="candidate-radio-invalid-pro">Pro</Label>
            </div>
          </RadioGroup>
          <FieldError id="candidate-radio-error">Choose a plan.</FieldError>
        </Field>
      )
    case 'custom-token':
      return (
        <RadioGroup class="radcn-fixture-custom-radio" name="theme">
          <div style={radioRowStyle}>
            <RadioGroupItem checked class="radcn-fixture-custom-radio" id="candidate-radio-custom-system" name="theme" value="system" />
            <Label for="candidate-radio-custom-system">System</Label>
          </div>
          <div style={radioRowStyle}>
            <RadioGroupItem class="radcn-fixture-custom-radio" id="candidate-radio-custom-light" name="theme" value="light" />
            <Label for="candidate-radio-custom-light">Light</Label>
          </div>
        </RadioGroup>
      )
    case 'form-submit-reset':
      return (
        <form action="/fixtures/radio-group/form-submit-reset" method="get" style={formStyle}>
          <RadioGroup name="contact">
            <div style={radioRowStyle}>
              <RadioGroupItem checked id="candidate-radio-form-email" name="contact" value="email" />
              <Label for="candidate-radio-form-email">Email</Label>
            </div>
            <div style={radioRowStyle}>
              <RadioGroupItem id="candidate-radio-form-sms" name="contact" value="sms" />
              <Label for="candidate-radio-form-sms">SMS</Label>
            </div>
          </RadioGroup>
          <div style={buttonRowStyle}>
            <button name="intent" type="submit" value="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </form>
      )
    default:
      return (
        <RadioGroup name="priority">
          <div style={radioRowStyle}>
            <RadioGroupItem checked id="candidate-radio-default-low" name="priority" value="low" />
            <Label for="candidate-radio-default-low">Low</Label>
          </div>
          <div style={radioRowStyle}>
            <RadioGroupItem id="candidate-radio-default-high" name="priority" value="high" />
            <Label for="candidate-radio-default-high">High</Label>
          </div>
        </RadioGroup>
      )
  }
}

export function renderSwitchFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'checked':
      return (
        <div style={inlineControlStyle}>
          <Switch checked id="candidate-switch-checked" name="availability" value="online" />
          <Label for="candidate-switch-checked">Available</Label>
        </div>
      )
    case 'disabled':
      return (
        <div style={inlineControlStyle}>
          <Switch disabled id="candidate-switch-disabled" name="availability" value="online" />
          <Label disabled for="candidate-switch-disabled">Available</Label>
        </div>
      )
    case 'custom-token':
      return (
        <div style={inlineControlStyle}>
          <Switch checked class="radcn-fixture-custom-switch" id="candidate-switch-custom" name="availability" size="sm" value="online" />
          <Label for="candidate-switch-custom">Custom switch</Label>
        </div>
      )
    case 'form-submit-reset':
      return (
        <form action="/fixtures/switch/form-submit-reset" method="get" style={formStyle}>
          <div style={inlineControlStyle}>
            <Switch checked id="candidate-switch-form" name="dark" value="on" />
            <Label for="candidate-switch-form">Dark mode</Label>
          </div>
          <div style={buttonRowStyle}>
            <button name="intent" type="submit" value="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </form>
      )
    default:
      return (
        <div style={inlineControlStyle}>
          <Switch id="candidate-switch-default" name="availability" value="online" />
          <Label for="candidate-switch-default">Available</Label>
        </div>
      )
  }
}

export function renderProgressFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'demo':
      return (
        <div data-fixture-progress-family="progress-demo" style="width:100%;">
          <Field>
            <Label>Progress</Label>
            <Progress ariaLabel="Progress" class="w-[60%]" value={13} style="width:60%;" />
            <FieldDescription>Timed progress demo.</FieldDescription>
          </Field>
        </div>
      )
    case 'indeterminate':
      return (
        <Field>
          <Label>Syncing files</Label>
          <Progress ariaLabel="Syncing files" />
          <FieldDescription>Waiting for progress details.</FieldDescription>
        </Field>
      )
    case 'custom-token':
      return (
        <Field>
          <Label>Upload progress</Label>
          <Progress ariaLabel="Upload progress" class="radcn-fixture-custom-progress" value={72} />
          <FieldDescription>Custom progress tokens.</FieldDescription>
        </Field>
      )
    default:
      return (
        <Field>
          <Label>Upload progress</Label>
          <Progress ariaLabel="Upload progress" value={48} />
          <FieldDescription>48 percent complete.</FieldDescription>
        </Field>
      )
  }
}
