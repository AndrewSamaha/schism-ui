import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame } from '@react-three/fiber';
import { Instance } from '@react-three/drei';

export const EntityInstance = (props) => {
  const { entity } = props;
  const { color, position, rotation, id, scale } = entity;
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Instance
      key={id}
      color={hovered ? 'white' : color}
      position={position}
      rotation={rotation} // [Math.PI / 3, 0, 0]
      ref={ref}
      scale={scale}
      // onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      />
  )
}

EntityInstance.propTypes = {
    geometry: PropTypes.array,
    scale: PropTypes.number,
    color: PropTypes.string,
    withCanvas: PropTypes.bool
}

EntityInstance.defaultProps = {
    geometry: [2, 2, 2],
    scale: 1,
    color: 'blue',
    withCanvas: true
};
