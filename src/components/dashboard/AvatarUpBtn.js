import React, { useState, useRef } from 'react';
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModalState } from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebaseconfig';
import { useProfile } from '../context/profile.context';
import ProfileAvatar from './ProfileAvatar';
import { getUserUpdates } from '../../misc/helpers';

const fileInputType = '.png, .jpeg, .jpg';
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
const validFileType = (file) => acceptedFileTypes.includes(file.type);
const getBlob = (canvas) =>{
    return new Promise((resolve,reject) => {
        canvas.toBlob( (blob) => { 
            if(blob){
                resolve(blob);
            }else{
                reject(new Error ('File upload error'));
            }
        } )
    })
}
const AvatarUpBtn =() => {
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, open , close } = useModalState();
    const [image, setImage] = useState(null);
    const {profile} = useProfile();
    const avatarEditorRef = useRef();
    const onFileInputChange = (ev) => {
        const currentFiles = ev.target.files;
        if(currentFiles.length === 1){
            const file = currentFiles[0];
            if(validFileType (file)){
                setImage(file);
                open();
            }else{
                Alert.warning(`Incorrect file type ${file.type}`,2000);
            }
        }
    };

    const onClickUpload = async () => {
        const canvas = avatarEditorRef.current.getImageScaledToCanvas();
        // convert canvas to blob file (binary format), it only accepts call backs
        setIsLoading(true);
      try {
        const blob =  await getBlob(canvas);
        const avatarFileRef = storage.ref(`/profile/${profile.uid}`).child('avatar');
        const uploadAvatar = await avatarFileRef.put(blob,{
            cacheControl: `public, max-age=${3600*24*3}` 
        });
        const downloadUrl = await uploadAvatar.ref.getDownloadURL();

        const updates = await getUserUpdates(profile.uid,'avatar', downloadUrl, database);
        await database.ref().update(updates);

        // const useAvatarRef = database.ref(`/profiles/${profile.uid}`).child('avatar');
        // useAvatarRef.set(downloadUrl);
        setIsLoading(false);
        Alert.info('Profile pic updated',2000);
      } catch (error) {
        setIsLoading(false);
          Alert.error(error.message, 2000);
      }
    };

    return (
         <div className="mt-3 text-center">
        <ProfileAvatar src={profile.avatar} name={profile.name} className="width-150 height-150 img-fullsize font-huge"/>
     <div>
         <label htmlFor="avatar-upload" className="d-block cursor-pointer padded m-0">
             Change profile picture
             <input id="avatar-upload" type="file" className="d-none" accept={fileInputType} onChange={onFileInputChange}/>
         </label>

         <Modal show={isOpen} onHide={close}>
             <Modal.Header>
                 <Modal.Title>Upload new profile picture</Modal.Title>
             </Modal.Header>
             <Modal.Body> 
             <div className="d-flex justify-content-center align-items-center h-100">
                {image && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={image}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              )}
              </div>
              </Modal.Body>
             <Modal.Footer>
                 <Button block appearance="ghost" onClick={onClickUpload} disabled={isLoading} className="font-bolder"> Upload </Button>
             </Modal.Footer>
         </Modal>
     </div>
    </div>
    );
};

export default AvatarUpBtn;