import * as THREE from 'three';
import uniq from 'lodash/uniq';

// Local Imports
import { createEntityOnServerTicGenerator } from "../entities/ticGenerators";
import { ActionButton } from "../stories/atoms/ActionButton/ActionButton";
import createBaseIcon from '../stories/assets/ui/Buttons/CreateBase.png';
import createBaseIcon_hover from '../stories/assets/ui/Buttons/CreateBase_hover.png';
import { EntityInstance } from "../stories/atoms/EntityInstance/EntityInstance";
import { base } from '../entities/buildings/base';

const entityDefinition = base;
// Actions
export const CREATE_BASE = {
    name: 'CreateBase',
    longName: 'CREATE_BASE',
    ticGeneratorParams: {
        totalTime: 2_000
    },
    icon: createBaseIcon,
    icon_hover: createBaseIcon_hover,
    getReferenceEntity: () => base,
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