import type { FixtureScenario } from '../../../scenarios/types.ts'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'radcn'

function Panel({ children }: { children: string }) {
  return <div class="radcn-fixture-panel">{children}</div>
}

function NestedExample({ withHandle = false }: { withHandle?: boolean }) {
  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel defaultSize={50}>{Panel({ children: 'One' })}</ResizablePanel>
      <ResizableHandle withHandle={withHandle} />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup orientation="vertical" style="width:100%;min-height:100%;border:0;border-radius:0">
          <ResizablePanel defaultSize={25}>{Panel({ children: 'Two' })}</ResizablePanel>
          <ResizableHandle withHandle={withHandle} />
          <ResizablePanel defaultSize={75}>{Panel({ children: 'Three' })}</ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export function renderResizableFixture(fixture: FixtureScenario) {
  switch (fixture.id) {
    case 'demo':
      return NestedExample({})
    case 'demo-with-handle':
      return NestedExample({ withHandle: true })
    case 'handle':
      return (
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={25}>{Panel({ children: 'Sidebar' })}</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>{Panel({ children: 'Content' })}</ResizablePanel>
        </ResizablePanelGroup>
      )
    case 'vertical-upstream':
      return (
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={25}>{Panel({ children: 'Header' })}</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>{Panel({ children: 'Content' })}</ResizablePanel>
        </ResizablePanelGroup>
      )
  }

  let vertical = fixture.id === 'vertical'
  let custom = fixture.id === 'custom-token'
  return (
    <ResizablePanelGroup class={custom ? 'radcn-fixture-custom-resizable' : undefined} orientation={vertical ? 'vertical' : 'horizontal'}>
      <ResizablePanel defaultSize={fixture.id === 'keyboard' ? 40 : 50}>{Panel({ children: 'Navigation' })}</ResizablePanel>
      <ResizableHandle withHandle={fixture.id === 'with-handle' || fixture.id === 'keyboard'} />
      <ResizablePanel defaultSize={fixture.id === 'keyboard' ? 60 : 50}>{Panel({ children: 'Preview' })}</ResizablePanel>
    </ResizablePanelGroup>
  )
}
