import { cn } from "../lib/utils"

const items = [
  ["react", "React"],
  ["remix", "Remix"],
  ["svelte", "Svelte"],
  ["vue", "Vue"],
] as const

function ReferenceCombobox({
  children,
  className,
  disabled,
  invalid,
  multiple,
  open = true,
  placeholder = "Search framework",
  selected = "remix",
  popper,
}: {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  invalid?: boolean
  multiple?: boolean
  open?: boolean
  placeholder?: string
  selected?: string
  popper?: boolean
}) {
  let selectedLabel = items.find(([value]) => value === selected)?.[1] || ""

  return (
    <div className={cn("reference-combobox", className)} data-invalid={invalid ? "true" : undefined} data-open={open ? "true" : "false"}>
      {multiple && (
        <div className="reference-combobox-chips">
          <span className="reference-combobox-chip">React <button type="button">x</button></span>
          <span className="reference-combobox-chip">Remix <button type="button">x</button></span>
        </div>
      )}
      <div className="reference-combobox-control">
        <input aria-expanded={open} aria-haspopup="listbox" className="reference-combobox-input" disabled={disabled} placeholder={placeholder} role="combobox" value={selectedLabel} readOnly />
        <button className="reference-combobox-clear" type="button">x</button>
        <button className="reference-combobox-trigger" type="button">v</button>
      </div>
      {open && (
        <div className={cn("reference-combobox-content", popper && "reference-combobox-content--popper")} data-align={popper ? "end" : "start"} data-side={popper ? "right" : "bottom"}>
          <div className="reference-combobox-list" role="listbox">
            {children || items.map(([value, label]) => (
              <div aria-selected={selected === value} className="reference-combobox-item" data-highlighted={selected === value ? "true" : "false"} data-selected={selected === value ? "true" : "false"} key={value} role="option"><span className="reference-combobox-indicator">{selected === value ? "✓" : ""}</span><span>{label}</span></div>
            ))}
            <div className="reference-combobox-empty" hidden>No frameworks found.</div>
          </div>
        </div>
      )}
    </div>
  )
}

function groupedItems() {
  return (
    <>
      <div className="reference-combobox-group" role="group">
        <div className="reference-combobox-label">Libraries</div>
        <div aria-selected="false" className="reference-combobox-item" role="option"><span className="reference-combobox-indicator" /><span>React</span></div>
        <div aria-selected="true" className="reference-combobox-item" data-selected="true" role="option"><span className="reference-combobox-indicator">✓</span><span>Remix</span></div>
      </div>
      <div className="reference-combobox-separator" role="separator" />
      <div className="reference-combobox-group" role="group">
        <div className="reference-combobox-label">Meta frameworks</div>
        <div aria-selected="false" className="reference-combobox-item" role="option"><span className="reference-combobox-indicator" /><span>Astro</span></div>
        <div aria-disabled="true" aria-selected="false" className="reference-combobox-item" data-disabled="true" role="option"><span className="reference-combobox-indicator" /><span>Beta disabled</span></div>
      </div>
    </>
  )
}

export function renderComboboxFixture(id: string) {
  switch (id) {
    case "placeholder":
      return <ReferenceCombobox open={false} selected="" />
    case "groups":
      return <ReferenceCombobox selected="remix">{groupedItems()}</ReferenceCombobox>
    case "disabled-invalid":
      return <div className="grid gap-4"><ReferenceCombobox disabled open={false} selected="react" /><ReferenceCombobox invalid selected="" /></div>
    case "clearable":
      return <ReferenceCombobox selected="svelte" />
    case "chips-multiple":
      return <ReferenceCombobox multiple selected="react" />
    case "form-submit-reset":
      return <ReferenceCombobox selected="react" />
    case "popper-placement":
      return <div className="reference-combobox-edge"><ReferenceCombobox popper selected="vue" /></div>
    case "custom-token":
      return <ReferenceCombobox className="reference-fixture-custom-combobox" selected="remix" />
    default:
      return <ReferenceCombobox selected="remix" />
  }
}
