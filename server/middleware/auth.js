import sessions from "../src/sessions.js";

const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(400).send();

    const token = authHeader.split(" ")[1];
    if (!token && !/^[0-9a-f]{64}$/.test(token)) return res.status(401).send();

    const email = Object.keys(sessions).find((email) => sessions[email][token]);
    if (!email) return res.status(401).send();

    const sessionEntry = sessions[email][token];
    if (!sessionEntry && !sessionEntry.active) return res.status(401).send();

    req.token = token;
    req.email = email;
    next();
    return;
};

export default auth;
