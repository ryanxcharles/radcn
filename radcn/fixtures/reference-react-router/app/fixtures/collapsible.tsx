function Collapsible({
  children,
  className,
  disabled,
  open,
}: {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  open?: boolean
}) {
  let state = open ? "open" : "closed"

  if (disabled) {
    return (
      <div className={`reference-collapsible ${className ?? ""}`} data-disabled="true" data-state={state}>
        {children}
      </div>
    )
  }

  return (
    <details className={`reference-collapsible ${className ?? ""}`} data-state={state} open={open}>
      {children}
    </details>
  )
}

function CollapsibleTrigger({
  children,
  disabled,
}: {
  children: React.ReactNode
  disabled?: boolean
}) {
  let content = (
    <>
      <span className="reference-collapsible-trigger-text">{children}</span>
      <span aria-hidden="true" className="reference-collapsible-icon">v</span>
    </>
  )

  if (disabled) {
    return (
      <div aria-disabled="true" className="reference-collapsible-trigger" role="button">
        {content}
      </div>
    )
  }

  return <summary className="reference-collapsible-trigger">{content}</summary>
}

function CollapsibleContent({
  children,
  disabled,
}: {
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div className="reference-collapsible-content" hidden={disabled || undefined}>
      <div className="reference-collapsible-content-inner">{children}</div>
    </div>
  )
}

export function renderCollapsibleFixture(scenario: string) {
  switch (scenario) {
    case "open":
      return (
        <Collapsible open>
          <CollapsibleTrigger>Release notes</CollapsibleTrigger>
          <CollapsibleContent>Version 3 includes native disclosure support.</CollapsibleContent>
        </Collapsible>
      )
    case "disabled":
      return (
        <Collapsible disabled>
          <CollapsibleTrigger disabled>Locked details</CollapsibleTrigger>
          <CollapsibleContent disabled>Disabled content is not exposed.</CollapsibleContent>
        </Collapsible>
      )
    case "custom-token":
      return (
        <Collapsible className="reference-fixture-custom-collapsible" open>
          <CollapsibleTrigger>Custom collapsible</CollapsibleTrigger>
          <CollapsibleContent>Custom tokens style this disclosure.</CollapsibleContent>
        </Collapsible>
      )
    default:
      return (
        <Collapsible>
          <CollapsibleTrigger>Release notes</CollapsibleTrigger>
          <CollapsibleContent>Version 3 includes native disclosure support.</CollapsibleContent>
        </Collapsible>
      )
  }
}
