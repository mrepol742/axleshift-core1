import axios from 'axios'
import cookies from 'js-cookie'
import { VITE_APP_API_URL, VITE_APP_SESSION } from './config.js'

const _axios = axios.create()

_axios.defaults.baseURL = `${VITE_APP_API_URL}/api/v1`
_axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
_axios.defaults.timeout = 60000

_axios.interceptors.request.use(
    (config) => {
        const token = cookies.get(VITE_APP_SESSION)
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
        if (error.response && error.response.status === 401) {
            cookies.remove(VITE_APP_SESSION)
            window.location.reload()
        }
        return Promise.reject(error)
    },
)

window.axios = _axios
window.cookies = cookies
