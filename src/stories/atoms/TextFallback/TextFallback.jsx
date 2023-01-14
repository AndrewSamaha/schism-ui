import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Text } from '@react-three/drei';
import NotoSans from './NotoSans-Regular.ttf';
import { ViewRotation } from '../../../constants/viewport';

import './TextFallback.css';

// entity dispatch events
import { SELECT_ENTITY, HOVER_ENTITY_START, HOVER_ENTITY_STOP } from '../../../reducers/entityReducer';


extend({ TextGeometry });

export const TextFallback = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const { action, entity, entityReducer, mutations, geometry: geometryProp, material, color, position } = props;
  const ref = useRef();
  useFrame((state, delta) => {
    if (entity.tic) entity.tic(ref, delta, entityReducer, mutations);
  });
  const font = new FontLoader().parse(NotoSans);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  
  const { materialMap, rotation }= entity;
  const { entityState, entityDispatch } = entityReducer;
  const { scale, position: propPosition, ...slimProps } = props;

  const boxArgs = {
    args: {
      geometry: [1,1,1],
      position: [0,0,1]
    }
  }
  const boxGeometry = [.5, .5, .5];
  const boxPosition = [0, 0, .51];
  const textPosition = [0, 0, 1.1];
  const textRotation = (() => [ViewRotation[0], ViewRotation[1], ViewRotation[2]])();

  return (
    <group {...slimProps} position={position} key={entity.id} dispose={null}
      ref={ref}
      onClick={(event) => {
        if (action) return;
        if (entityState.selectedUnits.length && entityState.selectedUnits[0].id === entity.id) return;
        entityDispatch({ 
          type: SELECT_ENTITY,
          payload: [entity] 
        }) 
      }}
      onPointerOver={(event) => {
        console.log(entity)
        if (action) return;
        hover(true);
        entityDispatch({
          type: HOVER_ENTITY_START,
          payload: entity
        });
      }}
      onPointerOut={(event) => {
        if (action) return;
        hover(false)
        entityDispatch({
          type: HOVER_ENTITY_STOP,
          payload: entity
        });
      }}>
      <mesh rotation={rotation} position={boxPosition} >
        <boxGeometry args={boxGeometry} />
        <meshStandardMaterial color={hovered ? props.color : 'white'} wireframe={true} />
      </mesh>
      <Text fontSize={.5} position={textPosition} rotation={textRotation} color={hovered ? props.color : 'white'}>
          {entity.name}
      </Text>  
    </group>
  )
}

TextFallback.propTypes = {
    geometry: PropTypes.array,
    scale: PropTypes.number,
    color: PropTypes.string,
    withCanvas: PropTypes.bool
}

TextFallback.defaultProps = {
    geometry: [2, 2, 2],
    scale: 1,
    color: 'blue',
    withCanvas: true
};
