import React, { useRef, useState, useReducer } from 'react';
import { useNavigate, withRouter } from 'react-router-dom';
import { Header } from '../../organisms/Header/Header';
import { Box } from '../../atoms/Box/Box';
import { Tile } from '../../atoms/Tile/Tile';
import { Canvas, useFrame } from '@react-three/fiber';
import { UserContext, userReducer, initialState } from '../../../contexts/UserContext';
import './play.css';

export const Play = () => {
  const [user, setUser] = React.useState();
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <article>
      <Header
        user={user}
        onLogin={() => window.location = '/login'} // navigate('/login')} // setUser({ name: 'Jane Doe' })}
        onLogout={() => {
            dispatch({type: 'logout'})
        }}
        onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />
      <Canvas className="homedemo" style={{width: '100%', height: '100%', minHeight: '700px' ,zIndex: '1', backgroundColor: 'black'}}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-2, 0, 0]} />
        <Box position={[2, 0, 0]} />
        <Tile position={[0, 0, 0]} />
      </Canvas>
    </article>
  );
};
