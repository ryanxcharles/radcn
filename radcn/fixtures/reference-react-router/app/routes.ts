import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("fixtures", "routes/fixture.tsx", { id: "routes/fixtures" }),
  route("fixtures/:component", "routes/fixture.tsx", { id: "routes/fixture-component" }),
  route("fixtures/:component/:scenario", "routes/fixture.tsx", {
    id: "routes/fixture-scenario",
  }),
] satisfies RouteConfig
