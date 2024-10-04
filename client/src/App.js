import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import DocumentTitle from './components/middleware/DocumentTitle'
import Maintenance from './components/middleware/Maintenance'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const Login = React.lazy(() => import('./views/auth/login/index'))
const Register = React.lazy(() => import('./views/auth/register/index'))
const ForgotPassword = React.lazy(() => import('./views/auth/forgot-password/index'))
const Logout = React.lazy(() => import('./views/auth/logout/index'))

const App = () => {
    const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    const storedTheme = useSelector((state) => state.theme)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.href.split('?')[1])
        const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
        if (theme) setColorMode(theme)

        if (isColorModeSet()) return

        setColorMode(storedTheme)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Router>
            <Suspense
                fallback={
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                }
            >
                <Maintenance>
                    <DocumentTitle>
                        <Routes>
                            <Route exact path="/login" name="Login" element={<Login />} />
                            <Route exact path="/register" name="register" element={<Register />} />
                            <Route
                                exact
                                path="/forgot-password"
                                name="Forgot Password"
                                element={<ForgotPassword />}
                            />
                            <Route exact path="/logout" name="Logout" element={<Logout />} />
                            <Route path="*" name="Home" element={<DefaultLayout />} />
                        </Routes>
                    </DocumentTitle>
                </Maintenance>
            </Suspense>
        </Router>
    )
}

export default App
