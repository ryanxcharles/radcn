import { cn } from "../lib/utils"

const items = Array.from({ length: 16 }, (_, index) => `Release note ${index + 1}`)

function ScrollContent({ horizontal = false }: { horizontal?: boolean }) {
  if (horizontal) {
    return (
      <div className="reference-scroll-row">
        {items.slice(0, 8).map((item) => (
          <div className="reference-scroll-card" key={item}>
            {item}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="reference-scroll-list">
      {items.map((item) => (
        <p className="m-0" key={item}>
          {item}: RadCN keeps native scroll behavior while exposing stable styling hooks.
        </p>
      ))}
    </div>
  )
}

function ScrollArea({
  children,
  className,
  style,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("reference-scroll-area", className)} style={style}>
      {children}
    </div>
  )
}

function ScrollAreaViewport({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-label="Scrollable release notes" className="reference-scroll-area-viewport" tabIndex={0}>
      {children}
    </div>
  )
}

function ScrollBar({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  return (
    <div aria-hidden="true" className={cn("reference-scroll-area-scrollbar", `reference-scroll-area-scrollbar--${orientation}`)} data-orientation={orientation}>
      <div className="reference-scroll-area-thumb" />
    </div>
  )
}

function ScrollAreaCorner() {
  return <div aria-hidden="true" className="reference-scroll-area-corner" />
}

export function renderScrollAreaFixture(scenario: string) {
  let horizontal = scenario === "horizontal" || scenario === "both"
  let custom = scenario === "custom-token"
  let style = scenario === "horizontal" ? { height: "9rem" } : scenario === "both" ? { height: "10rem" } : undefined

  return (
    <ScrollArea className={custom ? "reference-fixture-custom-scroll-area" : undefined} style={style}>
      <ScrollAreaViewport>
        <ScrollContent horizontal={horizontal} />
      </ScrollAreaViewport>
      <ScrollBar orientation="vertical" />
      {(horizontal || scenario === "both") && <ScrollBar orientation="horizontal" />}
      {(horizontal || scenario === "both") && <ScrollAreaCorner />}
    </ScrollArea>
  )
}
