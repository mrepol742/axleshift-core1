import { JSDOM } from 'jsdom'
import DOMPurify from 'dompurify'

const { window } = new JSDOM('')
const purify = DOMPurify(window)

const sanitize = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        for (const key of Object.keys(req.body)) {
            if (typeof req.body[key] === 'string' && /[<>]/.test(req.body[key])) {
                req.body[key] = purify.sanitize(req.body[key])
            }
        }
    }
    next()
}

export default sanitize
