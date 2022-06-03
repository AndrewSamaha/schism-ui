import React, { useReducer, useContext, useEffect } from 'react';
import { Header } from '../../organisms/Header/Header';
import { Box } from '../../atoms/Box/Box';
import { ViewportTiles } from '../../molecules/ViewportTiles/ViewportTiles';
import { ViewRotation } from '../../../constants/viewport';
import { Canvas } from '@react-three/fiber';
import { UserContext, userReducer } from '../../../contexts/UserContext';
import { gameReducer } from '../../../contexts/GameContext';
import { createClientGameState } from '../../../mock/gameState';
import './play.css';



export const Play = () => {
  const contextUser = useContext(UserContext);
  const [userState, userDispatch] = useReducer(userReducer, contextUser);
  const [gameState, gameDispatch] = useReducer(gameReducer, createClientGameState());
  
  const keydown = (key) => userDispatch({type: 'keydown', payload: key});
  const keyup = (key) => userDispatch({type: 'keyup', payload: key});
  
  useEffect(() => {
    if (!userState.name) {
      console.log('Play.jsx useEffect; no user logged in, so logging in via userDispatch');
      userDispatch({type: 'loginFromCookie'});
    } else {
      console.log('Play.jsx useEffect; a user is already logged in: ',userState.name);
    }
    gameDispatch({type: 'initMock'});
  },[]);

  return (
    <article>
      <Header
        userState={userState}
        onLogin={() => window.location = '/login'}
        onLogout={() => {
            userDispatch({type: 'logout'})
        }}
      />

      <div onKeyDown={(e) => keydown(e.key)} onKeyUp={(e)=>keyup(e.key)} tabIndex={-1} >
        <div style={{ 
          zIndex: '100',
          position: 'absolute',
          left: '10px', 
          top: '75px', 
          width: '200px', 
          backgroundColor: 'rgba(230, 230, 230, 0.5)'}}>
          {userState.viewportWorldLocation[0].toFixed(2)}, {userState.viewportWorldLocation[1].toFixed(2)}, {userState.viewportWorldLocation[2].toFixed(2)}
        </div>
        <Canvas className="homedemo" style={{width: '100%', height: '100%', minHeight: '700px' ,zIndex: '1', backgroundColor: 'black'}}>
          <perspectiveCamera 
            makeDefault 
            position={[userState.viewportWorldLocation[0], userState.viewportWorldLocation[1], userState.viewportWorldLocation[2]]} 
            rotation={ViewRotation}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-2, 0, 0]} />
            <Box position={[2, 0, 0]} />
            <ViewportTiles
              gameReducer={{gameState, gameDispatch}}
              userReducer={{userState, userDispatch}}
            />
          </perspectiveCamera>
        </Canvas>
      </div>
    </article>
  );
};
