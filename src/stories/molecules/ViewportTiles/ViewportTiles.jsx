import React, { useState, useEffect } from 'react';
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

const physicsTic = (delta, state) => {
  if (!state.viewportVelocity) return state;
  
  state.viewportVelocity[0] = applyFriction(state.viewportVelocity[0], ViewMoveFriction);
  state.viewportVelocity[1] = applyFriction(state.viewportVelocity[1], ViewMoveFriction);

  state.viewportWorldLocation = calcNewViewportWorldPosition(
    state.viewportWorldLocation,
    state.viewportVelocity,
    delta
  );

  return {
    ...state
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
    worldLocation: new THREE.Vector3(point.x - vWL[0], point.y - vWL[1], 0),
    time: Date.now()
  });
}

export const ViewportTiles = ({client, gameReducer, userReducer, entityReducer, worldStateQuery, chunkQuery}) => {
  //tilesQuery={{getNearbyTilesQuery, nearbyTilesStatus}}
  const {getChunkQuery, getChunkQueryStatus} = chunkQuery;
  const [viewportTiles, setViewportTiles] = useState(null);
  const [tileStatus, setTileStatus] = useState(null);
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
      pollInterval: 10_000,
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

  // useEffect(() => {
  //   console.log('getEntitiesICanSee useEffect', data)
  //   startPolling(250);
  // }, [data])
  // useEffect(() => {
  //   console.log('starting polling for get_entities query')
  //   startPolling(200);
  // },[])
  useFrame((state, delta) => {
      const { userInput } = userState;

      if (Object.entries(userInput).length > 0) {
        const push = [0,0];
        const pushSpeed = 2;
        if ('a' in userInput) push[0] -= pushSpeed;
        if ('w' in userInput) push[1] += pushSpeed;
        if ('s' in userInput) push[1] -= pushSpeed;
        if ('d' in userInput) push[0] += pushSpeed;  

        userState.viewportVelocity[0] += push[0];
        userState.viewportVelocity[1] += push[1];
      }

      userDispatch({type: 'PHYSICS_TIC', payload: physicsTic(delta, userState)})
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
