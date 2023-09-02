import React, { useState } from 'react'
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite'
import { useModalState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebaseconfig';


const MAX_FILE_SIZE = 1000*1024*10;
const Attachment = ({ afterUpload }) => {
    const {isOpen, close, open} = useModalState();
    const { chatId } = useParams();
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const onChange = (fileArr) => {
        // allow only files less than 10mb
        const filtered = fileArr.filter(el => el.blobFile.size <= MAX_FILE_SIZE).slice(0,10);
        setFileList(filtered);
    }

    const onUpload = async () => {
        try {
            const uploadPromises = fileList.map(f => {
            return  storage.ref(`/chat/${chatId}`).child(Date.now() + f.name)
                .put(f.blobFile, { cacheControl: `public, max-age=${3600*24*3}`,
                });
            }) ;

            const uploadSnap = await Promise.all(uploadPromises);
            const shapePromises = uploadSnap.map(async snap => {
                return{
                    contentType: snap.metadata.contentType,
                    name: snap.metadata.name,
                    url: await snap.ref.getDownloadURL()
                }
            })

            const files = await Promise.all(shapePromises);
            await afterUpload(files);
            setIsLoading(false);
            close();
        } catch (err) {
            setIsLoading(false);
            Alert.error(err.message, 2000);
        }
    };

    return <>
           <InputGroup.Button onClick={open}>
           <Icon icon="attachment" />
           </InputGroup.Button> 
           <Modal show={isOpen} onHide={close}>
            <Modal.Header>
            <Modal.Title>Upload file</Modal.Title> </Modal.Header>
            <Modal.Body>
                <Uploader className="w-100" autoUpload={false} action="" fileList={fileList} onChange={onChange} multiple listType="picture-text" disabled={isLoading}/>
            </Modal.Body>
            <Modal.Footer>
                <Button block disabled={isLoading} onClick={onUpload}> Send</Button>
                <div className="text-right mt-2">
                    <small>* files should be less than 10mb</small>
                </div>
            </Modal.Footer>
           </Modal>
        </>;  
};

export default Attachment;
