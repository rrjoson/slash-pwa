import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
var firebaseConfig = {
  // apiKey:
  // authDomain:
  // projectId:
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
// firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD

export const db = firebase.firestore();
