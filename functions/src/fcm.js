const functions = require("firebase-functions");
const admin = require("firebase-admin");

const database = admin.database();
const messaging = admin.messaging();
exports.sendFcm = functions
    .region('europe-west3')
    .https.onCall(async (data, context) => {
    checkIfAuth(context);

    const {chatId, title, message} = data;
    const roomSnap = await database.ref(`/rooms/${chatId}`).once('value');
    if(!roomSnap.exists()){
        return false;
    }
    const roomData = roomSnap.val();
    checkIfAllowed(context, transformToArr(roomData.admins));
    const fcmUsers = transformToArr(roomData.fcmUsers);
    const userTokenPromises = fcmUsers.map(uid => getUserTokens(uid));
    const userTokensResult = await Promise.all(userTokenPromises);
    // Promise returns array of elements, giving us nested results, hence we need to flatten that array
    const tokens= userTokensResult.reduce((accTokens,userTokens) => [...accTokens, ...userTokens], []);
    if(tokens.length === 0){
        return false;
    }
    const fcmMessage = {
        notification: {
            title:`${title} (${roomData.name})`,
            body: message
        },
        tokens,
    }

    const batchResponse = await messaging.sendMulticast(fcmMessage);
    const failedTokens = [];
    if (batchResponse.failureCount > 0) {
        batchResponse.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
          }
        });
      }
      const removePromises = failedTokens.map(token => database.ref(`/fcm_tokens/${token}`).remove());
      return Promise.all(removePromises).catch(err => err.message);
});

function checkIfAuth(context) {
    if(!context.auth){
        throw new functions.https.HttpsError('unauthenticated','Please sign in');
    }
}

function checkIfAllowed(context, chatAdmins){
    if(!chatAdmins.includes(context.auth.uid)){
        throw new functions.https.HttpsError('unauthenticated','Restricted access');
    }
}

function transformToArr(snapVal){
    return snapVal ? Object.keys(snapVal) : [];
}

async function getUserTokens(uid){
    const userTokensSnap = await database.ref('/fcm_tokens').orderByValue().equalTo(uid).once('value');

    if(!userTokensSnap.hasChildren()){
        return [];
    }
    return Object.keys(userTokensSnap.val());
}