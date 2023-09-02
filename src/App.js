import React, { lazy, Suspense } from 'react';
import 'rsuite/dist/styles/rsuite-default.css';
import './styles/main.scss';
import { Switch } from 'react-router';
// import Signin from './pages/Signin'; removing as lazy loading is added
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import PublicRoute from './components/PublicRoute';
import { ProfileProvider } from './components/context/profile.context';
import { ErrorBoundary } from './components/ErrorBoundary';

const Signin = lazy(() => import('./pages/Signin'));

function App() {
  return ( 
  <ErrorBoundary>
  <ProfileProvider>
  <Switch>
    <PublicRoute path="/signin">
      <Suspense fallback={<div>Loading..</div>}>
      <Signin />
      </Suspense>
    </PublicRoute>
    
    <PrivateRoute path="/">
      <Home />
    </PrivateRoute>
  </Switch>
  </ProfileProvider>
  </ErrorBoundary>
  );
}

export default App;
