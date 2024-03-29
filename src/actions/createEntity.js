import * as THREE from 'three';
import uniq from 'lodash/uniq';

// Local Imports
import { createEntityOnServerTicGenerator } from "../entities/ticGenerators";
import { ActionButton } from "../stories/atoms/ActionButton/ActionButton";
import moveEntityIcon from '../stories/assets/ui/Buttons/CreateEntity.png';
import moveEntityIcon_hover from '../stories/assets/ui/Buttons/CreateEntity_hover.png';
import { EntityInstance } from "../stories/atoms/EntityInstance/EntityInstance";
import { testEntity } from '../entities/testEntity';

// const entityDefinition = testEntity;
// Actions
export const CREATE_ENTITY = {
    name: 'Create',
    longName: 'CREATE_ENTITY',
    ticGenerator: (args) => { return createEntityOnServerTicGenerator({...args, entityDefinition: testEntity}) },
    ticGeneratorParams: {
        totalTime: 2_000
    },
    icon: moveEntityIcon,
    icon_hover: moveEntityIcon_hover,
    getReferenceEntity: () => testEntity,
    meetsRequirements: function(inputEventState) {
        return true;
    },
    ButtonComponent: function (params) {
        return ActionButton(this, params)
    },
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