import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY, VITE_APP_SESSION } from '../../../config'

const Callback = () => {
    const navigate = useNavigate()
    const recaptchaRef = React.useRef()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchData = async (code) => {
        if (!navigator.geolocation)
            setError({
                error: true,
                message: 'Geolocation is not supported by this browser. Login failed!',
            })

        navigator.geolocation.getCurrentPosition(
            (position) => {
                github(code, {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            (error) => {
                let errorMessage
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'We need your location to continue.'
                        break
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.'
                        break
                    case error.TIMEOUT:
                        errorMessage = 'Timeout occurred while getting your location.'
                        break
                    default:
                        errorMessage = 'An unknown error occurred. Please try again later.'
                }
                setError({
                    error: true,
                    message: errorMessage,
                })
                return true
            },
        )
    }

    const github = async (code, location) => {
        const recaptcha = await recaptchaRef.current.executeAsync()
        axios
            .post(`/auth/login`, {
                type: 'github',
                code,
                location: JSON.stringify(location),
                recaptcha_ref: recaptcha,
            })
            .then((response) => {
                cookies.set(VITE_APP_SESSION, response.data.token, { expires: 30 })
                window.location.href = '/'
            })
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                setError(message)
                setTimeout(() => {
                    navigate(`/login`)
                }, 1500)
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
                <h1 className="text-center">{error ? error : 'Processing...'}</h1>
            </CContainer>
        </div>
    )
}

export default Callback
