import React, { useState, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useFrame } from '@react-three/fiber';
import './ViewportTiles.css';
import { ViewMoveFriction, ViewGeometry } from '../../../constants/viewport';
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

export const TileChunk = ({gameReducer, userReducer, worldStateQuery}) => {
  //tilesQuery={{getNearbyTilesQuery, nearbyTilesStatus}}
  const [viewportTiles, setViewportTiles] = useState(null);
  const [tileStatus, setTileStatus] = useState(null);
  const { gameState, gameDispatch } = gameReducer;
  const { userState, userDispatch } = userReducer;
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

  const startTime = window.performance.now();
  const tilesInView = gameState?.tilesFromServer && Object.entries(gameState?.tilesFromServer).filter((arg) => {
    const [key,tile] = arg;
    if (tile.x >= UpperLeft.x &&
        tile.x <= LowerRight.x && 
        tile.y <= UpperLeft.y &&
        tile.y >= LowerRight.y) return true;
    return false;
  });
  // const duration = window.performance.now() - startTime;
  // const numFilteredTiles = gameState?.tilesFromServer && Object.entries(gameState.tilesFromServer).length;
  // const rate = numFilteredTiles / duration;
  // if (duration > 0) console.log(rate, numFilteredTiles, duration);
  
  return (
  <group>
    {/* {viewportTiles && viewportTiles.map((xColumn, x) => {
      return xColumn.map((tile, y) => {
        return (<Tile key={`${x}-${y}`} position={[x,y,0]} src={tile.src} />)
      })
    })} */}
    {
      tilesInView?.length && tilesInView.map(([key, tile]) => {
        //console.log('boop',tile.x, tile.y);
        return (<Tile key={`x${tile.x}y${tile.y}`} position={[tile.x, tile.y, 0]} src={tile.src} />)
      })
    }
    {/* {
      gameState?.tilesFromServer && Object.entries(gameState?.tilesFromServer).map(([key,tile]) => {
        console.log('boop',tile);
        return (<Tile key={`x${tile.x}y${tile.y}`} position={[tile.x, tile.y, 0]} src={tile.src} />)
      })
    } */}
  </group>
  );
}

ViewportTiles.propTypes = { };

ViewportTiles.defaultProps = { };
