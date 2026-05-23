import { CButton } from '@coreui/react'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useGoogleLogin } from '@react-oauth/google'

const GoogleButton = ({ handleSubmit, setError }) => {
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            handleSubmit(null, 'google', credentialResponse.access_token)
        },
        onError: () => {
            setError({
                error: true,
                message: 'Please try again later',
            })
        },
    })

    return (
        <CButton color="outline-primary" className="me-2" onClick={handleGoogleLogin}>
            <FontAwesomeIcon icon={faGoogle} />
        </CButton>
    )
}

export default GoogleButton
