import { createContext } from 'react';
import { createClientGameState } from '../mock/gameState';

const GameContext = createContext();

function gameReducer(state, action) {
    let newState;
    console.log('gameReducer',{state},{action});
    if (state === null) {
        console.log('game state is null, creating mock state');
        return createClientGameState();
    }
    switch (action.type) {
        case 'initMock':
            const useMocks = true;
            const newMockGameState = createClientGameState(useMocks);
            return newMockGameState;
        case 'receivedGameState':
            const tileSentTime = action.worldState.stateTimeUTC;
            const timeDiff = Date.now() - tileSentTime; //parseInt(tileSentTime,10); //Date.now() - parseInt(tileSentTime,10);    
            const expirationTime = Date.now() + 50003;
            console.log('receivedGameState',timeDiff, action.worldState);
            
            // const newTiles = action.worldState.tiles.map((tile) => {...tile, expirationTime})
            // const oldTiles = state.tilesFromServer || [];
            // const tilesFromServer = oldTiles.filter(tile => )
            return {
                ...state

            }
        default:
            console.log(`unknown action in gameReducer: ${action}`);
            console.log({action});
            throw new Error(`unknown action in gameReducer: ${action}`);
    }
    return state;
}

export {
    GameContext,
    gameReducer
};
