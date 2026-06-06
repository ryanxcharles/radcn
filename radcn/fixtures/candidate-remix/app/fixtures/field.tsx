import type { FixtureScenario } from '../../../scenarios/types.ts'
import {
  Button,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  Slider,
  Switch,
  Textarea,
} from 'radcn'

function FieldSelect() {
  return (
    <Select defaultValue="card" id="candidate-field-select-payment" name="payment">
      <SelectTrigger ariaLabel="Payment method" id="candidate-field-payment-trigger">
        <SelectValue placeholder="Select payment">Card</SelectValue>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectViewport>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="bank">Bank account</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  )
}

export function renderFieldFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'demo':
      return (
        <form action="/fixtures/field/demo" method="get" style="display:grid;gap:18px;max-width:560px">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Payment details</FieldLegend>
              <FieldDescription>Checkout fields are grouped with native fieldset semantics.</FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel for="candidate-field-demo-name">Name on card</FieldLabel>
                  <Input id="candidate-field-demo-name" name="name" value="Ada Lovelace" />
                </Field>
                <Field>
                  <FieldLabel for="candidate-field-demo-payment">Payment method</FieldLabel>
                  {FieldSelect()}
                  <FieldDescription>Enhanced selects still submit a native hidden value.</FieldDescription>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox checked id="candidate-field-demo-save" name="save" value="yes" />
                  <FieldContent>
                    <FieldLabel for="candidate-field-demo-save">Save payment method</FieldLabel>
                    <FieldDescription>Store this method for future deploys.</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <Field>
              <FieldLabel for="candidate-field-demo-notes">Notes</FieldLabel>
              <Textarea id="candidate-field-demo-notes" name="notes" value="Bill this workspace monthly." />
            </Field>
            <div style="display:flex;gap:12px">
              <Button type="submit">Continue</Button>
              <Button type="reset" variant="outline">Reset</Button>
            </div>
          </FieldGroup>
        </form>
      )
    case 'input':
      return (
        <FieldSet>
          <FieldLegend>Account</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel for="candidate-field-username">Username</FieldLabel>
              <Input id="candidate-field-username" name="username" placeholder="radcn" />
              <FieldDescription>This is your public workspace slug.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel for="candidate-field-password">Password</FieldLabel>
              <Input id="candidate-field-password" name="password" value="radical" />
            </Field>
          </FieldGroup>
        </FieldSet>
      )
    case 'textarea':
      return (
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel for="candidate-field-bio">Bio</FieldLabel>
              <Textarea id="candidate-field-bio" name="bio" value="Server-rendered components with browser-owned enhancement." />
              <FieldDescription>Tell collaborators what this workspace is for.</FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      )
    case 'fieldset':
      return (
        <FieldSet>
          <FieldLegend>Shipping address</FieldLegend>
          <FieldDescription>FieldSet and FieldLegend render real fieldset and legend elements.</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel for="candidate-field-street">Street</FieldLabel>
              <Input id="candidate-field-street" name="street" value="404 Web Way" />
            </Field>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel for="candidate-field-city">City</FieldLabel>
                <Input id="candidate-field-city" name="city" value="Chicago" />
              </FieldContent>
              <FieldContent>
                <FieldLabel for="candidate-field-postal">Postal code</FieldLabel>
                <Input id="candidate-field-postal" name="postal" value="60606" />
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      )
    case 'radio':
      return (
        <FieldSet>
          <FieldLegend>Plan</FieldLegend>
          <FieldDescription>Select one deployment plan.</FieldDescription>
          <RadioGroup name="plan">
            <FieldGroup>
              <Field orientation="horizontal">
                <RadioGroupItem checked id="candidate-field-plan-free" name="plan" value="free" />
                <FieldLabel for="candidate-field-plan-free">Free</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem id="candidate-field-plan-pro" name="plan" value="pro" />
                <FieldLabel for="candidate-field-plan-pro">Pro</FieldLabel>
              </Field>
            </FieldGroup>
          </RadioGroup>
        </FieldSet>
      )
    case 'checkbox':
      return (
        <FieldSet>
          <FieldLegend>Notifications</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox checked id="candidate-field-email-alerts" name="notifications" value="email" />
              <FieldContent>
                <FieldLabel for="candidate-field-email-alerts">Email alerts</FieldLabel>
                <FieldDescription>Receive deploy and security alerts.</FieldDescription>
              </FieldContent>
            </Field>
            <FieldSeparator />
            <Field orientation="horizontal">
              <Checkbox id="candidate-field-sms-alerts" name="notifications" value="sms" />
              <FieldContent>
                <FieldLabel for="candidate-field-sms-alerts">SMS alerts</FieldLabel>
                <FieldDescription>Send urgent incident messages.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      )
    case 'switch':
      return (
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel for="candidate-field-switch">Security emails</FieldLabel>
            <FieldDescription>Receive emails for important account events.</FieldDescription>
          </FieldContent>
          <Switch checked id="candidate-field-switch" name="security_emails" />
        </Field>
      )
    case 'slider':
      return (
        <Field>
          <FieldTitle>Budget range</FieldTitle>
          <FieldDescription>Server default: $200 to $800. Native range inputs submit both ends.</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel for="candidate-field-slider-min">Minimum budget</FieldLabel>
              <Slider ariaLabel="Minimum budget" defaultValue={200} id="candidate-field-slider-min" max={1000} min={0} name="budget_min" step={50} />
            </Field>
            <Field>
              <FieldLabel for="candidate-field-slider-max">Maximum budget</FieldLabel>
              <Slider ariaLabel="Maximum budget" defaultValue={800} id="candidate-field-slider-max" max={1000} min={0} name="budget_max" step={50} />
            </Field>
          </FieldGroup>
        </Field>
      )
    case 'select':
      return (
        <Field>
          <FieldLabel for="candidate-field-payment-trigger">Payment method</FieldLabel>
          {FieldSelect()}
          <FieldDescription>Select values are submitted through a native hidden input.</FieldDescription>
        </Field>
      )
    case 'choice-card':
      return (
        <RadioGroup name="hosting">
          <FieldGroup>
            <Field class="radcn-field--choice-card" orientation="horizontal">
              <RadioGroupItem checked id="candidate-field-choice-hobby" name="hosting" value="hobby" />
              <FieldContent>
                <FieldLabel for="candidate-field-choice-hobby">
                  <FieldTitle>Hobby</FieldTitle>
                </FieldLabel>
                <FieldDescription>Best for prototypes and small demos.</FieldDescription>
              </FieldContent>
            </Field>
            <Field class="radcn-field--choice-card" orientation="horizontal">
              <RadioGroupItem id="candidate-field-choice-pro" name="hosting" value="pro" />
              <FieldContent>
                <FieldLabel for="candidate-field-choice-pro">
                  <FieldTitle>Pro</FieldTitle>
                </FieldLabel>
                <FieldDescription>Production deploys with team controls.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </RadioGroup>
      )
    case 'group':
      return (
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Profile visibility</FieldLegend>
            <Field orientation="horizontal">
              <Checkbox checked id="candidate-field-public-profile" name="visibility" value="public" />
              <FieldContent>
                <FieldLabel for="candidate-field-public-profile">Public profile</FieldLabel>
                <FieldDescription>Show your workspace in community listings.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Newsletter</FieldLegend>
            <Field orientation="horizontal">
              <Checkbox id="candidate-field-product-news" name="newsletter" value="product" />
              <FieldContent>
                <FieldLabel for="candidate-field-product-news">Product news</FieldLabel>
                <FieldDescription>Get updates and release notes.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldSet>
        </FieldGroup>
      )
    case 'responsive':
      return (
        <form action="/fixtures/field/responsive" method="get" style="display:grid;gap:16px;max-width:640px">
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel for="candidate-field-responsive-name">Project name</FieldLabel>
              <FieldDescription>The label and help stay beside the control on wide screens.</FieldDescription>
            </FieldContent>
            <Input id="candidate-field-responsive-name" name="project" value="RadCN docs" />
          </Field>
          <FieldSeparator />
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel for="candidate-field-responsive-notes">Launch notes</FieldLabel>
              <FieldDescription>Responsive fields collapse to one column on small screens.</FieldDescription>
            </FieldContent>
            <Textarea id="candidate-field-responsive-notes" name="notes" value="Ship the field parity examples." />
          </Field>
          <div style="display:flex;gap:12px;justify-content:flex-end">
            <Button type="reset" variant="outline">Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      )
    case 'input-invalid':
      return (
        <Field invalid>
          <Label for="candidate-email-invalid">Email</Label>
          <Input
            id="candidate-email-invalid"
            ariaInvalid
            ariaDescribedBy="candidate-email-invalid-error"
            name="email"
            value="not-an-email"
          />
          <FieldError id="candidate-email-invalid-error">
            Enter a valid email address.
          </FieldError>
        </Field>
      )
    case 'input-disabled':
      return (
        <Field>
          <Label disabled for="candidate-email-disabled">Email</Label>
          <Input
            id="candidate-email-disabled"
            disabled
            name="email"
            placeholder="name@example.com"
          />
          <FieldDescription>This field is currently unavailable.</FieldDescription>
        </Field>
      )
    case 'required':
      return (
        <Field>
          <Label for="candidate-email-required">Email</Label>
          <Input id="candidate-email-required" name="email" placeholder="name@example.com" required />
          <FieldDescription>Required email address.</FieldDescription>
        </Field>
      )
    case 'custom-error-token':
      return (
        <Field class="radcn-fixture-custom-field" invalid>
          <Label for="candidate-email-custom-error">Email</Label>
          <Input
            id="candidate-email-custom-error"
            ariaInvalid
            ariaDescribedBy="candidate-email-custom-error-message"
            name="email"
            value="not-an-email"
          />
          <FieldError id="candidate-email-custom-error-message">
            Custom token error color.
          </FieldError>
        </Field>
      )
    default:
      return (
        <Field>
          <Label for="candidate-email">Email</Label>
          <Input id="candidate-email" name="email" placeholder="name@example.com" />
          <FieldDescription>Use the email address for your account.</FieldDescription>
        </Field>
      )
  }
}
