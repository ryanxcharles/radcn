export type FixtureComponent =
  | "accordion"
  | "alert"
  | "aspect-ratio"
  | "avatar"
  | "badge"
  | "breadcrumb"
  | "button"
  | "button-group"
  | "card"
  | "checkbox"
  | "collapsible"
  | "dialog"
  | "empty"
  | "field"
  | "kbd"
  | "item"
  | "native-select"
  | "pagination"
  | "progress"
  | "radio-group"
  | "scroll-area"
  | "separator"
  | "skeleton"
  | "slider"
  | "spinner"
  | "switch"
  | "table"
  | "tabs"
  | "textarea"
  | "toggle"
  | "toggle-group"
  | "typography"

export interface FixtureScenario {
  component: FixtureComponent
  description: string
  id: string
  title: string
}
