
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlK7CBk44LgUMG-8NVgSAmPxFkbNtuz9w",
  authDomain: "vertex-god-infinity.firebaseapp.com",
  projectId: "vertex-god-infinity",
  storageBucket: "vertex-god-infinity.firebasestorage.app",
  messagingSenderId: "771460996415",
  appId: "1:771460996415:web:a64b9c725284dfe124078a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
