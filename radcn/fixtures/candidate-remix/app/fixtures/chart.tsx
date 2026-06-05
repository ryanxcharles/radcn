import type { FixtureScenario } from '../../../scenarios/types.ts'
import {
  ChartBarSeries,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
  ChartLineSeries,
  ChartTooltip,
  ChartTooltipItem,
} from 'radcn'

const labels = ['Jan', 'Feb', 'Mar', 'Apr']
const values = [32, 48, 36, 56]

export function renderChartFixture(fixture: FixtureScenario) {
  if (fixture.id === 'line') {
    return (
      <ChartContainer ariaLabel="Revenue trend" description="Revenue increased from January to April." title="Revenue">
        <ChartLineSeries color="#2563eb" labels={labels} name="revenue" values={[18, 28, 24, 44]} />
      </ChartContainer>
    )
  }

  if (fixture.id === 'legend') {
    return (
      <ChartContainer ariaLabel="Traffic by channel" description="Organic traffic leads paid traffic." title="Traffic">
        <ChartBarSeries color="#18181b" labels={labels} name="organic" values={values} />
        <ChartLegend>
          <ChartLegendItem color="#18181b" name="Organic">Organic</ChartLegendItem>
          <ChartLegendItem color="#2563eb" name="Paid">Paid</ChartLegendItem>
        </ChartLegend>
      </ChartContainer>
    )
  }

  if (fixture.id === 'tooltip') {
    return (
      <ChartContainer ariaLabel="Deployments chart" description="Deployments by month." title="Deployments">
        <ChartBarSeries color="#0f766e" labels={labels} name="deployments" values={values} />
        <ChartTooltip label="April">
          <ChartTooltipItem color="#0f766e" label="Deployments" value={56} />
          <ChartTooltipItem color="#2563eb" label="Incidents" value={2} />
        </ChartTooltip>
      </ChartContainer>
    )
  }

  if (fixture.id === 'accessibility') {
    return (
      <ChartContainer
        ariaDescribedBy="candidate-chart-accessibility-description"
        ariaLabel="Accessible signups chart"
        description="Signups increased every month in the sample."
        title="Signups"
      >
        <p id="candidate-chart-accessibility-description" style="margin:0;color:var(--radcn-muted-foreground);font-size:13px">
          Bar chart with values 12, 24, 30, and 42.
        </p>
        <ChartBarSeries labels={labels} name="signups" values={[12, 24, 30, 42]} />
      </ChartContainer>
    )
  }

  if (fixture.id === 'custom-token') {
    return (
      <ChartContainer class="radcn-fixture-custom-chart" ariaLabel="Custom chart" description="Custom token chart." title="Custom">
        <ChartBarSeries labels={labels} name="custom" values={values} />
        <ChartTooltip label="April">
          <ChartTooltipItem label="Custom" value={56} />
        </ChartTooltip>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer ariaLabel="Monthly visitors" description="Visitors by month." title="Visitors">
      <ChartBarSeries color="#18181b" labels={labels} name="visitors" values={values} />
    </ChartContainer>
  )
}
