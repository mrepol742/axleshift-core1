import React, { lazy } from 'react'
import auth from './components/middleware/Auth'

/*
 * GLOBAL ROUTE
 */
const OTP = lazy(() => import('./views/auth/OTP'))
const GithubCallback = lazy(() => import('./views/auth/github/Callback'))
const Logout = lazy(() => import('./views/auth/Logout'))

/*
 * EXTERNAL ROUTE
 */
const Landing = lazy(() => import('./views/landing/index'))
const Privacy = lazy(() => import('./views/legal/PrivacyPolicy'))
const Terms = lazy(() => import('./views/legal/Terms'))
const Login = lazy(() => import('./views/auth/Login'))
const Register = lazy(() => import('./views/auth/Register'))
const ForgotPassword = lazy(() => import('./views/auth/ForgotPassword'))

/*
 * INTERNAL ROUTE
 */
const Dashboard = auth(lazy(() => import('./views/dashboard/index')))
const Info = auth(lazy(() => import('./views/dashboard/Info')))
const Forms = auth(lazy(() => import('./views/dashboard/Forms')))
const Search = auth(lazy(() => import('./views/dashboard/Search')))
const Schedules = auth(lazy(() => import('./views/schedules/index')))

const Inbox = auth(lazy(() => import('./views/support/customer-service/index')))
const Chat = auth(lazy(() => import('./views/support/customer-service/Chat')))
const Account = auth(lazy(() => import('./views/account/index')))
const _Security = auth(lazy(() => import('./views/account/Security')))

const BookNow = auth(lazy(() => import('./views/book-now/index')))

const Couriers = auth(lazy(() => import('./views/couriers/index')))
const Routes = auth(lazy(() => import('./views/routes/index')))

const Security = auth(lazy(() => import('./views/security/index')))
const Management = auth(lazy(() => import('./views/security/Management')))
const Sessions = auth(lazy(() => import('./views/security/Sessions')))
const AccessToken = auth(lazy(() => import('./views/security/AccessToken')))
const Activity = auth(lazy(() => import('./views/security/Activity')))

const Track = auth(lazy(() => import('./views/track/index')))
const TrackInfo = auth(lazy(() => import('./views/track/Info')))

const Invoices = auth(lazy(() => import('./views/invoices/index')))

const Err404 = auth(lazy(() => import('./views/errors/404')))

/*
 * `external` = true will mark the route for non admin only, any
 * attemp of accessing unauthorized route path will return 404
 * and any attemp using unauthorized api endpoint will logout
 * the account.
 */
const routes = [
    { path: '/', external: true, name: '', element: Landing },
    { path: '/privacy-policy', external: true, name: 'Privacy Policy', element: Privacy },
    { path: '/terms-of-service', external: true, name: 'Terms of Service', element: Terms },
    { path: '/login', external: true, name: 'Login', element: Login },
    { path: '/register', external: true, name: 'Register', element: Register },
    { path: '/logout', external: true, name: 'Logout', element: Logout },
    { path: '/one-time-password', external: true, name: 'One Time Password', element: OTP },
    {
        path: '/auth/github/callback',
        external: true,
        name: 'Github Callback',
        element: GithubCallback,
    },
    { path: '/forgot-password', external: true, name: 'Forgot Password', element: ForgotPassword },

    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/shipment/:id', name: 'Shipment Info', element: Info },
    { path: '/shipment/:id/forms', name: 'Shipment Forms', element: Forms },
    { path: '/search', name: 'Search Shipment', element: Search },
    { path: '/schedules', name: 'Schedules', element: Schedules },

    { path: '/customer', name: 'Inbox', element: Inbox },
    { path: '/customer/:id', name: 'Chat', element: Chat },
    { path: '/account', name: 'Account', element: Account },
    { path: '/account/security', name: 'Security', element: _Security },

    // { path: '/documents', name: 'Freight Documents', element: Err500 },

    { path: '/book-now', name: 'Ship Now', element: BookNow },

    { path: '/invoices', name: 'Invoices', element: Invoices },
    //  { path: '/payment/invoice', name: 'Invoice', element: Err500 },

    { path: '/couriers', name: 'Couriers', element: Couriers },
    { path: '/routes', name: 'Routes', element: Routes },

    { path: '/security', name: 'Security', element: Security },
    { path: '/security/management', name: 'Management', element: Management },
    { path: '/security/activity', name: 'Activity', element: Activity },
    { path: '/security/sessions', name: 'Sessions', element: Sessions },
    { path: '/security/access-token', name: 'Access Token', element: AccessToken },

    { path: '/track', name: 'Track', element: Track },
    { path: '/track/:id', name: 'Track', element: TrackInfo },

    { path: '*', name: '404', element: Err404 },
]

export default routes
