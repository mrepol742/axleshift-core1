import axios from 'axios'
import cookies from 'js-cookie'
import { VITE_APP_API_URL, VITE_APP_SESSION } from './config.js'

const _axios = axios.create()
let userIP = null
const excludedPaths = ['/login', '/register', '/auth/github/callback', '/forgot-password', '/otp']

_axios.defaults.baseURL = `${VITE_APP_API_URL}/api/v1`
_axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
_axios.defaults.timeout = 60000

async function getUserIP() {
    try {
        const response = await axios.get('https://api64.ipify.org?format=json')
        return response.data.ip
    } catch (error) {
        console.error('Failed to fetch IP', error)
    }
    return null
}

_axios.interceptors.request.use(
    async (config) => {
        const token = cookies.get(VITE_APP_SESSION)
        config.headers['Authorization'] = `Bearer ${token}`

        if (!userIP) userIP = await getUserIP()
        config.headers['X-Client-IP'] = btoa(userIP)
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
