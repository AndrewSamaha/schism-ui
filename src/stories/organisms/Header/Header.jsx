import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../atoms/Button/Button';
import { LogoSVG } from '../../atoms/LogoSVG/LogoSVG';
import './header.css';
import UserContext from '../../../contexts/UserContext';

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
    
export const Header = ({ showLogin, user, onLogin, onLogout, onCreateAccount }) => {
  const contextUser = useContext(UserContext);
  const { name } = contextUser;
  console.log({name});
  return (
  <header>
    <div className="wrapper">
      <div>
        <LogoSVG />
        <h1>Schism</h1>
      </div>
      <div>
        {showLogin ? (
          name ? (
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
)};

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
