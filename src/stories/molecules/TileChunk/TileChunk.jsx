import React from 'react';
import { Tile } from '../../atoms/Tile/Tile';
import { CachedChunk } from './CachedChunk';
import { Text } from '@react-three/drei';
import { CHUNK_SIZE } from '../../../constants/tileChunks';
import { ViewRotation } from '../../../constants/viewport';
import { SHOW_CHUNK_INFO, USE_CACHED_CHUNKS } from '../../../constants/dev';

export const TileChunk = (props) => {
  
  const { chunk } = props;
  if (!chunk) {
    console.error('TileChunk passed no usable props')
    return (<></>)  
  }
  
  if (!chunk) return (<></>);
  const { tiles=[], key } = chunk;
  const boxGeometry = [10, 10];
  const textPosition = [0, 0, 1.1];
  const textRotation = (() => [ViewRotation[0], ViewRotation[1], ViewRotation[2]])();

  if (!tiles?.length) {
    const chunkPosition = [chunk.x + CHUNK_SIZE/2-.5, chunk.y + CHUNK_SIZE/2 -.5, 0.01]
    return (<group position={chunkPosition}>
    <Text fontSize={.5} position={textPosition}  rotation={textRotation} color={'white'}>
          {key} {tiles?.length}
    </Text>
    <mesh>
      <planeGeometry args={boxGeometry} />
      <meshStandardMaterial wireframe={true} />
    </mesh>  
  </group>)
  }

  const chunkPosition = [tiles[0]?.x+CHUNK_SIZE/2-.5, tiles[0]?.y+CHUNK_SIZE/2-.5, 0.01];
  
  if (USE_CACHED_CHUNKS && chunk.cachedImg) {
    return (
    <CachedChunk chunk={chunk}>
        {SHOW_CHUNK_INFO && 
      <group position={chunkPosition}>
        <Text fontSize={.5} position={textPosition}  rotation={textRotation} color={'white'}>
              {key} {tiles?.length}
        </Text>
        <mesh>
          <planeGeometry args={boxGeometry} />
          <meshStandardMaterial wireframe={true} />
        </mesh>  
      </group>}
    </CachedChunk>
    )
  }

  return (
  <group>
    {SHOW_CHUNK_INFO && 
    <group position={chunkPosition}>
      <Text fontSize={.5} position={textPosition}  rotation={textRotation} color={'white'}>
            {key} {tiles?.length}
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
