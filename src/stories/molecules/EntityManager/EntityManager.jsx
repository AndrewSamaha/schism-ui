// external
import React, { useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { Instances } from '@react-three/drei';
import first from 'lodash/first';
import compact from 'lodash/compact';

// Constants
import { ViewRotation } from '../../../constants/viewport';

// Components
import { EntityInstance } from '../../atoms/EntityInstance/EntityInstance';
import { GLTFModel } from '../../atoms/GLTFModel/GLTFModel';

// Queries
import { MY_ACTION_EFFECT_MUTATION } from '../../../graph/entities';

// Helpers
// Queries

export const EntityManager = ({gameReducer, userReducer, entityReducer, worldStateQuery, children, client }) => {
  const { entityState } = entityReducer;

  const [actionEffectMutation] = useMutation(MY_ACTION_EFFECT_MUTATION, {
    onCompleted: (data) => {
      console.log('actionEffectQuery on completed', data);
    },
    onError: (e) => {
      console.log('actionEffectQuery on error',e)
    },
    client
  });

  
  const actor = first(entityState.selectedUnits);
  const selectedAction = actor?.selectedAction;

  
  const pointerEntity = useMemo( () => {
    if (!selectedAction) {
      return () => {};
    }
    if (!selectedAction?.pointerEntityGenerator) {
      return () => {}
    };
    
    return selectedAction.pointerEntityGenerator(actor, {userReducer, entityReducer});
  }, [selectedAction, actor, userReducer, entityReducer]);
  
  
  return (
    <>
      <Instances>
        <boxGeometry />
        <meshStandardMaterial />
        {
          entityState.myEntities && compact(Object.entries(entityState.myEntities).map(([id, entity]) => {
            if (entity.gltfPath) return (null);
            return (<EntityInstance 
              key={id}
              entity={entity}
              actionEffectMutation={actionEffectMutation}
              entityReducer={entityReducer} />);
          }))
        }
        {
          entityState.otherEntities && compact(Object.entries(entityState.otherEntities).map(([id, entity]) => {
            if (entity.component) return (null);
            return (<EntityInstance key={id} entity={entity} entityReducer={entityReducer} />);
          }))
        }
        {entityState?.pointerData && pointerEntity(entityState.pointerData)}
        {children}
      </Instances>
      <>
      {
        entityState.myEntities && compact(Object.entries(entityState.myEntities).map(([id, entity]) => {
          if (!entity.gltfPath) return (null);
          return (<GLTFModel
            key={entity.id}
            position={entity.position}
            scale={entity.scale}
            rotation={ViewRotation}
            color={'red'}
            entityReducer={entityReducer}
            actionEffectMutation={actionEffectMutation}
            entity={entity} 
            gltfPath={entity.gltfPath} />);
        }))
      }
      </>
    </>
  );
}

EntityManager.propTypes = { };

EntityManager.defaultProps = { };
