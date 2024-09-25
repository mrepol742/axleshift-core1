import sessions from '../src/sessions.js'

const auth = (req, res, next) => {
    const { token } = req.body;

    if (!token && !/^[0-9a-f]{64}$/.test(token)) return res.json({ status: 401 })

        const email = Object.keys(sessions).find((email) => sessions[email][token])
    
        if (email) {
            const sessionEntry = sessions[email][token]
            if (sessionEntry) return next()
        }
        return res.json({ status: 401 })
}

export default auth