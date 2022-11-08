/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Tower1(props) {
  const { nodes, materials } = useGLTF('/Tower3Baked.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.OutterTower.geometry} material={materials['Material.001']} position={[0, 0, -0.55]} />
      <mesh geometry={nodes.SubtractMe.geometry} material={materials['Material.001']} position={[0, 0, 9.8]} />
    </group>
  )
}

useGLTF.preload('/Tower3Baked.gltf')