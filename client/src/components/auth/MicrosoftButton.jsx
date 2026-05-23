import { CButton } from '@coreui/react'
import { VITE_APP_MICROSOFT_OAUTH_CLIENT_ID } from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'

const MicrosoftButton = ({ setLoading }) => {
    const handleMicrosoftLogin = () => {
        setLoading(true)
        window.location.href = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${VITE_APP_MICROSOFT_OAUTH_CLIENT_ID}&response_type=code&redirect_uri=https://core1.axleshift.com/auth/microsoft/callback&response_mode=query&scope=openid%20profile%20email%20User.Read&state=12345`
    }

    return (
        <CButton color="outline-primary" className="me-2" onClick={handleMicrosoftLogin}>
            <FontAwesomeIcon icon={faMicrosoft} />
        </CButton>
    )
}

export default MicrosoftButton
