import ReactGA from 'react-ga4'
import { VITE_APP_GOOGLE_ANALYTICS } from './config'

export const initGA = () => {
    ReactGA.initialize(VITE_APP_GOOGLE_ANALYTICS)
}

export const trackPageview = (path) => {
    ReactGA.send({ hitType: 'pageview', page: path })
}
