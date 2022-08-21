// lodash
import uniqueId from 'lodash/uniqueId';
import times from 'lodash/times';

const colorArray = ['blue','brown','blue','green','red','pink'];
const createEntity = (params) => {
    const {viewportWorldLocation} = params;
    //console.log({viewportWorldLocation})
    const position = [Math.random()*10, Math.random()*10, 0]; // viewportWorldLocation.slice();
    const color = colorArray[Math.floor(colorArray.length * Math.random())];
    const entity = {
        id: uniqueId('entity-'),
        color,
        position,
        lastTic: Date.now()
    }
    return entity;
}

const createInitialState = (viewportWorldLocation) => {
    const myUnits = times(5, () => { return createEntity({viewportWorldLocation}) });
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