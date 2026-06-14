import { createController } from 'remix/router'

import { assetServer } from '../assets.ts'
import { Button } from '../components/ui/button.tsx'
import { routes } from '../routes.ts'
import { Document } from '../ui/document.tsx'

export default createController(routes, {
  actions: {
    async assets(context) {
      return (
        (await assetServer.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
      )
    },
    home(context) {
      return context.render(
        <Document>
          <main class="min-h-screen bg-background p-8 font-sans text-foreground">
            <section class="grid max-w-xl gap-4">
              <h1 class="text-2xl font-semibold">RadCN install target</h1>
              <p class="text-sm text-foreground">
                This route imports Button from generated target-owned source.
              </p>
              <div>
                <Button>Installed Button</Button>
              </div>
            </section>
          </main>
        </Document>,
      )
    },
  },
})
