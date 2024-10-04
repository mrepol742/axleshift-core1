import sessions from "../src/sessions.js";

const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.json({ status: 401 });

    const token = authHeader.split(" ")[1];
    if (!token && !/^[0-9a-f]{64}$/.test(token)) return res.json({ status: 401 });

    const email = Object.keys(sessions).find((email) => sessions[email][token]);
    if (!email) return res.json({ status: 401 });

    const sessionEntry = sessions[email][token];
    if (!sessionEntry && !sessionEntry.active) return res.json({ status: 401 });

    req.token = token;
    req.email = email;
    next();
    return;
};

export default auth;
