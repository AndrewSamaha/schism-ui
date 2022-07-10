import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { CHUNK_GEOMETRY } from '../../../constants/tileChunks';

export const CachedChunk = ({chunk}) => {
    const ref = useRef();
    const colorMap = useTexture(chunk.cachedImg);
    // console.log('rendering CachedChunk', {chunk});
    
    return (
        <group>
          <mesh
            position={[chunk.x, chunk.y, 0]}
            ref={ref}
            scale={1}
            withCanvas={true}
            >
            <planeGeometry args={CHUNK_GEOMETRY} />
            <meshStandardMaterial map={chunk.cachedImg} />
            {/* <meshStandardMaterial color='pink' /> */}
            {/* <meshStandardMaterial color='pink' map={colorMap} /> */}
          </mesh>
        </group>
    );
};
