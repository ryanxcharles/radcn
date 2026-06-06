import type { FixtureScenario } from '../../../scenarios/types.ts'
import { Button, Toaster, type ToastPayload } from 'radcn'

const duration = 0

function payload(type: ToastPayload['type'], title: string, description: string): ToastPayload {
  return { description, duration, title, type }
}

export function renderSonnerFixture(fixture: FixtureScenario) {
  if (fixture.id === 'demo') {
    return (
      <section style="display:grid;gap:16px;max-width:420px" data-radcn-sonner-recipe="demo">
        <span
          data-radcn-toast-trigger
          data-toast-action-label="Undo"
          data-toast-action-url="/fixtures/sonner/demo?undo=1"
          data-toast-description="Sunday, December 03, 2023 at 9:00 AM"
          data-toast-duration="0"
          data-toast-title="Event has been created"
        >
          <Button variant="outline">Show Toast</Button>
        </span>
        <Toaster defaultDuration={duration} />
      </section>
    )
  }

  if (fixture.id === 'types') {
    return (
      <section style="display:grid;gap:16px;max-width:520px" data-radcn-sonner-recipe="types">
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <span data-radcn-toast-trigger data-toast-duration="0" data-toast-title="Event has been created">
            <Button variant="outline">Default</Button>
          </span>
          <span data-radcn-toast-trigger data-toast-duration="0" data-toast-title="Event has been created" data-toast-type="success">
            <Button variant="outline">Success</Button>
          </span>
          <span data-radcn-toast-trigger data-toast-duration="0" data-toast-title="Be at the area 10 minutes before the event time" data-toast-type="info">
            <Button variant="outline">Info</Button>
          </span>
          <span data-radcn-toast-trigger data-toast-duration="0" data-toast-title="Event start time cannot be earlier than 8am" data-toast-type="warning">
            <Button variant="outline">Warning</Button>
          </span>
          <span data-radcn-toast-trigger data-toast-duration="0" data-toast-title="Event has not been created" data-toast-type="error">
            <Button variant="outline">Error</Button>
          </span>
          <span data-radcn-toast-trigger data-toast-duration="0" data-toast-title="Loading..." data-toast-type="loading">
            <Button variant="outline">Promise</Button>
          </span>
        </div>
        <p data-radcn-sonner-promise-mapping>
          toast.promise maps to app-owned orchestration that dispatches Loading...
          before dispatching Event has been created or Error.
        </p>
        <Toaster defaultDuration={duration} />
      </section>
    )
  }

  if (fixture.id === 'success') {
    return <Toaster defaultDuration={duration} toasts={[payload('success', 'Project published', 'The latest RadCN preview is live.')]} />
  }

  if (fixture.id === 'error') {
    return <Toaster defaultDuration={duration} toasts={[payload('error', 'Build failed', 'Fix the notification fixture before shipping.')]} />
  }

  if (fixture.id === 'loading') {
    return <Toaster defaultDuration={duration} toasts={[payload('loading', 'Syncing changes', 'This notification stays open until work completes.')]} />
  }

  if (fixture.id === 'action') {
    return <Toaster defaultDuration={duration} toasts={[{ actionLabel: 'Undo', actionUrl: '/fixtures/sonner/action?undo=1', description: 'The page can offer one focused follow-up.', duration, title: 'Item archived', type: 'default' }]} />
  }

  if (fixture.id === 'dismiss') {
    return <Toaster defaultDuration={duration} toasts={[{ description: 'Use the close button or Escape while focused.', duration, title: 'Dismiss me', type: 'info' }]} />
  }

  if (fixture.id === 'stack') {
    return (
      <Toaster
        defaultDuration={duration}
        toasts={[
          payload('success', 'Saved', 'Settings were stored.'),
          payload('info', 'Review queued', 'A teammate was notified.'),
          payload('warning', 'Deploy paused', 'Manual approval is required.'),
        ]}
      />
    )
  }

  if (fixture.id === 'custom-token') {
    return <Toaster class="radcn-fixture-custom-toaster" defaultDuration={duration} toasts={[payload('success', 'Custom tokens', 'Notification colors come from public variables.')]} />
  }

  return <Toaster defaultDuration={duration} toasts={[payload('default', 'Notification ready', 'RadCN renders initial toasts without Sonner.')]} />
}
