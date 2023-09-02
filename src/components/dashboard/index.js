import React from 'react';
import { Drawer, Button, Divider, Alert } from 'rsuite';
import { database } from '../../misc/firebaseconfig';
import { getUserUpdates } from '../../misc/helpers';
import { useProfile } from '../context/profile.context';
import EditableInput from '../EditableInput';
import AvatarUpBtn from './AvatarUpBtn';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({ onSignOut }) => {
    const { profile } = useProfile();
    const onSave = async newData => {
        // const userNickName = database.ref(`profiles/${profile.uid}`).child('name');
        try { 
           const updates = await getUserUpdates(profile.uid,'name', newData, database);
            await database.ref().update(updates);

            Alert.success('Nickname has been updated', 4000);
          } catch (err) {
            Alert.error(err.message, 4000);
          }
    
    };
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Profile</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h4>Hello, {profile.name} !!</h4>
        <ProviderBlock />
        <Divider />
        <EditableInput
        name="nickname"
          initialValue={profile.name}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
        />
        <AvatarUpBtn />
      </Drawer.Body>

      <Drawer.Footer>
        <Button block className="text-red font-bolder" onClick={onSignOut}>
          Sign Out
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;