import './instrument'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'core-js'
import { UserProvider } from './components/UserProvider'
import {
    VITE_APP_GITHUB_OAUTH_CLIENT_ID,
    VITE_APP_GOOGLE_OAUTH_CLIENT_ID,
    VITE_APP_MICROSOFT_OAUTH_CLIENT_ID,
    VITE_APP_RECAPTCHA_SITE_KEY,
} from './config'
import App from './App'
import store from './store'

const div = document.createElement('div')
document.body.appendChild(div)

if (!VITE_APP_GOOGLE_OAUTH_CLIENT_ID) {
    console.warn('VITE_APP_GOOGLE_OAUTH_CLIENT_ID is not set. Google OAuth will be disabled.')
}

if (!VITE_APP_MICROSOFT_OAUTH_CLIENT_ID) {
    console.warn('VITE_APP_MICROSOFT_OAUTH_CLIENT_ID is not set. Microsoft OAuth will be disabled.')
}

if (!VITE_APP_GITHUB_OAUTH_CLIENT_ID) {
    console.warn('VITE_APP_GITHUB_OAUTH_CLIENT_ID is not set. GitHub OAuth will be disabled.')
}

if (!VITE_APP_RECAPTCHA_SITE_KEY) {
    console.warn('VITE_APP_RECAPTCHA_SITE_KEY is not set. reCAPTCHA will be disabled.')
}

createRoot(div).render(
    <UserProvider>
        <Provider store={store}>
            {VITE_APP_GOOGLE_OAUTH_CLIENT_ID ? (
                <GoogleOAuthProvider clientId={VITE_APP_GOOGLE_OAUTH_CLIENT_ID}>
                    <App />
                </GoogleOAuthProvider>
            ) : (
                <App />
            )}
        </Provider>
    </UserProvider>,
)
