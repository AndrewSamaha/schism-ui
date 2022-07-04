import React, { useState, useEffect, useReducer } from 'react';
import { ViewGeometry } from '../../../constants/viewport';
import { TileChunk } from '../TileChunk/TileChunk';
import { CHUNK_SIZE } from '../../../constants/tileChunks';

const createInitialState = (viewportWorldLocation) => {
  
  return {
    visibleChunks: {},
    lastViewportWorldLocation: viewportWorldLocation,
    allChunks: {}
  }
}

const UPDATE_LOCATION = 'UPDATE_LOCATION';

const getWorldLocation = ({viewportWorldLocation}) => {
  return {
    x1: -1 * (viewportWorldLocation[0] + ViewGeometry[0]/2),
    y1: -1 * (viewportWorldLocation[1] + ViewGeometry[1]/2),
    x2: -1 * (viewportWorldLocation[0] - ViewGeometry[0]/2),
    y2: -1 * (viewportWorldLocation[1] - ViewGeometry[1]/2)
  }
}

const getChunkAddress = (worldX, worldY) => {
  return {
    x: Math.floor(worldX / CHUNK_SIZE) * CHUNK_SIZE,
    y: Math.floor(worldY / CHUNK_SIZE) * CHUNK_SIZE
  }
}

const getChunkLocation = ({viewportWorldLocation}) => {
  const {x1, y1} = getWorldLocation({viewportWorldLocation});
  return getChunkAddress(x1, y1);
}

const getVisibleChunkAddresses = ({viewportWorldLocation}) => {
  const numChunksX = Math.ceil(ViewGeometry[0] / CHUNK_SIZE);
  const numChunksY = Math.ceil(ViewGeometry[1] / CHUNK_SIZE);
  const chunkLocation = getChunkLocation({viewportWorldLocation});
  const visibleAddresses = [];

  for (let x = chunkLocation.x; x < chunkLocation.x + numChunksX*CHUNK_SIZE; x+=CHUNK_SIZE) {
    for (let y = chunkLocation.y; y < chunkLocation.y + numChunksY*CHUNK_SIZE; y+=CHUNK_SIZE) {
      visibleAddresses.push({x, y})
    }
  }
  return visibleAddresses;
}

const getKey = ({x, y}) => `ChunkX${x}Y${y}`;

function chunkManagerReducer(state, action) {

  // console.log('chunkManagerReducer', action, state);
  if (state === null) return createInitialState([]);

  switch (action.type) {
      case 'receivedGameState':
          return {
              ...state
          }
      case 'defineChunks':
          return {
              ...state
          }
      case UPDATE_LOCATION:
        const worldLocation = getWorldLocation({viewportWorldLocation: action.payload});
        const chunkLocation = getChunkAddress(worldLocation.x1, worldLocation.y1);
        const visibleChunkAddresses = getVisibleChunkAddresses({viewportWorldLocation: action.payload});
        const visibleChunkKeys = visibleChunkAddresses.map(({x,y}) => `ChunkX${x}Y${y}`);
        const newVisibleChunkKeys = visibleChunkKeys.filter((key) => !Object.keys(state.visibleChunks).includes(key));
        const newVisibleChunkAddresses = visibleChunkAddresses.filter((address) => !Object.keys(state.visibleChunks).includes(getKey(address)));
        if (!newVisibleChunkAddresses.length) {
          return {
            ...state,
            lastViewportWorldLocation: action.payload,  
          }
        }
        const newVisibleChunks = {};
        
        newVisibleChunkAddresses.forEach(({x, y}) => {
          const key = getKey({x, y});
          if (Object.keys(state.allChunks).includes(key)) {
            newVisibleChunks[key] = state.allChunks[key];
            return;
          }
          newVisibleChunks[key] = {
            x,
            y
          }
        });

        const stillVisibleChunksAddresses = visibleChunkAddresses.filter((address) => Object.keys(state.visibleChunks).includes(getKey(address)));
        const stillVisibleChunks = {};
        stillVisibleChunksAddresses.forEach(({x, y}) => {
          const key = getKey({x, y});
          newVisibleChunks[key] = {
            x,
            y
          }
        })
        const visibleChunks = {
          ...newVisibleChunks,
          ...stillVisibleChunks
        }
        
        //console.log('newVisibleChunkAddresses', newVisibleChunkAddresses);
        console.log('update')
        console.log('state.visibleChunks.keys()', Object.keys(state.visibleChunks))
        console.log('visibleChunks', Object.keys(visibleChunks));
        return {
          ...state,
          lastViewportWorldLocation: action.payload,
          visibleChunks,
          allChunks: {
            ...state.allChunks,
            ...newVisibleChunks
          }
        }
      default:
          console.log(`unknown action in chunkManagerReducer: ${action}`);
          console.log({action});
          throw new Error(`unknown action in chunkManagerReducer: ${action}`);
  }
}



const hasMoved = ({viewportWorldLocation}, {lastViewportWorldLocation}) => {
  if (Math.floor(lastViewportWorldLocation[0]) !== Math.floor(viewportWorldLocation[0]) ||
      Math.floor(lastViewportWorldLocation[1]) !== Math.floor(viewportWorldLocation[1])) return true;
  return false;
}

export const ChunkManager = ({gameReducer, userReducer, worldStateQuery, children}) => {
  const { userState, userDispatch } = userReducer;
  const {viewportWorldLocation} = userState;
  const [chunkManagerState, chunkManagerDispatch] = useReducer(chunkManagerReducer, createInitialState(viewportWorldLocation));

  if (hasMoved(userState, chunkManagerState)) chunkManagerDispatch({ type: UPDATE_LOCATION, payload: viewportWorldLocation})
  
  return (
  <group>
    {/* {
      chunkManagerState.visibleChunks.map(([key, chunk]) => {
        return (<TileChunk 
                  chunkData={[key, chunk]}
                  chunkManagerDispatch={{chunkManagerDispatch}}
                  />);
      })
    } */}
    {
      Object.entries(chunkManagerState.visibleChunks).map(([key, chunk]) => {
        return (<TileChunk 
                  key={key}
                  chunkData={[key, chunk]}
                  chunkManagerDispatch={{chunkManagerDispatch}}
                  />);
      })
    }
    {children}
  </group>
  );
}

ChunkManager.propTypes = { };

ChunkManager.defaultProps = { };
