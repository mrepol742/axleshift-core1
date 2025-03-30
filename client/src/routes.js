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
const Landing = lazy(() => import('./views/landing'))
const Privacy = lazy(() => import('./views/legal/PrivacyPolicy'))
const Terms = lazy(() => import('./views/legal/Terms'))
const Login = lazy(() => import('./views/auth/Login'))
const Register = lazy(() => import('./views/auth/Register'))
const ForgotPassword = lazy(() => import('./views/auth/ForgotPassword'))

/*
 * INTERNAL ROUTE
 */
const Dashboard = auth(lazy(() => import('./views/dashboard')))
const Shipment = auth(lazy(() => import('./views/shipment')))
const ShipmentInfo = auth(lazy(() => import('./views/shipment/[id]/')))
const Search = auth(lazy(() => import('./views/search')))
const Schedules = auth(lazy(() => import('./views/schedules')))

const SupportCustomerService = auth(lazy(() => import('./views/support/customer-service')))
const Faq = auth(lazy(() => import('./views/support/Faq')))

const Account = auth(lazy(() => import('./views/account')))
const _Security = auth(lazy(() => import('./views/account/Security')))

const BookNow = auth(lazy(() => import('./views/book-now')))

const Address = auth(lazy(() => import('./views/my-addresses')))
const NewAddress = auth(lazy(() => import('./views/my-addresses/New')))
const ViewAddress = auth(lazy(() => import('./views/my-addresses/View')))

const Security = auth(lazy(() => import('./views/security')))
const Management = auth(lazy(() => import('./views/security/Management')))
const Sessions = auth(lazy(() => import('./views/security/Sessions')))
const AccessToken = auth(lazy(() => import('./views/security/AccessToken')))
const NewAccessToken = auth(lazy(() => import('./views/security/access-token/New')))
const Webhooks = auth(lazy(() => import('./views/security/Webhooks')))
const ActivityLogs = auth(lazy(() => import('./views/security/AccountLogs')))

const Track = auth(lazy(() => import('./views/track')))
const TrackInfo = auth(lazy(() => import('./views/track/[id]')))

const Invoices = auth(lazy(() => import('./views/invoices')))
const InvoiceInfo = auth(lazy(() => import('./views/invoices/[id]')))

const Err404 = auth(lazy(() => import('./views/errors/404')))

const routes = [
    { path: '/', external: true, name: '', element: Landing },
    { path: '/privacy-policy', external: true, name: 'Privacy Policy', element: Privacy },
    { path: '/terms-of-service', external: true, name: 'Terms of Service', element: Terms },
    { path: '/login', external: true, name: 'Login', element: Login },
    { path: '/register', external: true, name: 'Register', element: Register },
    { path: '/logout', external: true, name: 'Logout', element: Logout },
    { path: '/auth/verify', external: true, name: 'Verify Account', element: OTP },
    {
        path: '/auth/github/callback',
        external: true,
        name: 'Github Callback',
        element: GithubCallback,
    },
    { path: '/forgot-password', external: true, name: 'Forgot Password', element: ForgotPassword },

    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/shipment', name: 'Shipment', element: Shipment },
    { path: '/shipment/:id', name: 'Shipment Info', element: ShipmentInfo },

    { path: '/search', name: 'Search Shipment', element: Search },
    { path: '/schedules', name: 'Schedules', element: Schedules },

    { path: '/customer', name: 'Customer Service', element: SupportCustomerService },
    { path: '/faq', name: 'Frequently Ask Question', element: Faq },

    { path: '/account', name: 'Account', element: Account },
    { path: '/account/security', name: 'Security', element: _Security },

    // { path: '/documents', name: 'Freight Documents', element: Err500 },

    { path: '/book-now', name: 'Ship Now', element: BookNow },

    { path: '/invoices', name: 'Invoices', element: Invoices },
    { path: '/invoices/:id', name: 'Invoice', element: InvoiceInfo },

    { path: '/my-addresses', name: 'My Addresses', element: Address },
    { path: '/my-addresses/new', name: 'New Address', element: NewAddress },
    { path: '/my-addresses/view', name: 'Address', element: ViewAddress },

    { path: '/security', name: 'Security', element: Security },
    { path: '/security/management', name: 'Management', element: Management },
    { path: '/security/account-logs', name: 'Account Logs', element: ActivityLogs },
    { path: '/security/sessions', name: 'Sessions', element: Sessions },
    { path: '/security/access-token', name: 'Access Token', element: AccessToken },
    { path: '/security/access-token/new', name: 'New Access Token', element: NewAccessToken },
    { path: '/security/webhooks', name: 'Webhooks', element: Webhooks },

    { path: '/track', name: 'Track', element: Track },
    { path: '/track/:id', name: 'Track', element: TrackInfo },

    { path: '*', name: '404', element: Err404 },
]

export default routes
