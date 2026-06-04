import type { FixtureComponent, FixtureScenario } from "./types.ts"

export const fixtureScenarios: FixtureScenario[] = [
  {
    component: "button",
    id: "default",
    title: "Default Button",
    description: "Primary button in its default interactive state.",
  },
  {
    component: "button",
    id: "variants",
    title: "Button Variants",
    description: "Primary, secondary, outline, ghost, and destructive button variants.",
  },
  {
    component: "button",
    id: "disabled",
    title: "Disabled Button",
    description: "Disabled button state and focus behavior.",
  },
  {
    component: "button",
    id: "as-child-or-link",
    title: "Button Link",
    description: "Button styling applied to a link-like action.",
  },
  {
    component: "field",
    id: "input-default",
    title: "Default Input Field",
    description: "Label, input, and description in a normal form field.",
  },
  {
    component: "field",
    id: "input-invalid",
    title: "Invalid Input Field",
    description: "Invalid input state with error message and ARIA wiring.",
  },
  {
    component: "field",
    id: "input-disabled",
    title: "Disabled Input Field",
    description: "Disabled input with label and helper text.",
  },
  {
    component: "accordion",
    id: "single",
    title: "Single Accordion",
    description: "Single-item open state with collapsible behavior.",
  },
  {
    component: "accordion",
    id: "multiple",
    title: "Multiple Accordion",
    description: "Multiple accordion sections open at once.",
  },
  {
    component: "accordion",
    id: "disabled-item",
    title: "Disabled Accordion Item",
    description: "Accordion with one disabled trigger item.",
  },
]

export function getFixtureScenario(
  component: string | undefined,
  scenario: string | undefined,
): FixtureScenario | undefined {
  return fixtureScenarios.find((item) => item.component === component && item.id === scenario)
}

export function getComponentScenarios(component: string | undefined): FixtureScenario[] {
  return fixtureScenarios.filter((item) => item.component === component)
}

export const fixtureComponents: FixtureComponent[] = Array.from(
  new Set(fixtureScenarios.map((item) => item.component)),
)
