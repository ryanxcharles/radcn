import type { FixtureScenario } from '../../../scenarios/types.ts'
import { Button, Input, Textarea } from 'radcn'
import { Form, FormDescription, FormField, FormLabel, FormMessage, formControlAttributes, formFieldIds } from 'radcn/form'

export function renderFormFixture(fixture: FixtureScenario) {
  let nativeEmail = formFieldIds('candidate-form-native-email')
  let serverEmail = formFieldIds('candidate-form-server-email')
  let actionName = formFieldIds('candidate-form-action-name')
  let customMessage = formFieldIds('candidate-form-custom-message')

  switch (fixture.id) {
    case 'server-errors':
      let serverControl = formControlAttributes(serverEmail, { invalid: true, message: true })

      return (
        <Form action="/fixtures/form/server-errors" method="get">
          <FormField invalid name="email">
            <FormLabel error for={serverControl.id}>Email</FormLabel>
            <Input
              ariaDescribedBy={serverControl.ariaDescribedBy}
              ariaInvalid={serverControl.ariaInvalid}
              id={serverControl.id}
              name="email"
              value="not-an-email"
            />
            <FormDescription id={serverEmail.descriptionId}>Use your work email address.</FormDescription>
            <FormMessage id={serverEmail.messageId}>Use a valid email address.</FormMessage>
          </FormField>
          <Button name="intent" type="submit" value="retry">Try again</Button>
        </Form>
      )
    case 'action-state':
      let actionControl = formControlAttributes(actionName)

      return (
        <Form action="/fixtures/form/action-state" method="get">
          <FormField name="project">
            <FormLabel for={actionControl.id}>Project</FormLabel>
            <Input ariaDescribedBy={actionControl.ariaDescribedBy} id={actionControl.id} name="project" value="RadCN" />
            <FormDescription id={actionName.descriptionId}>Last saved value: RadCN</FormDescription>
          </FormField>
          <Button name="intent" type="submit" value="save">Save</Button>
        </Form>
      )
    case 'custom-token':
      let customControl = formControlAttributes(customMessage, { invalid: true, message: true })

      return (
        <Form action="/fixtures/form/custom-token" class="radcn-fixture-custom-field" method="get">
          <FormField invalid name="message">
            <FormLabel error for={customControl.id}>Message</FormLabel>
            <Textarea
              ariaDescribedBy={customControl.ariaDescribedBy}
              ariaInvalid={customControl.ariaInvalid}
              id={customControl.id}
              name="message"
              value="Too short"
            />
            <FormDescription id={customMessage.descriptionId}>Keep it short and specific.</FormDescription>
            <FormMessage id={customMessage.messageId}>Custom token form error.</FormMessage>
          </FormField>
          <Button type="submit">Send</Button>
        </Form>
      )
    default:
      let nativeControl = formControlAttributes(nativeEmail)

      return (
        <Form action="/fixtures/form/native-validation" method="get">
          <FormField name="email">
            <FormLabel for={nativeControl.id}>Email</FormLabel>
            <Input
              ariaDescribedBy={nativeControl.ariaDescribedBy}
              id={nativeControl.id}
              name="email"
              placeholder="name@example.com"
              required
            />
            <FormDescription id={nativeEmail.descriptionId}>Native required validation owns this field.</FormDescription>
          </FormField>
          <Button name="intent" type="submit" value="submit">Submit</Button>
        </Form>
      )
  }
}
