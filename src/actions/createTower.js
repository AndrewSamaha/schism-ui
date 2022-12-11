import * as THREE from 'three';
import uniq from 'lodash/uniq';

// Local Imports
import { createEntityOnServerTicGenerator } from "../entities/ticGenerators";
import { ActionButton } from "../stories/atoms/ActionButton/ActionButton";
import createTowerIcon from '../stories/assets/ui/Buttons/CreateTower.png';
import createTowerIcon_hover from '../stories/assets/ui/Buttons/CreateTower_hover.png';
import { EntityInstance } from "../stories/atoms/EntityInstance/EntityInstance";
import { tower } from '../entities/tower';
import { ADD_TO_MY_ENTITIES } from '../reducers/entityReducer';

const entityDefinition = tower;
// Actions
export const CREATE_TOWER = {
    name: 'CreateTower',
    longName: 'CREATE_TOWER',
    ticGeneratorParams: {
        totalTime: 2_000
    },
    icon: createTowerIcon,
    icon_hover: createTowerIcon_hover,
    getReferenceEntity: () => tower,
    meetsRequirements: function(inputEventState) {
        return true;
    },
    ButtonComponent: function (params) {
        return ActionButton(this, params)
    },
    ticGenerator: (args) => { return createEntityOnServerTicGenerator({...args, entityDefinition}) },
    pointerEntityGenerator: function (actor, reducers) {
        const { userReducer, entityReducer } = reducers;
        const { userState, userDispatch } = userReducer;
        const { viewportWorldLocation: vWL } = userState;
        const entity = {
            ...this.getReferenceEntity().generate({color: 'gray'}),
            id: uniq('selected-action-entity'),
        };
            
        const pointerEntity = function (event) {
            if (!event) {
                console.log('pE is NULL')
                return null;
            }
            const { point, pointWorld, shiftKey, altKey, button, buttons, type, ctrlKey, unprojectedPoint } = event;
            console.warn('pointerEntityGenerator.pointerEntity might be trying to assign pointWorld(type Vector3) to entity.position(type array). pointWorld=', pointWorld)
            entity.position = pointWorld;
            return (
            <EntityInstance
                action
                key={entity.id}
                entity={entity}
                entityReducer={entityReducer} 
                opacity={0.01} transparent 
                wireframe={true} />);
        }
        
        return pointerEntity;
    }
};