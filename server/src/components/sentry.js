import axios from 'axios'
import { SENTRY_ORGANIZATION_SLUG, SENTRY_PROJECT_SLUG, SENTRY_AUTH_TOKEN } from '../config.js'
import logger from '../utils/logger.js'

let last_fetch
let res = []

/**
 * Returns issues from last fetch or fetches new issues if the last fetch was more than 5 minutes ago.
 * 
 * @returns {Promise<Array>}
 */
const sentry = async () => {
    if (!last_fetch || res.length === 0) return await fetch()

    const past = new Date(last_fetch)
    const ten = 5 * 60 * 1000

    if (!(Date.now() - past > ten)) return res
    return await fetch()
}

/**
 * Fetches the latest project issues from the Sentry API.
 * 
 * @returns {Promise<Array>}
 */
const fetch = async () => {
    try {
        const response = await axios.get(
            `https://sentry.io/api/0/projects/${SENTRY_ORGANIZATION_SLUG}/${SENTRY_PROJECT_SLUG}/issues/`,
            {
                headers: {
                    Authorization: `Bearer ${SENTRY_AUTH_TOKEN}`,
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
