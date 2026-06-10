/*
 * Tailwind v4 integration probe (Issue 6, Experiment 1).
 *
 * Everything here is styled exclusively with Tailwind utilities: no `style`
 * attributes, no `radcn-*` classes, no css() mixins. The arbitrary-value
 * colors only appear in the generated stylesheet if Tailwind really scanned
 * this source file, and they compute to stable rgb() values for Playwright
 * assertions.
 */
export function renderTailwindProbe() {
  return (
    <main data-tailwind-probe-page class="p-12">
      <section
        data-tailwind-probe
        class="flex w-full max-w-md flex-col gap-4 rounded-lg bg-[#112233] p-6 text-[#fafafa]"
      >
        <h1 data-tailwind-probe-heading class="text-lg font-semibold">
          Tailwind probe
        </h1>
        <p data-tailwind-probe-copy class="mt-2">
          This block is styled exclusively by Tailwind v4 utilities served
          through the Remix 3 asset server.
        </p>
      </section>
    </main>
  )
}
