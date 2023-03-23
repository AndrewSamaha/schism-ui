// external
import React, { useState, useEffect, useReducer, useRef, useUpdate } from 'react';
import * as THREE from 'three';
import { useLazyQuery } from '@apollo/client';
import { CanvasTexture } from 'three';
import { useFrame } from '@react-three/fiber';
import uniqBy from 'lodash/uniqBy';
import fill from 'lodash/fill';
import differenceBy from 'lodash/differenceBy';
import difference from 'lodash/difference';
import unionBy from 'lodash/unionBy';
import intersectionBy from 'lodash/intersectionBy';
import intersection from 'lodash/intersection';

// Components
import { TileChunk } from '../TileChunk/TileChunk';
import { ViewportBoundary } from '../../atoms/ViewportBoundary/ViewportBoundary';

// Queries
import { GET_CHUNK_COLLECTION } from '../../../graph/queries';
// Helpers
import { getTextureSrc } from '../../../helpers/texture';
// Constants
import { ViewGeometry, ViewRotation } from '../../../constants/viewport';
import { CHUNK_SIZE } from '../../../constants/tileChunks';
import { QUERY_SERVER_FOR_CHUNKS, SHOW_VIEWPORT_BOUNDARY, USE_INSTANCED_MESH_TEST } from '../../../constants/dev';

const xMax = 100;
const yMax = 100;
const tiles = new THREE.Matrix4();

export const InstancedTiles = ({gameReducer, userReducer, worldStateQuery, children, client }) => { // chunkQuery,

    const ref = useRef()
    let tiles;

    useEffect(() => {
        // tiles = 
        let counter = 0;
        // ref.current.setMatrixAt(0, new THREE.Matrix4())
        for (let x = 0; x < xMax; x++) {
            for (let y = 0; y < yMax; y++) {
                const id = counter++;
                tiles.position.set(xMax / 2 - x, yMax / 2 - y, 0);
                // tiles.rotation.y = t;
                tiles.updateMatrix();
                ref.current.setMatrixAt(id, tiles.matrix);
            }
        }
      ref.current.instanceMatrix.needsUpdate = true;
    }, []);

      return (
        <instancedMesh ref={ref} args={[null, null, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshNormalMaterial color='pink' />
          {children}
        </instancedMesh>
      )
  }
  
  InstancedTiles.propTypes = { };
  
  InstancedTiles.defaultProps = { };