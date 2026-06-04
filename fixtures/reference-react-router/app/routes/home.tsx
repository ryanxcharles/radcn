import { fixtureComponents, fixtureScenarios } from "../../../scenarios"

export default function Home() {
  return (
    <main className="fixture-page">
      <h1 className="fixture-heading">Reference React Router Fixtures</h1>
      <p className="fixture-description">
        Upstream-compatible shadcn/ui scenarios for browser comparison.
      </p>
      <ul className="fixture-list">
        <li>
          <a href="/fixtures">All fixtures</a>
        </li>
        {fixtureComponents.map((component) => (
          <li key={component}>
            <a href={`/fixtures/${component}`}>{component}</a>
          </li>
        ))}
      </ul>
      <p className="fixture-description">{fixtureScenarios.length} scenarios available.</p>
    </main>
  )
}
