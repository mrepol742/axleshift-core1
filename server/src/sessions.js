import fs from 'fs'
import cron from 'node-cron'
import logger from '../logger.js'

let sessions

init()

process.on('exit', (code) => {
    fs.writeFile('./sessions/sessions.json', JSON.stringify(sessions), (err) => {
        if (err) throw err
        logger.info('Sessions save')
    })
    logger.info('Server offline')
})

cron.schedule('0 * * * *', () => {
    fs.writeFile('./sessions/sessions.json', JSON.stringify(sessions), (err) => {
        if (err) throw err
        logger.info('Sessions save')
    })
})

function init() {
    fs.mkdir('./sessions', { recursive: true }, (err) => {
        if (err) throw err
    })

    try {
        sessions = JSON.parse(fs.readFileSync('./sessions/sessions.json', 'utf8'))
        logger.info('Sessions retrieved')
    } catch (err) {
        if (err.code === 'ENOENT') {
            sessions = {}
            logger.info('New session created')
        } else {
            throw err
        }
    }
}

export const addUserProfileToSession = (theUser) => {
    if (!sessions[theUser.email]) {
        sessions[theUser.email] = {}
    }

    if (!sessions[theUser.email]['profile']) {
        sessions[theUser.email]['profile'] = theUser
    }
}

export const addSession = (theUser, sessionToken, ip, userAgent) => {
    if (!sessions[theUser.email]) {
        sessions[theUser.email] = {}
    }

    sessions[theUser.email][sessionToken] = {
        active: true,
        ip_address: ip,
        user_agent: userAgent,
        last_accessed: Date.now(),
    }
}

export const removeSession = (sessionToken) => {

    const s = Object.keys(sessions).find((email) => sessions[email][sessionToken])

    if (s) {
        const sessionEntry = sessions[s][sessionToken]
        if (sessionEntry) {
            sessionEntry.active = false
        }
    }
}


export default sessions