import React, { useCallback, useEffect, useRef, useState } from 'react'
import { auth, database, storage } from '../../../misc/firebaseconfig';
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { groupBy, transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
const messagesRef = database.ref('/messages');

function scrollToBottom(node, threshold = 30) {
    const percent = (100*node.scrollTop)/(node.scrollHeight - node.clientHeight) || 0;
    return percent > threshold;
}

const Message = () => {
    const {chatId} = useParams();
    const [limit, setLimit] = useState(PAGE_SIZE);
    const [messages, setMessages] = useState(null);
    const isChatEmpty = messages && messages.length === 0;
    const canShowMessages = messages && messages.length > 0;
    const selfRef = useRef();

    const loadMessages = useCallback((limitToLast) => {
        const node = selfRef.current;
        messagesRef.off();
        messagesRef.orderByChild('roomId').equalTo(chatId).limitToLast(limitToLast || PAGE_SIZE).on('value', (snap) => {
            const data = transformToArrWithId(snap.val());
            setMessages(data);
          
            if(scrollToBottom(node)){
                node.scrollTop = node.scrollHeight;
            }
            
        });
        setLimit(p => p+ PAGE_SIZE);
    },[chatId]);

    const loadMore = useCallback (() => {
        const node = selfRef.current;
        const oldHeight = node.scrollHeight;
        loadMessages(limit);
        setTimeout(() => {
            const newHeight = node.scrollHeight;
            node.scrollTop = newHeight - oldHeight;
        },200);

    },[loadMessages,limit]);

    useEffect(() => {
        const node = selfRef.current;
        //load messages is an asynchronous operation
        loadMessages();
        setTimeout(() => {
            node.scrollTop = node.scrollHeight;
        },200);
        return () => {
            messagesRef.off('value');
        };
    },[loadMessages]);

    const handleLike = useCallback( async (msgId) => {
        const { uid } = auth.currentUser;
        const messagesRef = database.ref(`/messages/${msgId}`);
        let alertMsg;
        await messagesRef.transaction((msg) => {
            if (msg) {
                if (msg.likes && msg.likes[uid]) {
                    msg.likeCount -= 1;
                  msg.likes[uid] = null;
                  alertMsg = 'Unliked';
                } else {
                    msg.likeCount += 1;
                    if(!msg.likes){
                        msg.likes = {};
                    }
                  msg.likes[uid] = true;
                  alertMsg = 'Liked';
                }
              }
      
              return msg;
            });
            Alert.info(alertMsg, 2000);
    },[]);


    const handleAdmin = useCallback( async(uid) => {
        const adminRef = database.ref(`/rooms/${chatId}/admins`);
        let alertMsg;
        await adminRef.transaction(admins => {
            if (admins) {
                if (admins[uid]) {
                  admins[uid] = null;
                  alertMsg = 'Admin access removed';
                } else {
                  admins[uid] = true;
                  alertMsg = 'Admin access granted';
                }
              }
      
              return admins;
        });

        Alert.info(alertMsg,2000);
    },[chatId]);

    const handleDelete = useCallback( async (msgId, file) => {
        if(! window.confirm('Delete this message?')){
            return;
        }
        const isLast  = messages[messages.length - 1].id === msgId;
        const updates = {};
        updates[`/messages/${msgId}`] = null;
        if(isLast && messages.length > 1){
            updates[`/rooms/${chatId}/lastMessage`] = {
                ...messages[messages.length - 2],
                msgId: messages[messages.length - 2].id
            }
        }

        if(isLast && messages.length === 1){
            updates[`/rooms/${chatId}/lastMessage`] = null;
        }
        try {
            await database.ref().update(updates);
            Alert.info('Message deleted');
        } catch (err) {
          return  Alert.error(err.message);
        }
        if(file){
            try {
                const fileRef = storage.refFromURL(file.url)
               await fileRef.delete();
            } catch (error) {
                Alert.error(error.message);
            }
        }

    },[chatId, messages]);

    const renderMessages = () => {
        const groups = groupBy(messages, (item) => new Date(item.createdAt).toDateString());
        const items =[];
        Object.keys(groups).forEach((date) => {
            items.push( <li key={date} className="text-center mb-1 padded">{date}</li>);
        
            const msgs = groups[date].map(msg => (
                <MessageItem key={msg.id} 
                message={msg} 
                handleAdmin={handleAdmin} handleLike={handleLike} handleDelete={handleDelete}/>
            ));
                items.push(...msgs);
        });
        return items;
    };


    return <ul 
    ref={selfRef} className="msg-list custom-scroll">
        {messages && messages.length >= PAGE_SIZE && (
            <li className="text-center mt-2 mb-2"> <Button onClick={loadMore} color="cyan">Load more</Button></li>
        )}
        {isChatEmpty && <li>No messages yet</li>}
        {canShowMessages && renderMessages()}
        </ul>;
};

export default Message;
