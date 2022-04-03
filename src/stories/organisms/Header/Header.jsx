import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '../../atoms/Button/Button';
import { LogoSVG } from '../../atoms/LogoSVG/LogoSVG';
import './header.css';

export const Header = ({ showLogin, user, onLogin, onLogout, onCreateAccount }) => (
  <header>
    <div className="wrapper">
      <div>
        <LogoSVG />
        <h1>Schism</h1>
      </div>
      <div>
        {showLogin ? (
          user ? (
          <>
            <span className="welcome">
              Welcome, <b>{user.name}</b>!
            </span>
            <Button size="small" onClick={onLogout} label="Log out" />
          </>
        ) : (
          <>
            <Button size="small" onClick={onLogin} label="Log in" />
            <Button primary size="small" onClick={onCreateAccount} label="Sign up" />
          </>
        )) : (<></>)
      }
      </div>
    </div>
  </header>
);

Header.propTypes = {
  showLogin: PropTypes.bool,
  user: PropTypes.shape({}),
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onCreateAccount: PropTypes.func.isRequired,
};

Header.defaultProps = {
  showLogin: true,
  user: null
};
