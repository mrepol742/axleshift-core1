import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {
    VITE_APP_FIREBASE_API_KEY,
    VITE_APP_FIREBASE_APP_ID,
    VITE_APP_FIREBASE_AUTH_DOMAIN,
    VITE_APP_FIREBASE_MEASUREMENT_ID,
    VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    VITE_APP_FIREBASE_PROJECT_ID,
    VITE_APP_FIREBASE_STORAGE_BUCKET,
} from './config'

const config = {
    apiKey: VITE_APP_FIREBASE_API_KEY,
    authDomain: VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: VITE_APP_FIREBASE_APP_ID,
    measurementId: VITE_APP_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(config)
let db = getFirestore(app)

export default db
