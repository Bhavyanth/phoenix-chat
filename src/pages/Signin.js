import React from 'react';
import firebase from 'firebase/app';
import { Container, Grid, Panel, Row, Col, Button, Icon, Alert } from 'rsuite';
import { auth,database } from '../misc/firebaseconfig';

const Signin = () => {
        const signIn = async (provider) =>{
                try {
                        const {additionalUserInfo, user} = await auth.signInWithPopup(provider);
                        if(additionalUserInfo.isNewUser){
                             await   database.ref(`/profiles/${user.uid}`).set({
                                        name: user.displayName,
                                        createdAt: firebase.database.ServerValue.TIMESTAMP,
                                });
                        }

                        Alert.success('Logged in',2000);
                } catch (error) {
                      Alert.error(error.message,2000); 
                }
              
        };
        const onFB = () =>{
                signIn(new firebase.auth.FacebookAuthProvider());
        };
        const onGoogle = () =>{
                signIn(new firebase.auth.GoogleAuthProvider());
        };    
        
        return <Container style={{ 
                backgroundImage: `url("https://phoenixaerodrone.files.wordpress.com/2021/05/6819-1-e1619895851964.jpg")` 
              }}>
        <Grid className="mt-signin">
        <Row>
        <Col xs={12} md={8} mdOffset={14}>
        {/* <Col xs={24} md={12} mdOffset={6}> */}
        <Panel>
        {/* <div className="text-center">
        <h3 className="text-blue-50">Phoenix Chat</h3>
        <p className="font-bolder"> Let's connect together</p>
        </div> */}
        {/* mt for margin top */}
        <div className="mt-1">
        <Button block appearance="ghost" color="blue" className="text-blue font-bolder" 
        onClick={onFB}>
        <Icon icon="facebook" />   Continue with Facebook
        </Button>
        <Button block appearance="ghost" color="green" className="text-green font-bolder" 
        onClick={onGoogle}>
        <Icon icon="google" />   Continue with Google
        </Button> 
        </div>
        </Panel>
        </Col>
        </Row>
        </Grid>
        </Container>;
    
};

export default Signin;