import * as THREE from 'three';
import times from 'lodash/times';
import without from 'lodash/without';
import union from 'lodash/union';
import last from 'lodash/last';
import first from 'lodash/first';
import set from 'lodash/set';
import get from 'lodash/get';
import toPairs from 'lodash/toPairs';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';
import assign from 'lodash/assign';
import assignIn from 'lodash/assignIn';
import { RIGHT_CLICK, LEFT_CLICK } from '../constants/inputEvents';
import { entityTypes } from '../entities/entityTypes';

const createInitialState = (viewportWorldLocation) => {
    const myUnits = {}; // times(5, () => { return testEntity.generate() });
    // console.log('entityManager.createInitialState myUnit=', myUnits)
    return {
        myUnits,
        otherUnits: {},
        selectedUnits: [],
        perf: {},
        actionsToServer: []  // a queue of actions needed to be sent to server
    }
}

const hydrateEntityFromServer = (receivedEntity, entityTypes, existingEntitiesDict = {}) => {
    const { name, id } = receivedEntity;
    const type = entityTypes[name];
    const existingEntity = existingEntitiesDict[id];
    console.log('hydrateEntityFromServer name=',name, ' id=',id,'   existingEntity=', existingEntity);
    if (!existingEntity) {
        console.log('existingEntitiesDict', existingEntitiesDict);
    }
    if (!type) {
        console.log(`hydrateEntityFromServer: received unknown entity type name ${name}, entity=`, receivedEntity)
        return receivedEntity;
    }
    if (existingEntity) {
        const changes = differenceWith(
            toPairs(existingEntity), 
            toPairs(receivedEntity), 
            isEqual)
        console.log('received existing entity from server with changes id= ', id);
        if (changes?.length) changes.forEach(change => {
            console.log(id, change[0], change[1])
        })
        console.log('returning merged entity:', {
            ...existingEntity,
            ...receivedEntity
        })
        return assignIn(existingEntity, receivedEntity); 
        // {
        //     ...existingEntity,
        //     ...receivedEntity
        // }
    }
    console.log('received new entity from server with changes id= ', id);
    console.log(receivedEntity);
    const newEntity = type.generate({
            ...receivedEntity,
        });
    //onsole.log(`hydrateEntityFromServer ${newEntity.name}`, hydrated);
    return newEntity;
}

const STARTUP = 'STARTUP';
const SELECT_ENTITY = 'SELECT_ENTITY';
const INPUT_EVENT = 'INPUT_EVENT';
const HOVER_ENTITY_START = 'HOVER_ENTITY_START';
const HOVER_ENTITY_STOP = 'HOVER_ENTITY_STOP';
const SELECT_ACTION = 'SELECT_ACTION';
const POINTER_MOVE = 'POINTER_MOVE';
const POINTER_OUT = 'POINTER_OUT';
const SET_ENTITY_FIELD = 'SET_ENTITY_FIELD';
const ADD_TO_MY_ENTITIES = 'ADD_TO_MY_ENTITIES';
const RECEIVED_VISIBLE_ENTITIES = 'RECEIVED_VISIBLE_ENTITIES';

const getGeneratedAction = (entity, worldLocation) => {
    const action = entity.selectedAction || entity.defaultAction;
    if (!action) return null;
    const { ticGenerator, ticGeneratorParams } = action;
    if (!ticGenerator) return null;
    console.log('initiating ', action.longName, ' for ', entity.id, ' selectedAction=', !!entity.selectedAction);
    return ticGenerator({entity, worldLocation, ...ticGeneratorParams});
}

const performActions = (selectedUnits, worldLocation) => {
    selectedUnits.map((entity) => {
        entity.tic = getGeneratedAction(entity, worldLocation);
    });
}

const handleInputEvent = (state, action) => {
    const { pointerData, inputSource, worldLocation, time } = action;
    const { point, shiftKey, altKey, button, buttons, type, ctrlKey, unprojectedPoint } = pointerData;
    const { selectedUnits, hoverEntities } = state;
    
    const selectedUnit = (() => {
        if (!selectedUnits) return null;
        if (!selectedUnits.length) return null;
        return first(selectedUnits);
    })();

    const selectedAction = (() => {
        if (!selectedUnit) return null;
        if (!selectedUnit.selectedAction) return null;
        return selectedUnit.selectedAction;
    })();

    // this block is sus
    // I don't think action means here what the author thought it means
    if (action.meetsRequirements) {
        const inputEventState = {
            ...action, 
            ...pointerData,
            state
        };
        if (!action.meetsRequirements(inputEventState)) {
            return state;
        }
    }

    // Left Click
    // - Select and Unselect entities
    // - Perform selected actions
    if (button === LEFT_CLICK) {
        // check to see if there's a selected action
        if (!selectedAction) {
            if (hoverEntities?.length) {
                state.selectedUnits?.forEach((entity) => entity.selectedAction = null);
                state.selectedUnits = [last(hoverEntities)];
                return state;
            }
            
            state.selectedUnits = [];
            return state;
        }

        if (selectedAction.meetsRequirements) {
            if (selectedAction.meetsRequirements()) {
                performActions(selectedUnits, worldLocation);
                selectedUnits.forEach((entity) => entity.selectedAction = null);
                return state;
            }
        };
        
    }

    if (!selectedUnit) { return state; }

    if (button === RIGHT_CLICK) {
        performActions(selectedUnits, worldLocation);
        selectedUnits.forEach((entity) => entity.selectedAction = null);
    }
    return state;
}

const entityReducer = (state, action) => {
    switch (action.type) {
        case SELECT_ENTITY:
            state.selectedUnits = Array.isArray(action.payload) ? action.payload : [action.payload];
            state.selectedUnits.forEach((entity) => entity.selectedAction = null)
            console.log({selected: state.selectedUnits})
            return state;
        case STARTUP:
            return state;
        case HOVER_ENTITY_START:
            state.hoverEntities = union(state.hoverEntities, [action.payload]);
            return state;
        case HOVER_ENTITY_STOP:
            state.hoverEntities = without(state.hoverEntities, action.payload);
            return state;
        case INPUT_EVENT:
            return handleInputEvent(state, action);
        case SELECT_ACTION:
            if (state.selectedUnits?.length) {
                first(state.selectedUnits).selectedAction = action.payload;
            }
            // console.log('new selectedAction: ', first(state.selectedUnits).selectedAction)
            return state;
        case POINTER_MOVE:
            const { pointerData, userState } = action.payload;
            const { viewportWorldLocation: vWL } = userState;
            const { point } = pointerData;
            pointerData.pointWorld = new THREE.Vector3(point.x - vWL[0], point.y - vWL[1], 0);
            state.pointerData = pointerData;
            return state;
        case POINTER_OUT:
            state.pointerData = null;
            return state;
        case SET_ENTITY_FIELD:
            const { path, payload, entityId } = action;
            return state;
        case ADD_TO_MY_ENTITIES:
            state.myUnits = union(state.myUnits, [action.payload]);
            return state;
        case RECEIVED_VISIBLE_ENTITIES:
            const statsPath = `queryResults[${RECEIVED_VISIBLE_ENTITIES}].stats`;
            const { timeOfLastResult, numReceived } = get(state, statsPath, {
                timeOfLastResult: 0,
                numReceived: 0
            });
            // console.log(RECEIVED_VISIBLE_ENTITIES, numReceived)
            if (!timeOfLastResult) {
                console.log(action.payload)
            }
            const { getEntitiesICanSee } = action.payload;
            let unitDict = createMyUnitsDictionary(state);
            state.myUnits = getEntitiesICanSee
                .filter(entity => entity.ownerId === 'player.1')
                .map(entity => hydrateEntityFromServer({
                    ...entity, 
                    position: [
                        entity.position.x,
                        entity.position.y,
                        entity.position.z || 0
                    ]},
                    entityTypes,
                    unitDict));
            state.myUnitsById = createMyUnitsDictionary(state);
            
            
            // console.log('state.myUnits', state.myUnits)
            //state.otherUnits = action.payload.fil
            set(state, `${statsPath}.numReceived`, numReceived+1);
            set(state, `${statsPath}.timeOfLastResult`, Date.now());
            
            return state;
        default:
            console.log(`unknown action in entityManagerReducer: ${action}`);
            console.log({action});
            throw new Error(`unknown action in entityManagerReducer: ${action}`);
    }
}

export {
    createInitialState,
    entityReducer,
    SELECT_ENTITY,
    INPUT_EVENT,
    HOVER_ENTITY_START,
    HOVER_ENTITY_STOP,
    SELECT_ACTION,
    POINTER_MOVE,
    POINTER_OUT,
    SET_ENTITY_FIELD,
    ADD_TO_MY_ENTITIES,
    RECEIVED_VISIBLE_ENTITIES
}