import { createController } from 'remix/router'

import { assetServer } from '../assets.ts'
import { getComponentDoc } from '../content/components.tsx'
import { routes } from '../routes.ts'
import { ComponentPage, HomePage } from '../ui/docs-pages.tsx'

export default createController(routes, {
  actions: {
    async assets(context) {
      return (
        (await assetServer.fetch(context.request)) ?? new Response('Not Found', { status: 404 })
      )
    },
    home(context) {
      return context.render(<HomePage />)
    },
    component(context) {
      let component = getComponentDoc(context.params.slug)
      if (!component) {
        return new Response('Component not found', { status: 404 })
      }

      return context.render(<ComponentPage component={component} />)
    },
  },
})
