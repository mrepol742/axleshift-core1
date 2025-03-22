import axios from 'axios'
import cookies from 'js-cookie'
import pako from 'pako'
import DOMPurify from 'dompurify'
import { VITE_APP_API_URL, VITE_APP_SESSION } from './config.js'

const token = cookies.get(VITE_APP_SESSION)
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
    '/forgot-password',
    '/one-time-password',
]

_axios.interceptors.request.use(
    async (config) => {
        if (config.data) {
            console.log(JSON.stringify(config.data))
            const sanitizedData = DOMPurify.sanitize(JSON.stringify(config.data))
            console.log(sanitizedData)
            config.data = pako.gzip(sanitizedData, { to: 'string' })
            config.headers['Content-Encoding'] = 'gzip'
            config.headers['Content-Type'] = 'application/json'
        }
        config.headers['Authorization'] = `Bearer ${token}`
        return config
    },
    (error) => {
        console.error(error)
        return Promise.reject(error)
    },
)

_axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        console.error(error)
        if (
            error.response &&
            error.response.status === 401 &&
            !excludedPaths.includes(window.location.pathname)
        ) {
            if (!excludedPaths.includes(window.location.pathname)) {
                cookies.remove(VITE_APP_SESSION)
                window.location.reload()
            }
        }
        return Promise.reject(error)
    },
)

window.axios = _axios
window.cookies = cookies
