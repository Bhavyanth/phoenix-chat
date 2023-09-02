import React, { useCallback, useState } from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite'
import firebase from 'firebase/app';
import { useProfile } from '../../context/profile.context';
import { useParams } from 'react-router';
import {database} from  '../../../misc/firebaseconfig';
import Attachment from './Attachment';
import AudioMsgBtn from './AudioMsgBtn';

function assembleMsg(profile, chatId){
    return {
        roomId: chatId,
        author:{
            name:profile.name,
            uid: profile.uid,
            createdAt: profile.createdAt,
            ...(profile.avatar ? { avatar:profile.avatar } : {} )
        },
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        likecount: 0,
    };
}
const Bottom = () => {
    const {chatId} = useParams();
    const {profile} = useProfile();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const onInputChange = useCallback((value) => {
        setInput(value);
        },[]);
    const onSend = async () => {
    if(input.trim() === ''){
        return;
    }
    const msgData = assembleMsg(profile,chatId);
    msgData.text = input;

    // to display last msg in chat list
    const updates = {};
    const messageId  = database.ref('messages').push().key;
    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
        ...msgData,
        msgId:messageId,
    };
    setIsLoading(true);
    try {
        await database.ref().update(updates);
        //after sending msg, set input to empty string
        setInput('');
        setIsLoading(false);
    } catch (error) {
        setIsLoading(false);
        Alert.error(error.message);
    }
}

    
const onKeyDown = (ev) => {
        if(ev.keyCode === 13){
            // to prevent default functionality for this button
            ev.preventDefault();
            onSend();
        }
}

    const afterUpload = useCallback( async (files) => {
        setIsLoading(true);
        const updates ={};
        files.forEach(file => {
            const msgData = assembleMsg(profile,chatId);
            msgData.file = file;

            const messageId  = database.ref('messages').push().key;
            updates[`/messages/${messageId}`] = msgData;
        });

        const lastMsgId = Object.keys(updates).pop();
        updates[`/rooms/${chatId}/lastMessage`] = {
            ...updates[lastMsgId],
            msgId:lastMsgId,
        };

        try {
            await database.ref().update(updates);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            Alert.error(error.message);
        }

    },[chatId, profile]);

    return <div>
  <InputGroup>
  <Attachment afterUpload={afterUpload}/>
  <AudioMsgBtn afterUpload={afterUpload}/>
    <Input placeholder="Type a message..." value={input} onChange={onInputChange} onKeyDown={onKeyDown}/>
    <InputGroup.Button color="cyan" appearance="primary" onClick={onSend} disabled={isLoading}>
        <Icon icon="send-o" />
    </InputGroup.Button>
  </InputGroup>
        </div>;
};

export default Bottom;
