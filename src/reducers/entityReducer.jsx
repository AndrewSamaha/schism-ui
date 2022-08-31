import times from 'lodash/times';
import without from 'lodash/without';
import union from 'lodash/union';
import last from 'lodash/last';
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

const handleInputEvent = (state, action) => {
    const { pointerData, inputSource, worldLocation, time } = action;
    const { point, shiftKey, altKey, button, buttons, type, ctrlKey, unprojectedPoint } = pointerData;
    const { selectedUnits, hoverEntities } = state;

    // Handle Select and Unselect
    if (button === LEFT_CLICK) {
        if (state.hoverEntities?.length) {
            state.selectedUnits = last(state.hoverEntities);
        } else {
            state.selectedUnits = [];
        }
        return state;
    }
    if (!selectedUnits.length) {
    
        return state;
    }
    if (selectedUnits.length) {

    }
    return state;
}

const entityReducer = (state, action) => {
    switch (action.type) {
        case SELECT_ENTITY:
            state.selectedUnits = action.payload;
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
    HOVER_ENTITY_STOP
}