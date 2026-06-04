const labels = ["Jan", "Feb", "Mar", "Apr"]
const values = [32, 48, 36, 56]

function BarSvg({ custom = false }: { custom?: boolean }) {
  let max = Math.max(...values)
  return (
    <svg className="reference-chart-svg" viewBox="0 0 320 180">
      <line className="reference-chart-axis" x1="24" x2="296" y1="156" y2="156" />
      {values.map((value, index) => {
        let height = (value / max) * 132
        let x = 24 + index * 70
        return <rect className="reference-chart-bar" data-value={value} fill={custom ? "#0f766e" : "#18181b"} height={height} key={index} rx="4" width="52" x={x} y={156 - height} />
      })}
    </svg>
  )
}

function LineSvg() {
  return (
    <svg className="reference-chart-svg" viewBox="0 0 320 180">
      <line className="reference-chart-axis" x1="24" x2="296" y1="156" y2="156" />
      <polyline className="reference-chart-line" fill="none" points="24,102 114,66 205,78 296,24" stroke="#2563eb" />
      {[["24", "102"], ["114", "66"], ["205", "78"], ["296", "24"]].map(([cx, cy], index) => (
        <circle className="reference-chart-point" cx={cx} cy={cy} fill="#2563eb" key={index} r="4" />
      ))}
    </svg>
  )
}

function ChartShell({ children, className = "", description, title }: { children: React.ReactNode; className?: string; description: string; title: string }) {
  return (
    <figure className={`reference-chart ${className}`} role="img" aria-label={title}>
      <figcaption className="reference-chart-title">{title}</figcaption>
      <p className="reference-chart-description">{description}</p>
      {children}
    </figure>
  )
}

export function renderChartFixture(scenario: string) {
  if (scenario === "line") {
    return <ChartShell title="Revenue" description="Revenue increased from January to April."><LineSvg /></ChartShell>
  }
  if (scenario === "legend") {
    return (
      <ChartShell title="Traffic" description="Organic traffic leads paid traffic.">
        <BarSvg />
        <figcaption className="reference-chart-legend">
          <span><i style={{ background: "#18181b" }} />Organic</span>
          <span><i style={{ background: "#2563eb" }} />Paid</span>
        </figcaption>
      </ChartShell>
    )
  }
  if (scenario === "tooltip") {
    return (
      <ChartShell title="Deployments" description="Deployments by month.">
        <BarSvg custom />
        <div className="reference-chart-tooltip">
          <strong>April</strong>
          <span>Deployments <b>56</b></span>
          <span>Incidents <b>2</b></span>
        </div>
      </ChartShell>
    )
  }
  if (scenario === "accessibility") {
    return <ChartShell title="Accessible signups chart" description="Bar chart with values 12, 24, 30, and 42."><BarSvg /></ChartShell>
  }
  if (scenario === "custom-token") {
    return <ChartShell className="reference-fixture-custom-chart" title="Custom chart" description="Custom token chart."><BarSvg custom /></ChartShell>
  }
  return <ChartShell title="Monthly visitors" description="Visitors by month."><BarSvg /></ChartShell>
}
