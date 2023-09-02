import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Grid, Row, Col } from 'rsuite';
import { RoomsProvider } from '../../components/context/rooms.context';
import Sidebar from '../../components/Sidebar';
import { useMediaQuery } from '../../misc/custom-hooks';
import Chat from './Chat';

const Home = () => {
    const isDesktop = useMediaQuery('(min-width: 992px)');
    // when we are on home page the below hook returns true
    const { isExact } = useRouteMatch();
    const canRenderSideBar = isDesktop || isExact;
        return (
            <RoomsProvider>
            <Grid fluid className="h-100">
            <Row className="h-100">
            {canRenderSideBar && 
            <Col xs={24} md={8} className="h-100">
                <Sidebar />
            </Col>
            }
            <Switch>
                <Route exact path="/chat/:chatId"> 
                    <Col xs={24} md={16} className="h-100">
                        <Chat />
                    </Col>
                </Route>
                <Route>
                    {isDesktop && <Col xs={24} md={16} className="h-100">
                        <h6 className="text-center mt-page">Select a conversation</h6>
                    </Col> }
                </Route>
            </Switch>
            </Row>
        </Grid>   
        </RoomsProvider>         
        );
};

export default Home;