import  firebase from 'firebase/app' ;
import "firebase/auth" ;
import  "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDfRJGnzqj6KnEmQk-MB9VA8Gcq-eN9LTg",
  authDomain: "nwitter-24d07.firebaseapp.com",
  projectId: "nwitter-24d07",
  storageBucket: "nwitter-24d07.appspot.com",
  messagingSenderId: "426674927915",
  appId: "1:426674927915:web:2818fbbe942283eb2fed6e"
};
firebase.initializeApp(firebaseConfig);

export const friebaseInstance = firebase ;

const authSerVice = firebase.auth() ;
export  default authSerVice

export const dbService = firebase.firestore(); 

export const storageService= firebase.storage();


