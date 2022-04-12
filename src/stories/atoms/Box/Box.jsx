import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame } from '@react-three/fiber';
import './Box.css';

export const Box = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  const { geometry, color, scale } = props;
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={scale}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={geometry} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

Box.propTypes = {
    geometry: PropTypes.array,
    scale: PropTypes.number,
    color: PropTypes.string,
    withCanvas: PropTypes.bool
}

Box.defaultProps = {
    geometry: [2, 2, 2],
    scale: 1,
    color: 'blue',
    withCanvas: true
};
