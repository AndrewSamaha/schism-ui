import React, { useState, useEffect, useReducer } from 'react';
import { TileChunk } from '../TileChunk/TileChunk';

const initialState = {
  visibleChunks: [],
  allChunks: []
};

function chunkManagerReducer(state, action) {
  let newState;


  if (state === null) return initialState();
  switch (action.type) {
      case 'receivedGameState':
          return {
              ...state
          }
      case 'defineChunks':
          return {
              ...state
          }
      default:
          console.log(`unknown action in chunkManagerReducer: ${action}`);
          console.log({action});
          throw new Error(`unknown action in chunkManagerReducer: ${action}`);
  }
  return state;
}

export const ChunkManager = ({gameReducer, userReducer, worldStateQuery}) => {
  const [chunkManagerState, chunkManagerDispatch] = useReducer(chunkManagerReducer, initialState);

  return (
  <group>
    {
      chunkManagerState.visibleChunks.map(([key, chunk]) => {
        return (<TileChunk 
                  chunkData={[key, chunk]}
                  chunkManagerDispatch={{chunkManagerDispatch}}
                  />);
      })
    }
  </group>
  );
}

ChunkManager.propTypes = { };

ChunkManager.defaultProps = { };
