import axios from 'axios'
import cookies from 'js-cookie'

window.axios = axios
window.cookies = cookies

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
