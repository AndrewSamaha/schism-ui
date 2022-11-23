// external
import React, { useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { Instances, Instance } from '@react-three/drei';
import first from 'lodash/first';

// Constants
import { ViewRotation } from '../../../constants/viewport';

// Components
import { InteractiveModel } from '../../atoms/InteractiveModel/InteractiveModel';
import { EntityInstance } from '../../atoms/EntityInstance/EntityInstance';
import { TestHuman } from '../../atoms/Character/TestHuman/TestHuman';

// Queries
import { MY_ACTION_EFFECT_MUTATION } from '../../../graph/entities';

// Helpers
// Queries



export const EntityManager = ({gameReducer, userReducer, entityReducer, worldStateQuery, children, client }) => { // chunkQuery,
  const { userState, userDispatch } = userReducer;
  const { entityState, entityDispatch } = entityReducer;
  const {viewportWorldLocation} = userState;

  const [actionEffectMutation, getActionEffectMutationStatus] = useMutation(MY_ACTION_EFFECT_MUTATION, {
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
  
  return ( // test
    <>
      <Instances>
        <boxGeometry />
        <meshStandardMaterial />
        {
          entityState.myEntities && Object.entries(entityState.myEntities).map(([id, entity]) => {
            if (entity.component) return (null);
            return (<EntityInstance 
              key={id}
              entity={entity}
              actionEffectMutation={actionEffectMutation}
              entityReducer={entityReducer} />);
          })
        }
        {
          entityState.otherEntities && Object.entries(entityState.otherEntities).map(([id, entity]) => {
            if (entity.component) return (null);
            return (<EntityInstance key={id} entity={entity} entityReducer={entityReducer} />);
          })
        }
        {entityState?.pointerData && pointerEntity(entityState.pointerData)}
        {children}
      </Instances>
      <>
      {
        entityState.myEntities && Object.entries(entityState.myEntities).map(([id, entity]) => {
          if (!entity.component) return (null);

          // return entity.component({
          //   key: entity.id,
          //   position: entity.position,
          //   scale: 1,
          //   rotation: ViewRotation,
          //   color: 'red',
          //   entityReducer,
          //   actionEffectMutation,
          //   entity
          // })

          return (<TestHuman 
            key={entity.id}
            position={entity.position}
            scale={1}
            rotation={ViewRotation}
            color={'red'}
            entityReducer={entityReducer}
            actionEffectMutation={actionEffectMutation}
            entity={entity} />);

          return (null);

          // Below is the 'standard' practice
          return entity.component({
                position: entity.position,
                scale: 1,
                rotation: ViewRotation,
                color: 'red',
                entityReducer,
                entity
              })
          
          // Below is an attempt to add the interactive bits
          // to a wrapper that goes around the actual model
          // return InteractiveModel({
          //   model: entity.component({
          //     position: entity.position,
          //     scale: 1,
          //     rotation: ViewRotation
          //   }),
          //   entity,
          //   entityReducer
          // });
          // const key = `InteractiveModel${entity.id}.${id}`;
          // console.log('key ', key)
          // return (<InteractiveModel
          //     model={entity.component({
          //       position: entity.position,
          //       scale: 1,
          //       rotation: ViewRotation
          //     })}
          //     entity={entity}
          //     entityReducer={entityReducer}
          //     key={key}
          // />)
          
        })
      }
      </>
    </>
  );
}

EntityManager.propTypes = { };

EntityManager.defaultProps = { };
