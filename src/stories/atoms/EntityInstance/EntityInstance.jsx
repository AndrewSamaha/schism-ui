import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame } from '@react-three/fiber';
import { Instance } from '@react-three/drei';

// entity dispatch events
import { SELECT_ENTITY, HOVER_ENTITY_START, HOVER_ENTITY_STOP } from '../../../reducers/entityReducer';

export const EntityInstance = (props) => {
  const { entity, entityReducer } = props;
  const { color, position, rotation, id, scale } = entity;
  const { entityState, entityDispatch } = entityReducer;
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01;
    if (entity.tic) entity.tic(ref, delta);
  });
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <Instance
      key={id}
      color={hovered ? 'white' : color}
      position={position}
      rotation={rotation} // [Math.PI / 3, 0, 0]
      ref={ref}
      scale={scale}
      //onClick={(event) => click(!clicked)}
      onClick={(event) => {
        if (entityState.selectedUnits.length && entityState.selectedUnits[0] === entity) return;
        entityDispatch({ 
          type: SELECT_ENTITY,
          payload: [entity] 
        }) 
      }}
      onPointerOver={(event) => {
        hover(true);
        entityDispatch({
          type: HOVER_ENTITY_START,
          payload: entity
        });
      }}
      onPointerOut={(event) => {
        hover(false)
        entityDispatch({
          type: HOVER_ENTITY_STOP,
          payload: entity
        });
      }}
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
