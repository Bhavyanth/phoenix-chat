import React, { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import { functions } from '../../../misc/firebaseconfig';

const { StringType } = Schema.Types;

const model = Schema.Model({
    title: StringType().isRequired('Title is required'),
    message: StringType().isRequired('Message body is required'),
});

const INIT_FORM = {
    title: '',
    message: '',
}

const SendFcmBtn = () => {
    const {chatId} = useParams();
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
        try {
            const sendFcm = functions.httpsCallable('sendFcm');
            await sendFcm({chatId, ...formValue});
            setIsLoading(false);
            setFormValue(INIT_FORM);
            close();
            Alert.info('Notification sent', 2000);
        } catch (err) {
            setIsLoading(false);
            Alert.error(err.message, 2000);
        }
    };
        return (
            <>
                <Button appearance="primary" size="xs" onClick={open}>
                    <Icon icon="podcast"/> Broadcast message
                </Button>
                <Modal show={isOpen} onHide={close}>
                    <Modal.Header><Modal.Title>Send notifications</Modal.Title></Modal.Header>
                    <Modal.Body>
                    <Form fluid onChange={onFormChange} formValue={formValue} model={model} ref={formRef}>
                        <FormGroup>
                            <ControlLabel>Title</ControlLabel>
                            <FormControl name="title" placeholder="Enter message title.." />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Message</ControlLabel>
                            <FormControl componentClass="textarea" rows={5} name="message" placeholder="Enter notification message.." />
                        </FormGroup>
                    </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button block appearance="primary" onClick={onSubmit} disabled={isLoading}>
                        Publish message
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
};

export default SendFcmBtn;