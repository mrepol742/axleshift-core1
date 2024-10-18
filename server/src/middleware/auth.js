import validateInternalToken from "../components/token/internal.js";
import validateExternalToken from "../components/token/external.js";

const auth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send();

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).send();
    // validate external token
    if (/^core1_[0-9a-f]{64}$/.test(token)) return validateExternalToken(req, res, next);
    if (!/^[0-9a-f]{64}$/.test(token)) return res.status(401).send();
    return validateInternalToken(req, res, next);
};

export default auth;
