import React, { useReducer, useContext, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Header } from '../../organisms/Header/Header';
import { Box } from '../../atoms/Box/Box';
import { ViewportTiles } from '../../molecules/ViewportTiles/ViewportTiles';
import { ViewRotation } from '../../../constants/viewport';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { UserContext, userReducer } from '../../../contexts/UserContext';
import { gameReducer } from '../../../contexts/GameContext';
import { createClientGameState } from '../../../mock/gameState';
import { Debug } from '../../organisms/Debug/Debug';
import { GET_NEARBY_TILES, GET_WORLD_STATE } from '../../../graph/queries';
import { visibilityRange } from '../../../constants/clientGame';

import './play.css';



export const Play = () => {
  const contextUser = useContext(UserContext);
  const [userState, userDispatch] = useReducer(userReducer, contextUser);
  const [gameState, gameDispatch] = useReducer(gameReducer, createClientGameState());
  const [getWorldStateQuery, worldStateQueryStatus] = useLazyQuery(GET_WORLD_STATE, {
    variables: {
      positions: [{x: 5, y: 7}],
      range: visibilityRange
    }
  }
  );
  const keydown = (event) => {
    const {key, repeat} = event;
    if (repeat) return;
    userDispatch({type: 'keydown', payload: key});
  };

  const keyup = (event) => {
    const {key, repeat} = event;
    if (repeat) return;
    userDispatch({type: 'keyup', payload: key});
  };
  const showStats = 0;

  useEffect(() => {
    if (!userState.name) {
      console.log('Play.jsx useEffect; no user logged in, so logging in via userDispatch');
      userDispatch({type: 'loginFromCookie'});
    } else {
      console.log('Play.jsx useEffect; a user is already logged in: ',userState.name);
    }
    gameDispatch({type: 'initMock'});
  },[]);

  useEffect(() => {
    if (!worldStateQueryStatus.data) {
      return;
    }
    //console.log('got tiles: ', worldStateQueryStatus.data.getWorldState)
    gameDispatch({type: 'receivedGameState', worldState: worldStateQueryStatus.data.getWorldState})
  }, [worldStateQueryStatus?.data]);

  return (
    <article>
      <Header
        userState={userState}
        onLogin={() => window.location = '/login'}
        onLogout={() => {
            userDispatch({type: 'logout'})
        }}
      />

      <div onKeyDown={(e) => keydown(e)} onKeyUp={(e)=>keyup(e)} tabIndex={-1} >
        <Debug userState={userState} gameState={gameState} />
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
              worldStateQuery={{getWorldStateQuery, worldStateQueryStatus}}
            />
          </perspectiveCamera>
          {showStats && <Stats />} 
        </Canvas>
      </div>
    </article>
  );
};
