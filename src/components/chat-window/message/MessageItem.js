import React, { memo } from 'react'
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import { auth } from '../../../misc/firebaseconfig';
import { useCurrentRoom } from '../../context/current.room.context';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import PresenceDot from '../../PresenceDot';
import IconBtnControl from './IconBtnControl';
import ImageBtnModal from './ImageBtnModal';
import ProfileInfoBtn from './ProfileInfoBtn';

const renderFileMessage = (file) => {

    if(file.contentType.includes('image')){
        return ( <div className="height-220">
            <ImageBtnModal src={file.url} fileName={file.name}/>
        </div>
        );
    }

    if(file.contentType.includes('audio')){
        return <audio controls>
            <source src={file.url} type="audio/mp3" /> Your browser does not support audio
        </audio>
    }

    return <a href={file.url}>Download {file.name}</a>
}

const MessageItem = ({message, handleAdmin, handleDelete}) => {
    const {author, createdAt, text, file, likes} = message;
    // useHover returns an array of exaclty 2 elements
    const [selfRef, isHover] = useHover();
    const isMobile = useMediaQuery('(max-width: 992px)');
    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const admins = useCurrentRoom(v => v.admins);
    const isMsgAuthorAdmin = admins.includes(author.uid);
    const isAuthor = auth.currentUser.uid === author.uid;
    const canGrantAdmAccess =  isAdmin && !isAuthor;
    const isLiked =  likes && Object.keys(likes).includes(auth.currentUser.uid);

    const canShowIcons = isMobile || isHover;

    return <li className={`padded-mb-1 cursor-pointer ${isHover ? 'bg-black-02' : ''}`} ref={selfRef}>
        <div className="d-flex align-items-center font-bolder mb-1">
            <PresenceDot uid={author.uid}/>
        <ProfileAvatar src={author.avatar} name={author.name} className="ml-1" size="xs"/>
        {/* <span className="ml-2">{author.name}</span> */}
        <ProfileInfoBtn profile={author} appearance="link" className="p-0 ml-1 text-black">
            { canGrantAdmAccess && 
            <Button block onClick={() => handleAdmin(author.uid)} color="blue"> 
            {isMsgAuthorAdmin ? 'Remove admin access' : 'Grant admin access'}
            </Button> 
            } 
        </ProfileInfoBtn>
        <TimeAgo datetime={createdAt} className="font-normal text-black-45 ml-2"/>
        {/* <IconBtnControl 
        {...(isLiked ? {color:'red'}: {})} 
        isVisible={canShowIcons} 
        iconName="heart" 
        tooltip="Like" 
        onClick={() => handleLike(message.id)} 
        badgeContent={likeCount}/> */}

        {isAuthor && (  <IconBtnControl 
        {...(isLiked ? {color:'red'}: {})} 
        isVisible={canShowIcons} 
        iconName="close" 
        tooltip="Delete this message" 
        onClick={() => handleDelete(message.id, file)} 
        />
        )}
        </div>
        <div>
            {text && <span className="word-breal-all">{text}</span>}
            {file && renderFileMessage(file)}
        </div>
    </li>
}

export default memo(MessageItem);
