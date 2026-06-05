import type { ReactNode } from "react"

function DirectionProvider({
  children,
  className,
  dir = "ltr",
  direction,
}: {
  children?: ReactNode
  className?: string
  dir?: "ltr" | "rtl"
  direction?: "ltr" | "rtl"
}) {
  let value = direction ?? dir
  return (
    <div className={["reference-direction-provider", className].filter(Boolean).join(" ")} data-direction={value} data-radcn-direction-provider dir={value}>
      {children}
    </div>
  )
}

function content(label: string) {
  return (
    <div className="reference-direction-sample" data-radcn-direction-sample>
      <span>{label}</span>
      <span>Start</span>
      <span>End</span>
    </div>
  )
}

export function renderDirectionFixture(scenario: string) {
  if (scenario === "rtl") {
    return <DirectionProvider direction="rtl">{content("RTL")}</DirectionProvider>
  }

  if (scenario === "prop-alias") {
    return <DirectionProvider dir="ltr" direction="rtl">{content("Alias RTL")}</DirectionProvider>
  }

  if (scenario === "nested") {
    return (
      <DirectionProvider direction="rtl">
        {content("Outer RTL")}
        <DirectionProvider className="reference-direction-nested" direction="ltr">
          {content("Inner LTR")}
        </DirectionProvider>
      </DirectionProvider>
    )
  }

  if (scenario === "custom-token") {
    return <DirectionProvider className="reference-fixture-custom-direction" direction="rtl">{content("Custom RTL")}</DirectionProvider>
  }

  return <DirectionProvider direction="ltr">{content("LTR")}</DirectionProvider>
}
