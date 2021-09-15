import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../store/auth-context';

export const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
  const authCtx = useContext(AuthContext);
  return (
    <Route
      {...restOfProps}
      render={(props) => 
        authCtx.user ? <Component {...props} /> : <Redirect to="/" />
      }
     />
  );
}

export default ProtectedRoute;