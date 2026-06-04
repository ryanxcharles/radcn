import { cn } from "../lib/utils"

function ReferenceCommand({ className, dialog, query }: { className?: string; dialog?: boolean; query?: string }) {
  let isFiltered = query === "set"
  let command = (
    <div className={cn("reference-command", className)}>
      <div className="reference-command-input-wrapper"><input aria-controls="reference-command-list" className="reference-command-input" placeholder="Type a command or search..." value={query} readOnly={query !== undefined} /></div>
      <div className="reference-command-list" id="reference-command-list" role="listbox">
        <div className="reference-command-group" role="group" hidden={isFiltered}>
          <div aria-selected="true" className="reference-command-item" data-highlighted="true" role="option" hidden={isFiltered}>Open File<span className="reference-command-shortcut">Cmd+O</span></div>
          <div aria-selected="false" className="reference-command-item" role="option" hidden={isFiltered}>Save File<span className="reference-command-shortcut">Cmd+S</span></div>
        </div>
        <div className="reference-command-separator" role="separator" />
        <div className="reference-command-group" role="group">
          <div aria-disabled="true" aria-selected="false" className="reference-command-item" data-disabled="true" role="option" hidden={isFiltered}>Deploy disabled</div>
          <div aria-selected="false" className="reference-command-item" role="option">Settings<span className="reference-command-shortcut">Cmd+,</span></div>
        </div>
        <div className="reference-command-empty" hidden>No command found.</div>
      </div>
    </div>
  )

  if (!dialog) return command

  return (
    <div className="reference-dialog-portal">
      <div className="reference-dialog-overlay" />
      <div className="reference-dialog-content reference-command-dialog" role="dialog" aria-modal="true">
        <div className="reference-dialog-header"><h2>Command Palette</h2><p>Search for an action.</p></div>
        {command}
      </div>
    </div>
  )
}

export function renderCommandFixture(id: string) {
  switch (id) {
    case "filtering":
      return <ReferenceCommand query="set" />
    case "empty":
      return <div className="reference-command"><div className="reference-command-input-wrapper"><input className="reference-command-input" value="zzzz" readOnly /></div><div className="reference-command-list" role="listbox"><div className="reference-command-empty">No command found.</div></div></div>
    case "checked":
      return <div className="reference-command"><div className="reference-command-input-wrapper"><input className="reference-command-input" /></div><div className="reference-command-list" role="listbox"><div aria-selected="true" className="reference-command-item" data-checked="true" role="option">Settings<span className="reference-command-item-indicator">✓</span></div></div></div>
    case "dialog":
      return <ReferenceCommand dialog />
    case "custom-token":
      return <ReferenceCommand className="reference-fixture-custom-command" />
    default:
      return <ReferenceCommand />
  }
}
