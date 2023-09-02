import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import ChatTop from '../../components/chat-window/top';
import Messages from '../../components/chat-window/message';
import ChatBottom from '../../components/chat-window/bottom';
import { useRooms } from '../../components/context/rooms.context';
import { CurrentRoomProvider } from '../../components/context/current.room.context';
import { transformToArr } from '../../misc/helpers';
import { auth } from '../../misc/firebaseconfig';



const Chat = () => {
    const {chatId} = useParams();
    const rooms = useRooms();

    if(!rooms){
        return <Loader center vertical size="md" content="Loading" speed="slow" />
    }

    // get current room from rooms array
    const currentRoom = rooms.find(room => room.id === chatId);
    if(!currentRoom){
        return  <h6 className="text-center mt-page">Chat {chatId} not found</h6>
    }
    // destructuring values
    const {name,description} = currentRoom;

    const admins = transformToArr(currentRoom.admins);
    const fcmUsers =  transformToArr(currentRoom.fcmUsers);
    const isAdmin = admins.includes(auth.currentUser.uid);
    const isReceivingFcm = fcmUsers.includes(auth.currentUser.uid);

    const currRoomData = {
        name, description,admins, isAdmin,isReceivingFcm,
    };

    // Objects are always compared by references\
    // Objects are referentially changed
    return (
     <CurrentRoomProvider data={currRoomData}>
        <div className="chat-top">
           <ChatTop />
        </div>
        <div className="chat-middle">
        <Messages />
     </div>
     <div className="chat-bottom">
     <ChatBottom />
     </div>
  </CurrentRoomProvider>
  );
};

export default Chat;
