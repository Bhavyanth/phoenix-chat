import React, { createContext, useContext, useEffect, useState } from "react";
import firebase from 'firebase/app';
import { auth, database, messaging } from "../../misc/firebaseconfig";


const ProfileContext = createContext();

export const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

export const ProfileProvider = ({children}) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 
    
    useEffect(() =>{
        let userRef;
        let userStatusRef;
        let tokenRefreshUnsub;
    
        const authUnsubscribe = auth.onAuthStateChanged(async authObj => {
            if(authObj){
                console.log('AuthOject', authObj.uid);
                userStatusRef = database.ref(`/status/${authObj.uid}`);
                userRef = database.ref(`/profiles/${authObj.uid}`);
                userRef.on('value', (snapshot) => {
                    const { name, createdAt, avatar } = snapshot.val();
                    const userData = {
                        name, createdAt, avatar,
                        uid: authObj.uid,
                        email: authObj.email,
                    };
                    setProfile(userData);
                    setIsLoading(false);
                });

               

                database.ref('.info/connected').on('value', (snapshot) => {
                    // snapshot.val()  might always be a Boolean, hence using !!
                    if (!!snapshot.val() === false) {
                        return;
                    };

                    userStatusRef.onDisconnect().set(isOfflineForDatabase).then(() => {
                        userStatusRef.set(isOnlineForDatabase);
                    });
                });

               if(messaging){
                try {
                    const currentToken = await messaging.getToken();
                    if(currentToken){
                        await database.ref(`/fcm_tokens/${currentToken}`).set(authObj.uid);
                    }
                } catch (err) {
                    console.log('An error occured',err);
                }

                tokenRefreshUnsub = messaging.onTokenRefresh(async () => {
                    try {
                        const currentToken = await messaging.getToken();
                        if(currentToken){
                            await database.ref(`/fcm_tokens/${currentToken}`).set(authObj.uid);
                        }
                    } catch (err) {
                        console.log('An error occured',err);
                    }
                });
               }


            }else{
                if(userRef){
                    userRef.off();
                }
                if(userStatusRef){
                    userStatusRef.off();
                }
                if(tokenRefreshUnsub){
                    tokenRefreshUnsub();
                }
                database.ref('.info/connected').off();
                setProfile(null);
                setIsLoading(false);
            }
        });
        return () =>{
            authUnsubscribe();
            database.ref('.info/connected').off();
            if(userRef){
                userRef.off();
            }
            if(userStatusRef){
                userStatusRef.off();
            }
            if(tokenRefreshUnsub){
                tokenRefreshUnsub();
            }
        }
    },[]);

    return ( <ProfileContext.Provider value={{ isLoading, profile}}>
        { children }
    </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);