import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAAuNBZlrx1ezZ14Gpxxn4itYeb0ml4BHU",
    authDomain: "dongalleton-e39c2.firebaseapp.com",
    projectId: "dongalleton-e39c2",
    storageBucket: "dongalleton-e39c2.appspot.com",
    messagingSenderId: "267086803782",
    appId: "1:267086803782:web:385b9b5ab81481dd526b47"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };