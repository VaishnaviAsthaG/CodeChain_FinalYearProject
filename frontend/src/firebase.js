import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFb1RqUbKWyl4qE6Z8prKQcFzJgbMuYa8",
  authDomain: "codechain-0414.firebaseapp.com",
  projectId: "codechain-0414",
  appId: "1:778626959352:web:9faeabd09374d29a1c780d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();