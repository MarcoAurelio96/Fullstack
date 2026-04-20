import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfq480PuTvpxW5h2DfPyBRjAHfuWcF9l8",
  authDomain: "ironpace-3f9de.firebaseapp.com",
  projectId: "ironpace-3f9de",
  storageBucket: "ironpace-3f9de.firebasestorage.app",
  messagingSenderId: "687023895456",
  appId: "1:687023895456:web:2a4028c36c7ee944d3aac5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);