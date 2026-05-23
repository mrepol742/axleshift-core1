import { CButton } from '@coreui/react'
import { VITE_APP_GITHUB_OAUTH_CLIENT_ID } from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const GithubButton = ({ setLoading }) => {
    const handleGithubLogin = () => {
        setLoading(true)
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${VITE_APP_GITHUB_OAUTH_CLIENT_ID}`
    }

    return (
        <CButton color="outline-primary" className="me-2" onClick={handleGithubLogin}>
            <FontAwesomeIcon icon={faGithub} />
        </CButton>
    )
}

export default GithubButton
