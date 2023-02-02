import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

export const ViewportBoundary = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const boxGeometry = [1, 1, 1];
  const color = 'white';
  const positions = props.cameraRef?.frustrum;

  if (!props.cameraRef?.current?.position) {
    // console.log('viewportBoundary: cameraRef is null')
    return (<></>);
  }
  
  return (

    <group dispose={null} scale={1} >
      <mesh position={positions.center} >
        <boxGeometry args={boxGeometry} />
        <meshStandardMaterial color={color} wireframe={true} />
      </mesh>
      <mesh position={positions.topLeft} >
        <boxGeometry args={boxGeometry} />
        <meshStandardMaterial color={color} wireframe={true} />
      </mesh>
      <mesh position={positions.topRight} >
        <boxGeometry args={boxGeometry} />
        <meshStandardMaterial color={color} wireframe={true} />
      </mesh>
      <mesh position={positions.bottomLeft} >
        <boxGeometry args={boxGeometry} />
        <meshStandardMaterial color={color} wireframe={true} />
      </mesh>
      <mesh position={positions.bottomRight} >
        <boxGeometry args={boxGeometry} />
        <meshStandardMaterial color={color} wireframe={true} />
      </mesh>
    </group>
  )
}

ViewportBoundary.propTypes = {
    geometry: PropTypes.array,
    scale: PropTypes.number,
    color: PropTypes.string,
    withCanvas: PropTypes.bool
}

ViewportBoundary.defaultProps = {
    geometry: [2, 2, 2],
    scale: 1,
    color: 'blue',
    withCanvas: true
};
