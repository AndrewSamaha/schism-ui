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
        const parentEffect = actionEffect({
            changes: [],
            sourceEntity: entity,
            targetEntity: entity,
            actionStrings: strings,
        });
    
        return (ref, delta, entityReducer, actionEffectMutation) => {
            
            // console.log('straightlinemove')
            // console.log(`   ref is ${ref ? 'not null' : 'null'}`)
            // console.log(`   ref is`, {ref})
            // if (!ref.current) return;
            const length = entity.speed * delta;
            const { current } = ref;
            const { angle, dist } = getAngleDist(current.position, worldLocation);  
            if (dist < length) {
                const new3DPosition = new THREE.Vector3(worldLocation.x, worldLocation.y, worldLocation.z); 
                current.position.set(new3DPosition.x, new3DPosition.y, new3DPosition.z);
                actionEffect({
                    parentEffect,
                    changes: [
                        { path: 'position[0]', value: current.position.x },
                        { path: 'position[1]', value: current.position.y },
                        { path: 'tic', value: null }
                    ],
                    last: true
                })
                    .apply()
                    .callMutation(actionEffectMutation)
                    .status();
                    
                return;
            }
            const step = new THREE.Vector2(length, 0);
            step.rotateAround({x: 0, y: 0}, angle);
            const step3D = new THREE.Vector3(step.x, step.y, 0);
            current.position.add(step3D);
            actionEffect({
                parentEffect,
                changes: [
                    { path: 'position[0]', value: current.position.x },
                    { path: 'position[1]', value: current.position.y }
                ]
            })
                .apply()
                .callMutation(actionEffectMutation);
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