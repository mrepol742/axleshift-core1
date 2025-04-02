import React, { Suspense, useEffect, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AOS from 'aos'
import { CSpinner, useColorModes } from '@coreui/react'
import ReactGA from 'react-ga4'
import PropTypes from 'prop-types'
import { CContainer } from '@coreui/react'
import { VITE_APP_NODE_ENV, VITE_APP_GOOGLE_ANALYTICS } from './config'
import './scss/style.scss'
import DocumentTitle from './components/middleware/DocumentTitle'
import IdleTimeout from './components/middleware/IdleTimeout'
import routes from './routes'
import './bootstrap'

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'))

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary: ', error, errorInfo)
        this.setState({ error, errorInfo })
    }

    render() {
        if (this.state.hasError) {
            return (
                <CContainer className="border-2 border border-danger m-5 rounded-3">
                    <h1 className="mt-4">Something went wrong.</h1>
                    {this.state.errorInfo && <code>{this.state.errorInfo.componentStack}</code>}
                    <p className="text-muted small mt-5">
                        Report issues at{' '}
                        <a href="mailto:mrepol742@gmail.com">mrepol742@gmail.com</a>
                    </p>
                </CContainer>
            )
        }

        return this.props.children
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node,
}

const App = () => {
    AOS.init()
    const { isColorModeSet, setColorMode } = useColorModes('theme')
    const storedTheme = useSelector((state) => state.theme)
    if (VITE_APP_NODE_ENV === 'production') ReactGA.initialize(VITE_APP_GOOGLE_ANALYTICS)

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
        <Router>
            <Suspense
                fallback={
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                }
            >
                <ErrorBoundary>
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
                </ErrorBoundary>
            </Suspense>
        </Router>
    )
}

export default App
