import React, { useReducer } from 'react';
import { Tile } from '../../atoms/Tile/Tile';
import { getViewportTiles, calcNewViewportWorldPosition } from '../../../helpers/viewport';
import { CHUNK_SIZE } from '../../../constants/tileChunks';

const initialState = {
  x: 0,
  y: 0,
  lastRefresh: 0,
  tiles: [],
  cachedImage: null,
  key: null,
  inited: false
};

const REFRESH_TILES = 'REFRESH_TILES';
const GOT_CHUNK_DATA = 'GOT_CHUNK_DATA';
const INIT_CHUNK = 'INIT_CHUNK';

function tileChunkReducer(state, action) {
  switch (action.type) {
      case INIT_CHUNK:
        const { x, y, key } = action.payload;
        return {
          ...state,
          x,
          y,
          key,
          inited: true
        }
      case GOT_CHUNK_DATA:
        return {
          ...state
        }
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
  if (!tileChunkState.inited) tileChunkDispatch({ type: INIT_CHUNK, payload: chunkData })
  const { key, tiles, lastRefresh }= tileChunkState;
  
  // if (refreshed) tileChunkDispatch({
  //   type: REFRESH_TILES,
  //   tiles,
  // });

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
