const functions = require("firebase-functions");

const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-app-a690c-default-rtdb.firebaseio.com"
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.fcm
const { sendFcm } = require('./src/fcm');

exports.sendFcm = sendFcm;