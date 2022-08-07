// external
import React, { useState, useEffect, useReducer } from 'react';
import { useLazyQuery } from '@apollo/client';
import { CanvasTexture } from 'three';
import { Instances, Instance } from '@react-three/drei';
import uniqueId from 'lodash/uniqueId';
import times from 'lodash/times';
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

const colorArray = ['blue','brown','blue','green','red','pink'];


const createEntity = (params) => {
  const {viewportWorldLocation} = params;
  //console.log({viewportWorldLocation})
  const position = [Math.random()*10, Math.random()*10, 1]; // viewportWorldLocation.slice();
  const color = colorArray[Math.floor(colorArray.length * Math.random())];
  const entity = {
    id: uniqueId('entity-'),
    color,
    position
  }
  return entity;
}

const createInitialState = (viewportWorldLocation) => {
  const myUnits = times(5, () => { return createEntity({viewportWorldLocation}) });
  console.log('entityManager.createInitialState myUnit=', myUnits)
  return {
    myUnits: myUnits,
    otherUnits: [],
    perf: {},
    actionsToServer: []  // a queue of actions needed to be sent to server
  }
}

const STARTUP = 'STARTUP';

const entityManagerReducer = (state, action) => {
  switch (action.type) {
      case STARTUP:
        return state;
      default:
          console.log(`unknown action in chunkManagerReducer: ${action}`);
          console.log({action});
          throw new Error(`unknown action in chunkManagerReducer: ${action}`);
  }
}


export const EntityManager = ({gameReducer, userReducer, worldStateQuery, children, client }) => { // chunkQuery,
  const { userState, userDispatch } = userReducer;
  const {viewportWorldLocation} = userState;
  const [entityManagerState, entityManagerDispatch] = useReducer(entityManagerReducer, viewportWorldLocation, createInitialState);


  // useEffect(() => {
  //   entityManagerDispatch({ 
  //     type: STARTUP,
  //     payload: viewportWorldLocation,
  //     chunkQuery
  //   });
  // },[])

  return (
    <Instances>
      <boxGeometry />
      <meshStandardMaterial />
      {
        entityManagerState.myUnits && entityManagerState.myUnits.map((entity) => {
          return (<EntityInstance entity={entity} />);
          // return (<Instance
          //           key={unit.id}
          //           color={unit.color}
          //           scale={1}
          //           position={unit.position}
          //           rotation={[Math.PI / 3, 0, 0]}
          //           />);
        })
      }
      {children}
    </Instances>
  );
}

EntityManager.propTypes = { };

EntityManager.defaultProps = { };
