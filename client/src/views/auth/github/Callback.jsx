import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_SESSION } from '../../../config'
import errorMessages from '../../../components/ErrorMessages'

const Callback = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchData = async (code) => {
        const recaptcha = await recaptchaRef.current.executeAsync()
        await axios
            .post(`/auth/login`, {
                type: 'github',
                code: code,
                recaptcha_ref: recaptcha,
            })
            .then((response) => {
                if (response.data.error) return setError(response.data.error)
                cookies.set(VITE_APP_SESSION, response.data.token, { expires: 30 })
                window.location.href = '/'
            })
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                setError(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')

        if (!code) navigate('/dashboard')

        fetchData(code)
    }, [])

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <div className="auth-bg" />
            <CContainer>
                {loading && (
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                )}
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={VITE_APP_RECAPTCHA_SITE_KEY}
                />
                <p className="text-center">{error ? error : 'Processing...'}</p>
            </CContainer>
        </div>
    )
}

export default Callback
