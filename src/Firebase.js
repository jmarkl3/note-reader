import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

var firebaseConfig = {
    apiKey: "AIzaSyDCrQSCE91lh7GYlr7eTFbX--e1NnvF7Uw",
    authDomain: "practice-79227.firebaseapp.com",
    databaseURL: "https://practice-79227-default-rtdb.firebaseio.com",
    projectId: "practice-79227",
      storageBucket: "practice-79227.appspot.com",
      messagingSenderId: "283438782315",
      appId: "1:283438782315:web:d913f1ed9d87b5401a1e2e"     
}
var app = initializeApp(firebaseConfig)
export const dbRef = getDatabase(app)
export const auth = getAuth(app)