import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyAXulWErfXIEfaLq3U6L-L2_AW8ZW16SLo",
  authDomain: "auth-2c1fd.firebaseapp.com",
  databaseURL: "https://auth-2c1fd-default-rtdb.firebaseio.com",
  projectId: "auth-2c1fd",
  storageBucket: "auth-2c1fd.appspot.com",
  messagingSenderId: "830886358380",
  appId: "1:830886358380:web:c6a3f976e1ed7bd39c1749"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export {auth,provider}