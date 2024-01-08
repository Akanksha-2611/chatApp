import {initializeApp} from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

const firebaseConfig={
    apiKey: "AIzaSyBhe-C2917aL0AMWUkn9oWXUC-xPQZEkfk",
    authDomain: "chat-app-7655c.firebaseapp.com",
    projectId: "chat-app-7655c",
    storageBucket: "chat-app-7655c.appspot.com",
    messagingSenderId: "122445808715",
    appId: "1:122445808715:web:e2c3401e22f3cec7caf9ce",
    measurementId: "G-4NVNXT776R",
};

const app=initializeApp(firebaseConfig);
const firestore=getFirestore(app);
const auth=getAuth(app);

export {app,firestore,auth};
