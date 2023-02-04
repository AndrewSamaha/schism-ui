// external
import React, { useState, useEffect, useReducer } from 'react';
import { useLazyQuery } from '@apollo/client';
import { CanvasTexture } from 'three';
import { useFrame } from '@react-three/fiber';
import uniqBy from 'lodash/uniqBy';

// Components
import { TileChunk } from '../TileChunk/TileChunk';
import { ViewportBoundary } from '../../atoms/ViewportBoundary/ViewportBoundary';

// Queries
import { GET_CHUNK_COLLECTION } from '../../../graph/queries';
// Helpers
import { getTextureSrc } from '../../../helpers/texture';
// Constants
import { ViewGeometry, ViewRotation } from '../../../constants/viewport';
import { CHUNK_SIZE } from '../../../constants/tileChunks';


const LAG_ESTIMATE = 2;

const guessNextCameraPosition = (ref, lagEstimate=LAG_ESTIMATE) => {
  return {
    x: ref.current.position.x + ref.current.velocity[0] * lagEstimate,
    y: ref.current.position.y + ref.current.velocity[1] * lagEstimate,
    z: 0
  }
}

const getNextVisibleChunk = (cameraRef) => {
  const nextCameraPosition = guessNextCameraPosition(cameraRef);
  const nextChunkAddress = getChunkAddress(nextCameraPosition.x, nextCameraPosition.y)
  return nextChunkAddress;
}

const isNextChunkVisible = (cameraRef, chunkManagerState) => !!chunkManagerState.allChunks[getKey(getNextVisibleChunk(cameraRef))]

const toObj = (pos) => {
  if (!Array.isArray(pos)) return pos;
  return {
    x: pos[0],
    y: pos[1],
    z: pos[2]
  }
}

const toArray = (pos) => {
  if (Array.isArray(pos)) return pos;
  return [
    pos.x,
    pos.y,
    pos.z
  ];
}

const createInitialState = (viewportWorldLocation) => {
  console.log('chunkManager.createInitialState, viewportWorldLocation', viewportWorldLocation)
  const lastCameraPosition = ((location) => {})()
  return {
    visibleChunks: {},
    lastViewportWorldLocation: toArray(viewportWorldLocation),
    lastCameraPosition: toObj(viewportWorldLocation),
    allChunks: {},
    queryQueue: []
  }
}

const RECEIVED_CHUNK = 'RECEIVED_CHUNK';
const RECEIVED_CHUNK_COLLECTION = 'RECEIVED_CHUNK_COLLECTION';
const CAMERA_IS_MOVING = 'CAMERA_IS_MOVING';

const getWorldLocation = ({viewportWorldLocation}) => {
  return {
    x1: viewportWorldLocation[0] + ViewGeometry[0]/2,
    y1: viewportWorldLocation[1] + ViewGeometry[1]/2,
    x2: viewportWorldLocation[0] - ViewGeometry[0]/2,
    y2: viewportWorldLocation[1] - ViewGeometry[1]/2
  }
}

const getViewportCoordinates = ({viewportWorldLocation}) => {
  return {
    x1: viewportWorldLocation[0] - ViewGeometry[0]/2,
    y1: viewportWorldLocation[1] - ViewGeometry[1]/2,
    x2: viewportWorldLocation[0] + ViewGeometry[0]/2,
    y2: viewportWorldLocation[1] + ViewGeometry[1]/2
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
  const viewportOffsets = [-3*CHUNK_SIZE, 1*CHUNK_SIZE];
  const viewportWidth = [(numChunksX+2)*CHUNK_SIZE, (numChunksY+2)*CHUNK_SIZE];
  const start = [chunkLocation.x + viewportOffsets[0], chunkLocation.y + viewportOffsets[1]]

  for (let x = start[0]; x <= start[0] + viewportWidth[0]; x+=CHUNK_SIZE) {
    for (let y = start[1]; y <= start[1] + viewportWidth[1]; y+=CHUNK_SIZE) {
      visibleAddresses.push({x, y})
    }
  }
  
  return visibleAddresses;
}

const getKey = ({x, y}) => `ChunkX${x}Y${y}`;

const createNewChunk = ({key, x, y}) => {
  // console.log('createNewChunk',x,y,key)
  return {
    key,
    x,
    y
  }
}

const makeChunkImageContext = (chunk) => {
  const { x, y, tiles } = chunk;
  const canvas = document.createElement('canvas');
  const tileWidth = 100;
  const tileHeight = 100;
  canvas.width = CHUNK_SIZE * tileWidth;
  canvas.height = CHUNK_SIZE * tileHeight;

  // The default <canvas> is transparent, let's make it white
  const startTime = window.performance.now();
  let ctx = canvas.getContext('2d');
  
  const colorArray = ['blue','brown','blue','green','red','pink'];

  const pixelOffsetX = -chunk.x*tileWidth;
  const pixelOffsetY = chunk.y*tileHeight - tileHeight + canvas.height;

  tiles.map((tile) => {
    const img = new Image();
    
    img.onload = function() {

      const rcolor = colorArray[Math.floor(colorArray.length * Math.random())];
      ctx.fillStyle = rcolor;
      
      const chunkImgX = tile.x*tileWidth + pixelOffsetX;
      const chunkImgY = -(tile.y*tileHeight) + pixelOffsetY;
      
      ctx.fillRect(chunkImgX, chunkImgY, tileWidth, tileHeight);
      
      ctx.drawImage(this, 
        chunkImgX,
        chunkImgY,
        tileWidth,
        tileHeight);

      chunk.cachedImgDurationMs = window.performance.now() - startTime;
      chunk.texture.needsUpdate = true;
    }
    img.src = tile.src;
  });
  chunk.cachedImg = canvas;
  chunk.texture = new CanvasTexture(ctx.canvas);
  chunk.texture.needsUpdate = true;
  const duration = window.performance.now() - startTime;
  return ctx;
}

const doCameraMove = (state, action) => {
  const { ref: cameraRef } = action.payload;
  const nextVisibleChunkAddress = getNextVisibleChunk(cameraRef);
  const visibleChunkAddresses = cameraRef.frustrum.visibleChunks;
  
  if (!visibleChunkAddresses) return {
    ...state,
    lastViewportWorldLocation: action.payload,  
  };

  const newVisibleChunkAddresses = visibleChunkAddresses.filter((address) => !Object.keys(state.visibleChunks).includes(getKey(address)));
  
  if (!newVisibleChunkAddresses.length) {
    return {
      ...state,
      lastViewportWorldLocation: action.payload,  
    }
  }
  const newVisibleChunks = {};
  const newQueries = [];
  const chunksAddressesToQuery = [];

  newVisibleChunkAddresses.forEach(({x, y}) => {
    const key = getKey({x, y});
    if (Object.keys(state.allChunks).includes(key)) {
      newVisibleChunks[key] = state.allChunks[key];
      return;
    }
    chunksAddressesToQuery.push({x, y});
    newVisibleChunks[key] = createNewChunk({key, x, y});
  });

  const {getChunkQuery, getChunkQueryStatus} = action.chunkQuery;
  chunksAddressesToQuery.push(nextVisibleChunkAddress);
  const uniqueChunks = uniqBy(chunksAddressesToQuery, getKey);

  if (chunksAddressesToQuery.length) {
    getChunkQuery({
      variables: {
        positions: uniqueChunks,
        chunkSize: CHUNK_SIZE
      }
    });
  }

  const queryQueue = [...state.queryQueue, ...newQueries];

  const stillVisibleChunksAddresses = visibleChunkAddresses.filter((address) => Object.keys(state.visibleChunks).includes(getKey(address)));
  const stillVisibleChunks = {};
  stillVisibleChunksAddresses.forEach(({x, y}) => {
    const key = getKey({x, y});
    stillVisibleChunks[key] = state.visibleChunks[key];
  })

  const visibleChunks = {
    ...newVisibleChunks,
    ...stillVisibleChunks
  }

  return {
    ...state,
    lastViewportWorldLocation: action.payload,
    visibleChunks,
    allChunks: {
      ...state.allChunks,
      ...newVisibleChunks
    },
    queryQueue
  }
}

function chunkManagerReducer(state, action) {
  switch (action.type) {
      case 'receivedGameState':
          return state;

      case 'defineChunks':
          return state;

      case CAMERA_IS_MOVING:
        return doCameraMove(state, action);
        
      case RECEIVED_CHUNK_COLLECTION:
        const { getChunkCollection: { chunks: receivedChunks } } = action.payload;
        // console.log(`calling makeChunkImage on ${receivedChunks.length} chunks.`);
        const chunks = receivedChunks.reduce((collection, chunk) => {
          const { x, y } = chunk;
          const key = getKey(chunk);
          const tiles = chunk.tiles.map(tile => ({
            ...tile,
            src: getTextureSrc(tile.TileType.type)
          }));
          const newChunk = {
            ...chunk,
            key,
            tiles
          };

          newChunk.imgContext = makeChunkImageContext(newChunk);

          return {
            ...collection,
            [key]: newChunk
          }
        },{})

        return {
          ...state,
          visibleChunks: {
            ...state.visibleChunks,
            ...chunks
          },
          allChunks: {
            ...state.allChunks,
            ...chunks
          }
        };
      case RECEIVED_CHUNK:
        console.log('received chunks',action.payload);
        const { getChunk } = action.payload;
        
        const { x, y } = getChunk.position[0];
        const key = getKey({x, y});
        console.log('received chunk',key);
        if (getChunk.tiles.length != 100) {
          console.log('TILES != 100!!! len=', getChunk.tiles.length);
        }
        const tiles = getChunk.tiles.map(tile => ({
          ...tile,
          src: getTextureSrc(tile.TileType.type)
        }));
        const chunk = {
          ...getChunk,
          x,
          y,
          key,
          tiles
        }

        const receivedVisibleChunks = {
          ...state.visibleChunks,
          [key]: chunk
        };

        return {
          ...state,
          visibleChunks: receivedVisibleChunks,
          allChunks: {
            ...state.allChunks,
            ...receivedVisibleChunks
          }
        };
      default:
          console.log(`unknown action in chunkManagerReducer: ${action}`);
          console.log({action});
          throw new Error(`unknown action in chunkManagerReducer: ${action}`);
  }
}

export const ChunkManager = ({gameReducer, userReducer, worldStateQuery, children, client }) => { // chunkQuery,
  const { gameState, gameDispatch } = gameReducer;
  const { userState, userDispatch } = userReducer;
  const {viewportWorldLocation} = userState;
  
  const [chunkManagerState, chunkManagerDispatch] = useReducer(chunkManagerReducer, viewportWorldLocation, createInitialState);
  const [getChunkQuery, getChunkQueryStatus] = useLazyQuery(GET_CHUNK_COLLECTION, {
    onCompleted: data => chunkManagerDispatch({ type: RECEIVED_CHUNK_COLLECTION, payload: data }),
    onError: e => console.log('on error',e),
    client
  });

  useEffect(() => {
    if (!gameState.camera?.ref?.current) return;
    if (!isNextChunkVisible(gameState.camera.ref, chunkManagerState)) {
      chunkManagerDispatch({ type: CAMERA_IS_MOVING, payload: gameState.camera, chunkQuery })
      return;
    }
  },[gameState.camera?.ref?.current?.position?.x, gameState.camera?.ref?.current?.position?.y])

  const chunkQuery = { getChunkQuery, getChunkQueryStatus };

  return (
    <group>
      {
        chunkManagerState.visibleChunks && Object.entries(chunkManagerState.visibleChunks).map(([key, chunk]) => {
          return (<TileChunk 
                    key={key}
                    chunkData={[key, chunk]}
                    chunkManagerDispatch={{chunkManagerDispatch}}
                    chunk={chunk}
                    />);
        })
      }
      <ViewportBoundary cameraRef={gameState.camera?.ref} />
      {children}
    </group>
  );
}

ChunkManager.propTypes = { };

ChunkManager.defaultProps = { };
