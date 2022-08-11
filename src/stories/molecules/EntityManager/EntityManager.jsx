// external
import React, { useState, useEffect, useReducer } from 'react';
import { useLazyQuery } from '@apollo/client';
import { CanvasTexture } from 'three';
import { Instances, Instance } from '@react-three/drei';

// Components
import { TileChunk } from '../TileChunk/TileChunk';
import { EntityInstance } from '../../atoms/EntityInstance/EntityInstance';
// Queries
import { GET_CHUNK_COLLECTION } from '../../../graph/queries';
// Helpers
import { getTextureSrc } from '../../../helpers/texture';
// Constants
import { ViewGeometry } from '../../../constants/viewport';
import { CHUNK_SIZE } from '../../../constants/tileChunks';


export const EntityManager = ({gameReducer, userReducer, entityReducer, worldStateQuery, children, client }) => { // chunkQuery,
  const { userState, userDispatch } = userReducer;
  const { entityState, entityDispatch } = entityReducer;
  const {viewportWorldLocation} = userState;
  
  return (
    <Instances>
      <boxGeometry />
      <meshStandardMaterial />
      {
        entityState.myUnits && entityState.myUnits.map((entity) => {
          return (<EntityInstance key={entity.id} entity={entity} entityReducer={entityReducer} />);
        })
      }
      {children}
    </Instances>
  );
}

EntityManager.propTypes = { };

EntityManager.defaultProps = { };
