import {Notification as Toast} from 'rsuite';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';
import 'firebase/functions';
import { isLocalhost } from './helpers';


const config = {
    apiKey: "AIzaSyDomqXnBteDuDtILH0fuBHykatTiM1SM5w",
    authDomain: "chat-app-a690c.firebaseapp.com",
    projectId: "chat-app-a690c",
    storageBucket: "chat-app-a690c.appspot.com",
    messagingSenderId: "664874593048",
    appId: "1:664874593048:web:c88618b1d19ee3a8738c6d",
    measurementId: "G-E7KYWVBM0N"
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
export const functions = app.functions('europe-west3');
export const messaging = firebase.messaging.isSupported() ? app.messaging() : null;


if(messaging){
    messaging.usePublicVapidKey('BCoNgx-6blpkJ30kD4j1r5Htmbgx5J9pScwcQx7RP8rc0CPbUrvDqLZ5VREejfCSEYjlsOiNzmGLhduefXo6I0E');

    messaging.onMessage(({notification}) => {
        const {title, body} = notification
        Toast.info({title,description:body, duration:0});
    });
}

if(isLocalhost){
    functions.useFunctionsEmulator('http://localhost:5001');
}