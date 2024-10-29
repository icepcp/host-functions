const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require("firebase-admin/auth");

var admin = require("firebase-admin");
const serviceAccount = {
    "type": "service_account",
    "project_id": "myt-hosting",
    "private_key_id": process.env.FB_PRIVATE_KEY_ID,
    "private_key": process.env.FB_PRIVATE_KEY,
    "client_email": process.env.FB_CLIENT_EMAIL,
    "client_id": process.env.FB_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7bhtf%40myt-hosting.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }  
initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default async function verifyToken(authHeader: string) {
    try {
      const decodedToken = await getAuth().verifyIdToken(authHeader.split(' ')[1]);
      return { uid: decodedToken.uid, error: null };
    } catch (error) {
      console.error('Token verification failed:', error);
      return { uid: null, error: 'Unauthorized' };
    }
  }
  