import React, { Suspense, useEffect, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AOS from 'aos'
import { CSpinner, useColorModes } from '@coreui/react'
import ReactGA from 'react-ga4'
import { TourProvider } from '@reactour/tour'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { VITE_APP_NODE_ENV, VITE_APP_GOOGLE_ANALYTICS } from './config'
import './scss/style.scss'
import AppErrorBoundary from './components/AppErrorBoundary'
import DocumentTitle from './components/middleware/DocumentTitle'
import IdleTimeout from './components/middleware/IdleTimeout'
import routes from './routes'
import steps from './steps'
import './bootstrap'

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'))

const App = () => {
    AOS.init()
    const { isColorModeSet, setColorMode } = useColorModes('theme')
    const storedTheme = useSelector((state) => state.theme)
    if (VITE_APP_NODE_ENV === 'production') ReactGA.initialize(VITE_APP_GOOGLE_ANALYTICS)
    const disableBody = (target) => disableBodyScroll(target)
    const enableBody = (target) => enableBodyScroll(target)
    const [disableKeyboardNavigation] = ['esc']

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.href.split('?')[1])
        const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
        if (theme) setColorMode(theme)

        if (isColorModeSet()) return

        setColorMode(storedTheme)

        if (VITE_APP_NODE_ENV === 'production')
            ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
    }, [])

    return (
        <TourProvider
            steps={steps}
            afterOpen={disableBody}
            beforeClose={enableBody}
            disableKeyboardNavigation={disableKeyboardNavigation}
            onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {
                if (steps) {
                    if (currentStep === steps.length - 1) {
                        setIsOpen(false)
                    }
                    setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1))
                }
            }}
            styles={{
                popover: (base) => ({
                    ...base,
                    color: 'var(--cui-body-color)',
                    backgroundColor: 'var(--cui-body-bg)',
                    boxShadow: 'var(--cui-box-shadow-lg)',
                    borderRadius: 'var(--cui-border-radius)',
                }),
            }}
        >
            <Router>
                <Suspense
                    fallback={
                        <div className="loading-overlay">
                            <CSpinner color="primary" variant="grow" />
                        </div>
                    }
                >
                    <AppErrorBoundary>
                        <DocumentTitle>
                            <IdleTimeout>
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
                            </IdleTimeout>
                        </DocumentTitle>
                    </AppErrorBoundary>
                </Suspense>
            </Router>
        </TourProvider>
    )
}

export default App
