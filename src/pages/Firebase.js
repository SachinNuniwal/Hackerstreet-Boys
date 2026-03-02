import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDK128MIwUDQgRblHhjbXDmvpiJWSlUkf8",
  authDomain: "first--0001.firebaseapp.com",
  projectId: "first--0001",
  storageBucket: "first--0001.firebasestorage.app",
  messagingSenderId: "165308659564",
  appId: "1:165308659564:web:654baee9fd1a3bf347e549",
  measurementId: "G-WZ79P3MFK5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);