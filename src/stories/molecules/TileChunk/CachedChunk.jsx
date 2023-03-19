import React, { useRef } from 'react';
import { CHUNK_GEOMETRY } from '../../../constants/tileChunks';
import { ViewMaxGeometry } from '../../../constants/viewport';
export const CachedChunk = ({chunk, children}) => {
    const ref = useRef();
    const meshOffset= -0.5;
    return (
        <group>
          {children}
          <mesh
            position={[
              chunk.x + ViewMaxGeometry[0] + meshOffset,
              chunk.y + ViewMaxGeometry[1] + meshOffset,
              0]}
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
