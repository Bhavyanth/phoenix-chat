import React, { useState } from 'react';
import { Alert, Button, Icon, Tag } from 'rsuite';
import { auth } from '../../misc/firebaseconfig';
import firebase from 'firebase/app';

const ProviderBlock = () => {
    const [isConnected, setIsConnected] = useState({
        'google.com':auth.currentUser.providerData.some((data) => data.providerId === 'google.com'),
        'facebook.com':auth.currentUser.providerData.some((data) => data.providerId === 'facebook.com'),
    });

        const updateIsConnected = (providerId, value) => {
            setIsConnected(p => {
                return {
                    // ...p is to merge the previous state, getting a key and value using []:val
                    ...p, 
                    [providerId]:value,
                };
            });
        };
    const unlink = async providerId => {
        try {
            if(auth.currentUser.providerData.length === 1){
                throw new Error (`You cannot disconnect from ${providerId}`)
            }
            await auth.currentUser.unlink(providerId);
            updateIsConnected(providerId,false);
            Alert.info(`Disconnected from ${providerId}`,2000);
        } catch (err) {
            Alert.error(err.message,2000);
        }
    };

    const unLinkGoogle = () => {
        unlink('google.com');
    }
    const unLinkFacebook = () => {
        unlink('facebook.com');
    }

    const link = async (provider) => {
        try {
            await auth.currentUser.linkWithPopup(provider);
            Alert.info(`Linked to ${provider.providerId}`,2000);
            updateIsConnected(provider.providerId, true);
        } catch (err) {
            Alert.info(err.message,2000);
        }
    };

    const linkGoogle = () => {
        link(new firebase.auth.GoogleAuthProvider());
    };
    const linkFacebook = () => {
        link(new firebase.auth.FacebookAuthProvider());
    };
    
    return ( <div>
        {isConnected["google.com"] && (
        <Tag className="text-green font-bolder" closable onClose={unLinkGoogle}>
            <Icon icon="google" /> Connected
        </Tag>
        )}
        {isConnected["facebook.com"] && (
        <Tag className="text-blue font-bolder" closable onClose={unLinkFacebook}>
            <Icon icon="facebook" /> Connected
        </Tag>
        )}   
        <div className="mt-2">
        {!isConnected["google.com"] && (
        <Button block className="text-green font-bolder" onClick={linkGoogle}>
            <Icon icon="google"/> Link to Google
        </Button>
        )}
        {!isConnected["facebook.com"] && (
        <Button block className="text-blue font-bolder" onClick={linkFacebook}>
            <Icon icon="facebook"/> Link to Facebook
        </Button>
        )}
        </div>
        </div>
    );
};
export default ProviderBlock;