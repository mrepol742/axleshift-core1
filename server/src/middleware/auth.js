import { getUser, isActiveToken } from "../components/sessions.js";

const adminRoute = [];

const auth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send();

    const token = authHeader.split(" ")[1];
    if (!token && !/^[0-9a-f]{64}$/.test(token)) return res.status(401).send();

    const theUser = await getUser(token);
    if (!theUser || (adminRoute.includes(req.path) && theUser.role !== 'admin')) return res.status(401).send();

    const status = await isActiveToken(token);
    if (!status) return res.status(401).send();

    req.token = token;
    req.email = theUser.email;
    req.role = theUser.role;
    return next();
};

export default auth;
