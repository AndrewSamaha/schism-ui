import React, { useRef, useState, useReducer, useContext } from 'react';
import { useNavigate, withRouter } from 'react-router-dom';
import { Header } from '../../organisms/Header/Header';
import { Box } from '../../atoms/Box/Box';
import { Tile } from '../../atoms/Tile/Tile';
import { ViewportTiles } from '../../molecules/ViewportTiles/ViewportTiles';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { UserContext, userReducer, initialState } from '../../../contexts/UserContext';
import { GameContext, gameReducer } from '../../../contexts/GameContext';
import { createClientGameState } from '../../../mock/gameState';
import './play.css';


export const Play = () => {
  console.log('play.render');
  const contextUser = useContext(UserContext);
  const { name } = contextUser;
  const [userState, userDispatch] = useReducer(userReducer, contextUser);
  const [gameState, gameDispatch] = useReducer(gameReducer, createClientGameState());
  
  // gameDispatch({
  //   type: 'initMock'
  // });
  console.log({gameState});
  console.log({playUserstate: userState});
  return (
    <article>
      <Header
        user={userState.name}
        onLogin={() => window.location = '/login'} // navigate('/login')} // setUser({ name: 'Jane Doe' })}
        onLogout={() => {
            userDispatch({type: 'logout'})
        }}
        // onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />
      <Canvas className="homedemo" style={{width: '100%', height: '100%', minHeight: '700px' ,zIndex: '1', backgroundColor: 'black'}}>
        <perspectiveCamera makeDefault position={[0, 0, 0]} rotation={[-Math.PI*.35, 0, 0]}>
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
    </article>
  );
};
