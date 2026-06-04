import type { FixtureScenario } from '../../../scenarios/types.ts'
import type { RemixNode } from 'remix/ui'
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxPortal,
  ComboboxSeparator,
  ComboboxTrigger,
  Label,
} from 'radcn'

const items = [
  ['react', 'React'],
  ['remix', 'Remix'],
  ['svelte', 'Svelte'],
  ['vue', 'Vue'],
] as const

function ComboboxShell({
  children,
  className,
  defaultOpen,
  defaultValue,
  disabled,
  id = 'candidate-combobox',
  invalid,
  multiple,
  name = 'framework',
  placeholder = 'Search framework',
  side = 'bottom',
  align = 'start',
}: {
  align?: 'start' | 'center' | 'end'
  children?: RemixNode
  className?: string
  defaultOpen?: boolean
  defaultValue?: string
  disabled?: boolean
  id?: string
  invalid?: boolean
  multiple?: boolean
  name?: string
  placeholder?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <div style="display:grid;gap:8px;max-width:380px">
      <Label for={`${id}-input`} disabled={disabled}>Framework</Label>
      <Combobox class={className} defaultOpen={defaultOpen} defaultValue={defaultValue} disabled={disabled} id={id} invalid={invalid} multiple={multiple} name={name}>
        {multiple && (
          <ComboboxChips>
            <ComboboxChip value="react">React <ComboboxChipRemove /></ComboboxChip>
            <ComboboxChip value="remix">Remix <ComboboxChipRemove /></ComboboxChip>
            <ComboboxChip value="svelte">Svelte <ComboboxChipRemove /></ComboboxChip>
          </ComboboxChips>
        )}
        <div class="radcn-combobox-control">
          <ComboboxInput ariaLabel="Framework" disabled={disabled} placeholder={placeholder} />
          <ComboboxClear />
          <ComboboxTrigger />
        </div>
        <ComboboxPortal>
          <ComboboxContent align={align} class={className} side={side}>
            <ComboboxList>
              {children || items.map(([value, label]) => <ComboboxItem keywords={`${label} javascript`} textValue={label} value={value}>{label}</ComboboxItem>)}
              <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </ComboboxPortal>
      </Combobox>
    </div>
  )
}

function groupedItems() {
  return (
    <>
      <ComboboxGroup>
        <ComboboxLabel>Libraries</ComboboxLabel>
        <ComboboxItem textValue="React" value="react">React</ComboboxItem>
        <ComboboxItem textValue="Remix" value="remix">Remix</ComboboxItem>
      </ComboboxGroup>
      <ComboboxSeparator />
      <ComboboxGroup>
        <ComboboxLabel>Meta frameworks</ComboboxLabel>
        <ComboboxItem textValue="Astro" value="astro">Astro</ComboboxItem>
        <ComboboxItem disabled textValue="Beta disabled" value="beta">Beta disabled</ComboboxItem>
        <ComboboxItem textValue="SvelteKit" value="sveltekit">SvelteKit</ComboboxItem>
      </ComboboxGroup>
    </>
  )
}

export function renderComboboxFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'filtering':
      return ComboboxShell({ defaultOpen: true, defaultValue: 'react', id: 'candidate-combobox-filtering' })
    case 'placeholder':
      return ComboboxShell({ id: 'candidate-combobox-placeholder', placeholder: 'Pick a framework' })
    case 'groups':
      return ComboboxShell({ children: groupedItems(), defaultOpen: true, defaultValue: 'remix', id: 'candidate-combobox-groups' })
    case 'disabled-invalid':
      return <div style="display:grid;gap:18px">{ComboboxShell({ defaultValue: 'react', disabled: true, id: 'candidate-combobox-disabled' })}{ComboboxShell({ id: 'candidate-combobox-invalid', invalid: true })}</div>
    case 'clearable':
      return ComboboxShell({ defaultOpen: true, defaultValue: 'svelte', id: 'candidate-combobox-clearable' })
    case 'chips-multiple':
      return ComboboxShell({ defaultOpen: true, defaultValue: 'react,remix', id: 'candidate-combobox-chips', multiple: true, name: 'frameworks' })
    case 'form-submit-reset':
      return (
        <form action="/fixtures/combobox/form-submit-reset" method="get" style="display:grid;gap:12px;max-width:380px">
          {ComboboxShell({ defaultValue: 'react', id: 'candidate-combobox-form', name: 'framework' })}
          <div style="display:flex;gap:12px">
            <button name="intent" type="submit" value="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </form>
      )
    case 'popper-placement':
      return <div style="display:flex;justify-content:flex-end;width:100%;padding-top:80px">{ComboboxShell({ align: 'end', defaultOpen: true, defaultValue: 'vue', id: 'candidate-combobox-popper', side: 'right' })}</div>
    case 'custom-token':
      return ComboboxShell({ className: 'radcn-fixture-custom-combobox', defaultOpen: true, defaultValue: 'remix', id: 'candidate-combobox-custom' })
    default:
      return ComboboxShell({ defaultOpen: true, defaultValue: 'remix', id: 'candidate-combobox-default' })
  }
}
