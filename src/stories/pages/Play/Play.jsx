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
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        flexDirection: 'row' //row-reverse
        // justifyContent: 'flex-end'
        }} >
        <Debug userState={userState} gameState={gameState} performance={performance} entityReducer={{entityState, entityDispatch}} />

        <Canvas onContextMenu={(e)=> e.preventDefault()} className="homedemo" style={{
          // maxWidth: '100%', 
          width: 'calc(100% - 300px)',
          height: '100%',
          minHeight: '700px',
          margin: '0px',
          padding: '0px',
          
          zIndex: `${CANVAS_ZINDEX}`,
          backgroundColor: 'black'}}>
            {/* <Suspense  fallback={null}> */}
            <PerspectiveCamera 
                makeDefault 
                fov={30}
                position={[userState.viewportWorldLocation[0], userState.viewportWorldLocation[1], userState.viewportWorldLocation[2]]} 
                //position={[10, 10, -20]} 
                //rotation={ViewRotation}
                rotation={[.90,0,0]}
              >
                <ambientLight intensity={.5} />
                {/* <pointLight position={[10, 10, 10]} intensity={.5} /> */}
                {/* <pointLight 
                  position={[-userState.viewportWorldLocation[0],
                             -userState.viewportWorldLocation[1],
                             -userState.viewportWorldLocation[2]+55]}
                  intensity={1} /> */}
              </PerspectiveCamera>
              <ViewportTiles
                gameReducer={{gameState, gameDispatch}}
                userReducer={{userState, userDispatch}}
                entityReducer={{entityState, entityDispatch}}
                worldStateQuery={{getWorldStateQuery, worldStateQueryStatus}}
                chunkQuery={{getChunkQuery, getChunkQueryStatus}}
                client={client}
              /> 
              
            {/* </Suspense> */}
          {showStats && <Stats />} 
        </Canvas>
        <StatusMenu
          userState={userState}
          gameState={gameState}
          performance={performance}
          entityReducer={{entityState, entityDispatch}}
          style={{
            // flexBasis: '250px',
            // minWidth: '250px !important',
            // maxWidth: '250px !important',
            // width: '250px',
            // flexGrow: '.25',
            // flexShrink: '.25',
            height: '100%',
            minHeight: '700px',
            margin: '0px',
            padding: '0px',
            backgroundColor: 'white'}}>

        </StatusMenu>
      </div>
    </article>
  );
};
