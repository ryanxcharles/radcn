# Avatar Example Inventory

## Summary

Upstream shadcn/ui New York v4 exposes one direct Avatar example:
`avatar-demo`.

RadCN already ships `radcn/avatar` with Avatar, AvatarImage, AvatarFallback,
AvatarBadge, AvatarGroup, and AvatarGroupCount exports. Current package,
fixture, and Playwright evidence proves image alt text, visible and hidden
fallback behavior, badge hooks, group hooks, group count hooks, size variants,
custom token styling, and Avatar composition inside Item and Empty examples.

The named upstream example is still partial because current docs, fixtures, and
tests do not prove the exact `avatar-demo` composition: GitHub remote images
for `@shadcn`, `@evilrabbit`, and `@maxleiter`; fallback text `CN`, `ER`, and
`LR`; a rounded-square Avatar; a flex/wrapped/gap-12 wrapper; and a stacked
negative-space group with ring and grayscale image treatment.

## Examples

| Upstream example | User-facing behavior and upstream mechanics | Current RadCN evidence | Outcome | Follow-up |
| --- | --- | --- | --- | --- |
| `avatar-demo` | Wrapper `div` uses flex row, wrapping, centered items, and `gap-12`. First Avatar is the default circular shape with image `https://github.com/shadcn.png`, alt `@shadcn`, and fallback `CN`. Second Avatar adds `className="rounded-lg"` for a rounded-square shape with image `https://github.com/evilrabbit.png`, alt `@evilrabbit`, and fallback `ER`. Third section is a stacked avatar group using negative spacing, ring styling, and grayscale image treatment for avatars `@shadcn`/`CN`, `@maxleiter`/`LR`, and `@evilrabbit`/`ER`. The upstream UI uses a React client component marker, Radix Avatar primitive, `data-slot`, `data-size`, `className`, `cn`, Tailwind size/shape/flex/ring/group selectors, and app-owned remote GitHub image mechanics. | `radcn/packages/radcn/src/components/avatar.tsx` exports Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, and AvatarGroupCount with public `data-radcn-avatar*` hooks, `data-size`, class/style props, native `img` alt/src/loading/width/height props, and explicit fallback `ariaHidden` control. `radcn/packages/radcn/src/styles/tokens.css` covers root sizing, circular shape, overflow clipping, image fill/object-fit, fallback layout, badge size, group negative spacing, ring-like border via pseudo-element, group count, and custom tokens. `radcn/fixtures/candidate-remix/app/fixtures/avatar.tsx` covers default image+hidden fallback with deterministic data URI, visible fallback, badge, group count, and custom tokens. `radcn/fixtures/tests/avatar-scroll-area.spec.ts` verifies image alt text, hidden and visible fallback behavior, badge hooks, group accessible name/count, and custom token styling. `radcn/apps/docs/app/content/components.tsx` and `radcn/apps/docs/tests/coverage.spec.ts` prove a generic docs preview for Avatar. `item-example-inventory.md` and `empty-example-inventory.md` record related Avatar composition in Item and Empty examples. No current docs/fixture/test proves the named upstream `avatar-demo` wrapper layout, exact GitHub image URLs, exact alt/fallback triplets, rounded-square Avatar, or stacked group ring/grayscale treatment. | Partial | Add named docs, candidate fixture, and Playwright coverage for `avatar-demo` with the exact wrapper layout, three exact GitHub image URLs, exact alt and fallback texts, default circular Avatar, rounded-square Avatar, stacked negative-space group, ring styling evidence, grayscale image treatment, public Avatar/Image/Fallback/Group hooks, and mapping copy for React, Radix, `data-slot`, `data-size`, `className`, `cn`, Tailwind utilities, remote image handling, custom tokens, and vendor source. |

## Related Examples

- `item-avatar` belongs to the Item example cluster. It is tracked in
  `item-example-inventory.md` and is already covered by Item docs, fixtures,
  and Playwright checks for Avatar media, stacked avatars, and icon-only invite
  actions.
- `empty-avatar` belongs to the Empty example cluster. It is tracked in
  `empty-example-inventory.md` and is already covered by Empty docs, fixtures,
  and Playwright checks for Avatar media, deterministic image/fallback content,
  and action composition.
- `empty-avatar-group` belongs to the Empty example cluster. It is tracked in
  `empty-example-inventory.md` and is already covered by Empty docs, fixtures,
  and Playwright checks for AvatarGroup media and AvatarGroupCount composition.

## Decisions

- RadCN should keep Avatar as dependency-free markup over native `img` and
  span/div parts. The Radix Avatar primitive is not needed for this example.
- Upstream `data-slot` maps to public `data-radcn-avatar*` hooks, and upstream
  `data-size` maps to RadCN `data-size` plus size classes.
- Upstream `className` and `cn` map to explicit `class`, `style`, CSS
  variables, and package classes.
- Remote GitHub image loading remains app-owned content. A follow-up may use
  the exact upstream remote URLs for markup parity, while tests should verify
  attributes and CSS behavior rather than depend on network image decoding.
- Upstream fallback texts `CN`, `ER`, and `LR` should be included in named
  docs/fixtures even when images are present. Use `ariaHidden` deliberately
  when fallback text is only visual backup behind an accessible image.
- Upstream `rounded-lg` on Avatar maps to an app/docs class or style on the
  Avatar root; it should not require a package API change.
- Upstream stacked `-space-x-2`, ring utilities, and grayscale image treatment
  map to AvatarGroup package behavior plus explicit app/docs classes, styles,
  CSS variables, or scoped CSS over public hooks.
- AvatarBadge is not used by `avatar-demo`; badge evidence remains useful
  package coverage but should not be required for this direct example row.
- `AvatarGroupCount` is not used by `avatar-demo`; count evidence remains
  useful package coverage but should not be required for this direct example
  row.
- Vendor source remains read-only evidence and should not be imported or
  committed into RadCN.
