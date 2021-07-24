import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Need to update below config
const config = {
    apiKey: "AIzaSyDQWmHRJsU99V46uTeg5zolcj6Z0p-fwak",
    authDomain: "exam-cd2db.firebaseapp.com",
    projectId: "exam-cd2db",
    storageBucket: "exam-cd2db.appspot.com",
    messagingSenderId: "998510104034",
    appId: "1:998510104034:web:7540bc4d2b6981e1183dbb",
    measurementId: "G-QSPXP1SDT9"
};
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}
const auth = firebase.auth();
export {
    auth,
    firebase
};