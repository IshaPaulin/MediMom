// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeEAs4Z1oJT1xRNIYhicIgKj0-JLhU4Rc",
  authDomain: "medimom-d8fb3.firebaseapp.com",
  projectId: "medimom-d8fb3",
  storageBucket: "medimom-d8fb3.firebasestorage.app",
  messagingSenderId: "411413663313",
  appId: "1:411413663313:web:d8a9023d1cb5e9364c7270",
  measurementId: "G-GSXH2M6CQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;