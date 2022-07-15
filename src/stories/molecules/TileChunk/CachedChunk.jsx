import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CHUNK_GEOMETRY } from '../../../constants/tileChunks';

export const CachedChunk = ({chunk}) => {
    const ref = useRef();
    //const colorMap = useTexture(chunk.cachedImg);
    // console.log('rendering CachedChunk', {cachedImg: chunk.cachedImg});
    // useFrame(() => {
    //   chunk.texture.needsUpdate = true
    //   })
    return (
        <group>
          <mesh
            position={[chunk.x, chunk.y, 0]}
            ref={ref}
            scale={1}
            withCanvas={true}
            >
            <planeGeometry args={CHUNK_GEOMETRY} />
            {/* <meshStandardMaterial map={chunk.cachedImg.canvas} /> */}
            <meshStandardMaterial map={chunk.texture} />
            {/* <canvasTexture map={colorMap} /> */}
            {/* <canvasTexture map={chunk.cachedImg} /> */}
            {/* <canvasTexture map={chunk.texture} /> */}
            {/* <meshStandardMaterial color='pink' /> */}
            {/* <meshStandardMaterial color='pink' map={colorMap} /> */}
          </mesh>
        </group>
    );
};
