import * as THREE from 'three';
import uniq from 'lodash/uniq';

// Local Imports
import { straightLineMoveGenerator } from "../entities/actions";
import { ActionButton } from "../stories/atoms/ActionButton/ActionButton";
import moveEntityIcon from '../stories/assets/ui/Buttons/CreateEntity.png';
import moveEntityIcon_hover from '../stories/assets/ui/Buttons/CreateEntity_hover.png';
import { EntityInstance } from "../stories/atoms/EntityInstance/EntityInstance";
import { testEntity } from '../entities/testEntity';

// Actions
export const CREATE_ENTITY = {
    name: 'Create',
    longName: 'CREATE_ENTITY',
    generator: straightLineMoveGenerator,
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
        // console.log('pointerEntityGenerator being called')
        const { userReducer, entityReducer } = reducers;
        const { userState, userDispatch } = userReducer;
        const { viewportWorldLocation: vWL } = userState;
        const entity = {
            ...this.getReferenceEntity().generate(),
            id: uniq('selected-action-entity')
        };
            
        const pointerEntity = function (event) {
            if (!event) {
                console.log('pE is NULL')
                return null;
            }
            const { point, shiftKey, altKey, button, buttons, type, ctrlKey, unprojectedPoint } = event;
            entity.position = new THREE.Vector3(point.x - vWL[0], point.y - vWL[1], 0);
            return (
            <EntityInstance
                key={entity.id}
                entity={entity}
                entityReducer={entityReducer} 
                opacity={0.01} transparent />);
        }
        //console.log('pointerEntityGenerator returning new pointerEntity function', pointerEntity)
        return pointerEntity;
    }
};