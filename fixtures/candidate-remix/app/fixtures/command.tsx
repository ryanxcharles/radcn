import type { FixtureScenario } from '../../../scenarios/types.ts'
import type { RemixNode } from 'remix/ui'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from 'radcn'

function CommandShell({
  children,
  className,
  defaultQuery,
  dialog,
  id = 'candidate-command',
}: {
  children?: RemixNode
  className?: string
  defaultQuery?: string
  dialog?: boolean
  id?: string
}) {
  let command = (
    <Command class={className} id={id}>
      <CommandInput ariaLabel="Command" defaultValue={defaultQuery} placeholder="Type a command or search..." />
      <CommandList>
        {children || commandItems()}
        <CommandEmpty>No command found.</CommandEmpty>
      </CommandList>
    </Command>
  )

  if (dialog) {
    return <CommandDialog defaultOpen title="Command Palette" description="Search for an action.">{command}</CommandDialog>
  }

  return <div data-default-query={defaultQuery} style="width:min(100%,420px)">{command}</div>
}

function commandItems() {
  return (
    <>
      <CommandGroup>
        <CommandItem value="open-file">Open File<CommandShortcut>Cmd+O</CommandShortcut></CommandItem>
        <CommandItem value="save-file">Save File<CommandShortcut>Cmd+S</CommandShortcut></CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup>
        <CommandItem disabled value="deploy">Deploy disabled</CommandItem>
        <CommandItem value="settings">Settings<CommandShortcut>Cmd+,</CommandShortcut></CommandItem>
      </CommandGroup>
    </>
  )
}

export function renderCommandFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'filtering':
      return CommandShell({ defaultQuery: 'set', id: 'candidate-command-filtering' })
    case 'empty':
      return CommandShell({ defaultQuery: 'zzzz', id: 'candidate-command-empty' })
    case 'groups':
      return CommandShell({ id: 'candidate-command-groups' })
    case 'disabled':
      return CommandShell({ id: 'candidate-command-disabled' })
    case 'shortcuts':
      return CommandShell({ id: 'candidate-command-shortcuts' })
    case 'checked':
      return CommandShell({ children: <CommandItem checked value="settings">Settings</CommandItem>, id: 'candidate-command-checked' })
    case 'dialog':
      return CommandShell({ dialog: true, id: 'candidate-command-dialog' })
    case 'custom-token':
      return CommandShell({ className: 'radcn-fixture-custom-command', id: 'candidate-command-custom' })
    default:
      return CommandShell({ id: 'candidate-command-default' })
  }
}
