import { createContext } from 'react';
import { createClientGameState } from '../mock/gameState';
import { fogOfWarDelay_ms } from '../constants/clientGame';
import { getTextureSrc } from '../helpers/texture';
import { TileChunk } from '../lib/TileChunk/TileChunk';

const GameContext = createContext();

const chunk = new TileChunk({ worldTopLeftX: 50, worldTopLeftY: 50});

function gameReducer(state, action) {
    let newState;
    //console.log('gameReducer',{state},{action});
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
            const now = Date.now();
            const timeDiff = now - tileSentTime; //parseInt(tileSentTime,10); //Date.now() - parseInt(tileSentTime,10);    
            const expirationTime = now + fogOfWarDelay_ms;
            // console.log('receivedGameState',timeDiff, action.worldState);
            
            const newTiles = action.worldState.tiles.map((tile) => ({
                ...tile, 
                expirationTime,
                type: tile.TileType.type,
                src: getTextureSrc(tile.TileType.type)
            }));

            //console.log(newTiles); 
            const oldTiles = state.tilesFromServer || {};
            const activeOldTiles = {};
            Object.entries(oldTiles).forEach(([key, value]) => {
                if (value.expirationTime > now) activeOldTiles[key] = value;
            });
            const tilesFromServer = newTiles.reduce((tileCollection, tile) => {
                const key = "x" + tile.x + "y" + tile.y;
                const newCollection = {
                    ...tileCollection
                };
                newCollection[key] = tile;
                return newCollection;
            }, activeOldTiles);
            
            // const tilesFromServer = oldTiles.filter(tile => )
            return {
                ...state,
                tilesFromServer
            }
        case 'defineChunks':

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
