import type { FixtureScenario } from '../../../scenarios/types.ts'
import { ScrollArea, ScrollAreaCorner, ScrollAreaThumb, ScrollAreaViewport, ScrollBar } from 'radcn'

const items = Array.from({ length: 16 }, (_, index) => `Release note ${index + 1}`)

function ScrollContent({ horizontal = false }: { horizontal?: boolean }) {
  if (horizontal) {
    return (
      <div style="display:flex;gap:12px;width:720px">
        {items.slice(0, 8).map((item) => (
          <div style="flex:0 0 7rem;border:1px solid var(--radcn-border);border-radius:6px;padding:12px" key={item}>
            {item}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style="display:grid;gap:10px">
      {items.map((item) => (
        <p style="margin:0" key={item}>
          {item}: RadCN keeps native scroll behavior while exposing stable styling hooks.
        </p>
      ))}
    </div>
  )
}

export function renderScrollAreaFixture(fixture: FixtureScenario) {
  let horizontal = fixture.id === 'horizontal' || fixture.id === 'both'
  let custom = fixture.id === 'custom-token'
  let style = fixture.id === 'horizontal' ? 'height:9rem' : fixture.id === 'both' ? 'height:10rem' : undefined

  return (
    <ScrollArea class={custom ? 'radcn-fixture-custom-scroll-area' : undefined} style={style}>
      <ScrollAreaViewport ariaLabel="Scrollable release notes">
        {ScrollContent({ horizontal })}
      </ScrollAreaViewport>
      <ScrollBar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollBar>
      {(horizontal || fixture.id === 'both') && (
        <ScrollBar orientation="horizontal">
          <ScrollAreaThumb />
        </ScrollBar>
      )}
      {(horizontal || fixture.id === 'both') && <ScrollAreaCorner />}
    </ScrollArea>
  )
}
