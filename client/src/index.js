import './instrument'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'core-js'
import { VITE_APP_GOOGLE_OAUTH_CLIENT_ID } from './config'
import App from './App'
import store from './store'
import { ToastProvider } from './components/ToastContext'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <ToastProvider>
            <GoogleOAuthProvider clientId={VITE_APP_GOOGLE_OAUTH_CLIENT_ID}>
                <App />
            </GoogleOAuthProvider>
        </ToastProvider>
    </Provider>,
)
