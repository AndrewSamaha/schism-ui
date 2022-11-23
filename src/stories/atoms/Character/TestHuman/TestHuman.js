/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/


import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'

// entity dispatch events
import { SELECT_ENTITY, HOVER_ENTITY_START, HOVER_ENTITY_STOP } from '../../../../reducers/entityReducer';

export function TestHuman(props) {
  const { entity, entityReducer, action, actionEffectMutation } = props;
  const { position } = props;
  // const { color, position, rotation, id, scale } = entity;
  const { entityState, entityDispatch } = entityReducer;

  const ref = useRef();
  const [hovered, hover] = useState(false);
  const { nodes, materials } = useGLTF('/TestHuman.gltf');
  

  // <mesh geometry={nodes.Cube.geometry} material={materials.Material} color={props.color} >s
  useFrame((state, delta) => {
    if (entity.tic) entity.tic(ref, delta, entityReducer, actionEffectMutation);
  });
  return (
    // <Suspense fallback={null}>
      <group {...props} position={position} key={entity.id} dispose={null}
        ref={ref}
        onClick={(event) => {
          if (action) return;
          if (entityState.selectedUnits.length && entityState.selectedUnits[0] === entity) return;
          entityDispatch({ 
            type: SELECT_ENTITY,
            payload: [entity] 
          }) 
        }}
        onPointerOver={(event) => {
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
        }}
        >
        <mesh geometry={nodes.Cube.geometry} material={materials.Material} material-color={hovered ? 'white' : props.color} >
          {/* <meshStandardMaterial color={props.color} /> */}
        </mesh>
        </group>
    // </Suspense>
    
  )
}

useGLTF.preload('/TestHuman.gltf')