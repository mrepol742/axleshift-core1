import dotenv from "dotenv";
dotenv.config();
import logger from "./logger.js";
import axios from "axios";

let last_fetch;
let response = [];

const scm = async () => {
    if (!last_fetch || response.length === 0) return await fetch();

    const past = new Date(last_fetch);
    const ten = 10 * 60 * 1000;

    if (!(Date.now() - past > ten)) return response;
    return await fetch();
};

const fetch = async () => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/dependabot/alerts`, {
            headers: {
                Authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (response.data.length === 0) return [];

        const alerts = response.data.map((alert) => ({
            number: alert.number,
            state: alert.state,
            scope: alert.dependency.scope,
            manifest: alert.dependency.manifest_path,
            cve: alert.security_advisory.cve_id ?? null,
            summary: alert.security_advisory.summary,
            severity: alert.security_advisory.severity,
            created_at: alert.security_advisory.created_at,
            updated_at: alert.security_advisory.updated_at ?? null,
        }));

        last_fetch = Date.now();
        response = alerts;

        return alerts;
    } catch (err) {
        logger.error(err);
    }
    return [];
};

export default scm;
