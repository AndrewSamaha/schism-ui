import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { ApolloConsumer, useLazyQuery, useQuery } from '@apollo/client';
import { useFrame, useThree } from '@react-three/fiber';
import './ViewportTiles.css';
import { ViewMoveFriction, ViewGeometry } from '../../../constants/viewport';
import { Tile } from '../../atoms/Tile/Tile';
import { getViewportTiles, calcNewViewportWorldPosition } from '../../../helpers/viewport';
import { applyFriction } from '../../../helpers/physics';
import { GET_NEARBY_TILES } from '../../../graph/queries';
import { visibilityRange } from '../../../constants/clientGame';
import { ChunkManager } from '../../molecules/ChunkManager/ChunkManager';
import { EntityManager } from '../../molecules/EntityManager/EntityManager';
import { SELECT_ENTITY } from '../../../reducers/entityReducer';

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

const LEFT_CLICK = 0;
const RIGHT_CLICK = 2;

const mouseWorldClick = (pointerData, reducers) => {
  const {point, shiftKey, altKey, button, buttons, type, ctrlKey, unprojectedPoint } = pointerData;
  console.log({type, shiftKey, altKey, button, buttons, ctrlKey});
  console.log('projected point', point)
  //console.log('unprojected point', unprojectedPoint);
  console.log(pointerData)
  if (button === LEFT_CLICK) {
    console.log('left click!')
    const { entityState, entityDispatch } = reducers.entityReducer;
    if (entityState?.selectedUnits.length > 0) {
      entityDispatch({
        type: SELECT_ENTITY,
        payload: []
      });
    }
    
    return;
  }
  if (button === RIGHT_CLICK) {
    console.log('right click!')
    const { entityState, entityDispatch } = reducers.entityReducer;
    if (entityState?.selectedUnits.length > 0) {
      entityState.selectedUnits.forEach((entity) => {
        const unitsPerMS = .001;
        const end = [...point];
        const vector = [end[0] - point[0], end[1] - point[1], end[2] - point[2]];
        const dist = Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2]);
        entity.lastTic = Date.now();
        entity.tic = (me, delta) => {
          
          me.position = [
            me.position + unitsPerMS * delta
          ]
        }
      });
    }
    return;
  }
  
  // var vec = new THREE.Vector3(); // create once and reuse
  // var pos = new THREE.Vector3(); // create once and reuse

  // vec.set(
  //     ( event.clientX / window.innerWidth ) * 2 - 1,
  //     - ( event.clientY / window.innerHeight ) * 2 + 1,
  //     0.5 );

  // vec.unproject( camera );

  // vec.sub( camera.position ).normalize();

  // var distance = - camera.position.z / vec.z;

  // pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
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

  useFrame((state, delta) => {
      const { userInput } = userState;

      if (Object.entries(userInput).length > 0) {
        const push = [0,0];
        const pushSpeed = 2;
        if ('a' in userInput) push[0] += pushSpeed;
        if ('w' in userInput) push[1] -= pushSpeed;
        if ('s' in userInput) push[1] += pushSpeed;
        if ('d' in userInput) push[0] -= pushSpeed;  

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
  <group onPointerDown={(event) => {
    mouseWorldClick(event, {
      gameReducer, userReducer, entityReducer,
    });
  }}>
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
