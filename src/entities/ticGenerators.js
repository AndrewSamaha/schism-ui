import * as THREE from 'three';

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
                position: worldLocation
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

// the first action generator
const straightLineMoveTicGenerator = ({entity, worldLocation}) => {
    return (ref, delta) => {
        const length = entity.speed * delta;
        const { current } = ref;
        const { angle, dist } = getAngleDist(current.position, worldLocation);  
        if (dist < length) {
            const new3DPosition = new THREE.Vector3(worldLocation.x, worldLocation.y, worldLocation.z); 
            current.position.set(new3DPosition.x, new3DPosition.y, new3DPosition.z);
            entity.tic = null;
            return;
        }
        const step = new THREE.Vector2(length, 0);
        step.rotateAround({x: 0, y: 0}, angle);
        const step3D = new THREE.Vector3(step.x, step.y, 0);
        current.position.add(step3D);
    }
}

export {
    straightLineMoveTicGenerator,
    createEntityTicGenerator,
    dummyActionGenerator
}