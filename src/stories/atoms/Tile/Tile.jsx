import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import Grass from '../../assets/textures/grass/grass1.jpg';
import { TileGeometry } from '../../../constants/viewport';
import './Tile.css';
import { tileTextures } from '../../../constants/tiles';

export const Tile = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  const { geometry, material, color, scale, src, position } = props;
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // console.log('tile', position[0], position[1], src, key);
  useEffect(() => {
    // console.log('tile', position[0], position[1], src);
  },[])
  const colorMap = useTexture(src);
  if (hovered) console.log(position[0],position[1],position[2]);
  return (
    <group>
      <mesh
        {...props}
        ref={ref}
        scale={scale}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <planeGeometry args={geometry} />
        <meshStandardMaterial map={colorMap} />
      </mesh>
      {hovered && (<mesh position={[position[0], position[1], position[2]]} scale >
        <planeGeometry args={geometry} />
        <meshStandardMaterial color='pink' />
      </mesh>)}
    </group>
  )
}

Tile.propTypes = {
    geometry: PropTypes.array,
    scale: PropTypes.number,
    color: PropTypes.string,
    withCanvas: PropTypes.bool
}

Tile.defaultProps = {
    geometry: TileGeometry,
    scale: 1,
    color: 'blue',
    withCanvas: true
};
