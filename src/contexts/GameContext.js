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
            const newMockGameState = createClientGameState();
            return newMockGameState;
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