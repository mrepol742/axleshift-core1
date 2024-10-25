import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import {
    VITE_APP_RECAPTCHA_SITE_KEY,
    VITE_APP_SESSION,
    VITE_APP_API_URL,
    VITE_APP_GITHUB_OAUTH_CLIENT_ID,
} from '../../../config'
import errorMessages from '../../../components/http/ErrorMessages'

const Callback = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(async () => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')

        if (!code) navigate('/')

        const recaptcha = await recaptchaRef.current.executeAsync()
        const formData = new FormData()
        formData.append('type', 'github')
        formData.append('code', code)
        formData.append('recaptcha_ref', recaptcha)

        await axios
            .post(`${VITE_APP_API_URL}/api/v1/auth/login`, formData, {
                headers: {},
            })
            .then((response) => {
                if (response.data.error) return setError(response.data.error)
                cookies.set(VITE_APP_SESSION, response.data.token, { expires: 30 })
                window.location.href = '/'
            })
            .catch((error) => {
                console.error(error)
                const message = errorMessages[error.status] || 'An unexpected error occurred'
                setError(message)
            })
            .finally(() => {
                setLoading(false)
            })
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
                <p className="text-center">{error ? error : 'Processing github...'}</p>
            </CContainer>
        </div>
    )
}

export default Callback
