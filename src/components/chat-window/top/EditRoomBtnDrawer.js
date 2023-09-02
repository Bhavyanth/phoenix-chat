import React, { memo } from 'react'
import { useParams } from 'react-router';
import { Alert, Button, Drawer, Icon } from 'rsuite'
import { useMediaQuery, useModalState } from '../../../misc/custom-hooks'
import { database } from '../../../misc/firebaseconfig';
import { useCurrentRoom } from '../../context/current.room.context';
import EditableInput from '../../EditableInput';

const EditRoomBtnDrawer = () => {
    const {isOpen, open, close} = useModalState();
    const name = useCurrentRoom(v => v.name);
    const {chatId} = useParams();
    const isMobile = useMediaQuery('(max-widthL 992px)');
    const description = useCurrentRoom(v => v.description);
    
    const updateData = (key, value) => {
        database.ref(`rooms/${chatId}`).child(key).set(value).then(() => {
            Alert.success('Successfully updated', 2000);
        }).catch(err =>{
            Alert.error(err.message, 2000);
        });
    }

    const onNameSave = (newName) => {
        updateData('name', newName);
    }

    const onDescriptionSave = (newDesc) => {
        updateData('description', newDesc);
    }

    return (
        <>
            <Button appearance="link" className="br-circle1" size="sm" onClick={open}>
                {/* A for admin */}
                <Icon icon="gear-circle"/>
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={close} placement="right">
                <Drawer.Header><Drawer.Title>Edit Room</Drawer.Title></Drawer.Header>
                <Drawer.Body>
                    <EditableInput 
                    initialValue={name}
                    onSave={onNameSave}
                    label={<h6 className="mb-2">Name</h6>}
                    emptyMsg="Name cannot be empty"
                    />
                    <EditableInput 
                    componentClass="textarea"
                    rows={5}
                    initialValue={description}
                    onSave={onDescriptionSave}
                    emptyMsg="Description cannot be empty"
                    wrapperClassName="mt-3"
                    />
                </Drawer.Body>
                <Drawer.Footer>
                    <Button block className="font-bolder text-red" onClick={close}>Close</Button>
                </Drawer.Footer>
            </Drawer>
        </>
    )
}

export default memo(EditRoomBtnDrawer);
