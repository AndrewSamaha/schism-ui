import React, { useState, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useFrame } from '@react-three/fiber';
import './ViewportTiles.css';
import { ViewMoveFriction } from '../../../constants/viewport';
import { Tile } from '../../atoms/Tile/Tile';
import { getViewportTiles, calcNewViewportWorldPosition } from '../../../helpers/viewport';
import { applyFriction } from '../../../helpers/physics';
import { GET_NEARBY_TILES } from '../../../graph/queries';
import { visibilityRange } from '../../../constants/clientGame';

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

export const ViewportTiles = ({gameReducer, userReducer, worldStateQuery}) => {
  //tilesQuery={{getNearbyTilesQuery, nearbyTilesStatus}}
  const [viewportTiles, setViewportTiles] = useState(null);
  const [tileStatus, setTileStatus] = useState(null);
  const { gameState, gameDispatch } = gameReducer;
  const { userState, userDispatch } = userReducer;
  const {viewportWorldLocation} = userState;
  const { tiles } = gameState;
  const {getWorldStateQuery, worldStateQueryStatus} = worldStateQuery;
  
  // const getNearbyTiles = () => {};
  // const nearbyTiles = () => {};
  
  useEffect(() => {
    const newViewportTiles = getViewportTiles({ viewportWorldLocation, tiles });
    setViewportTiles(newViewportTiles);
    getWorldStateQuery({
      variables: {
        positions: [{
          x: Math.floor(userState.viewportWorldLocation[0])*-1,
          y: Math.floor(userState.viewportWorldLocation[1])*-1
        }],
        range: visibilityRange
      }
    })
    setTileStatus('requested');
  },[]);

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
        //setTileStatus('done')
        //console.log('worldStateQueryStatustatus data', worldStateQueryStatus.data)
        //console.log(userState)
        getWorldStateQuery({
          variables: {
            positions: [{
              x: Math.floor(userState.viewportWorldLocation[0])*-1,
              y: Math.floor(userState.viewportWorldLocation[1])*-1
            }],
            range: visibilityRange
          }
        });
        setTileStatus('requested')
        //viewportWorldLocation[0].toFixed(2)}, 
        //{viewportWorldLocation[1].toFixed(2)
      }
  });

  return (
  <group>
    {viewportTiles && viewportTiles.map((xColumn, x) => {
      return xColumn.map((tile, y) => {
        return (<Tile key={`${x}-${y}`} position={[x,y,0]} src={tile.src} />)
      })
    })}
    {
      gameState?.tilesFromServer && Object.entries(gameState?.tilesFromServer).map(([key,tile]) => {
        console.log('boop',tile);
        return (<Tile key={`x${tile.x}y${tile.y}`} position={[tile.x, tile.y, 0]} src={tile.src} />)
      })
    }
  </group>
  );
}

ViewportTiles.propTypes = { };

ViewportTiles.defaultProps = { };
