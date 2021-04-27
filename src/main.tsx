// Hyperstatic runtime
import { hyperstatic } from 'hyperstatic'

// Root view
import Loader from '/src/components/core/Loader'
import App from '/src/components/core/App'

const routes = {
  '/': import('./pages/HomePage'),
  '/secondary': import('./pages/SecondaryPage'),
  '/counter': import('./pages/CounterPage'),
  '/characters': import('./pages/CharacterList'),
  '/characters/:id': import('./pages/CharacterDetails'),
  '/:splat*': import('./pages/NotFoundPage')
}

// All of these are optional
const options = {
  baseUrl: '/', // Path prefix
  loader: Loader, // Custom loading indicator in case of slow networks
  fastClicks: true
}

hyperstatic({
  routes,
  options,
  init: {},
  view: App,
})
