import React, { memo } from 'react'
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { useMediaQuery } from '../../../misc/custom-hooks';
import { useCurrentRoom } from '../../context/current.room.context';
import AskFcmBtn from './AskFcmBtn';
import EditRoomBtnDrawer from './EditRoomBtnDrawer';
import RoomInfoButton from './RoomInfoButton';
import SendFcmBtn from './SendFcmBtn';

const Top = () => {
    const name = useCurrentRoom(v => v.name);
    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const isMobile = useMediaQuery('(max-width:992px)');
    return (
        <div>

         <div className="d-flex justify-content-between align-items-center">
            <h4 className="text-disappear d-flex align-items-center">
            <Icon componentClass={Link} to="/" icon="arrow-circle-left" size="2x" className={isMobile ? 'd-inline-block p-0 mr-2 text-blue link-unstyled' : 'd-none'}/> 
                <span className="text-disappear">{name}</span></h4>

            <ButtonToolbar className="ws-nowrap">
                <AskFcmBtn />
                {isAdmin &&  <EditRoomBtnDrawer /> }    
            </ButtonToolbar>
         </div>
         <div className="d-flex justify-content-between align-items-center">
            {isAdmin && <SendFcmBtn /> }
            <RoomInfoButton />
         </div>
        </div>
    )
}
// memorizes, reducing the update tree
export default memo(Top);