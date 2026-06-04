import * as React from "react"

import { cn } from "../lib/utils"

export function renderDialogFixture(scenario: string) {
  return <ReferenceDialog scenario={scenario} />
}

function ReferenceDialog({ scenario }: { scenario: string }) {
  let [open, setOpen] = React.useState(scenario === "default-open")
  let custom = scenario === "custom-token"
  let titleId = `reference-dialog-${scenario}-title`
  let descriptionId = `reference-dialog-${scenario}-description`

  React.useEffect(() => {
    if (!open) return
    let previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <>
      <button aria-haspopup="dialog" className="reference-dialog-trigger" data-state={open ? "open" : "closed"} onClick={() => setOpen(true)} type="button">
        {scenario === "outside-dismiss" ? "Open dismissible dialog" : "Open dialog"}
      </button>
      {open && (
        <div className="reference-dialog-portal" data-state="open">
          <div className="reference-dialog-overlay" data-state="open" onClick={() => setOpen(false)} />
          <div
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            className={cn("reference-dialog-content", custom && "reference-fixture-custom-dialog")}
            data-state="open"
            role="dialog"
            tabIndex={-1}
          >
            {scenario !== "close-button" && (
              <button aria-label="Close" className="reference-dialog-close" onClick={() => setOpen(false)} type="button">
                <span aria-hidden="true">x</span>
              </button>
            )}
            <div className="reference-dialog-header">
              <h2 className="reference-dialog-title" id={titleId}>{custom ? "Custom dialog" : "Project settings"}</h2>
              <p className="reference-dialog-description" id={descriptionId}>
                Update project details and close the modal when finished.
              </p>
            </div>
            <label className="reference-dialog-label">
              Project name
              <input className="reference-dialog-input" defaultValue="RadCN" />
            </label>
            <div className="reference-dialog-footer">
              <button className="reference-dialog-action" onClick={() => setOpen(false)} type="button">
                Save changes
              </button>
              {scenario === "close-button" && (
                <button aria-label="Cancel" className="reference-dialog-action" onClick={() => setOpen(false)} type="button">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
