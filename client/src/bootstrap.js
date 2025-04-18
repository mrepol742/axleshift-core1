import axios from 'axios'
import cookies from 'js-cookie'
import pako from 'pako'
import DOMPurify from 'dompurify'
import { VITE_APP_API_URL, VITE_APP_SESSION } from './config.js'

const _axios = axios.create({
    baseURL: `${VITE_APP_API_URL}/api/v1`,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: 15000,
})

const excludedPaths = [
    '/login',
    '/register',
    '/auth/github/callback',
    '/auth/verify',
    '/forgot-password',
]

_axios.interceptors.request.use(
    async (config) => {
        if (config.data && !(config.data instanceof FormData)) {
            const sanitizedData = DOMPurify.sanitize(JSON.stringify(config.data))
            config.data = pako.gzip(sanitizedData, { to: 'string' })
            config.headers['Content-Encoding'] = 'gzip'
            config.headers['Content-Type'] = 'application/json'
        }
        config.headers['Authorization'] = `Bearer ${cookies.get(VITE_APP_SESSION)}`
        return config
    },
    (error) => {
        console.error(error)
        return Promise.reject(error)
    },
)

_axios.interceptors.response.use(
    (response) => {
        if (window.location.pathname !== '/auth/verify' && response.data.otp)
            return (window.location.href = '/auth/verify')
        return response
    },
    (error) => {
        console.error(error)
        if (
            error.response &&
            error.response.status === 401 &&
            !excludedPaths.includes(window.location.pathname)
        ) {
            cookies.remove(VITE_APP_SESSION)
            window.location.reload()
        }
        return Promise.reject(error)
    },
)

window.axios = _axios
window.cookies = cookies

const styleTitle = `
    font-size: 48px;
    font-weight: bold;
    color: red;
    text-shadow: 2px 2px 0 black;
  `
const styleMessage = `
    font-size: 16px;
    color: black;
    font-weight: bold;
    background: yellow;
    padding: 4px 8px;
    display: block;
    border: 2px dashed red;
  `

console.log('%cSTOP!', styleTitle)
console.log(
    `%cThis browser feature is intended for developers.\nIf someone told you to copy and paste something here, it could be a scam. Never paste code you don’t understand.`,
    styleMessage,
)

let devtoolsOpen = false
const element = new Image()
Object.defineProperty(element, 'id', {
    get() {
        devtoolsOpen = true
        setTimeout(() => {
            if (devtoolsOpen) {
                console.clear()
                console.log('%cSTOP!', styleTitle)
                console.log(`%cThis feature is for developers. Be careful!`, styleMessage)
            }
        }, 100)
    },
})

console.log('%c', element)
