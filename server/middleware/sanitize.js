import ems from 'express-mongo-sanitize'

const sanitize = (req, res, next) => {
    req.body = ems.sanitize(req.body);
    req.params = ems.sanitize(req.params);
    next();
};

export default sanitize

