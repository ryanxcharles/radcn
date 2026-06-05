import type { FixtureScenario } from '../../../scenarios/types.ts'

import { DirectionProvider } from 'radcn'

function content(label: string) {
  return (
    <div class="radcn-direction-sample" data-radcn-direction-sample>
      <span>{label}</span>
      <span>Start</span>
      <span>End</span>
    </div>
  )
}

export function renderDirectionFixture(fixture: FixtureScenario) {
  if (fixture.id === 'rtl') {
    return <DirectionProvider direction="rtl">{content('RTL')}</DirectionProvider>
  }

  if (fixture.id === 'prop-alias') {
    return <DirectionProvider dir="ltr" direction="rtl">{content('Alias RTL')}</DirectionProvider>
  }

  if (fixture.id === 'nested') {
    return (
      <DirectionProvider direction="rtl">
        {content('Outer RTL')}
        <DirectionProvider class="radcn-direction-nested" direction="ltr">
          {content('Inner LTR')}
        </DirectionProvider>
      </DirectionProvider>
    )
  }

  if (fixture.id === 'custom-token') {
    return <DirectionProvider class="radcn-fixture-custom-direction" direction="rtl">{content('Custom RTL')}</DirectionProvider>
  }

  return <DirectionProvider direction="ltr">{content('LTR')}</DirectionProvider>
}
