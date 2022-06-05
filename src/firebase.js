import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBiACKikzBDfl_i14__a7JGDXILn8-kDQg",
  authDomain: "groupchat-5198c.firebaseapp.com",
  projectId: "groupchat-5198c",
  storageBucket: "groupchat-5198c.appspot.com",
  messagingSenderId: "230545846099",
  appId: "1:230545846099:web:e3ad869d22baf58be03ba6",
  measurementId: "G-G4HFHG2M6X"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);