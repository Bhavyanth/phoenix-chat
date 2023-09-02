importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDomqXnBteDuDtILH0fuBHykatTiM1SM5w",
    authDomain: "chat-app-a690c.firebaseapp.com",
    projectId: "chat-app-a690c",
    storageBucket: "chat-app-a690c.appspot.com",
    messagingSenderId: "664874593048",
    appId: "1:664874593048:web:c88618b1d19ee3a8738c6d",
    measurementId: "G-E7KYWVBM0N",
});

firebase.messaging();