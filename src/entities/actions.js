import * as THREE from 'three';

// Helpers
import { getAngleDist } from '../helpers/vector';

// Dummy / Placeholder Generator
const dummyActionGenerator = (args) => {
    return (ref, delta) => { }
}

// the first action generator
const straightLineMoveGenerator = ({entity, finalDestination}) => {
    return (ref, delta) => {
        const length = entity.speed * delta;
        const { current } = ref;
        const { angle, dist } = getAngleDist(current.position, finalDestination);  
        if (dist < length) {
            const new3DPosition = new THREE.Vector3(finalDestination.x, finalDestination.y, finalDestination.z); 
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
    straightLineMoveGenerator,
    dummyActionGenerator
}