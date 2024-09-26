const recaptcha = (req, res, next) => {
    const { recaptchaRef } = req.body;

    return res.json({ status: 401 })
}

export default recaptcha