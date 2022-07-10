import React, { useReducer, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Tile } from '../../atoms/Tile/Tile';
import { CachedChunk } from './CachedChunk';
import { getViewportTiles, calcNewViewportWorldPosition } from '../../../helpers/viewport';
import { GET_CHUNK } from '../../../graph/queries';
import { CHUNK_SIZE, CHUNK_GEOMETRY } from '../../../constants/tileChunks';

const initialState = {
  x: 0,
  y: 0,
  lastRefresh: 0,
  tiles: [],
  cachedImage: null,
  key: null,
  inited: false,
  getChunkQuery: null,
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



export const TileChunk = ({chunk, chunkData, chunkManagerDispatch}) => {
  const { key, tiles, lastRefresh } = chunk;

  if (chunk.cachedImg) {
    return (<CachedChunk chunk={chunk}></CachedChunk>)
  };

  return (
  <group>
    {
      tiles?.length && tiles.map((tile) => {
        return (<Tile key={`x${tile.x}y${tile.y}`} position={[tile.x, tile.y, 0]} src={tile.src} />)
      })
    }
  </group>
  );
}

TileChunk.propTypes = { };

TileChunk.defaultProps = { };
