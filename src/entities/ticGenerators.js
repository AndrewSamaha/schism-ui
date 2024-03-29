import * as THREE from 'three';

// actionEffect
import { actionEffect } from '../actions/actionEffect';

// Entities
import { testEntity } from '../entities/testEntity';

// Constants
import { ADD_TO_MY_ENTITIES } from '../reducers/entityReducer';

// Helpers
import { getAngleDist } from '../helpers/vector';

// Dummy / Placeholder Generator
const dummyActionGenerator = (args) => {
    return (ref, delta) => { }
}

// POC of an entity-building generator
const createEntityTicGenerator = ({entity, worldLocation, totalTime}) => {
    const startTime = Date.now();
    return (ref, delta, entityReducer) => {
        const elapsedTime = Date.now() - startTime;
        console.log('createEntityTic time remaining', (totalTime - elapsedTime));
        if (elapsedTime >= totalTime) {
            entity.tic = null;
            const newEntity = testEntity.generate({
                position: worldLocation,
                color: entity.color
            });
            const { entityState, entityDispatch } = entityReducer;
            entityDispatch({
                type: ADD_TO_MY_ENTITIES,
                payload: newEntity
            });
            return entity;
        }
        return entity;
    }
}

function createEntityOnServerTicGenerator({entity, entityDefinition, worldLocation, totalTime}) {
    console.log('createEntityOnServerTicGenerator entityDefinition=', entityDefinition)
    const startTime = Date.now();
    return (ref, delta, entityReducer, mutations) => {
        console.log('  tic')
        const { myCreateNewEntitiesMutation } = mutations;
        const elapsedTime = Date.now() - startTime;
        console.log('  createEntityTic time remaining', (totalTime - elapsedTime));
        if (elapsedTime >= totalTime) {
            entity.tic = null;
            const newEntity = entityDefinition.generate({
                position: [worldLocation.x, worldLocation.y, worldLocation.z],
                color: entity.color
            });
            const mutationEntity = {
                name: newEntity.name,
                longName: newEntity.longName,
                speed: newEntity.speed,
                position: newEntity.position,
                color: newEntity.color,
                sightRange: newEntity.sightRange
            }
            myCreateNewEntitiesMutation({
                variables: {
                    entities: [mutationEntity]
                }
            });
            return entity;
        }
        return entity;
    }
}

export {
    createEntityTicGenerator,
    createEntityOnServerTicGenerator,
    dummyActionGenerator
}