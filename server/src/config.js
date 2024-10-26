import dotenv from 'dotenv'
dotenv.config()
const MONGO_URL = process.env.MONGO_URL ?? ''
const MONGO_DB = process.env.MONGO_DB ?? 'core1'

const NODE_ENV = process.env.NODE_ENV ?? 'development'
const EXPRESS_PORT = process.env.EXPRESS_PORT ?? 5051
const REACT_APP_ORIGIN = process.env.REACT_APP_ORIGIN ?? 'http://localhost:3000'
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET ?? ''

const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID ?? ''
const GOOGLE_OAUTH_SECRET_ID = process.env.GOOGLE_OAUTH_SECRET_ID ?? ''
const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID ?? ''
const GITHUB_OAUTH_SECRET_ID = process.env.GITHUB_OAUTH_SECRET_ID ?? ''

const API_RATE_LIMIT = process.env.API_RATE_LIMIT ?? 30
const API_RATE_DELAY = process.env.API_RATE_DELAY ?? 600
const API_EXTERNAL_RATE_LIMIT = process.env.API_EXTERNAL_RATE_LIMIT ?? 1000
const API_EXTERNAL_RATE_DELAY = process.env.API_EXTERNAL_RATE_DELAY ?? 600

const MAIL_HOST = process.env.MAIL_HOST ?? 'smtp.gmail.com'
const MAIL_PORT = process.env.MAIL_HOST ?? 587
const MAIL_USERNAME = process.env.MAIL_USERNAME ?? ''
const MAIL_PASSWORD = process.env.MAIL_PASSWORD ?? ''
const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS ?? ''

const GITHUB_AUTH_TOKEN = process.env.GITHUB_AUTH_TOKEN ?? ''
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'core1'
const GITHUB_OWNER = process.env.GITHUB_OWNER ?? 'freight-capstone'

const SENTRY_DNS = process.env.SENTRY_DNS ?? ''
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN ?? ''
const SENTRY_ORGANIZATION_SLUG = process.env.SENTRY_ORGANIZATION_SLUG ?? 'freight-capstone'
const SENTRY_PROJECT_SLUG = process.env.SENTRY_PROJECT_SLUG ?? 'core1'

export {
    MONGO_URL,
    MONGO_DB,
    NODE_ENV,
    EXPRESS_PORT,
    REACT_APP_ORIGIN,
    RECAPTCHA_SECRET,
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_SECRET_ID,
    GITHUB_OAUTH_CLIENT_ID,
    GITHUB_OAUTH_SECRET_ID,
    API_RATE_LIMIT,
    API_RATE_DELAY,
    API_EXTERNAL_RATE_LIMIT,
    API_EXTERNAL_RATE_DELAY,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_FROM_ADDRESS,
    GITHUB_AUTH_TOKEN,
    GITHUB_REPO,
    GITHUB_OWNER,
    SENTRY_DNS,
    SENTRY_AUTH_TOKEN,
    SENTRY_ORGANIZATION_SLUG,
    SENTRY_PROJECT_SLUG,
}
