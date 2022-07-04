import React, { useReducer } from 'react';
import { Tile } from '../../atoms/Tile/Tile';
import { getViewportTiles, calcNewViewportWorldPosition } from '../../../helpers/viewport';

const initialState = {
  tiles: [],
  cachedImage: null,
  lastRefreshTime: 0
};

const REFRESH_TILES = 'REFRESH_TILES';

function tileChunkReducer(state, action) {
  let newState;


  if (state === null) return initialState();
  switch (action.type) {
      case REFRESH_TILES:
        const cachedImage = []; // calculate a cached image
        return {
            ...state,
            tiles: action.tiles
        }
      default:
        console.log(`unknown action in chunkManagerReducer: ${action}`);
        console.log({action});
        throw new Error(`unknown action in chunkManagerReducer: ${action}`);
  }
  return state;
}

export const TileChunk = ({chunkData, chunkManagerDispatch}) => {
  const [tileChunkState, tileChunkDispatch] = useReducer(tileChunkReducer, initialState);
  const [key, chunk] = chunkData;
  const { tiles, refreshed } = chunk;
  if (refreshed) tileChunkDispatch({
    type: REFRESH_TILES,
    tiles,
  });

  return (
  <group>
    {
      tiles?.length && tiles.map(([key, tile]) => {
        return (<Tile key={`x${tile.x}y${tile.y}`} position={[tile.x, tile.y, 0]} src={tile.src} />)
      })
    }
  </group>
  );
}

TileChunk.propTypes = { };

TileChunk.defaultProps = { };
