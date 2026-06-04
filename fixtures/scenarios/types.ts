export type FixtureComponent = "button" | "field" | "accordion"

export interface FixtureScenario {
  component: FixtureComponent
  description: string
  id: string
  title: string
}
