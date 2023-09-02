import React, { useCallback, useRef, useState } from 'react';
import { Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema } from 'rsuite';
import { useModalState } from '../../misc/custom-hooks';
import firebase from 'firebase/app';
import { auth, database } from '../../misc/firebaseconfig';
const { StringType } = Schema.Types;
const model = Schema.Model({
    name: StringType().isRequired('Name is required'),
    description: StringType().isRequired('Description is required'),
})

const INIT_FORM = {
    name: '',
    description: ''
}
const CreateRoomBtnModal = () => {
    const { isOpen, open, close } = useModalState();
    const [formValue, setFormValue] = useState(INIT_FORM);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef();
    const onFormChange = useCallback (value => {
        setFormValue(value);
    },[]);

    const onSubmit = async () => {
        // check() will validate the data against the schema defined
        if (!formRef.current.check()){
            return;
        }
        setIsLoading(true);

        const newRoomData={
            ...formValue,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            admins: {[auth.currentUser.uid] : true},
            fcmUsers: {[auth.currentUser.uid] : true},
        };
        try {
            await database.ref('rooms').push(newRoomData);
            Alert.info(`${formValue.name} is created`, 2000);
            setIsLoading(false);
            setFormValue(INIT_FORM);
            close();
            
        } catch (error) {
            setIsLoading(false);
            Alert.error(error.message,2000);
        }
    }
        return (
            <div className="mt-2">
                <Button block color="green" className="font-bolder" 
                onClick={open}>
                    <Icon icon="pencil"/> New chat
                </Button>
                <Modal show={isOpen} onHide={close}>
                    <Modal.Header><Modal.Title>New Chat</Modal.Title></Modal.Header>
                    <Modal.Body>
                    <Form fluid onChange={onFormChange} formValue={formValue} model={model} ref={formRef}>
                        <FormGroup>
                            <ControlLabel>Chat name</ControlLabel>
                            <FormControl name="name" placeholder="Enter chat name.." />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl componentClass="textarea" rows={5} name="description" placeholder="Enter chat description.." />
                        </FormGroup>
                    </Form>

                    </Modal.Body>
                    <Modal.Footer><Button block appearance="ghost" color="blue" className="text-blue font-bolder" onClick={onSubmit} disabled={isLoading}>
                        Create New Chat
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
};

export default CreateRoomBtnModal;