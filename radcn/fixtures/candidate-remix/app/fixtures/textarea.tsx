import type { FixtureScenario } from '../../../scenarios/types.ts'
import { Button, Field, FieldDescription, Label, Textarea } from 'radcn'

export function renderTextareaFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'demo':
      return <Textarea name="message" placeholder="Type your message here." />
    case 'disabled':
      return (
        <Field>
          <Label disabled for="candidate-message-disabled">Message</Label>
          <Textarea
            disabled
            id="candidate-message-disabled"
            name="message"
            value="Disabled textarea content"
          />
          <FieldDescription>This textarea is disabled for the fixture.</FieldDescription>
        </Field>
      )
    case 'with-button':
      return (
        <form action="/fixtures/textarea/with-button" method="get" style="display:grid;gap:8px;width:min(100%,360px)">
          <Textarea name="message" placeholder="Type your message here." />
          <Button name="intent" type="submit" value="send">Send message</Button>
        </form>
      )
    case 'with-label':
      return (
        <Field>
          <Label for="candidate-textarea-message">Your message</Label>
          <Textarea id="candidate-textarea-message" name="message" placeholder="Type your message here." />
        </Field>
      )
    case 'with-text':
      return (
        <Field>
          <Label for="candidate-textarea-message-2">Your Message</Label>
          <Textarea
            ariaDescribedBy="candidate-textarea-message-2-help"
            id="candidate-textarea-message-2"
            name="message"
            placeholder="Type your message here."
          />
          <FieldDescription id="candidate-textarea-message-2-help">
            Your message will be copied to the support team.
          </FieldDescription>
        </Field>
      )
    default:
      return (
        <Field>
          <Label for="candidate-message">Message</Label>
          <Textarea id="candidate-message" name="message" placeholder="Write a message" />
          <FieldDescription>Use a stable message for the fixture.</FieldDescription>
        </Field>
      )
  }
}
