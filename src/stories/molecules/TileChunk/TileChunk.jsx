import React, { useReducer, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Tile } from '../../atoms/Tile/Tile';
import { CachedChunk } from './CachedChunk';
import { Text } from '@react-three/drei';
import { GET_CHUNK } from '../../../graph/queries';
import { CHUNK_SIZE } from '../../../constants/tileChunks';
import { ViewRotation } from '../../../constants/viewport';
import { SHOW_CHUNK_INFO } from '../../../constants/dev';

export const TileChunk = ({chunk}) => {
  const { key, tiles } = chunk;
  
  if (!tiles?.length) return (<></>)

  const chunkPosition = [tiles[0]?.x-CHUNK_SIZE/2-.5, tiles[0]?.y-CHUNK_SIZE/2-.5, 0.01];
  const textPosition = [0, 0, 1.1];
  const textRotation = (() => [ViewRotation[0], ViewRotation[1], ViewRotation[2]])();
  const boxGeometry = [10, 10];

  return (
  <group>
    {SHOW_CHUNK_INFO && 
    <group position={chunkPosition}>
      <Text fontSize={.5} position={textPosition}  rotation={textRotation} color={'white'}>
            {key}
      </Text>
      <mesh>
        <planeGeometry args={boxGeometry} />
        <meshStandardMaterial wireframe={true} />
      </mesh>  
    </group>}
    
    
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
