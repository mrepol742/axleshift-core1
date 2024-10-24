import dotenv from 'dotenv'
dotenv.config()
import logger from './logger.js'
import axios from 'axios'

let last_fetch
let res = []

const sentry = async () => {
    if (!last_fetch || res.length === 0) return await fetch()

    const past = new Date(last_fetch)
    const ten = 5 * 60 * 1000

    if (!(Date.now() - past > ten)) return res
    return await fetch()
}

const fetch = async () => {
    try {
        const response = await axios.get(
            `https://sentry.io/api/0/projects/${process.env.SENTRY_ORGANIZATION_SLUG}/${process.env.SENTRY_PROJECT_SLUG}/issues/`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SENTRY_AUTH_TOKEN}`,
                },
            },
        )

        if (response.data.length === 0) return []

        const issues = response.data.map((issue) => ({
            id: issue.id,
            title: issue.title,
            culprit: issue.culprit,
            level: issue.level,
            status: issue.status,
            priority: issue.priority,
            count: issue.count,
            updated_at: issue.lastSeen,
        }))

        last_fetch = Date.now()
        res = issues

        return issues
    } catch (err) {
        logger.error(err)
    }
    return []
}

export default sentry
