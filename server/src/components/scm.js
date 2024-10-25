import axios from 'axios'
import { parseRateLimit } from 'ratelimit-header-parser'
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_AUTH_TOKEN } from '../config.js'
import logger from './logger.js'

let last_fetch
let res = []

const scm = async () => {
    if (!last_fetch || res.length === 0) return await fetch()

    const past = new Date(last_fetch)
    const ten = 5 * 60 * 1000

    if (!(Date.now() - past > ten)) return res
    return await fetch()
}

const fetch = async () => {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dependabot/alerts`,
            {
                headers: {
                    Authorization: `token ${GITHUB_AUTH_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            },
        )

        if (response.data.length === 0) return []

        const alerts = response.data.map((alert) => ({
            number: alert.number,
            state: alert.state,
            scope: alert.dependency.scope,
            manifest: alert.dependency.manifest_path,
            cve: alert.security_advisory.cve_id ?? null,
            summary: alert.security_advisory.summary,
            severity: alert.security_advisory.severity,
            updated_at: alert.security_advisory.updated_at ?? null,
        }))

        last_fetch = Date.now()
        res = alerts

        logger.info(`github ratelimit: ${JSON.stringify(parseRateLimit(response))}`)
        return alerts
    } catch (err) {
        logger.error(err)
    }
    return []
}

export default scm
