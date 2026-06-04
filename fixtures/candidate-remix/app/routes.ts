import { get, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  fixtures: '/fixtures',
  fixtureComponent: '/fixtures/:component',
  fixtureScenario: '/fixtures/:component/:scenario',
})
