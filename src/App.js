import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Auth from './pages/Auth';
import Contacts from './pages/Contacts';
import AddEditContact from './pages/AddEditContact';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AuthContext from './store/auth-context';

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <React.Fragment>
      <Header />
      <main>
        <div className="container">
          <Switch>
            {!authCtx.user && (
              <Route exact path="/">
                <Auth />
              </Route>
            )}
            {authCtx.user && (
              <Route exact path="/">
                <Redirect to="/contacts" />
              </Route>
            )}
            <ProtectedRoute path="/contacts" component={Contacts} />
            <ProtectedRoute path="/addContact" component={AddEditContact} yoyo="addddddddd"/>
            <ProtectedRoute path="/editContact/:contactId" component={AddEditContact} yoyo="eddiiiittt"/>
            <Route path='*'><NotFound /></Route>
          </Switch>
        </div>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default App;
