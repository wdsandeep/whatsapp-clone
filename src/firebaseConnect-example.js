import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR-FIREBASE-API-KEY",
  authDomain: "YOUR-FIREBASE-AUTH-DOMAIN-KEY",
  projectId: "YOUR-FIREBASE-PROJECT-ID",
  storageBucket: "YOUR-FIREBASE-STORAGE-BUCKET-ID",
  messagingSenderId: "YOUR-FIREBASE-MESSAGING-SENDER-ID",
  appId: "YOUR-FIREBASE-APP-ID",
  measurementId: "YOUR-FIREBASE-MEASUREMENT-ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
export default db;
