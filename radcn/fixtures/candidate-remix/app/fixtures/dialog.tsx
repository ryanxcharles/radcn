import type { FixtureScenario } from '../../../scenarios/types.ts'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from 'radcn'

export function renderDialogFixture(fixture: FixtureScenario) {
  let defaultOpen = fixture.id === 'default-open'
  let custom = fixture.id === 'custom-token'
  let label = fixture.id === 'outside-dismiss' ? 'Open dismissible dialog' : 'Open dialog'

  return (
    <Dialog defaultOpen={defaultOpen} id={`candidate-dialog-${fixture.id}`}>
      <DialogTrigger>{label}</DialogTrigger>
      <DialogPortal class={custom ? 'radcn-fixture-custom-dialog' : undefined}>
        <DialogOverlay />
        <DialogContent class={custom ? 'radcn-fixture-custom-dialog' : undefined} showCloseButton={fixture.id !== 'close-button'}>
          <DialogHeader>
            <DialogTitle>{custom ? 'Custom dialog' : 'Project settings'}</DialogTitle>
            <DialogDescription>Update project details and close the modal when finished.</DialogDescription>
          </DialogHeader>
          <label style="display:grid;gap:6px;font:500 0.875rem/1.2 var(--radcn-font)">
            Project name
            <input class="radcn-input" data-dialog-name-input value="RadCN" />
          </label>
          <DialogFooter>
            <DialogClose>Save changes</DialogClose>
            {fixture.id === 'close-button' && <DialogClose ariaLabel="Cancel">Cancel</DialogClose>}
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
