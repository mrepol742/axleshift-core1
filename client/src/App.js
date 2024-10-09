import React, { Suspense, useEffect, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import ReactGA from 'react-ga4'
import './scss/style.scss'
import DocumentTitle from './components/middleware/DocumentTitle'
import Maintenance from './components/middleware/Maintenance'

// Containers
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'))

const Login = lazy(() => import('./views/auth/login'))
const Register = lazy(() => import('./views/auth/register'))
const ForgotPassword = lazy(() => import('./views/auth/forgotpassword'))
const Logout = lazy(() => import('./views/auth/logout'))
const MailOTP = lazy(() => import('./views/auth/otp/mail.js'))

const App = () => {
    const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    const storedTheme = useSelector((state) => state.theme)
    ReactGA.initialize(import.meta.env.VITE_APP_GOOGLE_ANALYTICS)

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
                <Maintenance>
                    <DocumentTitle>
                        <Routes>
                            <Route exact path="/login" name="Login" element={<Login />} />
                            <Route exact path="/register" name="Register" element={<Register />} />
                            <Route exact path="/otp" name="OTP" element={<MailOTP />} />
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
