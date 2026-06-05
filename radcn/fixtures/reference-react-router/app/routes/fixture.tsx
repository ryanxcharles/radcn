import { useParams } from "react-router"

import {
  fixtureComponents,
  fixtureScenarios,
  getComponentScenarios,
  getFixtureScenario,
} from "../../../scenarios"
import { renderReferenceFixture } from "../fixtures"

export default function FixtureRoute() {
  let params = useParams()
  let component = params.component
  let scenario = params.scenario

  if (!component) {
    return (
      <main className="fixture-page">
        <h1 className="fixture-heading">Reference fixtures</h1>
        <ul className="fixture-list">
          {fixtureComponents.map((item) => (
            <li key={item}>
              <a href={`/fixtures/${item}`}>{item}</a>
            </li>
          ))}
        </ul>
      </main>
    )
  }

  if (!scenario) {
    let scenarios = getComponentScenarios(component)
    return (
      <main className="fixture-page">
        <h1 className="fixture-heading">{component}</h1>
        <ul className="fixture-list">
          {scenarios.map((item) => (
            <li key={item.id}>
              <a href={`/fixtures/${item.component}/${item.id}`}>{item.title}</a>
            </li>
          ))}
        </ul>
      </main>
    )
  }

  let fixture = getFixtureScenario(component, scenario)

  if (!fixture) {
    return (
      <main className="fixture-page">
        <h1 className="fixture-heading">Fixture not found</h1>
        <p className="fixture-description">
          {component}/{scenario} is not one of the {fixtureScenarios.length} shared scenarios.
        </p>
      </main>
    )
  }

  return (
    <main
      className="fixture-shell"
      data-fixture-app="reference"
      data-component={fixture.component}
      data-scenario={fixture.id}
    >
      <h1 className="fixture-heading">{fixture.title}</h1>
      <p className="fixture-description">{fixture.description}</p>
      <section data-fixture-stage>{renderReferenceFixture(fixture)}</section>
    </main>
  )
}
