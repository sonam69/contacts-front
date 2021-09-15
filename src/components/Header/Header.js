import React, { useContext, useEffect, useState } from "react";
import { useLocation, Link, NavLink } from "react-router-dom";

import './Header.css';
import AuthContext from '../../store/auth-context';

const Header = (props) => {
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const [showNav, setShowNav] = useState();

  useEffect(() => {
    if (showNav)
      document.body.classList.add('isNavOpen');
    else
      document.body.classList.remove('isNavOpen');
  }, [showNav]);

  useEffect(() => {
    setShowNav(false);
  }, [location])

  return (
    <React.Fragment>
      <div className="overlay" onClick={() => {setShowNav(false)}}></div>
      <header>
        <div className="container">
          <Link className="logo" to="/"></Link>
          {authCtx.user && (
            <ul>
                <li><NavLink activeClassName='active' exact={true} to="/contacts">Contacts</NavLink></li>
                <li><NavLink activeClassName='active' exact={true} to="/addContact">Add Contact</NavLink></li>
                <button className="logout" onClick={() => {authCtx.onLogout()}}></button>
            </ul>
          )}
          {authCtx.user && (
            <button className="burger" onClick={() => {showNav ? setShowNav(false) : setShowNav(true)}}>
              <div></div>
              <div></div>
              <div></div>
            </button>
          )}
        </div>
      </header>
      {authCtx.user && (
        <nav>
          <ul>
            <li><NavLink activeClassName='active' exact={true} to="/contacts">Contacts</NavLink></li>
            <li><NavLink activeClassName='active' exact={true} to="/addContact">Add Contact</NavLink></li>
          </ul>
          <button className="logout" onClick={() => {authCtx.onLogout()}}></button>
        </nav>
      )}
    </React.Fragment>
  );
};

export default Header;
