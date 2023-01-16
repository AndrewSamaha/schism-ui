import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ApolloConsumer, useLazyQuery, useQuery } from '@apollo/client';
import { useFrame, useThree } from '@react-three/fiber';
import get from 'lodash/get';

// Local Imports
import './ViewportTiles.css';
import { ViewMoveFriction, ViewGeometry } from '../../../constants/viewport';
import { Tile } from '../../atoms/Tile/Tile';
import { getViewportTiles, calcNewViewportWorldPosition } from '../../../helpers/viewport';
import { applyFriction } from '../../../helpers/physics';
import { GET_NEARBY_TILES } from '../../../graph/queries';
import { visibilityRange } from '../../../constants/clientGame';
import { ChunkManager } from '../../molecules/ChunkManager/ChunkManager';

// Entities
import { EntityManager } from '../../molecules/EntityManager/EntityManager';
import { SELECT_ENTITY } from '../../../reducers/entityReducer';

// Queries
import { GET_ENTITIES_I_CAN_SEE } from '../../../graph/entities';
import { RECEIVED_VISIBLE_ENTITIES } from '../../../reducers/entityReducer';

// Constants
import { RIGHT_CLICK, LEFT_CLICK } from '../../../constants/inputEvents';
import { INPUT_EVENT, POINTER_MOVE, POINTER_OUT } from '../../../reducers/entityReducer';
import { VIEWPORT_TILES } from '../../../constants/inputSources';
import { INTERVAL_GET_ENTITIES_I_CAN_SEE } from '../../../constants/queryIntervals';

const physicsTic = (delta, state) => {
  const { viewportVelocity, userInput } = state;
  if (!viewportVelocity) return state;
  if (!viewportVelocity[0] && !viewportVelocity[1] && !viewportVelocity[2]) return state;
  
  state.viewportVelocity[0] = applyFriction(state.viewportVelocity[0], ViewMoveFriction);
  state.viewportVelocity[1] = applyFriction(state.viewportVelocity[1], ViewMoveFriction);

  state.viewportWorldLocation = calcNewViewportWorldPosition(
    state.viewportWorldLocation,
    state.viewportVelocity,
    delta
  );

  return state;
}

const physicsTicRef = (delta, userInput, current) => {
  const { position: currentPosition, velocity: currentVelocity } = current;
  
  if (!currentVelocity) return { velocity: currentVelocity, position: currentPosition }
  if (!currentVelocity[0] && !currentVelocity[1] && !currentVelocity[2]) return { velocity: currentVelocity, position: currentPosition }

  return { 
    velocity: [ applyFriction(currentVelocity[0], ViewMoveFriction), applyFriction(currentVelocity[1], ViewMoveFriction) ],
    position: calcNewViewportWorldPosition( currentPosition, currentVelocity, delta )
  };
}

const mouseWorldClick = (pointerData, reducers) => {
  const { point, shiftKey, altKey, button, buttons, type, ctrlKey, unprojectedPoint } = pointerData;
  const { userState, userDispatch } = reducers.userReducer;
  const { entityState, entityDispatch } = reducers.entityReducer;
  const { viewportWorldLocation: vWL } = userState;
  entityDispatch({
    type: INPUT_EVENT,
    pointerData,
    inputSource: VIEWPORT_TILES,
    worldLocation: new THREE.Vector3(point.x, point.y, 0),
    time: Date.now()
  });
}

export const ViewportTiles = ({client, gameReducer, userReducer, entityReducer, worldStateQuery, chunkQuery}) => {
  //tilesQuery={{getNearbyTilesQuery, nearbyTilesStatus}}
  const {getChunkQuery, getChunkQueryStatus} = chunkQuery;
  const [viewportTiles, setViewportTiles] = useState(null);
  const [tileStatus, setTileStatus] = useState(null);
  const viewportRef = useRef();

  const { gameState, gameDispatch } = gameReducer;
  const { userState, userDispatch } = userReducer;
  const { entityState, entityDispatch } = entityReducer;
  const {viewportWorldLocation} = userState;
  const { tiles } = gameState;
  const {getWorldStateQuery, worldStateQueryStatus} = worldStateQuery;
  
  const UpperLeft = {
    x: -1 * (userState.viewportWorldLocation[0] + ViewGeometry[0]/2),
    y: -1 * (userState.viewportWorldLocation[1] - ViewGeometry[1]/2)
  };
  const LowerRight = {
    x: -1 * (userState.viewportWorldLocation[0] - ViewGeometry[0]/2),
    y: -1 * (userState.viewportWorldLocation[1] + ViewGeometry[1]/2)
  };

  const {loading, error, data, startPolling, stopPolling} = useQuery(
    GET_ENTITIES_I_CAN_SEE, 
    {
      pollInterval: INTERVAL_GET_ENTITIES_I_CAN_SEE,
      onCompleted: data => entityDispatch({ 
        type: RECEIVED_VISIBLE_ENTITIES,
        payload: data,
        userState
      }),
      onError: (e, r) => {
        console.log('on error',JSON.stringify(e))
        // console.log(e.graphQLErrors[0].extensions.code)
        const errorCode = get(e, 'graphQLErrors[0].extensions.code', 'noErrorFound')
        console.log('errorCode: ', errorCode)
        if (errorCode === 'UNAUTHENTICATED') {
          console.log('user is unauthenticated. Logging out.')
          userDispatch({type: 'logout'});
        }
        
      },
      client,
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true
    }
  ); 


  useFrame((state, delta) => {
      const { userInput } = userState;

      if (Object.entries(userInput).length > 0) {
        const push = [0,0];
        const pushSpeed = 2;
        if ('a' in userInput) push[0] -= pushSpeed;
        if ('w' in userInput) push[1] += pushSpeed;
        if ('s' in userInput) push[1] -= pushSpeed;
        if ('d' in userInput) push[0] += pushSpeed;  

        // userState.viewportVelocity[0] += push[0];
        // userState.viewportVelocity[1] += push[1];
        // if (viewportRef.current == null) viewportRef.current = {};
        // if (viewportRef.current?.velocity == null) {
        //   viewportRef.current.velocity = [0,0,0];
        //   viewportRef.current.position = [0,0,0];
        // }
        // viewportRef.current.velocity[0] += push[0];
        // viewportRef.current.velocity[1] += push[1];

        // const { velocity, position } = physicsTicRef(delta, userInput, viewportRef.current);
        // viewportRef.current.velocity = velocity;
        // viewportRef.current.position = position;
        // console.log({velocity, position})
      } else {
        // console.log('useFrame no keys pressed')
      }

      (()=> {
        const { viewportVelocity } = userState;
        if (!viewportVelocity) return state;
        if (!viewportVelocity[0] && !viewportVelocity[1] && !viewportVelocity[2]) return state;
        userDispatch({type: 'PHYSICS_TIC', payload: {}})  
      })();
      
      if (worldStateQueryStatus.loading && tileStatus === 'requested') {
        //console.log('loading')
        setTileStatus('loading')
      } else if (tileStatus === 'loading' && worldStateQueryStatus.error) {
        //console.log('error',worldStateQueryStatus.error);
        setTileStatus('error')
      } else if (worldStateQueryStatus.data) {
        const USE_WORLDSTATE_QUERY = 0;
        if (USE_WORLDSTATE_QUERY) getWorldStateQuery({
          variables: {
            positions: [{
              x: Math.floor(userState.viewportWorldLocation[0])*-1,
              y: Math.floor(userState.viewportWorldLocation[1])*-1
            }],
            range: visibilityRange
          }
        });
        setTileStatus('requested')
      }
  });

  return (
  <group 
    onPointerDown={(event) => { mouseWorldClick(event, {gameReducer, userReducer, entityReducer })}}
    onPointerMove={(pointerData) => { entityDispatch({type: POINTER_MOVE, payload: {pointerData, userState}})}}
    onPointerOut={() => entityDispatch({type: POINTER_OUT })}
    >
    <EntityManager 
        gameReducer={{gameState, gameDispatch}}
        userReducer={{userState, userDispatch}}
        entityReducer={{entityState, entityDispatch}}
        worldStateQuery={{getWorldStateQuery, worldStateQueryStatus}}
        chunkQuery={{getChunkQuery, getChunkQueryStatus}}
        client={client}
    />
    <ChunkManager
              gameReducer={{gameState, gameDispatch}}
              userReducer={{userState, userDispatch}}
              entityReducer={{entityState, entityDispatch}}
              worldStateQuery={{getWorldStateQuery, worldStateQueryStatus}}
              chunkQuery={{getChunkQuery, getChunkQueryStatus}}
              client={client}
              >
              
    </ChunkManager>
  </group>
  );
}

ViewportTiles.propTypes = { };

ViewportTiles.defaultProps = { };
