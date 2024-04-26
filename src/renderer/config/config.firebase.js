
/*
export default {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ?? '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID ?? '',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ?? ''
}
*/
// TODO: Fix this! Environment variables are now loaded differently with WebPack and ERB, .env module doesn't work out of the box

export default {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: ''
}
