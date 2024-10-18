import React, { Suspense, useEffect, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import ReactGA from 'react-ga4'
import './scss/style.scss'
import './bootstrap'
import DocumentTitle from './components/middleware/DocumentTitle'

// Containers
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'))

const Landing = lazy(() => import('./views/landing'))
const Login = lazy(() => import('./views/auth/login'))
const Register = lazy(() => import('./views/auth/register'))
const ForgotPassword = lazy(() => import('./views/auth/forgotpassword'))
const MailOTP = lazy(() => import('./views/auth/otp/mail'))

const App = () => {
    const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    const storedTheme = useSelector((state) => state.theme)
    ReactGA.initialize(import.meta.env.VITE_APP_GOOGLE_ANALYTICS)
    let token = cookies.get(import.meta.env.VITE_APP_SESSION)

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((reg) => {
                    self.addEventListener('activate', (event) => {
                        event.waitUntil(
                            (async () => {
                                const keys = await caches.keys()
                                return keys.map(async (cache) => {
                                    if (cache !== cacheName) {
                                        return await caches.delete(cache)
                                    }
                                })
                            })(),
                        )
                    })
                })
                .catch((err) => {
                    console.error(err)
                })
        }

        const urlParams = new URLSearchParams(window.location.href.split('?')[1])
        const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
        if (theme) setColorMode(theme)

        if (isColorModeSet()) return

        setColorMode(storedTheme)

        ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
    }, [])

    useEffect(() => {
        token = cookies.get(import.meta.env.VITE_APP_SESSION)
    }, [useNavigate])

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
                        {!token && (
                            <Route exact path="/" name="Landing Page" element={<Landing />} />
                        )}
                        <Route exact path="/login" name="Login" element={<Login />} />
                        <Route exact path="/register" name="Register" element={<Register />} />
                        <Route exact path="/otp" name="OTP" element={<MailOTP />} />
                        <Route
                            exact
                            path="/forgot-password"
                            name="Forgot Password"
                            element={<ForgotPassword />}
                        />
                        <Route path="*" name="Home" element={<DefaultLayout />} />
                    </Routes>
                </DocumentTitle>
            </Suspense>
        </Router>
    )
}

export default App
