# Empty Example Inventory

Generated during Experiment 21 on 2026-06-06.

## Sources

- Upstream registry:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/_registry.ts`
- Upstream examples:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/examples/empty-*.tsx`
- Upstream package:
  `vendor/shadcn-ui/apps/v4/registry/new-york-v4/ui/empty.tsx`
- RadCN packages:
  `radcn/packages/radcn/src/components/empty.tsx`
  `radcn/packages/radcn/src/components/avatar.tsx`
  `radcn/packages/radcn/src/components/button.tsx`
  `radcn/packages/radcn/src/components/input-group.tsx`
  `radcn/packages/radcn/src/components/kbd.tsx`
  `radcn/packages/radcn/src/components/spinner.tsx`
  `radcn/packages/radcn/src/styles/tokens.css`
- RadCN docs:
  `radcn/apps/docs/app/content/components.tsx`
- RadCN fixtures:
  `radcn/fixtures/scenarios/index.ts`
  `radcn/fixtures/candidate-remix/app/fixtures/static-display.tsx`
  `radcn/fixtures/tests/static-display.spec.ts`

## Summary

Empty example parity is complete after Experiment 22. RadCN exports the core
upstream Empty parts: `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`,
`EmptyDescription`, and `EmptyContent`. Docs, fixtures, and Playwright coverage
now prove the package slots, default media, icon media, multiple action rows,
link-style actions, Avatar media, stacked Avatar media, InputGroup/Kbd search
composition, outline/dashed styling, muted/background styling, support links,
and composed loading states from the Spinner cluster.

The existing Empty package API was enough. No new Empty prop, React dependency,
Radix Slot dependency, icon package dependency, Tailwind dependency, remote
image dependency, vendor import, or npm publishing behavior was needed.

## Example Map

| Upstream id | User-facing behavior | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `empty-avatar` | Empty state with Avatar media, offline user title/description, and Leave Message Button. Uses remote GitHub avatar image and grayscale/size utilities. | RadCN docs and `/fixtures/empty/avatar` prove Avatar, AvatarImage, AvatarFallback, Button, and EmptyMedia composition with deterministic data-URI image content and fallback text. | Covered | Remote GitHub image and grayscale/size utilities map to deterministic app-owned image/fallback choices and public style hooks. |
| `empty-avatar-group` | Empty state with stacked Avatar media, invite copy, and Invite Members Button with icon. Uses remote GitHub avatar images, Tailwind stack/ring/grayscale utilities, and lucide Plus icon. | RadCN docs and `/fixtures/empty/avatar-group` prove AvatarGroup, Avatar, AvatarFallback, AvatarGroupCount, Button, and EmptyMedia composition. | Covered | Remote images, ring/stack utilities, and lucide Plus map to app-owned content, RadCN AvatarGroup styles, and button/action composition. |
| `empty-background` | Full-height muted/background Empty state with icon media, title/description, and outline Refresh Button. Uses Tabler bell icon, lucide refresh icon, and gradient utility classes. | RadCN docs and `/fixtures/empty/background` prove muted/background styling through Empty `class`/`style`, icon media, and outline Button action. | Covered | Tabler/lucide icons and gradient utilities map to app-owned glyphs plus RadCN public class/style/CSS-variable hooks. |
| `empty-demo` | Default project Empty state with icon media, title/description, primary Create Project Button, outline Import Project Button, and link-style Learn More action using `asChild`. | RadCN docs and `/fixtures/empty/demo` prove multi-action default Empty composition with primary Button, outline Button, and link-style `Button href`. | Covered | shadcn `asChild` maps to explicit native link semantics through `Button href`. |
| `empty-icon` | Grid of four Empty states with icon media and distinct titles/descriptions for messages, favorites, likes, and bookmarks. Uses Tabler icons. | RadCN docs and `/fixtures/empty/icon-grid` prove a four-item icon Empty grid with `EmptyMedia variant="icon"` and distinct titles/descriptions. | Covered | Tabler icons map to app-owned glyphs/assets inside `EmptyMedia`. |
| `empty-input-group` | 404 Empty state with title/description, InputGroup search field, Search icon addon, inline-end Kbd addon, and support link in description. | RadCN docs and `/fixtures/empty/input-group` prove InputGroup, InputGroupAddon, InputGroupInput, Kbd, support link, title, description, and EmptyContent composition. | Covered | Search icon and support route behavior are app-owned; Empty does not own form or route state. |
| `empty-outline` | Dashed outline Empty state with icon media, cloud storage title/description, and outline Upload Files Button. Uses Tabler cloud icon and border utility classes. | RadCN docs and `/fixtures/empty/outline` prove dashed/border styling through Empty `class`/`style`, icon media, and outline Button action. | Covered | Tabler cloud icon and border utilities map to app-owned glyphs plus public class/style hooks. |

## Mapping Decisions

- RadCN should not port shadcn's `asChild` or Radix Slot mechanics directly.
  Link-style Empty actions should map to explicit RadCN `Button href` or native
  anchor composition.
- Lucide icons and Tabler icons are presentation choices. Empty parity should
  verify icon media, button affordances, and accessible text without adding
  icon packages as RadCN dependencies.
- Tailwind utility classes map to RadCN public class hooks, inline `style`, or
  CSS variables; RadCN should not depend on Tailwind utility names.
- Remote GitHub avatar images are content choices, not package requirements.
  Docs/fixtures should avoid depending on remote images and can use local/static
  assets, generated assets, app-owned images, or AvatarFallback where the
  user-facing behavior is equivalent.
- Avatar, AvatarGroup, Button, InputGroup, Kbd, Spinner, and link behavior stay
  owned by those package primitives or app-owned markup. Empty should remain a
  layout/content primitive unless the implementation experiment proves a narrow
  package API gap.
- Empty outline, muted, and background examples should be treated as styling
  and composition parity over public hooks rather than new stateful package
  behavior.
- The audit should not assume DOM equivalence. The implementation target is
  equivalent visual empty-state composition, accessibility, and author-facing
  customization.

## Resolution

Experiment 22 resolved Empty example parity depth. The next Issue 4 cluster
should come from the regenerated `parity-inventory.md` first recommended
cluster.
