import React, { Suspense, useEffect, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import ReactGA from 'react-ga4'
import { VITE_APP_GOOGLE_ANALYTICS } from './config'
import './scss/style.scss'
import DocumentTitle from './components/middleware/DocumentTitle'
import routes from './routes'
import './bootstrap'

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'))

const App = () => {
    const { isColorModeSet, setColorMode } = useColorModes('theme')
    const storedTheme = useSelector((state) => state.theme)
    ReactGA.initialize(VITE_APP_GOOGLE_ANALYTICS)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.href.split('?')[1])
        const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
        if (theme) setColorMode(theme)

        if (isColorModeSet()) return

        setColorMode(storedTheme)

        ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
    }, [])

    return (
        <Router>
            <Suspense
                fallback={
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                }
            >
                <DocumentTitle>
                    <Routes>
                        {routes.map((route, idx) => {
                            return (
                                route.external && (
                                    <Route
                                        key={idx}
                                        path={route.path}
                                        exact={route.exact}
                                        name={route.name}
                                        element={<route.element />}
                                    />
                                )
                            )
                        })}
                        <Route path="*" element={<DefaultLayout />} />
                    </Routes>
                </DocumentTitle>
            </Suspense>
        </Router>
    )
}

export default App
