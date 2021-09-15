import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { post } from "../helpers/api_helper";
import { LOGOUT, LOGOUT_ALL } from "../helpers/url_helper";

let logoutTimer;

const AuthContext = React.createContext({
  user: '',
  onLogout: () => {},
  onLogin: (token) => {}
});

const calculateRemainingTime = (token) => {
  if (!token)
    return;
  const decodedToken = jwt_decode(token);
  const expirationTime = decodedToken.exp * 1000;
  const currentTime = new Date().getTime();
  const remainingDuration = expirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('accessToken');
  if (!storedToken){
    return false;
  }
  const remainingTime = calculateRemainingTime(storedToken);
  if (remainingTime <= 3600) {
    localStorage.removeItem('accessToken');
    return null;
  }
  const decodedToken = jwt_decode(storedToken);
  return {
    email: decodedToken.email,
    duration: remainingTime
  };
}

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let email = ''
  if (tokenData) {
    email = tokenData.email
  }

  const history = useHistory();
  const [user, setUser] = useState(email);

  const logoutHandler = (logoutall) => {
    let url = LOGOUT
    if (logoutall)
      url = LOGOUT_ALL;
    post(url).finally(() => {
      localStorage.removeItem('accessToken');
      setUser('');
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      history.replace('/');
    })
  }

  const loginHandler = (token) => {
    if (!token) {
      return
    }
    localStorage.setItem('accessToken', token);
    const decodedToken = jwt_decode(token);
    setUser(decodedToken.email);
    const remainingTime = calculateRemainingTime(token);
    logoutTimer = setTimeout(logoutHandler, remainingTime)
    history.replace('/contacts');
  }

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration)
    }
  }, [tokenData])

  const contextValue = {
    user: user,
    onLogout: logoutHandler,
    onLogin: loginHandler
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext;