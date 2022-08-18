import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CHUNK_GEOMETRY } from '../../../constants/tileChunks';
export const CachedChunk = ({chunk}) => {
    const ref = useRef();

    return (
        <group>
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
