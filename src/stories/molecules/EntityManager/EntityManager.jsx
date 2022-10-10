// external
import React, { useEffect, useMemo } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { CanvasTexture } from 'three';
import { Instances, Instance } from '@react-three/drei';
import first from 'lodash/first';

// Components
import { TileChunk } from '../TileChunk/TileChunk';
import { EntityInstance } from '../../atoms/EntityInstance/EntityInstance';
// Queries
import { GET_CHUNK_COLLECTION } from '../../../graph/queries';
import { RECEIVED_VISIBLE_ENTITIES } from '../../../reducers/entityReducer';
// Helpers
import { getTextureSrc } from '../../../helpers/texture';
// Queries



export const EntityManager = ({gameReducer, userReducer, entityReducer, worldStateQuery, children, client }) => { // chunkQuery,
  const { userState, userDispatch } = userReducer;
  const { entityState, entityDispatch } = entityReducer;
  const {viewportWorldLocation} = userState;

 
  
  const actor = first(entityState.selectedUnits);
  const selectedAction = actor?.selectedAction;

  //console.log('selectedUnits', selectedUnits.length, selectedUnits);
  const pointerEntity = useMemo( () => {
    if (!selectedAction) {
      // console.log('pE useMemo bailing out because no selectedAction was found')
      return () => {};
    }
    if (!selectedAction?.pointerEntityGenerator) {
      // console.log('pE useMemo bailing out because no pointerEntityGenerator was found')
      return () => {}};
    
    return selectedAction.pointerEntityGenerator(actor, {userReducer, entityReducer});
  }, [selectedAction]);
  //if (pointerEvent) console.log(pointerEvent?.point);
  
  return (
    <Instances>
      <boxGeometry />
      <meshStandardMaterial />
      {
        entityState.myUnits && entityState.myUnits.map((entity) => {
          return (<EntityInstance key={entity.id} entity={entity} entityReducer={entityReducer} />);
        })
      }
      {entityState?.pointerData && pointerEntity(entityState.pointerData)}
      {children}
    </Instances>
  );
}

EntityManager.propTypes = { };

EntityManager.defaultProps = { };
