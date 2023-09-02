import React, { memo } from 'react'
import { Button, Icon, Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import { useCurrentRoom } from '../../context/current.room.context';

const RoomInfoButton = () => {
    const {isOpen, open , close } = useModalState();
    const description = useCurrentRoom(v => v.description);
    const name = useCurrentRoom (v => v.name);

    return (
        <>
            <Button appearance="subtle" className="px-0 font-bolder" onClick={open}>
               <Icon icon="info"/> Room Info
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>About {name}</Modal.Title>
                </Modal.Header>
                <Modal.Body><h6 className="mb-1">Description</h6><p>{description}</p></Modal.Body>
                <Modal.Footer>
                    <Button block onClick={close}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default memo(RoomInfoButton);
