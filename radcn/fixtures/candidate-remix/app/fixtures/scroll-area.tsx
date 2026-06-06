import type { FixtureScenario } from '../../../scenarios/types.ts'
import { ScrollArea, ScrollAreaCorner, ScrollAreaThumb, ScrollAreaViewport, ScrollBar, Separator } from 'radcn'

const items = Array.from({ length: 16 }, (_, index) => `Release note ${index + 1}`)
const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)
const artworks = [
  {
    artist: 'Ornella Binni',
    src: "data:image/svg+xml,%3Csvg viewBox='0 0 300 400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='400' fill='%230f766e'/%3E%3Ccircle cx='92' cy='112' r='52' fill='%23ccfbf1'/%3E%3Cpath d='M24 332 C92 246 176 286 276 176 L276 400 L24 400 Z' fill='%23134e4a'/%3E%3C/svg%3E",
  },
  {
    artist: 'Tom Byrom',
    src: "data:image/svg+xml,%3Csvg viewBox='0 0 300 400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='400' fill='%237c3aed'/%3E%3Crect x='54' y='74' width='192' height='252' rx='28' fill='%23ede9fe'/%3E%3Cpath d='M72 304 L144 188 L204 248 L246 156 L246 326 L72 326 Z' fill='%235b21b6'/%3E%3C/svg%3E",
  },
  {
    artist: 'Vladimir Malyavko',
    src: "data:image/svg+xml,%3Csvg viewBox='0 0 300 400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='400' fill='%23be123c'/%3E%3Cpath d='M40 96 L260 40 L222 344 L76 360 Z' fill='%23ffe4e6'/%3E%3Ccircle cx='192' cy='156' r='46' fill='%239f1239'/%3E%3C/svg%3E",
  },
]

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
  if (fixture.id === 'demo') {
    return (
      <div data-scroll-area-example="demo">
        <ScrollArea style="width:12rem;height:18rem;">
          <ScrollAreaViewport ariaLabel="Tags">
            <div data-scroll-area-tags style="display:grid;padding:1rem;">
              <h4 style="margin:0 0 1rem;font-size:0.875rem;font-weight:500;line-height:1;">Tags</h4>
              {tags.map((tag, index) => (
                <div data-scroll-area-tag-row>
                  <div data-scroll-area-tag style="font-size:0.875rem;">{tag}</div>
                  {index < tags.length - 1 && <Separator style="margin:0.5rem 0;" />}
                </div>
              ))}
            </div>
          </ScrollAreaViewport>
          <ScrollBar orientation="vertical">
            <ScrollAreaThumb />
          </ScrollBar>
        </ScrollArea>
      </div>
    )
  }

  if (fixture.id === 'horizontal-demo') {
    return (
      <div data-scroll-area-example="horizontal-demo">
        <ScrollArea style="width:24rem;height:29rem;white-space:nowrap;">
          <ScrollAreaViewport ariaLabel="Artwork gallery">
            <div data-scroll-area-artwork-strip style="display:flex;width:max-content;gap:1rem;padding:1rem;">
              {artworks.map((artwork) => (
                <figure data-scroll-area-artwork style="flex:0 0 auto;margin:0;">
                  <div style="overflow:hidden;border-radius:var(--radcn-radius);">
                    <img
                      alt={`Photo by ${artwork.artist}`}
                      data-scroll-area-artwork-image
                      height="400"
                      src={artwork.src}
                      style="display:block;width:300px;height:400px;aspect-ratio:3 / 4;object-fit:cover;"
                      width="300"
                    />
                  </div>
                  <figcaption data-scroll-area-artwork-caption style="padding-top:0.5rem;color:var(--radcn-muted-foreground);font-size:0.75rem;">
                    Photo by <strong style="color:var(--radcn-foreground);">{artwork.artist}</strong>
                  </figcaption>
                </figure>
              ))}
            </div>
          </ScrollAreaViewport>
          <ScrollBar orientation="horizontal">
            <ScrollAreaThumb />
          </ScrollBar>
          <ScrollAreaCorner />
        </ScrollArea>
      </div>
    )
  }

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
