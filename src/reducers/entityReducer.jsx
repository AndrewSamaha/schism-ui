import times from 'lodash/times';
import without from 'lodash/without';
import union from 'lodash/union';
import last from 'lodash/last';
import first from 'lodash/first';
import { testEntity } from '../entities/testEntity';
import { RIGHT_CLICK, LEFT_CLICK } from '../constants/inputEvents';

const createInitialState = (viewportWorldLocation) => {
    const myUnits = times(5, () => { return testEntity.generate() });
    // console.log('entityManager.createInitialState myUnit=', myUnits)
    return {
        myUnits: myUnits,
        otherUnits: [],
        selectedUnits: [],
        perf: {},
        actionsToServer: []  // a queue of actions needed to be sent to server
    }
}

const STARTUP = 'STARTUP';
const SELECT_ENTITY = 'SELECT_ENTITY';
const INPUT_EVENT = 'INPUT_EVENT';
const HOVER_ENTITY_START = 'HOVER_ENTITY_START';
const HOVER_ENTITY_STOP = 'HOVER_ENTITY_STOP';
const SELECT_ACTION = 'SELECT_ACTION';

const getGeneratedAction = (entity, worldLocation) => {
    const action = entity.selectedAction || entity.defaultAction;
    if (!action) return null;
    const { generator } = action;
    if (!generator) return null;
    console.log('initiating ', action.longName, ' for ', entity.id, ' selectedAction=', !!entity.selectedAction);
    return generator({entity, worldLocation});
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
    // Handle Select and Unselect entities
    if (button === LEFT_CLICK) {
        if (hoverEntities?.length) {
            state.selectedUnits = last(hoverEntities);
        } else {
            state.selectedUnits = [];
        }
        return state;
    }
    if (!selectedUnits?.length) { return state; }

    if (button === RIGHT_CLICK) {
        performActions(selectedUnits, worldLocation);
    }
    return state;
}

const entityReducer = (state, action) => {
    switch (action.type) {
        case SELECT_ENTITY:
            state.selectedUnits = action.payload;
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
            console.log('new selectedAction: ', first(state.selectedUnits).selectedAction)
            return state;
        default:
            console.log(`unknown action in chunkManagerReducer: ${action}`);
            console.log({action});
            throw new Error(`unknown action in chunkManagerReducer: ${action}`);
    }
}

export {
    createInitialState,
    entityReducer,
    SELECT_ENTITY,
    INPUT_EVENT,
    HOVER_ENTITY_START,
    HOVER_ENTITY_STOP,
    SELECT_ACTION
}