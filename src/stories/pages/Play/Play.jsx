import React, { useReducer, useContext, useEffect, useState, Suspense } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useThree } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stats } from '@react-three/drei';

// Reducers
import { UserContext, userReducer } from '../../../contexts/UserContext';
import { gameReducer } from '../../../contexts/GameContext';
import { createInitialState as createInitialEntityState, entityReducer } from '../../../reducers/entityReducer';
import { createClientGameState } from '../../../mock/gameState';

// Components
import { Header } from '../../organisms/Header/Header';
import { Debug } from '../../organisms/Debug/Debug';
import { StatusMenu } from '../../organisms/StatusMenu/StatusMenu';
import { ViewportTiles } from '../../molecules/ViewportTiles/ViewportTiles';

// Queries
import { GET_NEARBY_TILES, GET_WORLD_STATE, GET_CHUNK } from '../../../graph/queries';

// Constants 
import { ViewRotation } from '../../../constants/viewport';
import { visibilityRange } from '../../../constants/clientGame';
import { CANVAS_ZINDEX } from '../../../constants/zIndex';

//CSS
import './play.css';

// import {Tower1} from '../../atoms/Tower1/Tower1';


export const Play = ({client}) => {
  const contextUser = useContext(UserContext);
  const [userState, userDispatch] = useReducer(userReducer, contextUser);
  const [gameState, gameDispatch] = useReducer(gameReducer, createClientGameState());
  const performance = 0; //useThree((state) => state.performance);

  const [entityState, entityDispatch] = useReducer(
    entityReducer, 
    userState.viewportWorldLocation, 
    createInitialEntityState);

  const [getWorldStateQuery, worldStateQueryStatus] = useLazyQuery(GET_WORLD_STATE, {
    variables: {
      positions: [{x: 5, y: 7}],
      range: visibilityRange
    }
  }
  );
  const [queryResults, setQueryResults] = useState();
  const [getChunkQuery, getChunkQueryStatus] = useLazyQuery(GET_CHUNK, {
    onCompleted: (data) => {
      console.log('on completed', data);
    },
    onError: (e) => {
      console.log('on error',e)
    }
  });

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

      <div onKeyDown={(e) => keydown(e)} onKeyUp={(e)=>keyup(e)} tabIndex={-1} style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
        }} >
        <Debug userState={userState} gameState={gameState} performance={performance} entityReducer={{entityState, entityDispatch}} />
          <div style={{ order: '1', flexGrow: '2', maxWidth: '1000px '}}>
            <div id='gradientWrapper' style={{
              display: 'flex',
              position: 'absolute'
            }}>
              <div id='iceLeft' style={{
                position: 'relative',
                height: '700px',
                width: '50px',
                zIndex: '100',
                backgroundImage: `url(${'/assets/ui/assetPrimitives/PlayPage/GradientBorder_left.png'})`}} ></div>
              <div id='iceRight' style={{
                  position: 'relative',
                  height: '700px',
                  width: '50px',
                  zIndex: '100',
                  left: '900px',
                  backgroundImage: `url(${'/assets/ui/assetPrimitives/PlayPage/GradientBorder_right.png'})`}} ></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
              <Canvas onContextMenu={(e)=> e.preventDefault()} className="homedemo" style={{
                order: '1',
                width: '100%',
                height: '550px',
                minHeight: '550px',
                margin: '0px 0px 0px 0px',
                padding: '0px',
                backgroundColor: 'black'}}>
                  <PerspectiveCamera 
                      makeDefault 
                      fov={20}
                      position={[userState.viewportWorldLocation[0], userState.viewportWorldLocation[1], userState.viewportWorldLocation[2]]} 
                      rotation={ViewRotation}
                    ><ambientLight intensity={.5} /></PerspectiveCamera>
                    <ViewportTiles
                      gameReducer={{gameState, gameDispatch}}
                      userReducer={{userState, userDispatch}}
                      entityReducer={{entityState, entityDispatch}}
                      worldStateQuery={{getWorldStateQuery, worldStateQueryStatus}}
                      chunkQuery={{getChunkQuery, getChunkQueryStatus}}
                      client={client}
                    /> 
                {/* {!!showStats && <Stats />} */}
              </Canvas>
              
              
              
              
              <StatusMenu
                userState={userState}
                gameState={gameState}
                performance={performance}
                entityReducer={{entityState, entityDispatch}}
                style={{
                  order: '2',
                  backgroundColor: 'white'}}>
              </StatusMenu>
              
            </div>
            
          </div>
          
      </div>
    </article>
  );
};
