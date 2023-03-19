import React, { useRef } from 'react';
import { CHUNK_GEOMETRY } from '../../../constants/tileChunks';
export const CachedChunk = ({chunk, children}) => {
    const ref = useRef();

    return (
        <group>
          {children}
          <mesh
            position={[chunk.x, chunk.y, 0]}
            ref={ref}
            scale={1}
            withCanvas={true}
            >
            <planeGeometry args={CHUNK_GEOMETRY} />
            <meshStandardMaterial map={chunk.texture} />
          </mesh>
        </group>
    );
};
