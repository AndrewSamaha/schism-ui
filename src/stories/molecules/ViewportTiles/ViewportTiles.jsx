import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { ApolloConsumer, useLazyQuery, useQuery } from '@apollo/client';
import { useFrame, useThree } from '@react-three/fiber';

// Local Imports
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

// the first action generator
const straightLineMoveGenerator = ({entity, finalDestination}) => {
  return (ref, delta) => {
    const length = entity.speed * delta;
    const { current } = ref;
    const { angle, dist } = getAngleDist(current.position, finalDestination);  
    if (dist < length) {
      const new3DPosition = new THREE.Vector3(finalDestination.x, finalDestination.y, finalDestination.z); 
      current.position.set(new3DPosition.x, new3DPosition.y, new3DPosition.z);
      entity.tic = null;
      return;
    }
    const step = new THREE.Vector2(length, 0);
    step.rotateAround({x: 0, y: 0}, angle);
    const step3D = new THREE.Vector3(step.x, step.y, 0);
    current.position.add(step3D);
  }
}

const getAngleDist = (start, end) => {
  let start2D;
  if (Array.isArray(start)) {
    start2D = new THREE.Vector2(start[0], start[1])
  } else {
    start2D = new THREE.Vector2(start.x, start.y);
  }
  const end2D = new THREE.Vector2(end.x, end.y);
  const vector = end2D.sub(start2D);
  const angle = vector.angle();
  const dist = vector.length();
  return { angle, dist };
};

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
  if (button === LEFT_CLICK) {
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
    const { entityState, entityDispatch } = reducers.entityReducer;
    if (entityState?.selectedUnits.length > 0) {
      const { userState, userDispatch } = reducers.userReducer;
      const { viewportWorldLocation: vWL } = userState;
      entityState.selectedUnits.forEach((entity) => {
        const finalDestination = new THREE.Vector3(point.x - vWL[0], point.y - vWL[1], 0);
        entity.tic = straightLineMoveGenerator({ entity, finalDestination });
      });
    }
    return;
  }
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
