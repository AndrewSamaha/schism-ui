import times from 'lodash/times';
import { testEntityGenerator } from '../constants/entityTypes';

const createInitialState = (viewportWorldLocation) => {
    const myUnits = times(5, () => { return testEntityGenerator({viewportWorldLocation}) });
    console.log('entityManager.createInitialState myUnit=', myUnits)
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

const entityReducer = (state, action) => {
    switch (action.type) {
        case SELECT_ENTITY:
            state.selectedUnits = action.payload;
            console.log({selected: state.selectedUnits})
            return state;
        case STARTUP:
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
    SELECT_ENTITY
}