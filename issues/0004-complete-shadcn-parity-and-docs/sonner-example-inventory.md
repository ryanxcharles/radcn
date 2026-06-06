# Sonner Example Inventory

## Summary

Upstream shadcn/ui New York v4 exposes two active Sonner examples:
`sonner-demo` and `sonner-types`.

RadCN has strong notification primitives: `radcn/sonner` renders
server-provided initial toasts, `radcn/toast` dispatches browser toast events,
and fixture coverage proves accessible regions, status/alert roles, default,
success, info, warning, error, loading, action, dismiss, stack, custom tokens,
and event dispatch behavior without React or the Sonner package dependency.

Experiment 78 added named docs, candidate fixture routes, and Playwright
coverage for the two active upstream Sonner examples. Both examples are covered
through RadCN's dependency-free Toaster plus browser event model. The upstream
`toast.promise` helper is intentionally mapped to app-owned orchestration:
apps dispatch a loading toast and then dispatch success or error notifications
from their own promise branch.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `sonner-demo` | Outline Button labelled `Show Toast`. Clicking it calls `toast("Event has been created", { description: "Sunday, December 03, 2023 at 9:00 AM", action: { label: "Undo", onClick: () => console.log("Undo") } })`. Uses React client component marker, React click handler, Sonner `toast`, Button composition, action callback, `console.log`, `className`/Tailwind through Button, and Sonner runtime. | Docs render `data-radcn-docs-sonner-family="sonner-demo"` with an outline `Show Toast` Button, Toaster proof, exact title, exact date description, `Undo` action label, status role, public toast/action hooks, and mapping copy. Candidate fixture route `/fixtures/sonner/demo` dispatches the exact payload from a native trigger and Playwright verifies title, description, action href/label, role semantics, public hooks, and dependency absence. | Covered | No follow-up. React onClick, Sonner `toast`, console callback behavior, Tailwind/className/data-slot/cn, and vendor source map to native RadCN triggers, explicit event payloads, app-owned action behavior, and public styling hooks. |
| `sonner-types` | Flex-wrapped Button group with six outline Buttons labelled `Default`, `Success`, `Info`, `Warning`, `Error`, and `Promise`. Each triggers the corresponding Sonner API: `toast`, `toast.success`, `toast.info`, `toast.warning`, `toast.error`, and `toast.promise` with loading text `Loading...`, success callback text `${data.name} has been created`, and error text `Error`. Uses React client component marker, React click handlers, Sonner typed helpers, promise orchestration, `setTimeout`, Button composition, Tailwind flex/gap utilities, and Sonner runtime. | Docs render `data-radcn-docs-sonner-family="sonner-types"` with the six exact Button labels, Toaster proof for default/success/info/warning/error/loading states, exact messages, status/alert role evidence, public data-type hooks, and mapping copy. Candidate fixture route `/fixtures/sonner/types` dispatches exact typed toast payloads and records the promise mapping. Playwright verifies all six trigger labels, exact upstream messages, data-type values, role semantics, public hooks, and the app-owned loading/success/error promise-flow mapping. | Covered | No follow-up. `toast.promise` remains app-owned orchestration rather than a package API: dispatch `Loading...`, then dispatch `Event has been created` or `Error` from the promise branch. Sonner, React, next-themes, lucide icons, Tailwind, `cn`, and vendor source remain non-dependencies. |

## Decisions

- `radcn/sonner` remains the Toaster rendering surface. It should not import
  or wrap the upstream `sonner` package.
- `radcn/toast` remains the explicit browser event/helper surface for
  client-dispatched notifications.
- shadcn React click handlers map to native Button triggers plus RadCN browser
  events, server-provided initial Toaster state, route state, or app-owned
  enhancement.
- `toast.promise` is promise orchestration, not Toaster rendering. A follow-up
  implementation should decide whether to document it as app-owned orchestration
  or add a dependency-free helper only if it removes real repeated complexity.
- Sonner `Toaster`, `next-themes`, lucide icons, Tailwind utilities,
  `className`, `data-slot`, `cn`, and vendor source remain mappings or
  non-dependencies, not required RadCN dependencies.
