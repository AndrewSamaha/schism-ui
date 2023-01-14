import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Stats } from '@react-three/drei';
import { Button } from '../../atoms/Button/Button';
import { LogoSVG } from '../../atoms/LogoSVG/LogoSVG';
import './header.css';
import { UserContext } from '../../../contexts/UserContext';

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
    
export const Header = ({ userState, showLogin, onLogin, onLogout, onCreateAccount }) => {
  const contextUser = useContext(UserContext);
  const { name } = contextUser;
  return (
  <header style={{position: 'sticky', marginLeft: '80px', top: '0', zIndex: '10', backgroundColor: 'white'}}>
    
    <div className="wrapper" style={{position: 'sticky'}}>
      <div>
        <LogoSVG />
        <h1>Schism</h1>
      </div>      
      <div>
        {showLogin ? (
          userState ? (
          <>
            <Stats className="statsPanel" />
            <span className="welcome">
              Welcome,  <b>{userState.name}</b>!
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
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  // onCreateAccount: PropTypes.func.isRequired,
};

Header.defaultProps = {
  showLogin: true,
  userState: null
};
