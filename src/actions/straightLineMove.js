import * as THREE from 'three';

import { ActionButton } from "../stories/atoms/ActionButton/ActionButton";
// actionEffect
import { actionEffect } from '../actions/actionEffect';
// Helpers
import { getAngleDist } from '../helpers/vector';
// static
import moveEntityIcon from '../stories/assets/ui/Buttons/MoveEntity.png';
import moveEntityIcon_hover from '../stories/assets/ui/Buttons/MoveEntity_hover.png';

// Actions
const strings = {
    name: 'Move',
    longName: 'STRAIGHT_LINE_MOVE'
}

const icons = {
    icon: moveEntityIcon,
    icon_hover: moveEntityIcon_hover,
}

export const functions = {
    ticGenerator: function({entity, worldLocation}) {
        const effect = actionEffect({
            changes: [],
            sourceEntity: entity,
            targetEntity: entity,
            actionStrings: strings,
            parent: null
        });
    
        return (ref, delta, entityReducer) => {
            const length = entity.speed * delta;
            const { current } = ref;
            const { angle, dist } = getAngleDist(current.position, worldLocation);  
            if (dist < length) {
                const new3DPosition = new THREE.Vector3(worldLocation.x, worldLocation.y, worldLocation.z); 
                current.position.set(new3DPosition.x, new3DPosition.y, new3DPosition.z);
                entity.position[0] = current.position.x;
                entity.position[1] = current.position.y;
                entity.tic = null;
                return;
            }
            const step = new THREE.Vector2(length, 0);
            step.rotateAround({x: 0, y: 0}, angle);
            const step3D = new THREE.Vector3(step.x, step.y, 0);
            current.position.add(step3D);
            console.log(current.position)
            entity.position[0] = current.position.x;
            entity.position[1] = current.position.y;
        }
    },
    meetsRequirements: function(inputEventState) {
        return true;
    },
    ButtonComponent: function (params) {
        return ActionButton(this, params)
    }
};

export const STRAIGHT_LINE_MOVE = {
    ...strings,
    ...icons,
    ...functions
};