import React from 'react'

const Overview = React.lazy(() => import('./views/overview/index'))

const Freight = React.lazy(() => import('./views/freight/index'))
const FreightAir = React.lazy(() => import('./views/freight/air/index'))
const FreightLand = React.lazy(() => import('./views/freight/land/index'))
const FreightSea = React.lazy(() => import('./views/freight/sea/index'))

const Page404 = React.lazy(() => import('./views/pages/404'))

const routes = [
  { path: '/', name: 'Overview', element: Overview },

  { path: '/freight', name: 'Freight', element: Freight },
  { path: '/freight/air', name: 'FreightAir', element: FreightAir },
  { path: '/freight/land', name: 'FreightLand', element: FreightLand },
  { path: '/freight/sea', name: 'FreightSea', element: FreightSea },

  { path: '*', name: '404', element: Page404 },
]

export default routes
