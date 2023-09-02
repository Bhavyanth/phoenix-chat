import React from 'react'
import { useParams } from 'react-router';
import { Button, Icon, IconButton, Modal } from 'rsuite'
import { useModalState } from '../../../misc/custom-hooks';
import { auth, database } from '../../../misc/firebaseconfig';
import { useCurrentRoom } from '../../context/current.room.context'

const AskFcmBtn = () => {
    const {chatId} = useParams();
    const isReceivingFcm = useCurrentRoom((v) => v.isReceivingFcm);
    const { isOpen,close,open } = useModalState();

    const onCancel = () => {
        database.ref(`/rooms/${chatId}/fcmUsers`).child(auth.currentUser.uid).remove();
    }

    const onAccept = () => {
        database.ref(`/rooms/${chatId}/fcmUsers`).child(auth.currentUser.uid).set(true);
    }

    return (
        <>
            <IconButton icon={<Icon icon="podcast" />}color="cyan" size="sm" circle onClick={open} appearance={isReceivingFcm ? 'default' : 'ghost'}/>
            <Modal show={isOpen} onHide={close} size="xs" backdrop="static">
            <Modal.Header>
            <Modal.Title>Notifications Permission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isReceivingFcm ? (<div className="text-center">
                    <Icon className="text-green mb-3" icon="check-circle" size="4x" />
                    <h6>You're subscribed to broadcast messages</h6>
                </div>): (<div className="text-center">
                    <Icon className="text-blue mb-3" icon="question-circle" size="4x" />
                    <h6>Do you want to receive notifications from this group?</h6>
                    </div>
                )}
                <p className="mt-2">Permission: {Notification.permission === 'granted' ? ( <span className="text-green">Granted</span> ) : ( <span className="text-red">Denied</span> 
                )}
                </p>
            </Modal.Body>
            <Modal.Footer>
            {isReceivingFcm ? <Button color="red" onClick={onCancel}>Disallow notifications</Button> : <Button color="green" onClick={onAccept}>Yes</Button>}
                <Button onClick={close}>Close</Button>
            </Modal.Footer>
            </Modal>

        </>

    );
}

export default AskFcmBtn;
