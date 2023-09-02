import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import Dashboard from '.';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import { auth, database } from '../../misc/firebaseconfig';
import {isOfflineForDatabase} from '../context/profile.context';

const DashBoardToggle = () => {

    const { isOpen, open, close } = useModalState();
    // The below hook returns Boolean
    const isMobile = useMediaQuery('(max-width: 992px)'); 

    const onSignOut = useCallback(() => {
        database.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase).then(()=>{
            auth.signOut();
            Alert.info('Signed out', 2000);
            close();
        }).catch(err =>{
            Alert.error(err.message,2000);
        });
      }, [close]);

    return (
        <>
        <Button block appearance="ghost" color="blue" className="text-blue font-bolder"
         onClick={open}>
        <Icon icon="user" /> Profile
        </Button>
        <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <Dashboard onSignOut={onSignOut}/>
        </Drawer>
        </>
    );
};

export default DashBoardToggle;