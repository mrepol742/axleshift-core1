import React, { lazy } from 'react'
import auth from './components/AppAuth'

/*
 * GLOBAL ROUTE
 */
const OTP = lazy(() => import('./views/auth/OTP'))
const GithubCallback = lazy(() => import('./views/auth/github/Callback'))
const MicrosoftCallback = lazy(() => import('./views/auth/microsoft/Callback'))
const Logout = lazy(() => import('./views/auth/Logout'))

/*
 * EXTERNAL ROUTE
 */
const Landing = lazy(() => import('./views/landing'))
const Login = lazy(() => import('./views/auth/Login'))
const Register = lazy(() => import('./views/auth/Register'))
const ForgotPassword = lazy(() => import('./views/auth/ForgotPassword'))

/*
 * INTERNAL ROUTE
 */
const Privacy = lazy(() => import('./views/legal/PrivacyPolicy'))
const Terms = lazy(() => import('./views/legal/Terms'))
const Refund = lazy(() => import('./views/legal/RefundPolicy'))

const Dashboard = lazy(() => import('./views/dashboard'))
const Shipment = lazy(() => import('./views/shipment'))
const ShipmentInfo = lazy(() => import('./views/shipment/[id]/'))
const Search = lazy(() => import('./views/search'))
const Schedules = lazy(() => import('./views/schedules'))

const SupportCustomerService = lazy(() => import('./views/support/customer-service'))
const Faq = lazy(() => import('./views/support/Faq'))
const SendEmail = lazy(() => import('./views/support/Email'))

const Account = lazy(() => import('./views/account'))

const BookNow = lazy(() => import('./views/book-now'))

const Documents = lazy(() => import('./views/documents'))
const Document = lazy(() => import('./views/documents/[id]'))
const BillOfLading = lazy(() => import('./views/documents/[id]/bill-of-lading'))

const Address = lazy(() => import('./views/my-addresses'))
const NewAddress = lazy(() => import('./views/my-addresses/New'))
const ViewAddress = lazy(() => import('./views/my-addresses/View'))

const Security = lazy(() => import('./views/security'))
const Management = lazy(() => import('./views/security/Management'))
const Sessions = lazy(() => import('./views/security/Sessions'))
const AccessToken = lazy(() => import('./views/security/AccessToken'))
const NewAccessToken = lazy(() => import('./views/security/access-token/New'))
const Webhooks = lazy(() => import('./views/security/Webhooks'))
const ActivityLogs = lazy(() => import('./views/security/AccountLogs'))
const LogManagement = lazy(() => import('./views/security/panel/LogManagement'))

const Track = lazy(() => import('./views/track'))
const TrackInfo = lazy(() => import('./views/track/[id]'))

const Invoices = lazy(() => import('./views/invoices'))
const InvoiceInfo = lazy(() => import('./views/invoices/[id]'))

const Reports = lazy(() => import('./views/reports'))

const Performance = lazy(() => import('./views/performance'))

const Err404 = lazy(() => import('./views/errors/404'))

const routes = [
    { path: '/', external: true, name: '', roles: [], element: Landing },
    { path: '/login', external: true, name: 'Login', roles: [], element: Login },
    { path: '/register', external: true, name: 'Register', roles: [], element: Register },
    { path: '/logout', external: true, name: 'Logout', roles: [], element: Logout },
    { path: '/auth/verify', external: true, name: 'Verify Account', roles: [], element: OTP },
    {
        path: '/auth/github/callback',
        external: true,
        name: 'Github Callback',
        element: GithubCallback,
    },
    {
        path: '/auth/microsoft/callback',
        external: true,
        name: 'Microsoft Callback',
        element: MicrosoftCallback,
    },
    {
        path: '/forgot-password',
        external: true,
        name: 'Forgot Password',
        roles: [],
        element: ForgotPassword,
    },

    { path: '/privacy-policy', name: 'Privacy Policy', roles: [], element: Privacy },
    { path: '/terms-of-service', name: 'Terms of Service', roles: [], element: Terms },
    { path: '/refund-policy', name: 'Refund Policy', roles: [], element: Refund },

    { path: '/dashboard', name: 'Dashboard', roles: [], element: Dashboard },
    { path: '/shipment', name: 'Shipment', roles: [], element: Shipment },
    { path: '/shipment/:id', name: 'Shipment Info', roles: [], element: ShipmentInfo },

    { path: '/search', name: 'Search Shipment', roles: [], element: Search },

    { path: '/documents', name: 'Documents', roles: [], element: Documents },
    { path: '/documents/:id', name: 'Documents', roles: [], element: Document },
    {
        path: '/documents/:id/bill-of-lading',
        name: 'Bill of Lading',
        roles: [],
        element: BillOfLading,
    },

    { path: '/schedules', name: 'Schedules', roles: [], element: Schedules },

    { path: '/customer', name: 'Customer Service', roles: [], element: SupportCustomerService },
    { path: '/faq', name: 'Frequently Ask Question', roles: [], element: Faq },
    { path: '/send-email', name: 'Send Email', roles: ['user'], element: SendEmail },

    { path: '/account', name: 'Account', roles: [], element: Account },

    { path: '/book-now', name: 'Ship Now', roles: ['admin'], element: BookNow },

    { path: '/invoices', name: 'Invoices', roles: [], element: Invoices },
    { path: '/invoices/:id', name: 'Invoice', roles: [], element: InvoiceInfo },

    { path: '/my-addresses', name: 'My Addresses', roles: ['admin'], element: Address },
    { path: '/my-addresses/new', name: 'New Address', roles: ['admin'], element: NewAddress },
    { path: '/my-addresses/view', name: 'Address', roles: ['admin'], element: ViewAddress },

    { path: '/security', name: 'Security', roles: [], element: Security },
    { path: '/security/management', name: 'Management', roles: ['user'], element: Management },
    { path: '/security/account-logs', name: 'Account Logs', roles: [], element: ActivityLogs },
    { path: '/security/sessions', name: 'Sessions', roles: [], element: Sessions },
    { path: '/security/access-token', name: 'Access Token', roles: ['user'], element: AccessToken },
    {
        path: '/security/access-token/new',
        name: 'New Access Token',
        roles: ['user'],
        element: NewAccessToken,
    },
    { path: '/security/webhooks', name: 'Webhooks', roles: ['user'], element: Webhooks },

    { path: '/track', name: 'Track', roles: [], element: Track },
    { path: '/track/:id', name: 'Track', roles: [], element: TrackInfo },

    { path: '/performance', name: 'Performance', roles: [], element: Performance },

    { path: '/reports', name: 'Reports', roles: [], element: Reports },

    { path: '*', name: '404', roles: [], element: Err404 },
]

export default routes
